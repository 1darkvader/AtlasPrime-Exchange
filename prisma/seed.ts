import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminEmail = 'admin@atlasprime.trade';
  const adminPassword = 'Admin@AtlasPrime2024!';

  // Check if admin user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        username: 'admin',
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'SUPER_ADMIN',
        emailVerified: true,
        kycStatus: 'VERIFIED',
        twoFactorEnabled: false,
      },
    });

    console.log('✅ Admin user created:', adminEmail);

    // Create admin wallets
    const assets = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL'];
    for (const asset of assets) {
      await prisma.wallet.create({
        data: {
          userId: adminUser.id,
          asset,
          balance: 0,
          lockedBalance: 0,
        },
      });
    }

    console.log('✅ Admin wallets created');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
