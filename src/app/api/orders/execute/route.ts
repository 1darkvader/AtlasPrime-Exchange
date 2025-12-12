import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUser } from '@/lib/auth-middleware';
import { parseTradingPair, getPrice } from '@/lib/priceService';

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
    const { side, pair, orderType, price, amount, leverage } = body;

    console.log('📊 Order Execution Request:', {
      user: user.username,
      side,
      pair,
      orderType,
      price,
      amount,
      leverage
    });

    // Validation
    if (!side || !pair || !orderType || !amount) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const amountNum = parseFloat(amount);
    let priceNum = price ? parseFloat(price) : 0;

    if (amountNum <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Parse trading pair properly
    const { base: baseCurrency, quote: quoteCurrency } = parseTradingPair(pair);

    console.log('💱 Parsed pair:', { baseCurrency, quoteCurrency });

    // Get current market price if not provided (for market orders)
    if (!priceNum || priceNum === 0) {
      try {
        priceNum = await getPrice(`${baseCurrency}${quoteCurrency}`);
        console.log('💰 Fetched market price:', priceNum);
      } catch (error) {
        console.error('Failed to fetch market price:', error);
        return NextResponse.json(
          { success: false, message: 'Unable to fetch current market price' },
          { status: 500 }
        );
      }
    }

    // Calculate total cost
    const totalCost = amountNum * priceNum;

    console.log('💵 Total cost:', totalCost, quoteCurrency);

    // Execute order in a transaction
    const result = await prisma.$transaction(async (tx) => {
      if (side === 'BUY' || side === 'LONG') {
        // BUY: Need quote currency (USDT) to buy base currency (BTC)
        const quoteWallet = await tx.wallet.findUnique({
          where: {
            userId_asset: {
              userId: user.id,
              asset: quoteCurrency,
            },
          },
        });

        const availableBalance = quoteWallet ? parseFloat(quoteWallet.balance.toString()) : 0;

        console.log('💳 Buy Order - Wallet Check:', {
          asset: quoteCurrency,
          available: availableBalance,
          required: totalCost,
          sufficient: availableBalance >= totalCost
        });

        if (!quoteWallet || availableBalance < totalCost) {
          throw new Error(`Insufficient ${quoteCurrency} balance. Required: ${totalCost.toFixed(2)}, Available: ${availableBalance.toFixed(2)}`);
        }

        // Deduct quote currency
        await tx.wallet.update({
          where: {
            userId_asset: {
              userId: user.id,
              asset: quoteCurrency,
            },
          },
          data: {
            balance: {
              decrement: totalCost,
            },
          },
        });

        // Credit base currency
        await tx.wallet.upsert({
          where: {
            userId_asset: {
              userId: user.id,
              asset: baseCurrency,
            },
          },
          create: {
            userId: user.id,
            asset: baseCurrency,
            balance: amountNum,
            lockedBalance: 0,
          },
          update: {
            balance: {
              increment: amountNum,
            },
          },
        });

      } else if (side === 'SELL' || side === 'SHORT') {
        // SELL: Need base currency (BTC) to sell for quote currency (USDT)
        const baseWallet = await tx.wallet.findUnique({
          where: {
            userId_asset: {
              userId: user.id,
              asset: baseCurrency,
            },
          },
        });

        if (!baseWallet) {
          throw new Error(`No ${baseCurrency} wallet found. Please deposit ${baseCurrency} first.`);
        }

        const totalBalance = parseFloat(baseWallet.balance.toString());
        const lockedBalance = parseFloat(baseWallet.lockedBalance.toString());
        const availableBalance = totalBalance - lockedBalance;

        console.log('💳 Sell Order - Wallet Check:', {
          asset: baseCurrency,
          totalBalance,
          lockedBalance,
          available: availableBalance,
          required: amountNum,
          sufficient: availableBalance >= amountNum
        });

        if (availableBalance < amountNum) {
          throw new Error(`Insufficient ${baseCurrency} balance. Required: ${amountNum.toFixed(8)}, Available: ${availableBalance.toFixed(8)} (${totalBalance.toFixed(8)} total, ${lockedBalance.toFixed(8)} locked)`);
        }

        // Deduct base currency
        await tx.wallet.update({
          where: {
            userId_asset: {
              userId: user.id,
              asset: baseCurrency,
            },
          },
          data: {
            balance: {
              decrement: amountNum,
            },
          },
        });

        // Credit quote currency
        await tx.wallet.upsert({
          where: {
            userId_asset: {
              userId: user.id,
              asset: quoteCurrency,
            },
          },
          create: {
            userId: user.id,
            asset: quoteCurrency,
            balance: totalCost,
            lockedBalance: 0,
          },
          update: {
            balance: {
              increment: totalCost,
            },
          },
        });
      }

      // Create order record
      const order = await tx.order.create({
        data: {
          userId: user.id,
          pair: `${baseCurrency}${quoteCurrency}`,
          type: orderType === 'market' ? 'MARKET' : 'LIMIT',
          side: side === 'BUY' || side === 'LONG' ? 'BUY' : 'SELL',
          price: priceNum,
          amount: amountNum,
          filled: amountNum, // Mark as filled immediately (simplified)
          status: 'FILLED',
          leverage: leverage ? parseInt(leverage) : null,
          completedAt: new Date(),
        },
      });

      console.log('✅ Order executed successfully:', {
        orderId: order.id,
        side,
        amount: amountNum,
        price: priceNum,
        total: totalCost
      });

      return order;
    });

    return NextResponse.json({
      success: true,
      order: result,
      message: `${side} order executed: ${amountNum} ${baseCurrency} at ${priceNum.toLocaleString()}`,
    });

  } catch (error) {
    console.error('❌ Order execution error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to execute order' },
      { status: 500 }
    );
  }
}
