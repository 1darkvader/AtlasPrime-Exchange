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
      include: { wallets: true },
    });

    return user;
  } catch (error) {
    return null;
  }
}

// GET /api/orders - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const pair = searchParams.get('pair');
    const type = searchParams.get('type');

    // Build query filters
    const where: any = { userId: user.id };

    if (status) {
      where.status = status.toUpperCase();
    }

    if (pair) {
      where.pair = pair.toUpperCase();
    }

    if (type) {
      where.type = type.toUpperCase();
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      pair,
      type,
      side,
      price,
      amount,
      stopPrice,
      takeProfitPrice,
      stopLossPrice,
      leverage,
      positionMode,
    } = body;

    // Validate required fields
    if (!pair || !type || !side || !amount) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate order type
    if (!['MARKET', 'LIMIT', 'STOP_LIMIT'].includes(type.toUpperCase())) {
      return NextResponse.json(
        { success: false, message: 'Invalid order type' },
        { status: 400 }
      );
    }

    // Validate side
    if (!['BUY', 'SELL', 'LONG', 'SHORT'].includes(side.toUpperCase())) {
      return NextResponse.json(
        { success: false, message: 'Invalid order side' },
        { status: 400 }
      );
    }

    // For limit orders, price is required
    if (type.toUpperCase() === 'LIMIT' && !price) {
      return NextResponse.json(
        { success: false, message: 'Price is required for limit orders' },
        { status: 400 }
      );
    }

    // Get the quote asset from the pair (e.g., USDT from BTCUSDT)
    const quoteAsset = pair.replace(/^[A-Z]+/, '') || 'USDT';
    const baseAsset = pair.replace(quoteAsset, '');

    // Check wallet balance
    const wallet = user.wallets.find(w => w.asset === quoteAsset);

    if (!wallet) {
      return NextResponse.json(
        { success: false, message: `No ${quoteAsset} wallet found` },
        { status: 400 }
      );
    }

    // Calculate required balance
    const orderPrice = type.toUpperCase() === 'MARKET' ? 0 : parseFloat(price);
    const orderAmount = parseFloat(amount);
    const requiredBalance = orderPrice * orderAmount;

    // For BUY/LONG orders, check if user has enough balance
    if (['BUY', 'LONG'].includes(side.toUpperCase())) {
      const availableBalance = wallet.balance.toNumber() - wallet.lockedBalance.toNumber();

      if (availableBalance < requiredBalance && type.toUpperCase() !== 'MARKET') {
        return NextResponse.json(
          { success: false, message: 'Insufficient balance' },
          { status: 400 }
        );
      }
    }

    // For SELL/SHORT orders, check if user has enough of the base asset
    if (['SELL', 'SHORT'].includes(side.toUpperCase())) {
      const baseWallet = user.wallets.find(w => w.asset === baseAsset);

      if (!baseWallet || (baseWallet.balance.toNumber() - baseWallet.lockedBalance.toNumber()) < orderAmount) {
        return NextResponse.json(
          { success: false, message: `Insufficient ${baseAsset} balance` },
          { status: 400 }
        );
      }
    }

    // Create the order with filled initialized to 0
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        pair: pair.toUpperCase(),
        type: type.toUpperCase(),
        side: side.toUpperCase(),
        price: price ? parseFloat(price) : null,
        amount: orderAmount,
        filled: 0, // Initialize filled amount to 0
        stopPrice: stopPrice ? parseFloat(stopPrice) : null,
        takeProfitPrice: takeProfitPrice ? parseFloat(takeProfitPrice) : null,
        stopLossPrice: stopLossPrice ? parseFloat(stopLossPrice) : null,
        leverage: leverage ? parseInt(leverage) : null,
        positionMode: positionMode || null,
        status: 'OPEN', // All orders start as OPEN
      },
    });

    console.log(`✅ Order created: ${order.id} - ${type} ${side} ${amount} ${pair} @ ${price || 'MARKET'}`);

    // Lock the balance for limit orders
    if (type.toUpperCase() !== 'MARKET' && ['BUY', 'LONG'].includes(side.toUpperCase())) {
      await prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          lockedBalance: wallet.lockedBalance.toNumber() + requiredBalance,
        },
      });
      console.log(`🔒 Locked ${requiredBalance} ${quoteAsset} for order ${order.id}`);
    }

    // For market orders, execute immediately (in a real system, this would be handled by a matching engine)
    if (type.toUpperCase() === 'MARKET') {
      console.log(`⚡ Executing MARKET order ${order.id} immediately...`);

      // Get current market price from a price feed (simplified for now)
      // In production, you'd use the actual market price
      const marketPrice = price ? parseFloat(price) : 0;

      // Update order to FILLED
      const filledOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'FILLED',
          filled: orderAmount,
          price: marketPrice, // Set the execution price
          completedAt: new Date(),
        },
      });

      // Create a trade record
      await prisma.trade.create({
        data: {
          orderId: order.id,
          userId: user.id,
          pair: pair.toUpperCase(),
          side: side.toUpperCase(),
          price: marketPrice,
          amount: orderAmount,
          fee: orderAmount * 0.001, // 0.1% fee
          feeAsset: quoteAsset,
        },
      });

      console.log(`✅ MARKET order ${order.id} FILLED at ${marketPrice}`);

      return NextResponse.json({
        success: true,
        message: 'Market order executed successfully',
        order: filledOrder,
      }, { status: 201 });
    }

    // For LIMIT and STOP_LIMIT orders, return OPEN order
    console.log(`📋 LIMIT order ${order.id} placed - waiting for market price to reach ${price}`);

    return NextResponse.json({
      success: true,
      message: 'Limit order placed successfully. It will be filled when market price reaches your limit.',
      order,
    }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order' },
      { status: 500 }
    );
  }
}
