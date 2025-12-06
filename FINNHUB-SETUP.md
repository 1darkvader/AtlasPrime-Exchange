# 📈 Finnhub Stock API Setup Guide

## 🎯 What is Finnhub?

Finnhub provides real-time stock market data, company fundamentals, and financial metrics. The free tier includes:

- ✅ 60 API calls per minute
- ✅ Real-time stock quotes (US stocks)
- ✅ Company profiles and fundamentals
- ✅ Financial metrics (P/E ratio, market cap, EPS, etc.)
- ✅ Earnings data

**Perfect for our AI Stocks Dashboard!**

---

## 🚀 Setup Instructions

### **Step 1: Create Finnhub Account**

1. Visit: https://finnhub.io/register
2. Sign up for a **FREE account**
3. Verify your email address
4. Login to your dashboard

### **Step 2: Get Your API Key**

1. After logging in, you'll see your **API Key** on the dashboard
2. Copy your API key (it looks like: `cr1234567890abcd`)

### **Step 3: Add API Key to Environment Variables**

Open your `.env` file and add:

```env
# Stock Market API (Finnhub - free tier)
FINNHUB_API_KEY="your-actual-api-key-here"
```

**Example:**
```env
FINNHUB_API_KEY="cr1234567890abcd"
```

### **Step 4: Update Database Schema**

Run this command to sync the new stock models to your database:

```bash
cd atlasprime-exchange
bunx prisma db push
```

This will create the new tables:
- `StockPortfolio` - Track user's stock holdings
- `StockWatchlist` - Track user's favorite stocks

### **Step 5: Restart Your Dev Server**

```bash
# Stop current server (Ctrl+C)
# Then restart
bun run dev
```

---

## 🎨 Features Now Available

### **1. AI Stocks Dashboard** (`/stocks/dashboard`)

**Overview Tab:**
- Real-time stock prices for 12 AI stocks
- Organized by category: Blue Chip, Growth, Frontier
- Live price updates every 30 seconds
- Add to watchlist with one click
- View detailed metrics (P/E, market cap, EPS)

**Portfolio Tab:**
- Track your stock holdings
- Real-time P&L calculations
- Performance metrics
- Average cost basis

**Watchlist Tab:**
- Monitor favorite stocks
- Quick access to trade
- Price alerts (coming soon)

### **2. Real-Time Stock Data**

All AI stock pairs now show:
- ✅ Live current price
- ✅ 24h change & change %
- ✅ Daily high/low
- ✅ Opening price
- ✅ Market capitalization
- ✅ P/E ratio
- ✅ EPS (Earnings per Share)
- ✅ Beta (volatility)
- ✅ 52-week high/low

### **3. Available Stocks**

**Blue Chip AI:**
- NVDA (NVIDIA)
- MSFT (Microsoft)
- GOOGL (Google/Alphabet)
- AMD (AMD)

**Growth AI:**
- PLTR (Palantir)
- CRWD (CrowdStrike)
- META (Meta Platforms)
- TSLA (Tesla)

**Frontier AI:**
- BKKT (Bakkt Holdings)
- AI (C3.ai)
- SMCI (Super Micro Computer)
- ARM (Arm Holdings)

---

## 🔧 Testing the Integration

### **Test 1: Visit AI Stocks Dashboard**

```
http://localhost:3000/stocks/dashboard
```

You should see:
- 12 AI stocks with live prices
- Category tabs (Blue Chip, Growth, Frontier)
- Add to watchlist buttons

### **Test 2: Check API Endpoints**

**Single Quote:**
```bash
curl http://localhost:3000/api/stocks/quote?symbol=NVDA
```

**Batch Quotes:**
```bash
curl -X POST http://localhost:3000/api/stocks/batch-quotes \
  -H "Content-Type: application/json" \
  -d '{"symbols": ["NVDA", "MSFT", "GOOGL"]}'
```

**Metrics:**
```bash
curl http://localhost:3000/api/stocks/metrics?symbol=NVDA
```

### **Test 3: Portfolio & Watchlist (Login Required)**

1. Login with your account
2. Go to `/stocks/dashboard`
3. Click star icon to add stocks to watchlist
4. Buy stocks on `/stocks` page
5. View portfolio on dashboard

---

## ⚠️ Important Notes

### **Rate Limiting**

- Free tier: **60 calls/minute**
- Dashboard auto-refreshes every 30 seconds
- Batch API calls are used to minimize requests

### **Data Delay**

- Real-time for US stocks during market hours
- 15-minute delay for some exchanges
- After-hours data available

### **Market Hours**

- US Stock Market: 9:30 AM - 4:00 PM EST
- Pre-market: 4:00 AM - 9:30 AM EST
- After-hours: 4:00 PM - 8:00 PM EST

---

## 🐛 Troubleshooting

### **Issue: "Failed to fetch quote data"**

**Solution:**
1. Check your API key in `.env` file
2. Verify API key is correct (no extra spaces)
3. Check Finnhub dashboard for API limits
4. Restart dev server after adding key

### **Issue: "Loading price data..." forever**

**Solution:**
1. Open browser console (F12)
2. Check for API errors
3. Verify internet connection
4. Check if Finnhub is down: https://status.finnhub.io

### **Issue: Database errors**

**Solution:**
```bash
# Regenerate Prisma client
bunx prisma generate

# Sync database schema
bunx prisma db push

# Restart server
bun run dev
```

---

## 📊 API Usage Tips

### **Minimize API Calls**

✅ **Do:**
- Use batch quotes for multiple stocks
- Cache data on frontend (30s refresh)
- Fetch metrics only when needed

❌ **Don't:**
- Call API on every render
- Fetch same data repeatedly
- Spam API during development

### **Optimize Performance**

```typescript
// Good - Batch request
fetch('/api/stocks/batch-quotes', {
  method: 'POST',
  body: JSON.stringify({ symbols: ['NVDA', 'MSFT', 'GOOGL'] })
});

// Bad - Multiple requests
symbols.forEach(symbol => {
  fetch(`/api/stocks/quote?symbol=${symbol}`);
});
```

---

## 🚀 Next Steps

1. ✅ Get Finnhub API key
2. ✅ Add to `.env` file
3. ✅ Run `bunx prisma db push`
4. ✅ Restart dev server
5. ✅ Visit `/stocks/dashboard`
6. ✅ Start trading AI stocks!

---

## 📚 Resources

- Finnhub Docs: https://finnhub.io/docs/api
- API Dashboard: https://finnhub.io/dashboard
- Support: https://finnhub.io/support

---

**🎉 You're all set! Happy trading!**
