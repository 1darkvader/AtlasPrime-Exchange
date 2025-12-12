# 🐛 Debugging Deposits Not Reflecting

**Issue:** User deposits are approved by admin, but balances don't update on user side.

**Version:** 78 (with enhanced logging)

---

## 📋 Step-by-Step Debugging Process

### Step 1: Make a Test Deposit

1. **User Side:**
   - Go to `/wallet` page
   - Click "Deposit" button
   - Select asset: **USDT**
   - Enter amount: **100**
   - Select network: **ERC20**
   - Click "Continue to Confirm"
   - Click "Confirm Transaction"
   - Note the transaction ID from the alert

2. **Expected Console Logs (User Side):**
   ```
   ✅ Deposit confirmed successfully!
   📡 Emitting balance-updated event...
   🚪 Closing deposit modal...
   🚪 Closing deposit modal...
   🔄 Refreshing data after modal close...
   🔄 Fetching wallets from API...
   📦 API returned wallets: [...]
   ✅ Wallets loaded: X wallets
   💰 Total balance: X
   ```

---

### Step 2: Approve Deposit (Admin Side)

1. **Admin Side:**
   - Check Telegram for notification
   - Go to `/admin` dashboard
   - Click "Transactions" tab
   - Find the pending deposit
   - Click "Approve" button

2. **Expected Console Logs (Server Side):**
   ```
   🔍 Starting approval for transaction: cmj1...
   📊 Transaction details: { type: 'DEPOSIT', asset: 'USDT', amount: '100', userId: 'clxxx...' }
   ✅ Transaction updated to COMPLETED
   💰 Processing DEPOSIT...
   Admin wallet before: 10000000.00000000 USDT
   ✅ Admin wallet after: 9999900.00000000 USDT
   ✅ User wallet balance: 100.00000000 USDT
   ✅ DEPOSIT COMPLETE: Admin -100, User +100 USDT
   ```

---

### Step 3: Verify Database Changes

Run these queries in your database:

```sql
-- Check admin wallet balance
SELECT * FROM "AdminWallet" WHERE asset = 'USDT';

-- Check user wallet balance (replace USER_ID)
SELECT * FROM "Wallet" WHERE "userId" = 'USER_ID' AND asset = 'USDT';

-- Check transaction status
SELECT id, type, asset, amount, status, "adminApproved", "userConfirmed", "approvedAt"
FROM "Transaction"
WHERE type = 'DEPOSIT'
ORDER BY "createdAt" DESC
LIMIT 5;
```

**Expected Results:**
- AdminWallet: balance should be **9,999,900**
- Wallet: balance should be **100**
- Transaction: status should be **COMPLETED**, adminApproved should be **true**

---

### Step 4: Check User Balance Refresh

1. **User Side (Automatic):**
   - Wait up to 30 seconds for auto-refresh
   - Watch console for:
   ```
   🔄 Auto-refresh triggered (30s interval)...
   🔄 Fetching wallets from API...
   📦 API returned wallets: [{ asset: 'USDT', balance: '100.00000000', ... }]
   ✅ Wallets loaded: 1 wallets
   💰 Total balance: 100
   ```

2. **User Side (Manual):**
   - Click the refresh button (🔄 icon)
   - Should see same logs immediately

3. **Expected Wallet API Response:**
   ```json
   {
     "success": true,
     "wallets": [
       {
         "asset": "USDT",
         "balance": "100.00000000",
         "lockedBalance": "0.00000000",
         "available": "100.00000000"
       }
     ]
   }
   ```

---

## 🔍 Common Issues & Solutions

### Issue 1: "Unauthorized" Error in Console

**Symptoms:**
```
❌ Wallet fetch failed: 401
Error details: {"error":"Unauthorized"}
```

**Cause:** Auth token not being sent or expired

**Solution:**
1. Check localStorage for token:
   ```javascript
   localStorage.getItem('atlasprime_token')
   ```
2. If missing, log out and log back in
3. Check token expiration in database:
   ```sql
   SELECT token, "expiresAt" FROM "Session" WHERE "userId" = 'USER_ID';
   ```

---

### Issue 2: Wallet Balance is Zero After Approval

**Symptoms:**
- Database shows balance = 100
- API returns balance = 0
- Frontend shows $0.00

**Debugging:**
1. Check server logs for wallet API call:
   ```
   📊 Fetched X wallets for user USERNAME
   Wallet balances: USDT: 100.00000000
   ```

2. Check frontend API response in Network tab:
   ```json
   {
     "success": true,
     "wallets": [
       { "asset": "USDT", "balance": "100.00000000" }
     ]
   }
   ```

3. Check if parseFloat is working:
   ```javascript
   console.log(parseFloat("100.00000000")); // Should be 100
   ```

**Possible Causes:**
- Decimal parsing issue
- Wrong user ID being fetched
- Multiple wallet records for same asset

---

### Issue 3: Auto-Refresh Not Working

