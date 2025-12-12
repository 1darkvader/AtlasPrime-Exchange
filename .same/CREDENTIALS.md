# AtlasPrime Exchange - Production Credentials & Configuration

## 🔐 Admin Credentials

**Production Admin Account:**
- **Email:** admin@atlasprime.trade
- **Password:** Admin@AtlasPrime2024!
- **Role:** SUPER_ADMIN
- **Access:** Full admin panel access

**To Create Admin User in Database:**
```bash
bun run seed-admin
```

---

## 🌐 Domain Configuration

**Primary Domain:**
- Production: https://atlasprime.trade
- Email URLs point to: atlasprime.trade

**Update Environment Variable:**
```bash
NEXT_PUBLIC_APP_URL=https://atlasprime.trade
```

---

## 📧 Email Configuration (Mailgun)

**Required Environment Variables:**
```bash
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=mg.atlasprime.trade
MAILGUN_FROM=AtlasPrime <noreply@atlasprime.trade>
```

**Note:** Email service is configured to work without Mailgun (will log to console). Add Mailgun credentials when ready.

---

## 🗄️ Database Configuration

**PostgreSQL (Render):**
```bash
DATABASE_URL=your_database_url_with_sslmode=require
```

**Prisma Commands:**
```bash
# Generate Prisma Client
bunx prisma generate

# Run migrations
bunx prisma migrate deploy

# Seed admin user
bun run seed-admin

# View database
bunx prisma studio
```

---

## 🔑 API Keys & Services

### Cloudinary (KYC Documents)
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### CoinMarketCap (Price Data)
```bash
COINMARKETCAP_API_KEY=your_cmc_api_key
```

### JWT (Authentication)
```bash
JWT_SECRET=your_strong_secret_key
JWT_EXPIRES_IN=7d
```

---

## 🌍 Supported Features

### Countries
- **Total:** 195+ countries worldwide
- **Features:** Phone codes, country codes
- **Sorting:** Alphabetically sorted

### Trading Pairs
- **Total:** 50+ major trading pairs
- **Categories:** DeFi, Layer 1, Meme, Gaming, AI
- **Data Source:** Binance WebSocket (real-time)

---

## 🚀 Deployment Steps

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Render Auto-Deploy:**
   - Automatically builds and deploys
   - Runs migrations on deploy

3. **Seed Admin User:**
   ```bash
   bun run seed-admin
   ```

4. **Verify Admin Login:**
   - Go to: https://atlasprime.trade/login
   - Email: admin@atlasprime.trade
   - Password: Admin@AtlasPrime2024!

5. **Access Admin Panel:**
   - URL: https://atlasprime.trade/admin
   - Requires SUPER_ADMIN role

---

## 📱 Admin Panel Features

**Dashboard:**
- User statistics
- Trading volume
- KYC approvals
- Transaction monitoring

**User Management:**
- View all users
- Edit user details
- Update KYC status
- Assign roles (USER, ADMIN, SUPER_ADMIN)

**KYC Management:**
- Review documents
- Approve/reject submissions
- Download documents via Cloudinary

**Transaction Monitoring:**
- View all transactions
- Filter by type (deposit, withdrawal, transfer)
- Update transaction status

**Analytics:**
- User growth charts
- Trading volume trends
- Platform statistics

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ Role-based access control (RBAC)
- ✅ 2FA support (TOTP)
- ✅ Email verification
- ✅ Password reset flow
- ✅ Session management
- ✅ Secure API routes

---

## 📞 Support

**Issues or Questions:**
- GitHub: https://github.com/1darkvader/AtlasPrime-Exchange
- Check `.same/todos.md` for latest updates

---

**Last Updated:** November 29, 2024
**Version:** 1.0.0 Production Ready
