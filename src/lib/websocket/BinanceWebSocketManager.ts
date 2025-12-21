/**
 * Binance WebSocket Manager
 * Handles real-time data streaming from Binance with:
 * - Connection pooling
 * - Automatic reconnection with exponential backoff
 * - Heartbeat/ping-pong mechanism
 * - Error handling and retry logic
 * - Multiple concurrent connections
 */

type StreamType = 'depth' | 'trade' | 'ticker' | 'kline' | 'aggTrade';

interface StreamSubscription {
  symbol: string;
  type: StreamType;
  callback: (data: any) => void;
}

interface ConnectionConfig {
  maxReconnectAttempts: number;
  reconnectDelay: number;
  maxReconnectDelay: number;
  heartbeatInterval: number;
  connectionTimeout: number;
}

const DEFAULT_CONFIG: ConnectionConfig = {
  maxReconnectAttempts: 10,
  reconnectDelay: 1000, // 1 second
  maxReconnectDelay: 30000, // 30 seconds
  heartbeatInterval: 30000, // 30 seconds
  connectionTimeout: 10000, // 10 seconds
};

export class BinanceWebSocketManager {
  private connections: Map<string, WebSocket> = new Map();
  private subscriptions: Map<string, Set<StreamSubscription>> = new Map();
  private reconnectAttempts: Map<string, number> = new Map();
  private heartbeatTimers: Map<string, NodeJS.Timeout> = new Map();
  private connectionTimers: Map<string, NodeJS.Timeout> = new Map();
  private config: ConnectionConfig;
  private baseUrl: string = 'wss://stream.binance.com:9443';

  // Connection status callbacks
  private statusCallbacks: Set<(status: ConnectionStatus) => void> = new Set();

  constructor(config: Partial<ConnectionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Subscribe to a stream
   */
  subscribe(subscription: StreamSubscription): () => void {
    const streamKey = this.getStreamKey(subscription.symbol, subscription.type);

    // Add subscription
    if (!this.subscriptions.has(streamKey)) {
      this.subscriptions.set(streamKey, new Set());
    }
    this.subscriptions.get(streamKey)!.add(subscription);

    // Create or reuse connection
    this.ensureConnection(streamKey, subscription.symbol, subscription.type);

    // Return unsubscribe function
    return () => this.unsubscribe(subscription);
  }

  /**
   * Unsubscribe from a stream
   */
  private unsubscribe(subscription: StreamSubscription): void {
    const streamKey = this.getStreamKey(subscription.symbol, subscription.type);
    const subs = this.subscriptions.get(streamKey);

    if (subs) {
      subs.delete(subscription);

      // If no more subscriptions, close connection
      if (subs.size === 0) {
        this.closeConnection(streamKey);
      }
    }
  }

  /**
   * Ensure a WebSocket connection exists for the stream
   */
  private ensureConnection(streamKey: string, symbol: string, type: StreamType): void {
    if (this.connections.has(streamKey)) {
      const ws = this.connections.get(streamKey)!;
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        return; // Connection already exists
      }
    }

    this.createConnection(streamKey, symbol, type);
  }

