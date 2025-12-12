import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUser } from '@/lib/auth-middleware';
import { telegramService } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, asset, amount, network, address, proofUrl } = body;

    // Validation
    if (!type || !asset || !amount) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // For withdrawals, check if user has sufficient balance
    if (type === 'WITHDRAWAL') {
      const wallet = await prisma.wallet.findUnique({
        where: {
          userId_asset: {
            userId: user.id,
            asset: asset,
          },
        },
      });

      if (!wallet || parseFloat(wallet.balance.toString()) < amount) {
        return NextResponse.json(
          { success: false, message: 'Insufficient balance' },
          { status: 400 }
        );
      }

      if (!address) {
        return NextResponse.json(
          { success: false, message: 'Withdrawal address is required' },
          { status: 400 }
        );
      }
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type,
        asset,
        amount,
        network,
        address,
        proofUrl,
        status: 'PENDING',
        userConfirmed: false,
        adminApproved: false,
      },
    });

    // Don't send Telegram notification yet - only when user confirms
    console.log('✅ Transaction created:', transaction.id);

    return NextResponse.json({
      success: true,
      transaction,
      message: 'Transaction request created successfully',
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
