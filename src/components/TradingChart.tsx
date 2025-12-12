"use client";

import { useEffect, useState } from "react";

interface CandleData {
  open: number;
  high: number;
  low: number;
  close: number;
  time: string;
}

export default function TradingChart() {
  const [candles, setCandles] = useState<CandleData[]>([]);

  useEffect(() => {
    // Generate realistic candlestick data
    const generateData = (): CandleData[] => {
      const data: CandleData[] = [];
      let basePrice = 91000;
      const now = Date.now();

      for (let i = 50; i >= 0; i--) {
        const volatility = Math.random() * 800;
        const open = basePrice + (Math.random() - 0.5) * 600;
        const close = open + (Math.random() - 0.5) * 800;
        const high = Math.max(open, close) + volatility * 0.5;
        const low = Math.min(open, close) - volatility * 0.5;

        const date = new Date(now - i * 3600000);
        const time = `${date.getHours()}:00`;

        data.push({
          open,
          high,
          low,
          close,
          time,
        });

        basePrice = close;
      }

      return data;
    };

    setCandles(generateData());
  }, []);

  const maxPrice = Math.max(...candles.map(c => c.high));
  const minPrice = Math.min(...candles.map(c => c.low));
  const priceRange = maxPrice - minPrice;
  const chartHeight = 350;
  const chartWidth = 1000;
  const candleWidth = Math.max(chartWidth / candles.length - 4, 8);

  const getY = (price: number) => {
    return ((maxPrice - price) / priceRange) * chartHeight;
  };

  return (
    <div className="w-full h-[400px] relative">
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between mb-4 px-4 py-2">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">BTC/USDT</span>
          <span className="text-2xl font-bold text-emerald-400">
            ${candles[candles.length - 1]?.close.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-sm text-emerald-400">
            +{((Math.random() * 5) + 1).toFixed(2)}%
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded">1H</button>
          <button className="px-3 py-1 hover:bg-white/5 rounded">4H</button>
          <button className="px-3 py-1 hover:bg-white/5 rounded">1D</button>
          <button className="px-3 py-1 hover:bg-white/5 rounded">1W</button>
        </div>
      </div>

      <div className="mt-12 overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="mx-auto"
          style={{ filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.2))" }}
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={`grid-${i}`}
              x1="0"
              y1={(chartHeight / 4) * i}
              x2={chartWidth}
              y2={(chartHeight / 4) * i}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="1"
            />
          ))}

          {/* Candlesticks */}
          {candles.map((candle, index) => {
            const isGreen = candle.close > candle.open;
            const x = index * (candleWidth + 4) + candleWidth / 2;
            const bodyTop = getY(Math.max(candle.open, candle.close));
            const bodyBottom = getY(Math.min(candle.open, candle.close));
            const wickTop = getY(candle.high);
            const wickBottom = getY(candle.low);
            const color = isGreen ? "#10b981" : "#ef4444";

            return (
              <g key={index} className="candle-group">
                {/* Wick */}
                <line
                  x1={x}
                  y1={wickTop}
                  x2={x}
                  y2={wickBottom}
                  stroke={color}
                  strokeWidth="2"
                  opacity="0.8"
                />
                {/* Body */}
                <rect
                  x={x - candleWidth / 2}
                  y={bodyTop}
                  width={candleWidth}
                  height={Math.max(bodyBottom - bodyTop, 2)}
                  fill={color}
                  opacity="0.9"
                  rx="2"
                  className="transition-all duration-300 hover:opacity-100"
                />
              </g>
            );
          })}

          {/* Trend line */}
          <path
            d={candles.map((candle, index) => {
              const x = index * (candleWidth + 4) + candleWidth / 2;
              const y = getY(candle.close);
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            stroke="url(#gradient)"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Price labels */}
      <div className="absolute right-0 top-12 bottom-0 flex flex-col justify-between text-xs text-muted-foreground pr-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i}>
            ${(maxPrice - (priceRange / 4) * i).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        ))}
      </div>
    </div>
  );
}
