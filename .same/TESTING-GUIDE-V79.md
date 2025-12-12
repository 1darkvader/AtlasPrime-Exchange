# 🧪 Testing Guide - Version 79

**Purpose:** Diagnose why deposits aren't reflecting on user wallets after admin approval.

**Version:** 79 (Enhanced Debugging)
**Status:** Ready for Testing

---

## 📋 What You Need

1. **Two browsers** (or one normal + one incognito):
   - Browser 1: User account
   - Browser 2: Admin account

2. **Access to:**
   - Render dashboard (server logs)
   - Database (optional, for verification)

3. **Time:** ~10 minutes

---

## 🚀 Testing Steps

### Step 1: Prepare User Browser

1. **Open your app in Browser 1**
   - Go to: `https://your-app.onrender.com`
   - Log in as a regular user (not admin)

2. **Open Developer Console:**
   - Press **F12** (or Cmd+Option+I on Mac)
   - Click "Console" tab
   - Click the "🗑️ Clear" icon to clear all logs

3. **Go to Wallet Page:**
   - Navigate to `/wallet`
   - You should see the wallet dashboard

---

### Step 2: Make a Test Deposit

1. **Click "Deposit" button** (green button with ↓ icon)

2. **Fill out the form:**
   - Asset: **USDT**
   - Amount: **100**
   - Network: **ERC20** (or any network)

3. **Click "Continue to Confirm"**

4. **Review the summary, then click "Confirm Transaction"**

5. **IMPORTANT: Copy the console logs immediately!**
   - Right-click in console
   - "Save as..." or copy all text
   - Look for these logs:
     ```
     ✅ Deposit confirmed successfully!
     📡 Emitting balance-updated event...
     🚪 Closing deposit modal...
     🔄 Refreshing data after modal close...
     🔄 Fetching wallets from API...
     📦 API returned wallets: [...]
     💰 Total balance: X
     ```

6. **Save these logs** - we'll need them later!

---

### Step 3: Approve as Admin

1. **Open your app in Browser 2** (or incognito)
   - Go to: `https://your-app.onrender.com/admin`
   - Log in as admin

2. **Check Telegram** (optional)
   - You should have received a notification
   - Contains transaction details

3. **Go to Transactions tab:**
   - Click "Transactions" in admin panel
   - Find the pending deposit (should be at the top)
   - Status: "Processing"

4. **Click "Approve" button**

5. **Check Render Logs:**
   - Go to Render dashboard
   - Click your service
   - Click "Logs" tab
   - Look for these logs:
     ```
     🔍 Starting approval for transaction: cmj1...
     📊 Transaction details: {...}
     ✅ Transaction updated to COMPLETED
     💰 Processing DEPOSIT...
     Admin wallet before: 10000000.00000000 USDT
     ✅ Admin wallet after: 9999900.00000000 USDT
     ✅ User wallet balance: 100.00000000 USDT
     ✅ DEPOSIT COMPLETE: Admin -100, User +100 USDT
     ```

6. **Copy these server logs!**

---

### Step 4: Check User Balance

1. **Go back to Browser 1** (user browser)

2. **Wait up to 30 seconds** (for auto-refresh)

3. **Watch the console** - you should see:
   ```
   🔄 Auto-refresh triggered (30s interval)...
   🔄 Fetching wallets from API...
   📊 Fetched 1 wallets for user testuser
   Wallet balances: USDT: 100.00000000
   📦 API returned wallets: [{ asset: 'USDT', balance: '100.00000000', ... }]
   ✅ Wallets loaded: 1 wallets
   💰 Total balance: 100
   ```

4. **Or click the refresh button (🔄 icon)** to force immediate refresh

5. **Check the UI:**
   - Total Balance card: Should show **$100.00**
   - Available Balance: Should show **$100.00**
   - Assets table: USDT row should show **100.00000000**

---

## 📊 What to Look For

### ✅ SUCCESS Scenario

If everything works:

**Browser Console:**
```
✅ Deposit confirmed successfully!
📡 Emitting balance-updated event...
🚪 Closing deposit modal...
🔄 Refreshing data after modal close...
🔄 Fetching wallets from API...
📦 API returned wallets: [{ asset: 'USDT', balance: '100.00000000', lockedBalance: '0', available: '100.00000000' }]
✅ Wallets loaded: 1 wallets
💰 Total balance: 100
```

