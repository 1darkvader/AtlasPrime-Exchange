import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding admin user...');

  const adminEmail = 'admin@atlasprime.trade';
  const adminPassword = 'Admin@AtlasPrime2024!';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log('✅ Admin user already exists:', adminEmail);
    console.log('   Role:', existingAdmin.role);
    return;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      username: 'admin',
      passwordHash,
      role: 'SUPER_ADMIN',
      emailVerified: true,
      kycStatus: 'VERIFIED',
      twoFactorEnabled: false,
      firstName: 'Admin',
      lastName: 'AtlasPrime',
      countryCode: 'US',
      phoneNumber: '+1234567890',
    },
  });

  // Create initial wallets for admin
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

  console.log('✅ Admin user created successfully!');
  console.log('📧 Email:', adminEmail);
  console.log('🔑 Password:', adminPassword);
  console.log('👤 Role:', admin.role);
  console.log('🎯 Use these credentials to login to the admin panel');
}

main()
  .catch((error) => {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
