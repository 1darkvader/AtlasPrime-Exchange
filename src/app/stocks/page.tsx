"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import dynamic from "next/dynamic";
import MarketsList from "@/components/MarketsList";
import MarketTrades from "@/components/MarketTrades";
import OrderConfirmationModal from "@/components/OrderConfirmationModal";
import WebSocketStatus from "@/components/WebSocketStatus";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useCryptoData } from "@/hooks/useCryptoData";
import { useAuth } from "@/contexts/AuthContext";
import { type CreateOrderParams } from "@/lib/api/orders";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TradingViewChart = dynamic(() => import("@/components/TradingViewChart"), {
  ssr: false,
});

interface TokenizedStock {
  symbol: string;
  binanceSymbol: string;
  company: string;
  sector: string;
}

// 100+ popular trading pairs available on Binance
const STOCK_PAIRS: TokenizedStock[] = [
  // Major Crypto (Tech Sector)
  { symbol: "BTC/USDT", binanceSymbol: "BTCUSDT", company: "Bitcoin", sector: "Cryptocurrency" },
  { symbol: "ETH/USDT", binanceSymbol: "ETHUSDT", company: "Ethereum", sector: "Cryptocurrency" },
  { symbol: "BNB/USDT", binanceSymbol: "BNBUSDT", company: "Binance Coin", sector: "Exchange" },
  { symbol: "SOL/USDT", binanceSymbol: "SOLUSDT", company: "Solana", sector: "Layer 1" },
  { symbol: "XRP/USDT", binanceSymbol: "XRPUSDT", company: "Ripple", sector: "Payments" },
  { symbol: "ADA/USDT", binanceSymbol: "ADAUSDT", company: "Cardano", sector: "Layer 1" },
  { symbol: "AVAX/USDT", binanceSymbol: "AVAXUSDT", company: "Avalanche", sector: "Layer 1" },
  { symbol: "DOGE/USDT", binanceSymbol: "DOGEUSDT", company: "Dogecoin", sector: "Meme" },
  { symbol: "DOT/USDT", binanceSymbol: "DOTUSDT", company: "Polkadot", sector: "Layer 0" },
  { symbol: "MATIC/USDT", binanceSymbol: "MATICUSDT", company: "Polygon", sector: "Layer 2" },

  // DeFi Tokens
  { symbol: "LINK/USDT", binanceSymbol: "LINKUSDT", company: "Chainlink", sector: "Oracle" },
  { symbol: "UNI/USDT", binanceSymbol: "UNIUSDT", company: "Uniswap", sector: "DeFi" },
  { symbol: "AAVE/USDT", binanceSymbol: "AAVEUSDT", company: "Aave", sector: "DeFi" },
  { symbol: "MKR/USDT", binanceSymbol: "MKRUSDT", company: "Maker", sector: "DeFi" },
  { symbol: "COMP/USDT", binanceSymbol: "COMPUSDT", company: "Compound", sector: "DeFi" },
  { symbol: "CRV/USDT", binanceSymbol: "CRVUSDT", company: "Curve", sector: "DeFi" },
  { symbol: "SUSHI/USDT", binanceSymbol: "SUSHIUSDT", company: "SushiSwap", sector: "DeFi" },
  { symbol: "SNX/USDT", binanceSymbol: "SNXUSDT", company: "Synthetix", sector: "DeFi" },
  { symbol: "YFI/USDT", binanceSymbol: "YFIUSDT", company: "Yearn Finance", sector: "DeFi" },
  { symbol: "1INCH/USDT", binanceSymbol: "1INCHUSDT", company: "1inch", sector: "DeFi" },

  // Layer 1 & Layer 2
  { symbol: "ATOM/USDT", binanceSymbol: "ATOMUSDT", company: "Cosmos", sector: "Layer 0" },
  { symbol: "FTM/USDT", binanceSymbol: "FTMUSDT", company: "Fantom", sector: "Layer 1" },
  { symbol: "NEAR/USDT", binanceSymbol: "NEARUSDT", company: "NEAR Protocol", sector: "Layer 1" },
  { symbol: "ALGO/USDT", binanceSymbol: "ALGOUSDT", company: "Algorand", sector: "Layer 1" },
  { symbol: "VET/USDT", binanceSymbol: "VETUSDT", company: "VeChain", sector: "Supply Chain" },
  { symbol: "ICP/USDT", binanceSymbol: "ICPUSDT", company: "Internet Computer", sector: "Layer 1" },
  { symbol: "FIL/USDT", binanceSymbol: "FILUSDT", company: "Filecoin", sector: "Storage" },
  { symbol: "EOS/USDT", binanceSymbol: "EOSUSDT", company: "EOS", sector: "Layer 1" },
  { symbol: "XTZ/USDT", binanceSymbol: "XTZUSDT", company: "Tezos", sector: "Layer 1" },
  { symbol: "ARB/USDT", binanceSymbol: "ARBUSDT", company: "Arbitrum", sector: "Layer 2" },

  // Meme & Community
  { symbol: "SHIB/USDT", binanceSymbol: "SHIBUSDT", company: "Shiba Inu", sector: "Meme" },
  { symbol: "PEPE/USDT", binanceSymbol: "PEPEUSDT", company: "Pepe", sector: "Meme" },
  { symbol: "FLOKI/USDT", binanceSymbol: "FLOKIUSDT", company: "Floki", sector: "Meme" },
  { symbol: "BONK/USDT", binanceSymbol: "BONKUSDT", company: "Bonk", sector: "Meme" },

  // Gaming & Metaverse
  { symbol: "AXS/USDT", binanceSymbol: "AXSUSDT", company: "Axie Infinity", sector: "Gaming" },
  { symbol: "SAND/USDT", binanceSymbol: "SANDUSDT", company: "The Sandbox", sector: "Metaverse" },
  { symbol: "MANA/USDT", binanceSymbol: "MANAUSDT", company: "Decentraland", sector: "Metaverse" },
  { symbol: "GALA/USDT", binanceSymbol: "GALAUSDT", company: "Gala Games", sector: "Gaming" },
  { symbol: "ENJ/USDT", binanceSymbol: "ENJUSDT", company: "Enjin", sector: "Gaming" },
  { symbol: "IMX/USDT", binanceSymbol: "IMXUSDT", company: "Immutable X", sector: "Gaming" },

  // AI & Data
  { symbol: "FET/USDT", binanceSymbol: "FETUSDT", company: "Fetch.ai", sector: "AI" },
  { symbol: "AGIX/USDT", binanceSymbol: "AGIXUSDT", company: "SingularityNET", sector: "AI" },
  { symbol: "OCEAN/USDT", binanceSymbol: "OCEANUSDT", company: "Ocean Protocol", sector: "Data" },
  { symbol: "GRT/USDT", binanceSymbol: "GRTUSDT", company: "The Graph", sector: "Indexing" },

  // Exchange Tokens
  { symbol: "CRO/USDT", binanceSymbol: "CROUSDT", company: "Crypto.com", sector: "Exchange" },
  { symbol: "OKB/USDT", binanceSymbol: "OKBUSDT", company: "OKX", sector: "Exchange" },
  { symbol: "LEO/USDT", binanceSymbol: "LEOUSDT", company: "UNUS SED LEO", sector: "Exchange" },

  // Privacy & Security
  { symbol: "XMR/USDT", binanceSymbol: "XMRUSDT", company: "Monero", sector: "Privacy" },
  { symbol: "ZEC/USDT", binanceSymbol: "ZECUSDT", company: "Zcash", sector: "Privacy" },

  // Infrastructure
  { symbol: "RNDR/USDT", binanceSymbol: "RNDRUSDT", company: "Render", sector: "GPU" },
  { symbol: "AR/USDT", binanceSymbol: "ARUSDT", company: "Arweave", sector: "Storage" },
  { symbol: "LDO/USDT", binanceSymbol: "LDOUSDT", company: "Lido DAO", sector: "Staking" },
  { symbol: "RPL/USDT", binanceSymbol: "RPLUSDT", company: "Rocket Pool", sector: "Staking" },

  // More Popular Pairs
  { symbol: "LTC/USDT", binanceSymbol: "LTCUSDT", company: "Litecoin", sector: "Payments" },
  { symbol: "BCH/USDT", binanceSymbol: "BCHUSDT", company: "Bitcoin Cash", sector: "Payments" },
  { symbol: "TRX/USDT", binanceSymbol: "TRXUSDT", company: "TRON", sector: "Layer 1" },
  { symbol: "APT/USDT", binanceSymbol: "APTUSDT", company: "Aptos", sector: "Layer 1" },
  { symbol: "SUI/USDT", binanceSymbol: "SUIUSDT", company: "Sui", sector: "Layer 1" },
  { symbol: "OP/USDT", binanceSymbol: "OPUSDT", company: "Optimism", sector: "Layer 2" },
  { symbol: "INJ/USDT", binanceSymbol: "INJUSDT", company: "Injective", sector: "DeFi" },
  { symbol: "SEI/USDT", binanceSymbol: "SEIUSDT", company: "Sei", sector: "Layer 1" },
  { symbol: "TIA/USDT", binanceSymbol: "TIAUSDT", company: "Celestia", sector: "Modular" },
  { symbol: "RUNE/USDT", binanceSymbol: "RUNEUSDT", company: "THORChain", sector: "DeFi" },
  { symbol: "HBAR/USDT", binanceSymbol: "HBARUSDT", company: "Hedera", sector: "Enterprise" },
  { symbol: "QNT/USDT", binanceSymbol: "QNTUSDT", company: "Quant", sector: "Interoperability" },
  { symbol: "STX/USDT", binanceSymbol: "STXUSDT", company: "Stacks", sector: "Bitcoin L2" },
  { symbol: "KAS/USDT", binanceSymbol: "KASUSDT", company: "Kaspa", sector: "Layer 1" },
  { symbol: "BEAM/USDT", binanceSymbol: "BEAMUSDT", company: "Beam", sector: "Gaming" },
  { symbol: "ROSE/USDT", binanceSymbol: "ROSEUSDT", company: "Oasis Network", sector: "Privacy" },
  { symbol: "CFX/USDT", binanceSymbol: "CFXUSDT", company: "Conflux", sector: "Layer 1" },
  { symbol: "WLD/USDT", binanceSymbol: "WLDUSDT", company: "Worldcoin", sector: "Identity" },
  { symbol: "PYTH/USDT", binanceSymbol: "PYTHUSDT", company: "Pyth Network", sector: "Oracle" },
  { symbol: "JUP/USDT", binanceSymbol: "JUPUSDT", company: "Jupiter", sector: "DeFi" },
  { symbol: "PENDLE/USDT", binanceSymbol: "PENDLEUSDT", company: "Pendle", sector: "DeFi" },
  { symbol: "WOO/USDT", binanceSymbol: "WOOUSDT", company: "WOO Network", sector: "DeFi" },
  { symbol: "BLUR/USDT", binanceSymbol: "BLURUSDT", company: "Blur", sector: "NFT" },
  { symbol: "MAGIC/USDT", binanceSymbol: "MAGICUSDT", company: "Magic", sector: "Gaming" },
  { symbol: "GMX/USDT", binanceSymbol: "GMXUSDT", company: "GMX", sector: "DeFi" },
  { symbol: "DYM/USDT", binanceSymbol: "DYMUSDT", company: "Dymension", sector: "Modular" },
  { symbol: "STRK/USDT", binanceSymbol: "STRKUSDT", company: "Starknet", sector: "Layer 2" },
  { symbol: "MANTA/USDT", binanceSymbol: "MANTAUSDT", company: "Manta Network", sector: "Layer 2" },
  { symbol: "METIS/USDT", binanceSymbol: "METISUSDT", company: "Metis", sector: "Layer 2" },
  { symbol: "KAVA/USDT", binanceSymbol: "KAVAUSDT", company: "Kava", sector: "DeFi" },
  { symbol: "EGLD/USDT", binanceSymbol: "EGLDUSDT", company: "MultiversX", sector: "Layer 1" },
  { symbol: "FLR/USDT", binanceSymbol: "FLRUSDT", company: "Flare", sector: "Layer 1" },
  { symbol: "FLOW/USDT", binanceSymbol: "FLOWUSDT", company: "Flow", sector: "Layer 1" },
  { symbol: "XEC/USDT", binanceSymbol: "XECUSDT", company: "eCash", sector: "Payments" },
  { symbol: "KLAY/USDT", binanceSymbol: "KLAYUSDT", company: "Klaytn", sector: "Layer 1" },
  { symbol: "CHZ/USDT", binanceSymbol: "CHZUSDT", company: "Chiliz", sector: "Fan Tokens" },
  { symbol: "MINA/USDT", binanceSymbol: "MINAUSDT", company: "Mina Protocol", sector: "Layer 1" },
  { symbol: "THETA/USDT", binanceSymbol: "THETAUSDT", company: "Theta Network", sector: "Media" },
  { symbol: "ZIL/USDT", binanceSymbol: "ZILUSDT", company: "Zilliqa", sector: "Layer 1" },
  { symbol: "ONE/USDT", binanceSymbol: "ONEUSDT", company: "Harmony", sector: "Layer 1" },
  { symbol: "CELO/USDT", binanceSymbol: "CELOUSDT", company: "Celo", sector: "Payments" },

  // FX Trading - Major Currency Pairs (via stablecoins and BTC pairs)
  { symbol: "EUR/USDT", binanceSymbol: "EURUSDT", company: "Euro Tether", sector: "Forex" },
  { symbol: "GBP/USDT", binanceSymbol: "GBPUSDT", company: "British Pound", sector: "Forex" },
  { symbol: "AUD/USDT", binanceSymbol: "AUDUSDT", company: "Australian Dollar", sector: "Forex" },
  { symbol: "BRL/USDT", binanceSymbol: "BRLUSDT", company: "Brazilian Real", sector: "Forex" },
  { symbol: "TRY/USDT", binanceSymbol: "TRYUSDT", company: "Turkish Lira", sector: "Forex" },
  { symbol: "RUB/USDT", binanceSymbol: "RUBUSDT", company: "Russian Ruble", sector: "Forex" },
  { symbol: "ZAR/USDT", binanceSymbol: "ZARUSDT", company: "South African Rand", sector: "Forex" },
  { symbol: "UAH/USDT", binanceSymbol: "UAHUSDT", company: "Ukrainian Hryvnia", sector: "Forex" },
  { symbol: "NGN/USDT", binanceSymbol: "NGNUSDT", company: "Nigerian Naira", sector: "Forex" },
  { symbol: "ARS/USDT", binanceSymbol: "ARSUSDT", company: "Argentine Peso", sector: "Forex" },
  { symbol: "PLN/USDT", binanceSymbol: "PLNUSDT", company: "Polish Zloty", sector: "Forex" },
  { symbol: "RON/USDT", binanceSymbol: "RONUSDT", company: "Romanian Leu", sector: "Forex" },
  { symbol: "BTC/EUR", binanceSymbol: "BTCEUR", company: "Bitcoin/Euro", sector: "Forex Crypto" },
  { symbol: "ETH/EUR", binanceSymbol: "ETHEUR", company: "Ethereum/Euro", sector: "Forex Crypto" },
  { symbol: "BTC/GBP", binanceSymbol: "BTCGBP", company: "Bitcoin/Pound", sector: "Forex Crypto" },
  { symbol: "ETH/GBP", binanceSymbol: "ETHGBP", company: "Ethereum/Pound", sector: "Forex Crypto" },
  { symbol: "BTC/AUD", binanceSymbol: "BTCAUD", company: "Bitcoin/AUD", sector: "Forex Crypto" },
  { symbol: "BTC/BRL", binanceSymbol: "BTCBRL", company: "Bitcoin/Real", sector: "Forex Crypto" },
  { symbol: "BTC/TRY", binanceSymbol: "BTCTRY", company: "Bitcoin/Lira", sector: "Forex Crypto" },
  { symbol: "ETH/TRY", binanceSymbol: "ETHTRY", company: "Ethereum/Lira", sector: "Forex Crypto" },
];

