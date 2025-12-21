// Deposit Wallet Addresses Configuration
// All EVM chains use the same address: 0xeeAaBD6c5598020C7494431aC2C28c54cb64b044

export interface DepositAddress {
  chain: string;
  network: string;
  nativeCoin: string;
  address: string;
  chainType: 'EVM' | 'Bitcoin' | 'Solana' | 'Cardano' | 'XRP' | 'Tron';
  chainId?: number;
  rpcUrl?: string;
  blockExplorer?: string;
  supportedTokens: string[];
  isTestnet?: boolean;
}

// Main wallet addresses
export const WALLET_ADDRESSES = {
  EVM: '0xeeAaBD6c5598020C7494431aC2C28c54cb64b044',
  BTC: 'bc1qt62p8xwj5w5zs8t7vvg9ttppc8kspsd7pswsja',
  DOGE: 'D9Lc4qSLENVdAPkxJtgsL7c7Pg1Lw882jx',
  SOL: 'ADJ58ev2vy5rqty8smaVrfjcUQmaLmKMFcWL3VrkCg1N',
  LTC: 'LM5cWFEg7NZ9AqK7XMNT9PDbnfNz145DEB',
  XRP: 'raUtLxcWiv1CEfjmoYRSytfNeiGPHZh268',
  ADA: 'addr1qyxqwmch555ud99xg7xqa8ckav66w28jn9m5cg20k0q3kegvqah30fffc622v3uvp603d6e45u509xthfss5lv7prdjsg5khmw',
  TRX: 'TNxfmxxtY2yPL9sr7NYoQCX7eBuCF2nYdS',
};

