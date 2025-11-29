import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding admin user...');

  const adminEmail = 'admin@atlasprime.trade';
  const adminPassword = 'Admin@AtlasPrime2024!';

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (existingAdmin) {
      // Update existing admin
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          passwordHash: hashedPassword,
          role: 'SUPER_ADMIN',
          emailVerified: true,
          kycStatus: 'VERIFIED',
        },
      });
      console.log('✅ Admin user updated');
    } else {
      // Create new admin
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          username: 'admin',
          passwordHash: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          role: 'SUPER_ADMIN',
          emailVerified: true,
          kycStatus: 'VERIFIED',
        },
      });

      // Create wallets for admin
      const assets = ['USDT', 'BTC', 'ETH', 'BNB', 'SOL'];
      for (const asset of assets) {
        await prisma.wallet.create({
          data: {
            userId: admin.id,
            asset,
            balance: 0,
            lockedBalance: 0,
          },
        });
      }

      console.log('✅ Admin user created');
    }

    console.log('\n📧 Admin Credentials:');
    console.log('  Email:', adminEmail);
    console.log('  Password:', adminPassword);
    console.log('\n✅ Seeding complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
