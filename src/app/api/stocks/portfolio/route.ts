import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify session
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || new Date(session.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    // Fetch user's stock portfolio
    const portfolio = await prisma.stockPortfolio.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      portfolio: portfolio.map((p: any) => ({
        id: p.id,
        symbol: p.symbol,
        shares: p.shares.toString(),
        averagePrice: p.averagePrice.toString(),
        totalInvested: p.totalInvested.toString(),
        createdAt: p.createdAt.toISOString(),
      })),
    });
  } catch (error: unknown) {
    console.error('Portfolio fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify session
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || new Date(session.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { symbol, shares, price, action } = body;

    if (!symbol || !shares || !price) {
      return NextResponse.json(
        { error: 'Symbol, shares, and price are required' },
        { status: 400 }
      );
    }

    const sharesNum = parseFloat(shares);
    const priceNum = parseFloat(price);

    // Get existing position
    const existingPosition = await prisma.stockPortfolio.findUnique({
      where: {
        userId_symbol: {
          userId: session.user.id,
          symbol,
        },
      },
    });

    if (action === 'BUY') {
      if (existingPosition) {
        // Update existing position
        const newShares = parseFloat(existingPosition.shares.toString()) + sharesNum;
        const newTotalInvested = parseFloat(existingPosition.totalInvested.toString()) + (sharesNum * priceNum);
        const newAveragePrice = newTotalInvested / newShares;

        const updated = await prisma.stockPortfolio.update({
          where: {
            userId_symbol: {
              userId: session.user.id,
              symbol,
            },
          },
          data: {
            shares: newShares,
            averagePrice: newAveragePrice,
            totalInvested: newTotalInvested,
          },
        });

        return NextResponse.json({
          success: true,
          portfolio: {
            id: updated.id,
            symbol: updated.symbol,
            shares: updated.shares.toString(),
            averagePrice: updated.averagePrice.toString(),
            totalInvested: updated.totalInvested.toString(),
          },
        });
      } else {
        // Create new position
        const portfolio = await prisma.stockPortfolio.create({
          data: {
            userId: session.user.id,
            symbol,
            shares: sharesNum,
            averagePrice: priceNum,
            totalInvested: sharesNum * priceNum,
          },
        });

        return NextResponse.json({
          success: true,
          portfolio: {
            id: portfolio.id,
            symbol: portfolio.symbol,
            shares: portfolio.shares.toString(),
            averagePrice: portfolio.averagePrice.toString(),
            totalInvested: portfolio.totalInvested.toString(),
          },
        });
      }
    } else if (action === 'SELL') {
      if (!existingPosition) {
        return NextResponse.json(
          { error: 'No position found for this stock' },
          { status: 400 }
        );
      }

      const currentShares = parseFloat(existingPosition.shares.toString());

      if (sharesNum > currentShares) {
        return NextResponse.json(
          { error: 'Not enough shares to sell' },
          { status: 400 }
        );
      }

      const newShares = currentShares - sharesNum;

      if (newShares === 0) {
        // Close position
        await prisma.stockPortfolio.delete({
          where: {
            userId_symbol: {
              userId: session.user.id,
              symbol,
            },
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Position closed',
        });
      } else {
        // Reduce position
        const avgPrice = parseFloat(existingPosition.averagePrice.toString());
        const newTotalInvested = newShares * avgPrice;

        const updated = await prisma.stockPortfolio.update({
          where: {
            userId_symbol: {
              userId: session.user.id,
              symbol,
            },
          },
          data: {
            shares: newShares,
            totalInvested: newTotalInvested,
          },
        });

        return NextResponse.json({
          success: true,
          portfolio: {
            id: updated.id,
            symbol: updated.symbol,
            shares: updated.shares.toString(),
            averagePrice: updated.averagePrice.toString(),
            totalInvested: updated.totalInvested.toString(),
          },
        });
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Must be BUY or SELL' },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error('Portfolio update error:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}
