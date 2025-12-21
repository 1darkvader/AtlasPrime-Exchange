import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper to verify JWT and get user
async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        wallets: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}

// POST /api/bots/user/[id]/stop - Stop a user's bot
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userBotId = params.id;

    // Get user bot
    const userBot = await prisma.userBot.findUnique({
      where: { id: userBotId },
      include: {
        bot: true,
      },
    });

    if (!userBot) {
      return NextResponse.json(
        { success: false, message: 'Bot not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (userBot.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Stop bot and unlock funds
    await prisma.$transaction(async (tx) => {
      // Update bot status
      await tx.userBot.update({
        where: { id: userBotId },
        data: {
          status: 'STOPPED',
          isActive: false,
          stoppedAt: new Date(),
        },
      });

      // Unlock the invested amount and add current value to balance
      const usdtWallet = user.wallets.find(w => w.asset === 'USDT');

      if (usdtWallet) {
        const investedAmount = parseFloat(userBot.investedAmount.toString());
        const currentValue = parseFloat(userBot.currentValue.toString());
        const lockedAmount = investedAmount; // Amount that was locked

        await tx.wallet.update({
          where: { id: usdtWallet.id },
          data: {
            // Unlock the invested amount
            lockedBalance: {
              decrement: lockedAmount,
            },
            // Add the current value (invested + profit) to available balance
            balance: {
              increment: currentValue,
            },
          },
        });
      }

      // Decrement bot's total users count
      await tx.tradingBot.update({
        where: { id: userBot.botId },
        data: {
          totalUsers: {
            decrement: 1,
          },
        },
      });
    });

    console.log(`✅ Bot stopped: ${userBot.bot.name} for user ${user.username}`);

    return NextResponse.json({
      success: true,
      message: 'Bot stopped successfully. Funds have been returned to your wallet.',
    });
  } catch (error) {
    console.error('Stop bot error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to stop bot' },
      { status: 500 }
    );
  }
}
