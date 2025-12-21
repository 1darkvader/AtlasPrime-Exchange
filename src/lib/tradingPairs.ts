export interface TradingPair {
  pair: string;
  symbol: string;
  name: string;
  icon: string;
  category: "major" | "defi" | "meme" | "layer1" | "layer2" | "gaming" | "ai" | "privacy" | "storage";
  rank: number;
}

export const TOP_50_PAIRS: TradingPair[] = [
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
  { pair: "APT/USDT", symbol: "APTUSDT", name: "Aptos", icon: "A", category: "layer1", rank: 21 },
  { pair: "ARB/USDT", symbol: "ARBUSDT", name: "Arbitrum", icon: "🔷", category: "layer2", rank: 22 },
  { pair: "OP/USDT", symbol: "OPUSDT", name: "Optimism", icon: "🔴", category: "layer2", rank: 23 },
  { pair: "FIL/USDT", symbol: "FILUSDT", name: "Filecoin", icon: "⨎", category: "storage", rank: 24 },
  { pair: "ALGO/USDT", symbol: "ALGOUSDT", name: "Algorand", icon: "△", category: "layer1", rank: 25 },
  { pair: "VET/USDT", symbol: "VETUSDT", name: "VeChain", icon: "V", category: "layer1", rank: 26 },
  { pair: "HBAR/USDT", symbol: "HBARUSDT", name: "Hedera", icon: "ℏ", category: "layer1", rank: 27 },
  { pair: "ICP/USDT", symbol: "ICPUSDT", name: "Internet Computer", icon: "∞", category: "layer1", rank: 28 },
  { pair: "AAVE/USDT", symbol: "AAVEUSDT", name: "Aave", icon: "👻", category: "defi", rank: 29 },
  { pair: "GRT/USDT", symbol: "GRTUSDT", name: "The Graph", icon: "◎", category: "defi", rank: 30 },
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
  { pair: "QNT/USDT", symbol: "QNTUSDT", name: "Quant", icon: "Q", category: "defi", rank: 51 },
  { pair: "RUNE/USDT", symbol: "RUNEUSDT", name: "THORChain", icon: "⚔", category: "defi", rank: 52 },
  { pair: "FTT/USDT", symbol: "FTTUSDT", name: "FTX Token", icon: "F", category: "major", rank: 53 },
  { pair: "EGLD/USDT", symbol: "EGLDUSDT", name: "MultiversX", icon: "⬡", category: "layer1", rank: 54 },
  { pair: "XMR/USDT", symbol: "XMRUSDT", name: "Monero", icon: "ɱ", category: "privacy", rank: 55 },
  { pair: "KAS/USDT", symbol: "KASUSDT", name: "Kaspa", icon: "K", category: "layer1", rank: 56 },
  { pair: "STX/USDT", symbol: "STXUSDT", name: "Stacks", icon: "S", category: "layer1", rank: 57 },
  { pair: "SEI/USDT", symbol: "SEIUSDT", name: "Sei", icon: "S", category: "layer1", rank: 58 },
  { pair: "TIA/USDT", symbol: "TIAUSDT", name: "Celestia", icon: "◎", category: "layer1", rank: 59 },
  { pair: "RENDER/USDT", symbol: "RENDERUSDT", name: "Render", icon: "R", category: "ai", rank: 60 },
  { pair: "BLUR/USDT", symbol: "BLURUSDT", name: "Blur", icon: "B", category: "defi", rank: 61 },
  { pair: "1INCH/USDT", symbol: "1INCHUSDT", name: "1inch", icon: "1", category: "defi", rank: 62 },
  { pair: "ENJ/USDT", symbol: "ENJUSDT", name: "Enjin Coin", icon: "E", category: "gaming", rank: 63 },
  { pair: "GALA/USDT", symbol: "GALAUSDT", name: "Gala", icon: "G", category: "gaming", rank: 64 },
  { pair: "CHZ/USDT", symbol: "CHZUSDT", name: "Chiliz", icon: "C", category: "gaming", rank: 65 },
  { pair: "KAVA/USDT", symbol: "KAVAUSDT", name: "Kava", icon: "K", category: "defi", rank: 66 },
  { pair: "COMP/USDT", symbol: "COMPUSDT", name: "Compound", icon: "C", category: "defi", rank: 67 },
  { pair: "BAT/USDT", symbol: "BATUSDT", name: "Basic Attention", icon: "🦁", category: "major", rank: 68 },
  { pair: "ZIL/USDT", symbol: "ZILUSDT", name: "Zilliqa", icon: "Z", category: "layer1", rank: 69 },
  { pair: "ENS/USDT", symbol: "ENSUSDT", name: "Ethereum Name Service", icon: "E", category: "defi", rank: 70 },
  { pair: "WOO/USDT", symbol: "WOOUSDT", name: "WOO Network", icon: "W", category: "defi", rank: 71 },
  { pair: "FLOKI/USDT", symbol: "FLOKIUSDT", name: "FLOKI", icon: "🐕", category: "meme", rank: 72 },
  { pair: "BONK/USDT", symbol: "BONKUSDT", name: "Bonk", icon: "🐕", category: "meme", rank: 73 },
  { pair: "OCEAN/USDT", symbol: "OCEANUSDT", name: "Ocean Protocol", icon: "🌊", category: "ai", rank: 74 },
  { pair: "JASMY/USDT", symbol: "JASMYUSDT", name: "JasmyCoin", icon: "J", category: "ai", rank: 75 },
  { pair: "ROSE/USDT", symbol: "ROSEUSDT", name: "Oasis Network", icon: "🌹", category: "privacy", rank: 76 },
  { pair: "ANKR/USDT", symbol: "ANKRUSDT", name: "Ankr", icon: "⚓", category: "defi", rank: 77 },
  { pair: "ZRX/USDT", symbol: "ZRXUSDT", name: "0x Protocol", icon: "0", category: "defi", rank: 78 },
  { pair: "SKL/USDT", symbol: "SKLUSDT", name: "SKALE", icon: "S", category: "layer2", rank: 79 },
  { pair: "IOTX/USDT", symbol: "IOTXUSDT", name: "IoTeX", icon: "I", category: "layer1", rank: 80 },
  { pair: "AR/USDT", symbol: "ARUSDT", name: "Arweave", icon: "A", category: "storage", rank: 81 },
  { pair: "STORJ/USDT", symbol: "STORJUSDT", name: "Storj", icon: "S", category: "storage", rank: 82 },
  { pair: "SC/USDT", symbol: "SCUSDT", name: "Siacoin", icon: "S", category: "storage", rank: 83 },
  { pair: "ZEC/USDT", symbol: "ZECUSDT", name: "Zcash", icon: "Z", category: "privacy", rank: 84 },
  { pair: "DASH/USDT", symbol: "DASHUSDT", name: "Dash", icon: "Ð", category: "privacy", rank: 85 },
  { pair: "QTUM/USDT", symbol: "QTUMUSDT", name: "Qtum", icon: "Q", category: "layer1", rank: 86 },
  { pair: "ONE/USDT", symbol: "ONEUSDT", name: "Harmony", icon: "1", category: "layer1", rank: 87 },
  { pair: "CELO/USDT", symbol: "CELOUSDT", name: "Celo", icon: "C", category: "layer1", rank: 88 },
  { pair: "ZEN/USDT", symbol: "ZENUSDT", name: "Horizen", icon: "Z", category: "privacy", rank: 89 },
  { pair: "ICX/USDT", symbol: "ICXUSDT", name: "ICON", icon: "I", category: "layer1", rank: 90 },
  { pair: "OMG/USDT", symbol: "OMGUSDT", name: "OMG Network", icon: "O", category: "layer2", rank: 91 },
  { pair: "WAVES/USDT", symbol: "WAVESUSDT", name: "Waves", icon: "W", category: "layer1", rank: 92 },
  { pair: "BTT/USDT", symbol: "BTTUSDT", name: "BitTorrent", icon: "B", category: "storage", rank: 93 },
  { pair: "HOT/USDT", symbol: "HOTUSDT", name: "Holo", icon: "H", category: "layer1", rank: 94 },
  { pair: "RSR/USDT", symbol: "RSRUSDT", name: "Reserve Rights", icon: "R", category: "defi", rank: 95 },
  { pair: "SPELL/USDT", symbol: "SPELLUSDT", name: "Spell Token", icon: "S", category: "defi", rank: 96 },
  { pair: "YFI/USDT", symbol: "YFIUSDT", name: "yearn.finance", icon: "Y", category: "defi", rank: 97 },
  { pair: "SUSHI/USDT", symbol: "SUSHIUSDT", name: "SushiSwap", icon: "🍣", category: "defi", rank: 98 },
  { pair: "DYDX/USDT", symbol: "DYDXUSDT", name: "dYdX", icon: "D", category: "defi", rank: 99 },
  { pair: "PAXG/USDT", symbol: "PAXGUSDT", name: "PAX Gold", icon: "🥇", category: "major", rank: 100 },
];

export const CATEGORIES = {
  major: "Major Coins",
  layer1: "Layer 1",
  layer2: "Layer 2",
  defi: "DeFi",
  meme: "Meme Coins",
  gaming: "Gaming/Metaverse",
  ai: "AI/ML",
  privacy: "Privacy",
  storage: "Storage",
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
