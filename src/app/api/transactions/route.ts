import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUser } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // DEPOSIT, WITHDRAWAL, TRANSFER
    const status = searchParams.get('status'); // PENDING, PROCESSING, COMPLETED, FAILED
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build where clause
    const where: any = {
      userId: user.id,
    };

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    // Fetch transactions
    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        type: true,
        asset: true,
        amount: true,
        fee: true,
        status: true,
        txHash: true,
        address: true,
        network: true,
        userConfirmed: true,
        adminApproved: true,
        rejectionReason: true,
        proofUrl: true,
        createdAt: true,
        completedAt: true,
        approvedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      transactions: transactions.map((tx: any) => ({
        id: tx.id,
        type: tx.type.toLowerCase(),
        asset: tx.asset,
        amount: parseFloat(tx.amount.toString()),
        fee: tx.fee ? parseFloat(tx.fee.toString()) : null,
        status: tx.status.toLowerCase(),
        txHash: tx.txHash,
        address: tx.address,
        network: tx.network,
        userConfirmed: tx.userConfirmed,
        adminApproved: tx.adminApproved,
        rejectionReason: tx.rejectionReason,
        proofUrl: tx.proofUrl,
        timestamp: tx.createdAt.toISOString(),
        completedAt: tx.completedAt?.toISOString(),
        approvedAt: tx.approvedAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Fetch transactions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
