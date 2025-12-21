import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth-middleware';

// POST /api/admin/bots/add-profit - Admin adds profit to a user's bot
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
    const {
      userBotId,
      profitAmount,
      profitPercent,
      createTrade,
      tradeDetails,
    } = body;

    // Validate required fields
    if (!userBotId || (!profitAmount && !profitPercent)) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user bot
    const userBot = await prisma.userBot.findUnique({
      where: { id: userBotId },
      include: {
        bot: true,
        user: true,
      },
    });

    if (!userBot) {
      return NextResponse.json(
        { success: false, message: 'User bot not found' },
        { status: 404 }
      );
    }

    let actualProfitAmount = 0;

    if (profitAmount) {
      actualProfitAmount = parseFloat(profitAmount);
    } else if (profitPercent) {
      const investedAmount = parseFloat(userBot.investedAmount.toString());
      actualProfitAmount = (investedAmount * parseFloat(profitPercent)) / 100;
    }

    // Update user bot in transaction
    const updatedUserBot = await prisma.$transaction(async (tx) => {
      const currentValue = parseFloat(userBot.currentValue.toString());
      const totalProfit = parseFloat(userBot.totalProfit.toString());
      const investedAmount = parseFloat(userBot.investedAmount.toString());

      const newCurrentValue = currentValue + actualProfitAmount;
      const newTotalProfit = totalProfit + actualProfitAmount;
      const newProfitPercent = (newTotalProfit / investedAmount) * 100;

      // Update user bot
      const updated = await tx.userBot.update({
        where: { id: userBotId },
        data: {
          currentValue: newCurrentValue,
          totalProfit: newTotalProfit,
          profitPercent: newProfitPercent,
        },
      });

      // Optionally create a simulated trade
      if (createTrade && tradeDetails) {
        await tx.botTrade.create({
          data: {
            userBotId: userBotId,
            pair: tradeDetails.pair || userBot.tradingPair,
            side: tradeDetails.side || 'BUY',
            entryPrice: parseFloat(tradeDetails.entryPrice || '0'),
            exitPrice: parseFloat(tradeDetails.exitPrice || '0'),
            amount: parseFloat(tradeDetails.amount || '0'),
            profit: actualProfitAmount,
            profitPercent: profitPercent ? parseFloat(profitPercent) : (actualProfitAmount / investedAmount) * 100,
            status: 'CLOSED',
            closedAt: new Date(),
          },
        });
      }

      return updated;
    });

    console.log(`✅ Admin ${admin.username} added profit: $${actualProfitAmount.toFixed(2)} to bot ${userBot.bot.name} for user ${userBot.user.username}`);

    return NextResponse.json({
      success: true,
      message: `Profit of $${actualProfitAmount.toFixed(2)} added successfully`,
      userBot: updatedUserBot,
    });
  } catch (error) {
    console.error('Add profit error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add profit' },
      { status: 500 }
    );
  }
}