**Server Logs:**
```
🔍 Starting approval for transaction: cmj1abc123...
📊 Transaction details: { type: 'DEPOSIT', asset: 'USDT', amount: '100', userId: 'clxxx...' }
✅ Transaction updated to COMPLETED
💰 Processing DEPOSIT...
Admin wallet before: 10000000.00000000 USDT
✅ Admin wallet after: 9999900.00000000 USDT
✅ User wallet balance: 100.00000000 USDT
✅ DEPOSIT COMPLETE: Admin -100, User +100 USDT
```

**UI:**
- ✅ Total Balance: $100.00
- ✅ Available: $100.00
- ✅ USDT row: 100.00000000

---

### ❌ FAILURE Scenarios

#### Scenario 1: Balance Updates in DB but not in UI

**Symptoms:**
- Server logs show: `✅ User wallet balance: 100.00000000 USDT`
- But browser shows: `💰 Total balance: 0`
- UI still shows $0.00

**Logs to collect:**
```
📦 API returned wallets: [...]  <-- What does this show?
```

**Possible Causes:**
- API returning old data
- Frontend not parsing correctly
- Caching issue

---

#### Scenario 2: Balance Not Updated in Database

**Symptoms:**
- Server logs show error or missing wallet update logs
- No `✅ User wallet balance: 100 USDT` log

**Logs to collect:**
```
💰 Processing DEPOSIT...
Admin wallet before: ...
[missing logs here?]
```

**Possible Causes:**
- Database transaction failed
- Insufficient admin balance
- Prisma error

---

#### Scenario 3: API Returns Empty Wallets

**Symptoms:**
```
📦 API returned wallets: []
✅ Wallets loaded: 0 wallets
💰 Total balance: 0
```

**Possible Causes:**
- Wrong user ID
- Session expired
- Wallet not created

---

#### Scenario 4: Auto-Refresh Not Working

**Symptoms:**
- No logs appear after 30 seconds
- No `🔄 Auto-refresh triggered` log

**Try:**
- Click manual refresh button
- Hard refresh page (Cmd+Shift+R)
- Check for JavaScript errors (red text in console)

---

## 📝 Report Template

If the deposit still doesn't work, copy and fill this out:

```
## Deposit Test Report - Version 79

**Date/Time:** [When you tested]
**User Account:** [Username or email]
**Deposit Amount:** 100 USDT
**Network:** ERC20

### Browser Console Logs (User):
[Paste all logs from Step 2]

### Server Logs (Admin Approval):
[Paste all logs from Step 3]

### Browser Console Logs (After Approval):
[Paste all logs from Step 4]

### UI State:
- Total Balance shown: $X.XX
- Available Balance shown: $X.XX
- USDT row balance: X.XXXXXXXX

### Database Queries (if you ran them):
- AdminWallet USDT balance: [amount]
- User Wallet USDT balance: [amount]
- Transaction status: [PENDING/PROCESSING/COMPLETED/FAILED]

### What's Missing:
- [ ] User confirmation logs
- [ ] Admin approval logs
- [ ] User refresh logs
- [ ] Balance update in DB
- [ ] Balance display in UI
- [ ] Other: [describe]

### Additional Notes:
[Any other observations]
```

---

## 🎯 Next Steps

After collecting the logs:

1. **If SUCCESS:**
   - Great! The system is working
   - Version 79 can be cleaned up (remove excessive logs)

2. **If FAILURE:**
   - Share the report template above
   - We'll identify the exact failure point
   - Create a targeted fix in Version 80

---

## 💡 Tips

**Tip 1: Keep Console Open**
Don't close the console during testing - logs disappear when you close it!

**Tip 2: Clear Console Between Tests**
Click the 🗑️ icon before each test to avoid confusion.

**Tip 3: Use Incognito for Admin**
Prevents session conflicts between user and admin.

**Tip 4: Screenshot Everything**
Take screenshots of:
- Console logs
- Server logs
- UI before/after
- Database queries

**Tip 5: Test Multiple Times**
If it fails once, try again to see if it's consistent.

---

**Version:** 79
**Status:** Ready for Testing
**Goal:** Identify where the deposit flow breaks

**Let's find the bug!** 🐛🔍