  /**
   * Create a new WebSocket connection
   */
  private createConnection(streamKey: string, symbol: string, type: StreamType): void {
    const streamName = this.getStreamName(symbol, type);
    const url = `${this.baseUrl}/ws/${streamName}`;

    console.log(`[WebSocket] Connecting to ${url}`);

    const ws = new WebSocket(url);
    this.connections.set(streamKey, ws);

    // Connection timeout
    const timeoutTimer = setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        console.error(`[WebSocket] Connection timeout for ${streamKey}`);
        ws.close();
        this.handleReconnect(streamKey, symbol, type);
      }
    }, this.config.connectionTimeout);

    this.connectionTimers.set(streamKey, timeoutTimer);

    ws.onopen = () => {
      console.log(`[WebSocket] Connected to ${streamKey}`);
      clearTimeout(timeoutTimer);
      this.reconnectAttempts.set(streamKey, 0);
      this.startHeartbeat(streamKey);
      this.notifyStatus({ connected: true, stream: streamKey });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleMessage(streamKey, data);
      } catch (error) {
        console.error(`[WebSocket] Error parsing message:`, error);
      }
    };

    ws.onerror = (error) => {
      console.error(`[WebSocket] Error on ${streamKey}:`, error);
      this.notifyStatus({ connected: false, stream: streamKey, error: 'Connection error' });
    };

    ws.onclose = () => {
      console.log(`[WebSocket] Disconnected from ${streamKey}`);
      this.stopHeartbeat(streamKey);
      clearTimeout(timeoutTimer);
      this.notifyStatus({ connected: false, stream: streamKey });

      // Attempt reconnection if there are still subscriptions
      if (this.subscriptions.get(streamKey)?.size ?? 0 > 0) {
        this.handleReconnect(streamKey, symbol, type);
      }
    };
  }

  /**
   * Handle reconnection with exponential backoff
   */
  private handleReconnect(streamKey: string, symbol: string, type: StreamType): void {
    const attempts = this.reconnectAttempts.get(streamKey) || 0;

    if (attempts >= this.config.maxReconnectAttempts) {
      console.error(`[WebSocket] Max reconnection attempts reached for ${streamKey}`);
      this.notifyStatus({
        connected: false,
        stream: streamKey,
        error: 'Max reconnection attempts reached'
      });
      return;
    }

    // Exponential backoff: delay = baseDelay * 2^attempts
    const delay = Math.min(
      this.config.reconnectDelay * Math.pow(2, attempts),
      this.config.maxReconnectDelay
    );

    console.log(`[WebSocket] Reconnecting ${streamKey} in ${delay}ms (attempt ${attempts + 1})`);
    this.reconnectAttempts.set(streamKey, attempts + 1);

    setTimeout(() => {
      this.createConnection(streamKey, symbol, type);
    }, delay);
  }

  /**
   * Start heartbeat/ping-pong mechanism
   */
  private startHeartbeat(streamKey: string): void {
    this.stopHeartbeat(streamKey);

    const timer = setInterval(() => {
      const ws = this.connections.get(streamKey);
      if (ws && ws.readyState === WebSocket.OPEN) {
        // Binance WebSocket doesn't require explicit ping
        // But we can verify connection is alive
        console.log(`[WebSocket] Heartbeat check for ${streamKey}`);
      } else {
        this.stopHeartbeat(streamKey);
      }
    }, this.config.heartbeatInterval);

    this.heartbeatTimers.set(streamKey, timer);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(streamKey: string): void {
    const timer = this.heartbeatTimers.get(streamKey);
    if (timer) {
      clearInterval(timer);
      this.heartbeatTimers.delete(streamKey);
    }
  }

  /**
   * Handle incoming WebSocket message
   */
  private handleMessage(streamKey: string, data: any): void {
    const subs = this.subscriptions.get(streamKey);
    if (!subs) return;

    // Call all subscription callbacks
    subs.forEach((sub) => {
      try {
        sub.callback(data);
      } catch (error) {
        console.error(`[WebSocket] Error in subscription callback:`, error);
      }
    });
  }

  /**
   * Close a specific connection
   */
  private closeConnection(streamKey: string): void {
    const ws = this.connections.get(streamKey);
    if (ws) {
      this.stopHeartbeat(streamKey);
      ws.close();
      this.connections.delete(streamKey);
      this.subscriptions.delete(streamKey);
      this.reconnectAttempts.delete(streamKey);

      const timer = this.connectionTimers.get(streamKey);
      if (timer) {
        clearTimeout(timer);
        this.connectionTimers.delete(streamKey);
      }
    }
  }

  /**
   * Close all connections
   */
  closeAll(): void {
    this.connections.forEach((_, streamKey) => {
      this.closeConnection(streamKey);
    });
    this.statusCallbacks.clear();
  }

  /**
   * Get stream name for Binance WebSocket
   */
  private getStreamName(symbol: string, type: StreamType): string {
    const lowerSymbol = symbol.toLowerCase();

    switch (type) {
      case 'depth':
        return `${lowerSymbol}@depth20@100ms`;
      case 'trade':
        return `${lowerSymbol}@trade`;
      case 'ticker':
        return `${lowerSymbol}@ticker`;
      case 'kline':
        return `${lowerSymbol}@kline_1m`;
      case 'aggTrade':
        return `${lowerSymbol}@aggTrade`;
      default:
        return `${lowerSymbol}@trade`;
    }
  }

  /**
   * Get unique stream key
   */
  private getStreamKey(symbol: string, type: StreamType): string {
    return `${symbol.toUpperCase()}_${type}`;
  }

  /**
   * Register connection status callback
   */
  onStatusChange(callback: (status: ConnectionStatus) => void): () => void {
    this.statusCallbacks.add(callback);
    return () => this.statusCallbacks.delete(callback);
  }

  /**
   * Notify all status callbacks
   */
  private notifyStatus(status: ConnectionStatus): void {
    this.statusCallbacks.forEach((callback) => {
      try {
        callback(status);
      } catch (error) {
        console.error('[WebSocket] Error in status callback:', error);
      }
    });
  }

  /**
   * Get connection statistics
   */
  getStats(): WebSocketStats {
    return {
      totalConnections: this.connections.size,
      activeConnections: Array.from(this.connections.values()).filter(
        (ws) => ws.readyState === WebSocket.OPEN
      ).length,
      totalSubscriptions: Array.from(this.subscriptions.values()).reduce(
        (sum, subs) => sum + subs.size,
        0
      ),
    };
  }
}

export interface ConnectionStatus {
  connected: boolean;
  stream: string;
  error?: string;
}

export interface WebSocketStats {
  totalConnections: number;
  activeConnections: number;
  totalSubscriptions: number;
}

// Singleton instance
let wsManager: BinanceWebSocketManager | null = null;

export function getWebSocketManager(): BinanceWebSocketManager {
  if (!wsManager) {
    wsManager = new BinanceWebSocketManager();
  }
  return wsManager;
}