**Symptoms:**
- Balance doesn't update after 30 seconds
- No "🔄 Auto-refresh triggered" logs in console

**Debugging:**
1. Check if interval was created:
   ```
   ✅ Auto-refresh interval started (30s)
   ```

2. Check if user is logged in:
   ```javascript
   console.log('User:', user);
   ```

3. Manually trigger refresh:
   - Click refresh button
   - Should force immediate update

**Solution:**
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Clear browser cache
- Check browser console for errors

---

### Issue 4: Deposit Approved But No Database Update

**Symptoms:**
- Admin clicks "Approve"
- Success message appears
- But database balance unchanged

**Debugging:**
1. Check server logs for error:
   ```
   ❌ Failed to process transaction
   Error: Insufficient admin balance
   ```

2. Verify admin wallet exists:
   ```sql
   SELECT * FROM "AdminWallet" WHERE asset = 'USDT';
   ```

3. If admin wallet missing, run seed script:
   ```bash
   bun run scripts/seed-admin-wallet.ts
   ```

---

## 🧪 Complete Test Flow

### Test 1: Deposit $100 USDT

```bash
# 1. User deposits
User deposits 100 USDT
→ Transaction created (PENDING)
→ User confirms
→ Transaction status = PROCESSING
→ Telegram notification sent

# 2. Admin approves
Admin clicks approve
→ Admin wallet: 10000000 → 9999900 (-100)
→ User wallet: 0 → 100 (+100)
→ Transaction status = COMPLETED

# 3. User sees update
Within 30 seconds:
→ Auto-refresh triggers
→ API fetches wallet
→ Frontend displays: $100.00
```

### Test 2: Withdraw $50 USDT

```bash
# 1. User withdraws
User withdraws 50 USDT
→ Transaction created (PENDING)
→ User confirms
→ Transaction status = PROCESSING

# 2. Admin approves
Admin clicks approve
→ User wallet: 100 → 50 (-50)
→ Admin wallet: 9999900 → 9999950 (+50)
→ Transaction status = COMPLETED

# 3. User sees update
Within 30 seconds:
→ Auto-refresh triggers
→ Frontend displays: $50.00
```

---

## 📊 Logging Checklist

When debugging, you should see these logs in sequence:

### User Confirms Deposit:
- [x] ✅ Deposit confirmed successfully!
- [x] 📡 Emitting balance-updated event...
- [x] 🚪 Closing deposit modal...
- [x] 🔄 Refreshing data after modal close...

### Admin Approves:
- [x] 🔍 Starting approval for transaction: ...
- [x] 📊 Transaction details: {...}
- [x] ✅ Transaction updated to COMPLETED
- [x] 💰 Processing DEPOSIT...
- [x] Admin wallet before: ...
- [x] ✅ Admin wallet after: ...
- [x] ✅ User wallet balance: ...
- [x] ✅ DEPOSIT COMPLETE: ...

### User Balance Refreshes:
- [x] 🔄 Auto-refresh triggered (30s interval)...
- [x] 🔄 Fetching wallets from API...
- [x] 📊 Fetched X wallets for user ...
- [x] Wallet balances: USDT: 100.00000000
- [x] 📦 API returned wallets: [...]
- [x] ✅ Wallets loaded: 1 wallets
- [x] 💰 Total balance: 100

---

## 🚨 If Nothing Works

### Nuclear Option: Hard Reset

1. **Clear ALL browser data:**
   ```
   - Clear cache
   - Clear localStorage
   - Clear cookies
   - Hard refresh (Cmd+Shift+R)
   ```

2. **Restart dev server:**
   ```bash
   # Stop server
   # Run: bun run dev
   ```

3. **Check database directly:**
   ```sql
   -- User wallet
   SELECT * FROM "Wallet" WHERE "userId" = 'USER_ID';

   -- Admin wallet
   SELECT * FROM "AdminWallet";

   -- Transactions
   SELECT * FROM "Transaction" WHERE "userId" = 'USER_ID';
   ```

4. **Re-seed admin wallet:**
   ```bash
   bun run scripts/seed-admin-wallet.ts
   ```

5. **Test with fresh user:**
   - Create new account
   - Make deposit
   - Approve
   - Check if balance updates

---

## 📝 Report to Support

If issue persists, collect these details:

```
1. User ID: [from database]
2. Transaction ID: [from deposit confirmation]
3. Asset: [USDT, BTC, etc.]
4. Amount: [100, 50, etc.]
5. Server logs: [copy all logs from Steps 1-3]
6. Database query results: [AdminWallet, Wallet, Transaction]
7. Network tab: [API request/response for /api/wallets]
8. Console logs: [all frontend logs]
9. Browser: [Chrome, Firefox, Safari]
10. Device: [Desktop, Mobile]
```

---

**Version:** 78
**Last Updated:** December 11, 2025
**Status:** Enhanced with comprehensive logging
