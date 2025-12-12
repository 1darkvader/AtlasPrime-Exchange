import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@atlasprime.trade' }
  });

  if (!admin) {
    console.log('❌ Admin not found');
    return;
  }

  console.log('✅ Admin found:', admin.email);
  console.log('👤 Username:', admin.username);
  console.log('🔑 Role:', admin.role);

  const testPassword = 'Admin@AtlasPrime2024!';
  const isValid = await bcrypt.compare(testPassword, admin.passwordHash);

  console.log('🔐 Password test:', isValid ? '✅ Valid' : '❌ Invalid');

  if (!isValid) {
    console.log('🔄 Updating password to: Admin@AtlasPrime2024!');
    const newHash = await bcrypt.hash(testPassword, 10);
    await prisma.user.update({
      where: { id: admin.id },
      data: { passwordHash: newHash }
    });
    console.log('✅ Password updated successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('  Email: admin@atlasprime.trade');
    console.log('  Password: Admin@AtlasPrime2024!');
  } else {
    console.log('\n✅ Password is already correct!');
    console.log('\n📧 Login Credentials:');
    console.log('  Email: admin@atlasprime.trade');
    console.log('  Password: Admin@AtlasPrime2024!');
  }
}

main()
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
