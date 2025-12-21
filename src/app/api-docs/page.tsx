"use client";
import Navigation from "@/components/Navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import { Code, Key, Terminal, Zap, Shield, Globe, AlertCircle, CheckCircle2, Copy } from "lucide-react";

export default function APIDocsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    javascript: {
      auth: `const axios = require('axios');

const apiKey = 'YOUR_API_KEY';
const apiSecret = 'YOUR_API_SECRET';

// Create signature
const timestamp = Date.now();
const signature = crypto
  .createHmac('sha256', apiSecret)
  .update(\`\${timestamp}\${apiKey}\`)
  .digest('hex');

const headers = {
  'X-API-KEY': apiKey,
  'X-TIMESTAMP': timestamp,
  'X-SIGNATURE': signature
};`,

      getMarkets: `// Get all trading pairs
axios.get('https://api.atlasprime.com/v1/markets', { headers })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error.response.data);
  });`,

      placeOrder: `// Place a limit buy order
const orderData = {
  symbol: 'BTC/USD',
  side: 'buy',
  type: 'limit',
  quantity: 0.1,
  price: 90000
};

axios.post('https://api.atlasprime.com/v1/orders', orderData, { headers })
  .then(response => {
    console.log('Order placed:', response.data);
  })
  .catch(error => {
    console.error('Error:', error.response.data);
  });`,

      websocket: `const WebSocket = require('ws');

const ws = new WebSocket('wss://stream.atlasprime.com/v1/market');

ws.on('open', function open() {
  // Subscribe to BTC/USD ticker
  ws.send(JSON.stringify({
    method: 'SUBSCRIBE',
    params: ['btcusd@ticker'],
    id: 1
  }));
});

ws.on('message', function message(data) {
  const ticker = JSON.parse(data);
  console.log('Price:', ticker.price);
  console.log('Volume:', ticker.volume);
});`
    },
    python: {
      auth: `import hmac
import hashlib
import time
import requests

api_key = 'YOUR_API_KEY'
api_secret = 'YOUR_API_SECRET'

# Create signature
timestamp = int(time.time() * 1000)
message = f'{timestamp}{api_key}'
signature = hmac.new(
    api_secret.encode(),
    message.encode(),
    hashlib.sha256
).hexdigest()

headers = {
    'X-API-KEY': api_key,
    'X-TIMESTAMP': str(timestamp),
    'X-SIGNATURE': signature
}`,

      getMarkets: `# Get all trading pairs
response = requests.get(
    'https://api.atlasprime.com/v1/markets',
    headers=headers
)
markets = response.json()
print(markets)`,

      placeOrder: `# Place a limit buy order
order_data = {
    'symbol': 'BTC/USD',
    'side': 'buy',
    'type': 'limit',
    'quantity': 0.1,
    'price': 90000
}

response = requests.post(
    'https://api.atlasprime.com/v1/orders',
    json=order_data,
    headers=headers
)
print('Order placed:', response.json())`,

      websocket: `import websocket
import json

def on_message(ws, message):
    data = json.loads(message)
    print(f"Price: {data['price']}")
    print(f"Volume: {data['volume']}")

def on_open(ws):
    subscribe_message = {
        "method": "SUBSCRIBE",
        "params": ["btcusd@ticker"],
        "id": 1
    }
    ws.send(json.dumps(subscribe_message))

ws = websocket.WebSocketApp(
    "wss://stream.atlasprime.com/v1/market",
    on_message=on_message,
    on_open=on_open
)
ws.run_forever()`
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 mb-6"
            >
              <Code className="w-10 h-10 text-emerald-400" />
            </motion.div>
            <h1 className="text-5xl font-bold gradient-text mb-4">API Documentation</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Build powerful trading applications with AtlasPrime Exchange API
            </p>
            <p className="text-sm text-muted-foreground mt-2">Version 1.0 • RESTful & WebSocket APIs</p>
          </motion.div>

          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
            <p className="text-muted-foreground mb-6">
              The AtlasPrime API provides programmatic access to trading, market data, account management, and more.
              Our API is designed to be RESTful, uses JSON for responses, and includes WebSocket support for real-time data.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-card rounded-lg">
                <Terminal className="w-8 h-8 text-emerald-400 mb-3" />
                <h3 className="font-semibold mb-2">REST API</h3>
                <p className="text-sm text-muted-foreground">HTTP/HTTPS endpoints for trading and account operations</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <Zap className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold mb-2">WebSocket</h3>
                <p className="text-sm text-muted-foreground">Real-time market data streams and order updates</p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <Shield className="w-8 h-8 text-purple-400 mb-3" />
                <h3 className="font-semibold mb-2">Secure</h3>
                <p className="text-sm text-muted-foreground">HMAC-SHA256 authentication with API keys</p>
              </div>
            </div>
          </motion.div>

          {/* Base URLs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">Base URLs</h2>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-card rounded-lg font-mono text-sm">
                <div className="text-muted-foreground mb-1">REST API</div>
                <div className="text-emerald-400">https://api.atlasprime.com/v1</div>
              </div>
              <div className="p-4 bg-card rounded-lg font-mono text-sm">
                <div className="text-muted-foreground mb-1">WebSocket API</div>
                <div className="text-emerald-400">wss://stream.atlasprime.com/v1/market</div>
              </div>
              <div className="p-4 bg-card rounded-lg font-mono text-sm">
                <div className="text-muted-foreground mb-1">Testnet REST API</div>
                <div className="text-blue-400">https://testnet-api.atlasprime.com/v1</div>
              </div>
            </div>
          </motion.div>

          {/* Authentication */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">Authentication</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              All private endpoints require authentication using HMAC-SHA256 signatures. Generate your API keys from your account dashboard.
            </p>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Required Headers</h3>
              <div className="space-y-2">
                <div className="p-3 bg-card rounded-lg font-mono text-sm flex justify-between items-center">
                  <span><span className="text-emerald-400">X-API-KEY:</span> Your API key</span>
                </div>
                <div className="p-3 bg-card rounded-lg font-mono text-sm flex justify-between items-center">
                  <span><span className="text-emerald-400">X-TIMESTAMP:</span> Current Unix timestamp in milliseconds</span>
                </div>
                <div className="p-3 bg-card rounded-lg font-mono text-sm flex justify-between items-center">
                  <span><span className="text-emerald-400">X-SIGNATURE:</span> HMAC SHA256 signature</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setSelectedLanguage("javascript")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedLanguage === "javascript" ? "bg-emerald-500" : "glass"
                  }`}
                >
                  JavaScript
                </button>
                <button
                  onClick={() => setSelectedLanguage("python")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedLanguage === "python" ? "bg-emerald-500" : "glass"
                  }`}
                >
                  Python
                </button>
              </div>
              <div className="relative">
                <pre className="p-4 bg-black/50 rounded-lg overflow-x-auto text-sm">
                  <code className="text-emerald-400">{codeExamples[selectedLanguage as keyof typeof codeExamples].auth}</code>
                </pre>
                <button
                  onClick={() => copyCode(codeExamples[selectedLanguage as keyof typeof codeExamples].auth, "auth")}
                  className="absolute top-2 right-2 p-2 glass rounded-lg hover:bg-card transition-colors"
                >
                  {copiedCode === "auth" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>

          {/* REST API Endpoints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">REST API Endpoints</h2>

            {/* Market Data */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-emerald-400">Market Data (Public)</h3>
              <div className="space-y-4">
                <div className="p-4 bg-card rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">GET</span>
                      <span className="ml-3 font-mono">/markets</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Get all available trading pairs and their current prices</p>
                  <div className="relative">
                    <pre className="p-3 bg-black/50 rounded-lg overflow-x-auto text-xs">
                      <code className="text-emerald-400">{codeExamples[selectedLanguage as keyof typeof codeExamples].getMarkets}</code>
                    </pre>
                    <button
                      onClick={() => copyCode(codeExamples[selectedLanguage as keyof typeof codeExamples].getMarkets, "markets")}
                      className="absolute top-2 right-2 p-1 glass rounded hover:bg-card transition-colors"
                    >
                      {copiedCode === "markets" ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-card rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">GET</span>
                      <span className="ml-3 font-mono">/ticker/:symbol</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Get 24hr ticker price change statistics for a symbol</p>
                </div>

                <div className="p-4 bg-card rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">GET</span>
                      <span className="ml-3 font-mono">/orderbook/:symbol</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Get current order book depth for a trading pair</p>
                </div>

                <div className="p-4 bg-card rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">GET</span>
                      <span className="ml-3 font-mono">/trades/:symbol</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Get recent trades for a symbol (limit: 500)</p>
                </div>

                <div className="p-4 bg-card rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">GET</span>
                      <span className="ml-3 font-mono">/klines/:symbol</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Get candlestick/kline data (1m, 5m, 15m, 1h, 4h, 1d, 1w)</p>
                </div>
              </div>
            </div>

            {/* Trading */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Trading (Private)</h3>
              <div className="space-y-4">
                <div className="p-4 bg-card rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-mono">POST</span>
                      <span className="ml-3 font-mono">/orders</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Place a new order (market, limit, stop-loss, stop-limit)</p>
                  <div className="relative">
                    <pre className="p-3 bg-black/50 rounded-lg overflow-x-auto text-xs">
                      <code className="text-emerald-400">{codeExamples[selectedLanguage as keyof typeof codeExamples].placeOrder}</code>
                    </pre>
                    <button
                      onClick={() => copyCode(codeExamples[selectedLanguage as keyof typeof codeExamples].placeOrder, "order")}
                      className="absolute top-2 right-2 p-1 glass rounded hover:bg-card transition-colors"
                    >
                      {copiedCode === "order" ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-card rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">GET</span>
                      <span className="ml-3 font-mono">/orders</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Get all open orders</p>
                </div>

                <div className="p-4 bg-card rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-mono">DELETE</span>
                      <span className="ml-3 font-mono">/orders/:orderId</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Cancel an open order</p>
                </div>

                <div className="p-4 bg-card rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">GET</span>
                      <span className="ml-3 font-mono">/orders/history</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Get order history (completed, cancelled, expired)</p>
                </div>
              </div>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-400">Account (Private)</h3>
              <div className="space-y-4">
                <div className="p-4 bg-card rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">GET</span>
                      <span className="ml-3 font-mono">/account</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Get account information and balances</p>
                </div>

                <div className="p-4 bg-card rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">GET</span>
                      <span className="ml-3 font-mono">/account/trades</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Get trade history</p>
                </div>

                <div className="p-4 bg-card rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">GET</span>
                      <span className="ml-3 font-mono">/account/deposits</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Get deposit history</p>
                </div>

                <div className="p-4 bg-card rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-mono">GET</span>
                      <span className="ml-3 font-mono">/account/withdrawals</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Get withdrawal history</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* WebSocket API */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">WebSocket Streams</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Subscribe to real-time market data streams for live price updates, order book changes, and more.
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Available Streams</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 bg-card rounded-lg">
                  <code className="text-emerald-400 text-sm">symbol@ticker</code>
                  <p className="text-xs text-muted-foreground mt-1">24hr ticker updates</p>
                </div>
                <div className="p-3 bg-card rounded-lg">
                  <code className="text-emerald-400 text-sm">symbol@trade</code>
                  <p className="text-xs text-muted-foreground mt-1">Real-time trades</p>
                </div>
                <div className="p-3 bg-card rounded-lg">
                  <code className="text-emerald-400 text-sm">symbol@depth</code>
                  <p className="text-xs text-muted-foreground mt-1">Order book updates</p>
                </div>
                <div className="p-3 bg-card rounded-lg">
                  <code className="text-emerald-400 text-sm">symbol@kline_1m</code>
                  <p className="text-xs text-muted-foreground mt-1">Candlestick updates</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <pre className="p-4 bg-black/50 rounded-lg overflow-x-auto text-sm">
                <code className="text-emerald-400">{codeExamples[selectedLanguage as keyof typeof codeExamples].websocket}</code>
              </pre>
              <button
                onClick={() => copyCode(codeExamples[selectedLanguage as keyof typeof codeExamples].websocket, "ws")}
                className="absolute top-2 right-2 p-2 glass rounded-lg hover:bg-card transition-colors"
              >
                {copiedCode === "ws" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>

          {/* Rate Limits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">Rate Limits</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              To ensure fair usage and system stability, API requests are rate-limited based on your account tier.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-card">
                  <tr>
                    <th className="text-left p-4">Endpoint Type</th>
                    <th className="text-left p-4">Rate Limit</th>
                    <th className="text-left p-4">Window</th>
                    <th className="text-left p-4">VIP Limit</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-t border-border">
                    <td className="p-4">Market Data</td>
                    <td className="p-4">1200 requests</td>
                    <td className="p-4">1 minute</td>
                    <td className="p-4 text-emerald-400">2400 requests</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">Trading</td>
                    <td className="p-4">300 requests</td>
                    <td className="p-4">1 minute</td>
                    <td className="p-4 text-emerald-400">600 requests</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">Account</td>
                    <td className="p-4">180 requests</td>
                    <td className="p-4">1 minute</td>
                    <td className="p-4 text-emerald-400">360 requests</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-4">WebSocket Connections</td>
                    <td className="p-4">5 connections</td>
                    <td className="p-4">Per IP</td>
                    <td className="p-4 text-emerald-400">10 connections</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong className="text-yellow-400">Note:</strong> Exceeding rate limits will result in a 429 error.
                Implement exponential backoff in your application.
              </p>
            </div>
          </motion.div>

          {/* Error Codes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glass rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-bold">Error Codes</h2>
            </div>
            <div className="space-y-3">
              <div className="p-4 bg-card rounded-lg flex items-start gap-3">
                <code className="text-red-400 font-bold">400</code>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Bad Request</h4>
                  <p className="text-sm text-muted-foreground">Invalid request parameters or malformed JSON</p>
                </div>
              </div>
              <div className="p-4 bg-card rounded-lg flex items-start gap-3">
                <code className="text-red-400 font-bold">401</code>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Unauthorized</h4>
                  <p className="text-sm text-muted-foreground">Invalid or missing authentication credentials</p>
                </div>
              </div>
              <div className="p-4 bg-card rounded-lg flex items-start gap-3">
                <code className="text-red-400 font-bold">403</code>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Forbidden</h4>
                  <p className="text-sm text-muted-foreground">Insufficient permissions for requested operation</p>
                </div>
              </div>
              <div className="p-4 bg-card rounded-lg flex items-start gap-3">
                <code className="text-yellow-400 font-bold">429</code>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Too Many Requests</h4>
                  <p className="text-sm text-muted-foreground">Rate limit exceeded, try again later</p>
                </div>
              </div>
              <div className="p-4 bg-card rounded-lg flex items-start gap-3">
                <code className="text-red-400 font-bold">500</code>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Internal Server Error</h4>
                  <p className="text-sm text-muted-foreground">Something went wrong on our end</p>
                </div>
              </div>
              <div className="p-4 bg-card rounded-lg flex items-start gap-3">
                <code className="text-yellow-400 font-bold">503</code>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Service Unavailable</h4>
                  <p className="text-sm text-muted-foreground">Service temporarily down for maintenance</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="glass rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join our developer community or contact API support for assistance
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-semibold transition-colors">
                Developer Discord
              </button>
              <button className="px-6 py-3 glass hover:bg-card rounded-lg font-semibold transition-colors">
                API Support
              </button>
              <button className="px-6 py-3 glass hover:bg-card rounded-lg font-semibold transition-colors">
                View Examples
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