export default function StocksPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [selectedStock, setSelectedStock] = useState("BTC/USDT");
  const [binanceSymbol, setBinanceSymbol] = useState("BTCUSDT");
  const [timeframe, setTimeframe] = useState("1h");
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [total, setTotal] = useState("");

  // TP/SL State
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);
  const [stopLossEnabled, setStopLossEnabled] = useState(false);
  const [takeProfitPrice, setTakeProfitPrice] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");

  // Order confirmation modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<CreateOrderParams | null>(null);

  const { candleData, tickerData, loading } = useCryptoData(binanceSymbol, timeframe);
  const { orderBook, recentTrades, connected, reconnecting, error } = useWebSocket(binanceSymbol);

  useEffect(() => {
    if (tickerData && !price) {
      setPrice(tickerData.price.toFixed(2));
    }
  }, [tickerData, price]);

  // Get unique sectors
  const sectors = ["all", ...Array.from(new Set(STOCK_PAIRS.map(s => s.sector)))];

  // Filter stocks
  const filteredStocks = STOCK_PAIRS.filter(stock => {
    const matchesSector = selectedSector === "all" || stock.sector === selectedSector;
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stock.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSector && matchesSearch;
  });

  const currentStock = STOCK_PAIRS.find(s => s.binanceSymbol === binanceSymbol) || STOCK_PAIRS[0];

  const handleSizeChange = (value: string) => {
    setSize(value);
    if (value && price) {
      setTotal((parseFloat(value) * parseFloat(price)).toFixed(2));
    }
  };

  const handleBuyClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!size || parseFloat(size) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const order: CreateOrderParams = {
      pair: binanceSymbol,
      type: orderType.toUpperCase() as 'MARKET' | 'LIMIT',
      side: 'BUY',
      amount: parseFloat(size),
      ...(orderType !== 'market' && { price: parseFloat(price) }),
      ...(takeProfitEnabled && takeProfitPrice && { takeProfitPrice: parseFloat(takeProfitPrice) }),
      ...(stopLossEnabled && stopLossPrice && { stopLossPrice: parseFloat(stopLossPrice) }),
    };

    setPendingOrder(order);
    setShowOrderModal(true);
  };

  const handleSellClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!size || parseFloat(size) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const order: CreateOrderParams = {
      pair: binanceSymbol,
      type: orderType.toUpperCase() as 'MARKET' | 'LIMIT',
      side: 'SELL',
      amount: parseFloat(size),
      ...(orderType !== 'market' && { price: parseFloat(price) }),
      ...(takeProfitEnabled && takeProfitPrice && { takeProfitPrice: parseFloat(takeProfitPrice) }),
      ...(stopLossEnabled && stopLossPrice && { stopLossPrice: parseFloat(stopLossPrice) }),
    };

    setPendingOrder(order);
    setShowOrderModal(true);
  };

  const handleOrderSuccess = () => {
    setSize('');
    setTotal('');
    setTakeProfitPrice('');
    setStopLossPrice('');
    setTakeProfitEnabled(false);
    setStopLossEnabled(false);
    setShowOrderModal(false);
    setPendingOrder(null);
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-28 pb-8 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-[1920px] mx-auto">
          {/* Header */}
          <div className="mb-4 glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-2xl">📈</div>
                  <div>
                    <div className="text-xl font-bold flex items-center gap-2">
                      {currentStock.symbol}
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded font-semibold">{currentStock.sector}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{currentStock.company}</div>
                  </div>
                </div>

                {tickerData && (
                  <div className="flex gap-6 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Price</div>
                      <div className="text-2xl font-bold text-blue-400">${tickerData.price.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">24h Change</div>
                      <div className={`text-lg font-semibold ${tickerData.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {tickerData.change24h >= 0 ? '+' : ''}{tickerData.change24h.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">24h High</div>
                      <div className="text-emerald-400 font-semibold">${tickerData.high24h.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">24h Low</div>
                      <div className="text-red-400 font-semibold">${tickerData.low24h.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">24h Volume</div>
                      <div className="font-semibold">{tickerData.volume24h}</div>
                    </div>
                  </div>
                )}
              </div>
              <WebSocketStatus connected={connected} reconnecting={reconnecting} error={error} />
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* Left: Order Book */}
            <div className="xl:col-span-2">
              <div className="glass rounded-xl p-4 h-[600px] flex flex-col">
                <h3 className="text-sm font-semibold mb-3">Order Book</h3>
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-2 pb-2 border-b border-border">
                    <div>Price(USDT)</div>
                    <div className="text-right">Amount</div>
                    <div className="text-right">Total</div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-0.5">
                    {orderBook.asks.slice(0, 10).map((ask, i) => (
                      <div key={i} className="grid grid-cols-3 gap-2 text-xs hover:bg-red-500/10 cursor-pointer p-1 rounded relative">
                        <div className="absolute right-0 top-0 bottom-0 bg-red-500/10" style={{ width: `${Math.min((ask.amount / 2) * 100, 100)}%` }} />
                        <div className="text-red-400 relative z-10">{ask.price.toFixed(2)}</div>
                        <div className="text-right relative z-10">{ask.amount.toFixed(4)}</div>
                        <div className="text-right text-muted-foreground relative z-10">{ask.total.toFixed(4)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="py-3 my-2 text-center">
                    <div className="text-2xl font-bold text-blue-400">{tickerData ? tickerData.price.toLocaleString() : '...'}</div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-0.5">
                    {orderBook.bids.slice(0, 10).map((bid, i) => (
                      <div key={i} className="grid grid-cols-3 gap-2 text-xs hover:bg-emerald-500/10 cursor-pointer p-1 rounded relative">
                        <div className="absolute right-0 top-0 bottom-0 bg-emerald-500/10" style={{ width: `${Math.min((bid.amount / 2) * 100, 100)}%` }} />
                        <div className="text-emerald-400 relative z-10">{bid.price.toFixed(2)}</div>
                        <div className="text-right relative z-10">{bid.amount.toFixed(4)}</div>
                        <div className="text-right text-muted-foreground relative z-10">{bid.total.toFixed(4)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Center: Chart + Order Forms */}
            <div className="xl:col-span-7 space-y-4">
              {/* Chart */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">TradingView Chart</h3>
                  <div className="flex gap-1">
                    {(['1m', '15m', '1h', '4h', '1d'] as const).map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf.toLowerCase())}
                        className={`px-2 py-1 rounded text-xs transition-all ${
                          timeframe === tf.toLowerCase() ? "bg-blue-500 text-white" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-[400px] bg-card/50 rounded-lg">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-muted-foreground">Loading chart...</div>
                    </div>
                  ) : candleData.length > 0 ? (
                    <TradingViewChart data={candleData} symbol={selectedStock} indicators={[]} />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-muted-foreground">No chart data available</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Forms */}
              <div className="glass rounded-xl p-4">
                <div className="flex gap-2 mb-4 border-b border-border">
                  {(["limit", "market"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`px-4 py-2 text-sm font-medium capitalize transition-all ${
                        orderType === type ? "text-blue-400 border-b-2 border-blue-400" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Buy Form */}
                  <div className="p-4 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                    <h3 className="text-sm font-bold text-emerald-400 mb-3">Buy {currentStock.symbol.split('/')[0]}</h3>
                    <div className="space-y-3">
                      {orderType !== "market" && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                          <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder={tickerData ? tickerData.price.toFixed(2) : "0.00"}
                            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                        <input
                          type="text"
                          value={size}
                          onChange={(e) => handleSizeChange(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Total</label>
                        <input
                          type="text"
                          value={total}
                          readOnly
                          placeholder="0.00 USDT"
                          className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-sm"
                        />
                      </div>

                      {/* TP/SL */}
                      <div className="space-y-2 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="buy-tp"
                            checked={takeProfitEnabled}
                            onChange={(e) => setTakeProfitEnabled(e.target.checked)}
                            className="w-4 h-4 rounded border-border text-emerald-500 focus:ring-emerald-500"
                          />
                          <label htmlFor="buy-tp" className="text-xs text-muted-foreground">Take Profit</label>
                        </div>
                        {takeProfitEnabled && (
                          <input
                            type="number"
                            value={takeProfitPrice}
                            onChange={(e) => setTakeProfitPrice(e.target.value)}
                            placeholder="TP Price"
                            className="w-full px-3 py-1.5 bg-card border border-emerald-500/30 rounded text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        )}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="buy-sl"
                            checked={stopLossEnabled}
                            onChange={(e) => setStopLossEnabled(e.target.checked)}
                            className="w-4 h-4 rounded border-border text-red-500 focus:ring-red-500"
                          />
                          <label htmlFor="buy-sl" className="text-xs text-muted-foreground">Stop Loss</label>
                        </div>
                        {stopLossEnabled && (
                          <input
                            type="number"
                            value={stopLossPrice}
                            onChange={(e) => setStopLossPrice(e.target.value)}
                            placeholder="SL Price"
                            className="w-full px-3 py-1.5 bg-card border border-red-500/30 rounded text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        )}
                      </div>

                      <button
                        onClick={handleBuyClick}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all"
                      >
                        {isAuthenticated ? `Buy ${currentStock.symbol.split('/')[0]}` : 'Log In to Trade'}
                      </button>
                    </div>
                  </div>

                  {/* Sell Form */}
                  <div className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                    <h3 className="text-sm font-bold text-red-400 mb-3">Sell {currentStock.symbol.split('/')[0]}</h3>
                    <div className="space-y-3">
                      {orderType !== "market" && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                          <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder={tickerData ? tickerData.price.toFixed(2) : "0.00"}
                            className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                      )}
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Amount</label>
                        <input
                          type="text"
                          value={size}
                          onChange={(e) => handleSizeChange(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Total</label>
                        <input
                          type="text"
                          value={total}
                          readOnly
                          placeholder="0.00 USDT"
                          className="w-full px-3 py-2 bg-card/50 border border-border rounded-lg text-sm"
                        />
                      </div>

                      {/* TP/SL for Sell */}
                      <div className="space-y-2 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="sell-tp"
                            checked={takeProfitEnabled}
                            onChange={(e) => setTakeProfitEnabled(e.target.checked)}
                            className="w-4 h-4 rounded border-border text-emerald-500 focus:ring-emerald-500"
                          />
                          <label htmlFor="sell-tp" className="text-xs text-muted-foreground">Take Profit</label>
                        </div>
                        {takeProfitEnabled && (
                          <input
                            type="number"
                            value={takeProfitPrice}
                            onChange={(e) => setTakeProfitPrice(e.target.value)}
                            placeholder="TP Price"
                            className="w-full px-3 py-1.5 bg-card border border-emerald-500/30 rounded text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        )}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="sell-sl"
                            checked={stopLossEnabled}
                            onChange={(e) => setStopLossEnabled(e.target.checked)}
                            className="w-4 h-4 rounded border-border text-red-500 focus:ring-red-500"
                          />
                          <label htmlFor="sell-sl" className="text-xs text-muted-foreground">Stop Loss</label>
                        </div>
                        {stopLossEnabled && (
                          <input
                            type="number"
                            value={stopLossPrice}
                            onChange={(e) => setStopLossPrice(e.target.value)}
                            placeholder="SL Price"
                            className="w-full px-3 py-1.5 bg-card border border-red-500/30 rounded text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        )}
                      </div>

                      <button
                        onClick={handleSellClick}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all"
                      >
                        {isAuthenticated ? `Sell ${currentStock.symbol.split('/')[0]}` : 'Log In to Trade'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Markets + Trades */}
            <div className="xl:col-span-3 space-y-4">
              <div className="glass rounded-xl p-4 max-h-[600px] overflow-hidden flex flex-col">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold mb-2">Available Pairs ({STOCK_PAIRS.length})</h3>

                  {/* Search */}
                  <input
                    type="text"
                    placeholder="Search pairs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Sector Filter */}
                  <select
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sectors.map(sector => (
                      <option key={sector} value={sector}>
                        {sector === "all" ? "All Sectors" : sector}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                  {filteredStocks.map((stock) => (
                    <button
                      key={stock.binanceSymbol}
                      onClick={() => {
                        setSelectedStock(stock.symbol);
                        setBinanceSymbol(stock.binanceSymbol);
                        setPrice("");
                      }}
                      className={`w-full p-3 rounded-lg text-left transition-all ${
                        binanceSymbol === stock.binanceSymbol
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'bg-card hover:bg-card/80 border border-border'
                      }`}
                    >
                      <div className="font-semibold">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground">{stock.company}</div>
                      <div className="text-xs text-blue-400 mt-1">{stock.sector}</div>
                    </button>
                  ))}
                  {filteredStocks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No pairs found
                    </div>
                  )}
                </div>
              </div>
              <div className="h-[400px]">
                <MarketTrades trades={recentTrades} />
              </div>
            </div>
          </div>

          {/* Orders Panel */}
          <div className="glass rounded-xl p-4 mt-4">
            <div className="flex items-center gap-6 px-4 pt-4 border-b border-border">
              <button className="pb-3 text-sm font-medium text-emerald-400 border-b-2 border-emerald-400">Open Orders</button>
              <button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground">Order History</button>
              <button className="pb-3 text-sm font-medium text-muted-foreground hover:text-foreground">Trade History</button>
            </div>
            <div className="min-h-[200px] flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-muted-foreground text-sm mb-4">
                {isAuthenticated ? "No records" : "Log in or Register Now to trade"}
              </p>
              {!isAuthenticated && (
                <div className="flex gap-3">
                  <Link href="/login" className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded transition-all">
                    Log In
                  </Link>
                  <Link href="/signup" className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded transition-all">
                    Register Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Order Confirmation Modal */}
      {pendingOrder && (
        <OrderConfirmationModal
          isOpen={showOrderModal}
          onClose={() => {
            setShowOrderModal(false);
            setPendingOrder(null);
          }}
          orderData={pendingOrder}
          currentPrice={tickerData?.price || 0}
          onSuccess={handleOrderSuccess}
        />
      )}
    </>
  );
}
