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

    // Fetch user's watchlist
    const watchlist = await prisma.stockWatchlist.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      watchlist: watchlist.map((w: any) => ({
        id: w.id,
        symbol: w.symbol,
        alertPrice: w.alertPrice?.toString() || null,
        notes: w.notes,
        createdAt: w.createdAt.toISOString(),
      })),
    });
  } catch (error: unknown) {
    console.error('Watchlist fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watchlist' },
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
    const { symbol, alertPrice, notes } = body;

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }

    // Check if already in watchlist
    const existing = await prisma.stockWatchlist.findUnique({
      where: {
        userId_symbol: {
          userId: session.user.id,
          symbol,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Stock already in watchlist' },
        { status: 400 }
      );
    }

    // Add to watchlist
    const watchlist = await prisma.stockWatchlist.create({
      data: {
        userId: session.user.id,
        symbol,
        alertPrice: alertPrice ? parseFloat(alertPrice) : null,
        notes,
      },
    });

    return NextResponse.json({
      success: true,
      watchlist: {
        id: watchlist.id,
        symbol: watchlist.symbol,
        alertPrice: watchlist.alertPrice?.toString() || null,
        notes: watchlist.notes,
      },
    });
  } catch (error: unknown) {
    console.error('Watchlist add error:', error);
    return NextResponse.json(
      { error: 'Failed to add to watchlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const { symbol } = body;

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol is required' },
        { status: 400 }
      );
    }

    // Remove from watchlist
    await prisma.stockWatchlist.delete({
      where: {
        userId_symbol: {
          userId: session.user.id,
          symbol,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Removed from watchlist',
    });
  } catch (error: unknown) {
    console.error('Watchlist delete error:', error);
    return NextResponse.json(
      { error: 'Failed to remove from watchlist' },
      { status: 500 }
    );
  }
}
