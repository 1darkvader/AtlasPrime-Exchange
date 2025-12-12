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
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Get transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { user: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (transaction.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if already confirmed
    if (transaction.userConfirmed) {
      return NextResponse.json(
        { success: false, message: 'Transaction already confirmed' },
        { status: 400 }
      );
    }

    // Update transaction to confirmed
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        userConfirmed: true,
        status: 'PROCESSING',
      },
    });

    // Send Telegram notification to admin
    const userName = `${transaction.user.firstName || ''} ${transaction.user.lastName || ''}`.trim() || transaction.user.username;

    const telegramData = {
      userId: transaction.user.id,
      userName,
      userEmail: transaction.user.email,
      type: transaction.type.toLowerCase() as 'deposit' | 'withdrawal',
      amount: parseFloat(transaction.amount.toString()),
      asset: transaction.asset,
      transactionId: transaction.id,
    };

    // Send notification based on type
    if (transaction.type === 'DEPOSIT') {
      await telegramService.sendDepositNotification(telegramData);
    } else if (transaction.type === 'WITHDRAWAL') {
      await telegramService.sendWithdrawalNotification(telegramData);
    }

    return NextResponse.json({
      success: true,
      transaction: updatedTransaction,
      message: 'Transaction confirmed. Admin will review shortly.',
    });
  } catch (error) {
    console.error('Confirm transaction error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to confirm transaction' },
      { status: 500 }
    );
  }
}
