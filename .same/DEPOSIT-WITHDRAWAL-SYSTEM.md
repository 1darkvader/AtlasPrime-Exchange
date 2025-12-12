# 💰 Deposit & Withdrawal System - Complete Guide

## Overview

This system allows users to deposit and withdraw funds, with admin approval required for all transactions. Telegram notifications are sent to admin upon user confirmation.

## 🔄 Flow Diagram

### Deposit Flow:
```
User → Enter Amount → Copy Deposit Address → Make Payment → Confirm Transaction
                                                                      ↓
                                                              Telegram Notification to Admin
                                                                      ↓
                                                              Admin Approves in Dashboard
                                                                      ↓
                                                              Funds Credited to User Wallet
```

### Withdrawal Flow:
```
User → Enter Amount & Address → Confirm Withdrawal
                                       ↓
                              Telegram Notification to Admin
                                       ↓
                              Admin Approves in Dashboard
                                       ↓
                              Funds Deducted from Wallet
```

## 📁 New Files Created

### 1. **Telegram Bot Service** (`src/lib/telegram.ts`)
- Sends deposit notifications to admin
- Sends withdrawal notifications to admin
- Includes user info, amount, transaction ID
- Test connection method

**Telegram Credentials:**
- Bot Token: `8201359495:AAF7tkcTsHu_9wt4m4s4XuOMm-ptqVqK-Mg`
- Chat ID: `5974323377`

### 2. **API Routes**

#### `/api/transactions/create` (POST)
- Creates new deposit/withdrawal transaction
- Validates user balance for withdrawals
- Sets status to `PENDING`
- Returns transaction ID

**Request Body:**
```json
{
  "type": "DEPOSIT" | "WITHDRAWAL",
  "asset": "USDT",
  "amount": 100,
  "network": "ERC20",
  "address": "0x..." (for withdrawals)
}
```

#### `/api/transactions/confirm` (POST)
- Confirms user made the payment
- Updates status to `PROCESSING`
- Sends Telegram notification to admin
- Returns success message

**Request Body:**
```json
{
  "transactionId": "clxxx..."
}
```

#### `/api/admin/transactions/approve` (POST)
- Admin approves or rejects transaction
- For deposits: Credits user wallet
- For withdrawals: Debits user wallet
- Updates transaction status to `COMPLETED` or `FAILED`

**Request Body:**
```json
{
  "transactionId": "clxxx...",
  "action": "approve" | "reject",
  "rejectionReason": "Optional reason for rejection"
}
```

### 3. **New Modal Components** (`src/components/DepositWithdrawModals.tsx`)

#### DepositModal
- Two-step process: Address → Confirm
- User enters deposit amount
- Shows deposit address with QR code
- Confirm Transaction button sends notification

#### WithdrawModal
- Two-step process: Form → Confirm
- User enters amount and withdrawal address
- Shows summary before confirmation
- Network fee estimation

## 🗄️ Database Changes

### Updated Transaction Model

New fields added to `prisma/schema.prisma`:

```prisma
model Transaction {
  // ... existing fields ...

  // New fields for deposit/withdrawal approval
  userConfirmed   Boolean   @default(false)   // User clicked "Confirm Transaction"
  adminApproved   Boolean   @default(false)   // Admin approved
  approvedBy      String?                      // Admin user ID
  rejectionReason String?                      // Reason if rejected
  proofUrl        String?                      // Screenshot/proof of payment
  approvedAt      DateTime?                    // When admin approved
}
```

### Migration Required

Run this command to update database:
```bash
bunx prisma db push
```

Or on production (Render):
```bash
npx prisma db push
```

## 🔔 Telegram Notifications

### Deposit Notification Format:
```
🔔 NEW DEPOSIT REQUEST

👤 User Info:
• ID: `clxxx...`
• Name: John Doe
• Email: user@email.com

💰 Transaction Details:
• Amount: *100 USDT*
• Type: Deposit
• Transaction ID: `clxxx...`

⏰ Time: Dec 11, 2025 10:30 AM

✅ Please review and approve in the admin panel.
```

