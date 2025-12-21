import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🌱 Starting database seed...');

    // Hash the password
    const hashedPassword = await bcrypt.hash('Admin@AtlasPrime2024!', 10);

    // Create or update admin user
    const user = await prisma.user.upsert({
      where: { email: 'admin@atlasprime.trade' },
      update: {
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
        emailVerified: true,
        kycStatus: 'VERIFIED',
      },
      create: {
        email: 'admin@atlasprime.trade',
        username: 'admin',
        passwordHash: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'SUPER_ADMIN',
        emailVerified: true,
        kycStatus: 'VERIFIED',
      },
    });

    console.log('✅ Admin user created:', user.email);

    // Create wallets with zero balances
    const wallets = [
      { asset: 'USDT', balance: 0 },
      { asset: 'BTC', balance: 0 },
      { asset: 'ETH', balance: 0 },
      { asset: 'BNB', balance: 0 },
      { asset: 'SOL', balance: 0 },
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

    console.log('✅ Wallets created');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      user: {
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('❌ Seed error:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
