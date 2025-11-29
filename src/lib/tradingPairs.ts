export interface TradingPair {
  pair: string;
  symbol: string;
  name: string;
  icon: string;
  category: "major" | "defi" | "meme" | "layer1" | "layer2" | "gaming" | "ai";
  rank: number;
}

export const TOP_50_PAIRS: TradingPair[] = [
  // Major Cryptocurrencies (Top 10)
  { pair: "BTC/USDT", symbol: "BTCUSDT", name: "Bitcoin", icon: "₿", category: "major", rank: 1 },
  { pair: "ETH/USDT", symbol: "ETHUSDT", name: "Ethereum", icon: "Ξ", category: "major", rank: 2 },
  { pair: "BNB/USDT", symbol: "BNBUSDT", name: "BNB", icon: "B", category: "major", rank: 3 },
  { pair: "SOL/USDT", symbol: "SOLUSDT", name: "Solana", icon: "◎", category: "layer1", rank: 4 },
  { pair: "XRP/USDT", symbol: "XRPUSDT", name: "Ripple", icon: "✕", category: "major", rank: 5 },
  { pair: "ADA/USDT", symbol: "ADAUSDT", name: "Cardano", icon: "₳", category: "layer1", rank: 6 },
  { pair: "AVAX/USDT", symbol: "AVAXUSDT", name: "Avalanche", icon: "▲", category: "layer1", rank: 7 },
  { pair: "DOGE/USDT", symbol: "DOGEUSDT", name: "Dogecoin", icon: "Ð", category: "meme", rank: 8 },
  { pair: "TRX/USDT", symbol: "TRXUSDT", name: "Tron", icon: "T", category: "layer1", rank: 9 },
  { pair: "DOT/USDT", symbol: "DOTUSDT", name: "Polkadot", icon: "●", category: "layer1", rank: 10 },

  // Top 11-20
  { pair: "MATIC/USDT", symbol: "MATICUSDT", name: "Polygon", icon: "⬡", category: "layer2", rank: 11 },
  { pair: "LTC/USDT", symbol: "LTCUSDT", name: "Litecoin", icon: "Ł", category: "major", rank: 12 },
  { pair: "SHIB/USDT", symbol: "SHIBUSDT", name: "Shiba Inu", icon: "🐕", category: "meme", rank: 13 },
  { pair: "BCH/USDT", symbol: "BCHUSDT", name: "Bitcoin Cash", icon: "₿", category: "major", rank: 14 },
  { pair: "LINK/USDT", symbol: "LINKUSDT", name: "Chainlink", icon: "⬡", category: "defi", rank: 15 },
  { pair: "UNI/USDT", symbol: "UNIUSDT", name: "Uniswap", icon: "🦄", category: "defi", rank: 16 },
  { pair: "ATOM/USDT", symbol: "ATOMUSDT", name: "Cosmos", icon: "⚛", category: "layer1", rank: 17 },
  { pair: "XLM/USDT", symbol: "XLMUSDT", name: "Stellar", icon: "✱", category: "major", rank: 18 },
  { pair: "ETC/USDT", symbol: "ETCUSDT", name: "Ethereum Classic", icon: "Ξ", category: "major", rank: 19 },
  { pair: "NEAR/USDT", symbol: "NEARUSDT", name: "NEAR Protocol", icon: "N", category: "layer1", rank: 20 },

  // Top 21-30
  { pair: "APT/USDT", symbol: "APTUSDT", name: "Aptos", icon: "A", category: "layer1", rank: 21 },
  { pair: "ARB/USDT", symbol: "ARBUSDT", name: "Arbitrum", icon: "🔷", category: "layer2", rank: 22 },
  { pair: "OP/USDT", symbol: "OPUSDT", name: "Optimism", icon: "🔴", category: "layer2", rank: 23 },
  { pair: "FIL/USDT", symbol: "FILUSDT", name: "Filecoin", icon: "⨎", category: "major", rank: 24 },
  { pair: "ALGO/USDT", symbol: "ALGOUSDT", name: "Algorand", icon: "△", category: "layer1", rank: 25 },
  { pair: "VET/USDT", symbol: "VETUSDT", name: "VeChain", icon: "V", category: "layer1", rank: 26 },
  { pair: "HBAR/USDT", symbol: "HBARUSDT", name: "Hedera", icon: "ℏ", category: "layer1", rank: 27 },
  { pair: "ICP/USDT", symbol: "ICPUSDT", name: "Internet Computer", icon: "∞", category: "layer1", rank: 28 },
  { pair: "AAVE/USDT", symbol: "AAVEUSDT", name: "Aave", icon: "👻", category: "defi", rank: 29 },
  { pair: "GRT/USDT", symbol: "GRTUSDT", name: "The Graph", icon: "◎", category: "defi", rank: 30 },

  // Top 31-40
  { pair: "SUI/USDT", symbol: "SUIUSDT", name: "Sui", icon: "~", category: "layer1", rank: 31 },
  { pair: "INJ/USDT", symbol: "INJUSDT", name: "Injective", icon: "◬", category: "defi", rank: 32 },
  { pair: "FTM/USDT", symbol: "FTMUSDT", name: "Fantom", icon: "◆", category: "layer1", rank: 33 },
  { pair: "SAND/USDT", symbol: "SANDUSDT", name: "The Sandbox", icon: "🏖", category: "gaming", rank: 34 },
  { pair: "MANA/USDT", symbol: "MANAUSDT", name: "Decentraland", icon: "M", category: "gaming", rank: 35 },
  { pair: "AXS/USDT", symbol: "AXSUSDT", name: "Axie Infinity", icon: "🎮", category: "gaming", rank: 36 },
  { pair: "EOS/USDT", symbol: "EOSUSDT", name: "EOS", icon: "E", category: "layer1", rank: 37 },
  { pair: "XTZ/USDT", symbol: "XTZUSDT", name: "Tezos", icon: "ꜩ", category: "layer1", rank: 38 },
  { pair: "THETA/USDT", symbol: "THETAUSDT", name: "Theta Network", icon: "Θ", category: "major", rank: 39 },
  { pair: "FLOW/USDT", symbol: "FLOWUSDT", name: "Flow", icon: "⟁", category: "layer1", rank: 40 },

  // Top 41-50
  { pair: "FET/USDT", symbol: "FETUSDT", name: "Fetch.ai", icon: "🤖", category: "ai", rank: 41 },
  { pair: "AGIX/USDT", symbol: "AGIXUSDT", name: "SingularityNET", icon: "🧠", category: "ai", rank: 42 },
  { pair: "RNDR/USDT", symbol: "RNDRUSDT", name: "Render Token", icon: "◆", category: "ai", rank: 43 },
  { pair: "IMX/USDT", symbol: "IMXUSDT", name: "Immutable X", icon: "⬡", category: "gaming", rank: 44 },
  { pair: "PEPE/USDT", symbol: "PEPEUSDT", name: "Pepe", icon: "🐸", category: "meme", rank: 45 },
  { pair: "APE/USDT", symbol: "APEUSDT", name: "ApeCoin", icon: "🦍", category: "gaming", rank: 46 },
  { pair: "MKR/USDT", symbol: "MKRUSDT", name: "Maker", icon: "M", category: "defi", rank: 47 },
  { pair: "SNX/USDT", symbol: "SNXUSDT", name: "Synthetix", icon: "S", category: "defi", rank: 48 },
  { pair: "CRV/USDT", symbol: "CRVUSDT", name: "Curve DAO", icon: "◠", category: "defi", rank: 49 },
  { pair: "LDO/USDT", symbol: "LDOUSDT", name: "Lido DAO", icon: "◎", category: "defi", rank: 50 },
];

export const CATEGORIES = {
  major: "Major Coins",
  layer1: "Layer 1",
  layer2: "Layer 2",
  defi: "DeFi",
  meme: "Meme Coins",
  gaming: "Gaming/Metaverse",
  ai: "AI/ML",
} as const;

export function getPairsByCategory(category: keyof typeof CATEGORIES) {
  return TOP_50_PAIRS.filter((pair) => pair.category === category);
}

export function getPairBySymbol(symbol: string) {
  return TOP_50_PAIRS.find((pair) => pair.symbol === symbol);
}

export function searchPairs(query: string) {
  const q = query.toLowerCase();
  return TOP_50_PAIRS.filter(
    (pair) =>
      pair.pair.toLowerCase().includes(q) ||
      pair.name.toLowerCase().includes(q) ||
      pair.symbol.toLowerCase().includes(q)
  );
}
