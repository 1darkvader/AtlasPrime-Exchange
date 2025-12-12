interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Simple Moving Average (SMA)
export function calculateSMA(data: CandleData[], period: number) {
  const result: { time: number; value: number }[] = [];

  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, candle) => acc + candle.close, 0);
    result.push({
      time: data[i].time,
      value: sum / period,
    });
  }

  return result;
}

// Exponential Moving Average (EMA)
export function calculateEMA(data: CandleData[], period: number) {
  const result: { time: number; value: number }[] = [];
  const multiplier = 2 / (period + 1);

  // Start with SMA for first value
  const firstSMA = data.slice(0, period).reduce((acc, candle) => acc + candle.close, 0) / period;
  result.push({ time: data[period - 1].time, value: firstSMA });

  // Calculate EMA for remaining values
  for (let i = period; i < data.length; i++) {
    const ema = (data[i].close - result[result.length - 1].value) * multiplier + result[result.length - 1].value;
    result.push({ time: data[i].time, value: ema });
  }

  return result;
}

// Relative Strength Index (RSI)
export function calculateRSI(data: CandleData[], period: number = 14) {
  const result: { time: number; value: number }[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  // Calculate price changes
  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }

  // Calculate first average gain/loss
  let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
  let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

  result.push({
    time: data[period].time,
    value: 100 - (100 / (1 + avgGain / avgLoss)),
  });

  // Calculate RSI for remaining values
  for (let i = period; i < gains.length; i++) {
    avgGain = (avgGain * (period - 1) + gains[i]) / period;
    avgLoss = (avgLoss * (period - 1) + losses[i]) / period;

    const rs = avgGain / avgLoss;
    result.push({
      time: data[i + 1].time,
      value: 100 - (100 / (1 + rs)),
    });
  }

  return result;
}

// MACD (Moving Average Convergence Divergence)
export function calculateMACD(data: CandleData[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
  const fastEMA = calculateEMA(data, fastPeriod);
  const slowEMA = calculateEMA(data, slowPeriod);

  // Calculate MACD line
  const macdLine: { time: number; value: number }[] = [];
  const startIndex = slowPeriod - 1;

  for (let i = 0; i < slowEMA.length; i++) {
    const fastValue = fastEMA.find(e => e.time === slowEMA[i].time);
    if (fastValue) {
      macdLine.push({
        time: slowEMA[i].time,
        value: fastValue.value - slowEMA[i].value,
      });
    }
  }

  // Calculate signal line (EMA of MACD)
  const signalLine: { time: number; value: number }[] = [];
  const multiplier = 2 / (signalPeriod + 1);

  const firstSMA = macdLine.slice(0, signalPeriod).reduce((acc, val) => acc + val.value, 0) / signalPeriod;
  signalLine.push({ time: macdLine[signalPeriod - 1].time, value: firstSMA });

  for (let i = signalPeriod; i < macdLine.length; i++) {
    const signal = (macdLine[i].value - signalLine[signalLine.length - 1].value) * multiplier + signalLine[signalLine.length - 1].value;
    signalLine.push({ time: macdLine[i].time, value: signal });
  }

  // Calculate histogram
  const histogram: { time: number; value: number }[] = [];
  for (let i = 0; i < signalLine.length; i++) {
    const macdValue = macdLine.find(m => m.time === signalLine[i].time);
    if (macdValue) {
      histogram.push({
        time: signalLine[i].time,
        value: macdValue.value - signalLine[i].value,
      });
    }
  }

  return { macdLine, signalLine, histogram };
}

// Bollinger Bands
export function calculateBollingerBands(data: CandleData[], period: number = 20, stdDev: number = 2) {
  const sma = calculateSMA(data, period);
  const upper: { time: number; value: number }[] = [];
  const lower: { time: number; value: number }[] = [];

  for (let i = 0; i < sma.length; i++) {
    const dataIndex = i + period - 1;
    const slice = data.slice(i, dataIndex + 1);

    // Calculate standard deviation
    const mean = sma[i].value;
    const squaredDiffs = slice.map(candle => Math.pow(candle.close - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / period;
    const sd = Math.sqrt(variance);

    upper.push({
      time: sma[i].time,
      value: mean + (stdDev * sd),
    });

    lower.push({
      time: sma[i].time,
      value: mean - (stdDev * sd),
    });
  }

  return { upper, middle: sma, lower };
}

// Volume Weighted Average Price (VWAP)
export function calculateVWAP(data: CandleData[]) {
  const result: { time: number; value: number }[] = [];
  let cumulativeTPV = 0; // Typical Price * Volume
  let cumulativeVolume = 0;

  for (let i = 0; i < data.length; i++) {
    const typicalPrice = (data[i].high + data[i].low + data[i].close) / 3;
    // Note: We don't have volume in our data structure, so we'll use 1 as placeholder
    const volume = 1;

    cumulativeTPV += typicalPrice * volume;
    cumulativeVolume += volume;

    result.push({
      time: data[i].time,
      value: cumulativeTPV / cumulativeVolume,
    });
  }

  return result;
}

// Average True Range (ATR)
export function calculateATR(data: CandleData[], period: number = 14) {
  const trueRanges: number[] = [];

  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevClose = data[i - 1].close;

    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );

    trueRanges.push(tr);
  }

  const result: { time: number; value: number }[] = [];

  // First ATR is simple average
  let atr = trueRanges.slice(0, period).reduce((a, b) => a + b, 0) / period;
  result.push({ time: data[period].time, value: atr });

  // Subsequent ATRs use smoothing
  for (let i = period; i < trueRanges.length; i++) {
    atr = ((atr * (period - 1)) + trueRanges[i]) / period;
    result.push({ time: data[i + 1].time, value: atr });
  }

  return result;
}

export type IndicatorType = "SMA" | "EMA" | "RSI" | "MACD" | "BB" | "VWAP" | "ATR";

export interface IndicatorConfig {
  type: IndicatorType;
  period?: number;
  color?: string;
  visible: boolean;
}
