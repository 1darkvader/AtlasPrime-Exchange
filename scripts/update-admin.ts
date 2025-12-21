import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAdminUser() {
  console.log('🔐 Updating demo user to admin role...\n');

  // Update demo user to SUPER_ADMIN
  const user = await prisma.user.update({
    where: { email: 'demo@atlasprime.com' },
    data: { role: 'SUPER_ADMIN' }
  });

  console.log('✅ Updated user:', {
    email: user.email,
    username: user.username,
    role: user.role
  });

  console.log('\n🎉 Admin user updated successfully!');
  console.log('Login with: demo@atlasprime.com / Demo123456');
}

updateAdminUser()
  .catch((error) => {
    console.error('❌ Error updating admin user:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
