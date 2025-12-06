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

// GET /api/orders/[orderId] - Get a specific order
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: { trades: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders/[orderId] - Modify an order
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Can only modify open orders
    if (order.status !== 'OPEN') {
      return NextResponse.json(
        { success: false, message: 'Can only modify open orders' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { price, amount, stopPrice, takeProfitPrice, stopLossPrice } = body;

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: params.orderId },
      data: {
        price: price ? parseFloat(price) : order.price,
        amount: amount ? parseFloat(amount) : order.amount,
        stopPrice: stopPrice !== undefined ? (stopPrice ? parseFloat(stopPrice) : null) : order.stopPrice,
        takeProfitPrice: takeProfitPrice !== undefined ? (takeProfitPrice ? parseFloat(takeProfitPrice) : null) : order.takeProfitPrice,
        stopLossPrice: stopLossPrice !== undefined ? (stopLossPrice ? parseFloat(stopLossPrice) : null) : order.stopLossPrice,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[orderId] - Cancel an order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const user = await authenticateUser(request);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.userId !== user.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Can only cancel open or partially filled orders
    if (!['OPEN', 'PARTIALLY_FILLED'].includes(order.status)) {
      return NextResponse.json(
        { success: false, message: 'Cannot cancel this order' },
        { status: 400 }
      );
    }

    // Update order status to cancelled
    const cancelledOrder = await prisma.order.update({
      where: { id: params.orderId },
      data: {
        status: 'CANCELLED',
        completedAt: new Date(),
      },
    });

    // Release locked balance
    if (order.price && ['BUY', 'LONG'].includes(order.side)) {
      const quoteAsset = order.pair.replace(/^[A-Z]+/, '') || 'USDT';
      const wallet = user.wallets.find(w => w.asset === quoteAsset);

      if (wallet) {
        const lockedAmount = order.price.toNumber() * order.amount.toNumber();
        await prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            lockedBalance: Math.max(0, wallet.lockedBalance.toNumber() - lockedAmount),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      order: cancelledOrder,
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel order' },
      { status: 500 }
    );
  }
}
