import prisma from '../src/lib/prisma';

const COMMON_ASSETS = [
  'USDT',
  'USDC',
  'BTC',
  'ETH',
  'BNB',
  'SOL',
  'XRP',
  'ADA',
  'DOGE',
  'MATIC',
  'DOT',
  'AVAX',
  'LINK',
  'UNI',
  'ATOM',
];

const INITIAL_BALANCE = 10000000; // $10 million

async function seedAdminWallet() {
  console.log('🚀 Seeding admin wallets...\n');

  for (const asset of COMMON_ASSETS) {
    try {
      const wallet = await prisma.adminWallet.upsert({
        where: { asset },
        create: {
          asset,
          balance: INITIAL_BALANCE,
          totalDeposits: 0,
          totalWithdrawals: 0,
        },
        update: {
          balance: INITIAL_BALANCE,
        },
      });

      console.log(`✅ ${asset}: $${INITIAL_BALANCE.toLocaleString()} (ID: ${wallet.id})`);
    } catch (error) {
      console.error(`❌ Failed to seed ${asset}:`, error);
    }
  }

  // Calculate total
  const totalBalance = INITIAL_BALANCE * COMMON_ASSETS.length;
  console.log(`\n💰 Total Admin Balance: $${totalBalance.toLocaleString()}`);
  console.log(`📊 Assets: ${COMMON_ASSETS.length}`);

  console.log('\n✅ Admin wallet seeding complete!');
}

seedAdminWallet()
  .then(() => {
    console.log('\n🎉 Seeding successful!');
    process.exit(0);
  })
  .catch((e) => {
    console.error('❌ Error seeding admin wallet:', e);
    process.exit(1);
  });