export const DEPOSIT_NETWORKS: DepositAddress[] = [
  // Bitcoin
  {
    chain: 'Bitcoin',
    network: 'Bitcoin Mainnet',
    nativeCoin: 'BTC',
    address: WALLET_ADDRESSES.BTC,
    chainType: 'Bitcoin',
    blockExplorer: 'https://blockchair.com/bitcoin',
    supportedTokens: ['BTC'],
  },

  // Ethereum & ERC20 Tokens
  {
    chain: 'Ethereum',
    network: 'Ethereum Mainnet',
    nativeCoin: 'ETH',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    blockExplorer: 'https://etherscan.io',
    supportedTokens: ['ETH', 'USDT', 'USDC', 'DAI', 'SHIBA', 'LINK', 'WBTC', 'UNI', 'AAVE', 'MKR'],
  },

  // BNB Smart Chain
  {
    chain: 'BNB Smart Chain',
    network: 'BSC Mainnet',
    nativeCoin: 'BNB',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 56,
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    supportedTokens: ['BNB', 'USDT', 'USDC', 'CAKE', 'BUSD', 'SAFEMOON'],
  },

  // Polygon
  {
    chain: 'Polygon',
    network: 'Polygon PoS',
    nativeCoin: 'MATIC',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    supportedTokens: ['MATIC', 'USDT', 'USDC', 'DAI', 'AAVE', 'QUICK'],
  },

  // Avalanche C-Chain
  {
    chain: 'Avalanche',
    network: 'Avalanche C-Chain',
    nativeCoin: 'AVAX',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 43114,
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorer: 'https://snowtrace.io',
    supportedTokens: ['AVAX', 'USDT', 'USDC', 'JOE', 'PNG'],
  },

  // Fantom
  {
    chain: 'Fantom',
    network: 'Fantom Opera',
    nativeCoin: 'FTM',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 250,
    rpcUrl: 'https://rpc.ftm.tools',
    blockExplorer: 'https://ftmscan.com',
    supportedTokens: ['FTM', 'USDT', 'USDC', 'BOO', 'SPIRIT', 'fUSD'],
  },

  // Arbitrum One
  {
    chain: 'Arbitrum',
    network: 'Arbitrum One',
    nativeCoin: 'ETH',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    supportedTokens: ['ETH', 'USDT', 'USDC', 'GMX', 'MAGIC', 'DAI'],
  },

  // Optimism
  {
    chain: 'Optimism',
    network: 'Optimism Mainnet',
    nativeCoin: 'ETH',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 10,
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    supportedTokens: ['ETH', 'USDT', 'USDC', 'OP', 'SNX'],
  },

  // Base
  {
    chain: 'Base',
    network: 'Base Mainnet',
    nativeCoin: 'ETH',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    blockExplorer: 'https://basescan.org',
    supportedTokens: ['ETH', 'USDC', 'AERO', 'DAI', 'cbETH'],
  },

  // Cronos
  {
    chain: 'Cronos',
    network: 'Cronos Mainnet',
    nativeCoin: 'CRO',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 25,
    rpcUrl: 'https://evm.cronos.org',
    blockExplorer: 'https://cronoscan.com',
    supportedTokens: ['CRO', 'USDT', 'USDC', 'VVS', 'TUSD'],
  },

  // zkSync Era
  {
    chain: 'zkSync Era',
    network: 'zkSync Era Mainnet',
    nativeCoin: 'ETH',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 324,
    rpcUrl: 'https://mainnet.era.zksync.io',
    blockExplorer: 'https://explorer.zksync.io',
    supportedTokens: ['ETH', 'USDT', 'USDC', 'DAI'],
  },

  // Linea
  {
    chain: 'Linea',
    network: 'Linea Mainnet',
    nativeCoin: 'ETH',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 59144,
    rpcUrl: 'https://rpc.linea.build',
    blockExplorer: 'https://lineascan.build',
    supportedTokens: ['ETH', 'USDC', 'USDT', 'DAI'],
  },

  // Mantle
  {
    chain: 'Mantle',
    network: 'Mantle Mainnet',
    nativeCoin: 'MNT',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 5000,
    rpcUrl: 'https://rpc.mantle.xyz',
    blockExplorer: 'https://explorer.mantle.xyz',
    supportedTokens: ['MNT', 'USDT', 'USDC'],
  },

  // Scroll
  {
    chain: 'Scroll',
    network: 'Scroll Mainnet',
    nativeCoin: 'ETH',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 534352,
    rpcUrl: 'https://rpc.scroll.io',
    blockExplorer: 'https://scrollscan.com',
    supportedTokens: ['ETH', 'USDT', 'USDC'],
  },

  // Moonbeam
  {
    chain: 'Moonbeam',
    network: 'Moonbeam Mainnet',
    nativeCoin: 'GLMR',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 1284,
    rpcUrl: 'https://rpc.api.moonbeam.network',
    blockExplorer: 'https://moonscan.io',
    supportedTokens: ['GLMR', 'USDT', 'USDC'],
  },

  // Moonriver
  {
    chain: 'Moonriver',
    network: 'Moonriver Mainnet',
    nativeCoin: 'MOVR',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 1285,
    rpcUrl: 'https://rpc.api.moonriver.moonbeam.network',
    blockExplorer: 'https://moonriver.moonscan.io',
    supportedTokens: ['MOVR', 'USDT', 'USDC'],
  },

  // Celo
  {
    chain: 'Celo',
    network: 'Celo Mainnet',
    nativeCoin: 'CELO',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 42220,
    rpcUrl: 'https://forno.celo.org',
    blockExplorer: 'https://celoscan.io',
    supportedTokens: ['CELO', 'cUSD', 'cEUR', 'USDT'],
  },

  // Harmony
  {
    chain: 'Harmony',
    network: 'Harmony Mainnet',
    nativeCoin: 'ONE',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 1666600000,
    rpcUrl: 'https://api.harmony.one',
    blockExplorer: 'https://explorer.harmony.one',
    supportedTokens: ['ONE', 'USDT', 'USDC', 'bscBUSD'],
  },

  // Gnosis Chain
  {
    chain: 'Gnosis',
    network: 'Gnosis Chain',
    nativeCoin: 'xDAI',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 100,
    rpcUrl: 'https://rpc.gnosischain.com',
    blockExplorer: 'https://gnosisscan.io',
    supportedTokens: ['xDAI', 'GNO', 'USDT', 'USDC', 'HNY'],
  },

  // Kava
  {
    chain: 'Kava',
    network: 'Kava EVM',
    nativeCoin: 'KAVA',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 2222,
    rpcUrl: 'https://evm.kava.io',
    blockExplorer: 'https://explorer.kava.io',
    supportedTokens: ['KAVA', 'USDT', 'USDC'],
  },

  // Metis
  {
    chain: 'Metis',
    network: 'Metis Andromeda',
    nativeCoin: 'METIS',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 1088,
    rpcUrl: 'https://andromeda.metis.io/?owner=1088',
    blockExplorer: 'https://andromeda-explorer.metis.io',
    supportedTokens: ['METIS', 'USDT', 'USDC'],
  },

  // OKX Chain
  {
    chain: 'OKX Chain',
    network: 'OKC Mainnet',
    nativeCoin: 'OKT',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 66,
    rpcUrl: 'https://exchainrpc.okex.org',
    blockExplorer: 'https://www.oklink.com/okc',
    supportedTokens: ['OKT', 'USDT', 'USDC'],
  },

  // Bitgert
  {
    chain: 'Bitgert',
    network: 'Bitgert Mainnet',
    nativeCoin: 'BRISE',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 32520,
    rpcUrl: 'https://rpc.icecreamswap.com',
    blockExplorer: 'https://brisescan.com',
    supportedTokens: ['BRISE', 'USDT', 'USDC'],
  },

  // Aurora
  {
    chain: 'Aurora',
    network: 'Aurora Mainnet',
    nativeCoin: 'ETH',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 1313161554,
    rpcUrl: 'https://mainnet.aurora.dev',
    blockExplorer: 'https://aurorascan.dev',
    supportedTokens: ['ETH', 'USDT', 'USDC'],
  },

  // Fuse
  {
    chain: 'Fuse',
    network: 'Fuse Mainnet',
    nativeCoin: 'FUSE',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 122,
    rpcUrl: 'https://rpc.fuse.io',
    blockExplorer: 'https://explorer.fuse.io',
    supportedTokens: ['FUSE', 'USDT', 'USDC'],
  },

  // Palm
  {
    chain: 'Palm',
    network: 'Palm Network',
    nativeCoin: 'PALM',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 11297108109,
    rpcUrl: 'https://palm-mainnet.infura.io/v3/3a961d6501e54add9a41aa53f15de99b',
    blockExplorer: 'https://explorer.palm.io',
    supportedTokens: ['PALM', 'DAI', 'WETH'],
  },

  // Telos
  {
    chain: 'Telos',
    network: 'Telos EVM',
    nativeCoin: 'TLOS',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 40,
    rpcUrl: 'https://mainnet.telos.net/evm',
    blockExplorer: 'https://www.teloscan.io',
    supportedTokens: ['TLOS', 'USDT', 'USDC'],
  },

  // Core DAO
  {
    chain: 'Core',
    network: 'Core DAO',
    nativeCoin: 'CORE',
    address: WALLET_ADDRESSES.EVM,
    chainType: 'EVM',
    chainId: 1116,
    rpcUrl: 'https://rpc.coredao.org',
    blockExplorer: 'https://scan.coredao.org',
    supportedTokens: ['CORE', 'USDT', 'USDC'],
  },

  // Non-EVM Chains

  // Solana
  {
    chain: 'Solana',
    network: 'Solana Mainnet',
    nativeCoin: 'SOL',
    address: WALLET_ADDRESSES.SOL,
    chainType: 'Solana',
    blockExplorer: 'https://solscan.io',
    supportedTokens: ['SOL', 'USDT', 'USDC'],
  },

  // Dogecoin
  {
    chain: 'Dogecoin',
    network: 'Dogecoin Mainnet',
    nativeCoin: 'DOGE',
    address: WALLET_ADDRESSES.DOGE,
    chainType: 'Bitcoin',
    blockExplorer: 'https://blockchair.com/dogecoin',
    supportedTokens: ['DOGE'],
  },

  // Litecoin
  {
    chain: 'Litecoin',
    network: 'Litecoin Mainnet',
    nativeCoin: 'LTC',
    address: WALLET_ADDRESSES.LTC,
    chainType: 'Bitcoin',
    blockExplorer: 'https://blockchair.com/litecoin',
    supportedTokens: ['LTC'],
  },

  // XRP
  {
    chain: 'XRP',
    network: 'XRP Ledger',
    nativeCoin: 'XRP',
    address: WALLET_ADDRESSES.XRP,
    chainType: 'XRP',
    blockExplorer: 'https://xrpscan.com',
    supportedTokens: ['XRP'],
  },

  // Cardano
  {
    chain: 'Cardano',
    network: 'Cardano Mainnet',
    nativeCoin: 'ADA',
    address: WALLET_ADDRESSES.ADA,
    chainType: 'Cardano',
    blockExplorer: 'https://cardanoscan.io',
    supportedTokens: ['ADA'],
  },

  // Tron (for USDT TRC20)
  {
    chain: 'Tron',
    network: 'Tron Mainnet',
    nativeCoin: 'TRX',
    address: WALLET_ADDRESSES.TRX,
    chainType: 'Tron',
    blockExplorer: 'https://tronscan.org',
    supportedTokens: ['TRX', 'USDT'],
  },
];

// Helper functions
export const getNetworkByChain = (chain: string): DepositAddress | undefined => {
  return DEPOSIT_NETWORKS.find(n => n.chain.toLowerCase() === chain.toLowerCase());
};

export const getEVMNetworks = (): DepositAddress[] => {
  return DEPOSIT_NETWORKS.filter(n => n.chainType === 'EVM');
};

export const getAllNetworks = (): DepositAddress[] => {
  return DEPOSIT_NETWORKS;
};

export const getNetworksByToken = (token: string): DepositAddress[] => {
  return DEPOSIT_NETWORKS.filter(n =>
    n.supportedTokens.some(t => t.toLowerCase() === token.toLowerCase())
  );
};
