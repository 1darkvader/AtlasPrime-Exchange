// Order API Service - Client-side

export interface Order {
  id: string;
  userId: string;
  pair: string;
  type: 'MARKET' | 'LIMIT' | 'STOP_LIMIT' | 'TRAILING_STOP' | 'OCO';
  side: 'BUY' | 'SELL' | 'LONG' | 'SHORT';
  price: number | null;
  amount: number;
  filled: number;
  status: 'OPEN' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' | 'REJECTED';
  stopPrice?: number | null;
  takeProfitPrice?: number | null;
  stopLossPrice?: number | null;
  leverage?: number | null;
  positionMode?: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface CreateOrderParams {
  pair: string;
  type: 'MARKET' | 'LIMIT' | 'STOP_LIMIT';
  side: 'BUY' | 'SELL' | 'LONG' | 'SHORT';
  price?: number;
  amount: number;
  stopPrice?: number;
  takeProfitPrice?: number;
  stopLossPrice?: number;
  leverage?: number;
  positionMode?: 'CROSS' | 'ISOLATED';
}

export interface ModifyOrderParams {
  price?: number;
  amount?: number;
  stopPrice?: number | null;
  takeProfitPrice?: number | null;
  stopLossPrice?: number | null;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  order?: Order;
  orders?: Order[];
}

const API_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('atlasprime_token');
}

// Get auth headers
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

export const ordersAPI = {
  /**
   * Create a new order (LIMIT orders stay OPEN, MARKET orders execute immediately)
   */
  async createOrder(params: CreateOrderParams): Promise<OrderResponse> {
    try {
      // Call new orders endpoint which properly handles LIMIT vs MARKET
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          pair: params.pair,
          type: params.type,
          side: params.side,
          price: params.price,
          amount: params.amount,
          stopPrice: params.stopPrice,
          takeProfitPrice: params.takeProfitPrice,
          stopLossPrice: params.stopLossPrice,
          leverage: params.leverage,
          positionMode: params.positionMode,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create order error:', error);
      return {
        success: false,
        message: 'Failed to create order. Please try again.',
      };
    }
  },

  /**
   * Get user's orders with optional filters
   */
  async getOrders(filters?: {
    status?: string;
    pair?: string;
    type?: string;
  }): Promise<OrderResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.pair) queryParams.append('pair', filters.pair);
      if (filters?.type) queryParams.append('type', filters.type);

      const response = await fetch(`${API_BASE_URL}/api/orders?${queryParams}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get orders error:', error);
      return {
        success: false,
        message: 'Failed to fetch orders.',
      };
    }
  },

  /**
   * Get a specific order by ID
   */
  async getOrder(orderId: string): Promise<OrderResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get order error:', error);
      return {
        success: false,
        message: 'Failed to fetch order.',
      };
    }
  },

  /**
   * Modify an existing order
   */
  async modifyOrder(orderId: string, params: ModifyOrderParams): Promise<OrderResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(params),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Modify order error:', error);
      return {
        success: false,
        message: 'Failed to modify order.',
      };
    }
  },

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<OrderResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Cancel order error:', error);
      return {
        success: false,
        message: 'Failed to cancel order.',
      };
    }
  },

  /**
   * Cancel all orders for a specific pair
   */
  async cancelAllOrders(pair?: string): Promise<OrderResponse> {
    try {
      const filters = pair ? { pair, status: 'OPEN' } : { status: 'OPEN' };
      const ordersResponse = await this.getOrders(filters);

      if (!ordersResponse.success || !ordersResponse.orders) {
        return {
          success: false,
          message: 'Failed to fetch orders for cancellation.',
        };
      }

      // Cancel all orders in parallel
      const cancelPromises = ordersResponse.orders.map(order =>
        this.cancelOrder(order.id)
      );

      await Promise.all(cancelPromises);

      return {
        success: true,
        message: `Cancelled ${ordersResponse.orders.length} order(s)`,
      };
    } catch (error) {
      console.error('Cancel all orders error:', error);
      return {
        success: false,
        message: 'Failed to cancel all orders.',
      };
    }
  },
};