### Withdrawal Notification Format:
```
🔔 NEW WITHDRAWAL REQUEST

👤 User Info:
• ID: `clxxx...`
• Name: John Doe
• Email: user@email.com

💸 Transaction Details:
• Amount: *50 USDT*
• Type: Withdrawal
• Transaction ID: `clxxx...`

⏰ Time: Dec 11, 2025 10:35 AM

⚠️ Please review and approve in the admin panel.
```

## 🎯 User Experience

### Deposit Steps:
1. Click "Deposit" in wallet
2. Select asset (USDT, BTC, ETH, etc.)
3. Enter amount to deposit
4. Select network (ERC20, TRC20, etc.)
5. Copy deposit address or scan QR code
6. Make payment from external wallet
7. Click "Confirm Transaction" button
8. Wait for admin approval
9. Funds appear in wallet

### Withdrawal Steps:
1. Click "Withdraw" in wallet
2. Select asset
3. Enter amount and withdrawal address
4. Select network
5. Review summary
6. Click "Confirm Withdrawal"
7. Wait for admin approval
8. Funds sent to address

## 🛡️ Admin Panel Updates

### Pending Transactions Tab

Admins will see:
- List of all pending deposits/withdrawals
- User information (name, email, ID)
- Amount and asset
- Transaction ID
- Time submitted
- Action buttons: Approve / Reject

### Approval Process:
1. Admin receives Telegram notification
2. Admin logs into dashboard
3. Reviews transaction details
4. Clicks "Approve" or "Reject"
5. If approved: Wallet automatically updated
6. If rejected: User notified with reason

## 🔄 Balance Updates

When admin approves:

**Deposit:**
```typescript
// Credits user wallet
await prisma.wallet.upsert({
  where: { userId_asset: { userId, asset } },
  update: {
    balance: { increment: amount }
  },
  create: {
    userId, asset, balance: amount
  }
});
```

**Withdrawal:**
```typescript
// Debits user wallet (after balance check)
await prisma.wallet.update({
  where: { userId_asset: { userId, asset } },
  data: {
    balance: { decrement: amount }
  }
});
```

## 📊 Transaction States

| State | Description | User See | Admin See |
|-------|-------------|----------|-----------|
| `PENDING` | Created, not confirmed | "Confirm Transaction" button | Hidden |
| `PROCESSING` | User confirmed, waiting approval | "Pending approval" | "Approve/Reject" buttons |
| `COMPLETED` | Admin approved, funds credited/debited | "Completed" ✅ | "Approved" ✅ |
| `FAILED` | Admin rejected | "Rejected" with reason ❌ | "Rejected" ❌ |

## 🚀 Next Steps

### To Complete:
1. ✅ Run database migration: `bunx prisma db push`
2. ✅ Add Telegram credentials to `.env` (already hardcoded)
3. ⏳ Update wallet page to use new modals
4. ⏳ Update admin transactions page with approval UI
5. ⏳ Test deposit flow end-to-end
6. ⏳ Test withdrawal flow end-to-end
7. ⏳ Test Telegram notifications
8. ⏳ Deploy to production

### Environment Variables (Optional):
```env
TELEGRAM_BOT_TOKEN=8201359495:AAF7tkcTsHu_9wt4m4s4XuOMm-ptqVqK-Mg
TELEGRAM_CHAT_ID=5974323377
```

*(Already hardcoded in `src/lib/telegram.ts`, so this is optional)*

## 🐛 Testing Checklist

- [ ] User can create deposit request
- [ ] User can confirm deposit
- [ ] Telegram notification sent to admin
- [ ] Admin can approve deposit
- [ ] Wallet balance updated correctly
- [ ] User can create withdrawal request
- [ ] User can confirm withdrawal
- [ ] Admin can approve withdrawal
- [ ] Wallet balance debited correctly
- [ ] Admin can reject transactions
- [ ] Balance reflects across all pages

## 📝 Notes

- All transactions require admin approval for security
- Users must confirm they made the payment before admin is notified
- Withdrawals check available balance before creating request
- Network fees shown as estimates
- QR codes auto-generated for deposit addresses
- Transaction history shows all states
- Real-time balance updates across application

---

**Created:** Version 72
**Status:** Core functionality implemented, UI integration pending
