import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // Create demo user
  const hashedPassword = await bcrypt.hash('Demo123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@atlasprime.com' },
    update: {
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
    },
    create: {
      email: 'demo@atlasprime.com',
      username: 'demo',
      passwordHash: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      emailVerified: true,
      kycStatus: 'VERIFIED',
    },
  });

  console.log('✅ Demo user created/updated:', {
    email: user.email,
    username: user.username,
    role: user.role,
  });

  // Create wallets for demo user
  const wallets = [
    { asset: 'USDT', balance: 10000 },
    { asset: 'BTC', balance: 0.5 },
    { asset: 'ETH', balance: 5 },
    { asset: 'BNB', balance: 10 },
    { asset: 'SOL', balance: 50 },
  ];

  for (const wallet of wallets) {
    await prisma.wallet.upsert({
      where: {
        userId_asset: {
          userId: user.id,
          asset: wallet.asset,
        },
      },
      update: {
        balance: wallet.balance,
      },
      create: {
        userId: user.id,
        asset: wallet.asset,
        balance: wallet.balance,
        lockedBalance: 0,
      },
    });
  }

  console.log('✅ Wallets created for demo user');
  console.log('\n🎉 Database seeding completed!');
  console.log('\nLogin credentials:');
  console.log('  Email: demo@atlasprime.com');
  console.log('  Password: Demo123456');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
