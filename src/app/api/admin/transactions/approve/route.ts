import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminUser();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { transactionId, action, rejectionReason } = body;

    if (!transactionId || !action) {
      return NextResponse.json(
        { success: false, message: 'Transaction ID and action are required' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Invalid action. Must be approve or reject' },
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

    // Check if already processed
    if (transaction.adminApproved || transaction.status === 'COMPLETED' || transaction.status === 'FAILED') {
      return NextResponse.json(
        { success: false, message: 'Transaction already processed' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      console.log(`✅ Approving ${transaction.type}: ${transaction.amount} ${transaction.asset} for user ${transaction.user.username}`);

      // Approve transaction
      const updatedTransaction = await prisma.$transaction(async (tx) => {
        // Update transaction
        const updated = await tx.transaction.update({
          where: { id: transactionId },
          data: {
            adminApproved: true,
            status: 'COMPLETED',
            approvedBy: admin.id,
            approvedAt: new Date(),
            completedAt: new Date(),
          },
        });

        // Get or create admin wallet for this asset
        const adminWallet = await tx.adminWallet.upsert({
          where: { asset: transaction.asset },
          create: {
            asset: transaction.asset,
            balance: 10000000, // $10 million initial balance
            totalDeposits: 0,
            totalWithdrawals: 0,
          },
          update: {},
        });

        // Credit or debit wallet based on transaction type
        if (transaction.type === 'DEPOSIT') {
          // Check admin has sufficient balance
          if (parseFloat(adminWallet.balance.toString()) < parseFloat(transaction.amount.toString())) {
            throw new Error(`Insufficient admin balance. Available: ${adminWallet.balance} ${transaction.asset}`);
          }

          // Deduct from admin wallet
          await tx.adminWallet.update({
            where: { asset: transaction.asset },
            data: {
              balance: { decrement: transaction.amount },
              totalDeposits: { increment: transaction.amount },
            },
          });

          // Credit user wallet
          await tx.wallet.upsert({
            where: {
              userId_asset: {
                userId: transaction.userId,
                asset: transaction.asset,
              },
            },
            create: {
              userId: transaction.userId,
              asset: transaction.asset,
              balance: transaction.amount,
              lockedBalance: 0,
            },
            update: {
              balance: {
                increment: transaction.amount,
              },
            },
          });

          console.log(`✅ Deposit approved: +${transaction.amount} ${transaction.asset} → ${transaction.user.username}`);
        } else if (transaction.type === 'WITHDRAWAL') {
          // Debit user wallet
          const wallet = await tx.wallet.findUnique({
            where: {
              userId_asset: {
                userId: transaction.userId,
                asset: transaction.asset,
              },
            },
          });

          if (!wallet || parseFloat(wallet.balance.toString()) < parseFloat(transaction.amount.toString())) {
            throw new Error('Insufficient user balance for withdrawal');
          }

          await tx.wallet.update({
            where: {
              userId_asset: {
                userId: transaction.userId,
                asset: transaction.asset,
              },
            },
            data: {
              balance: {
                decrement: transaction.amount,
              },
            },
          });

          // Credit admin wallet
          await tx.adminWallet.update({
            where: { asset: transaction.asset },
            data: {
              balance: { increment: transaction.amount },
              totalWithdrawals: { increment: transaction.amount },
            },
          });

          console.log(`✅ Withdrawal approved: -${transaction.amount} ${transaction.asset} ← ${transaction.user.username}`);
        }

        return updated;
      });

      return NextResponse.json({
        success: true,
        transaction: updatedTransaction,
        message: `${transaction.type} approved successfully`,
      });
    } else {
      // Reject transaction
      const updatedTransaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: 'FAILED',
          rejectionReason: rejectionReason || 'Rejected by admin',
          approvedBy: admin.id,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        transaction: updatedTransaction,
        message: 'Transaction rejected',
      });
    }
  } catch (error) {
    console.error('Approve transaction error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to process transaction' },
      { status: 500 }
    );
  }
}
