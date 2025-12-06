# 🔧 LOGIN FIX - Step by Step Guide

## ⚠️ If You Cannot Login, Follow These Steps:

### **Step 1: Regenerate Prisma Client**

Run this command in your terminal:

```bash
cd atlasprime-exchange
bunx prisma generate
```

This will regenerate the Prisma client with the latest schema changes.

---

### **Step 2: Create Admin User in Database**

Run this command to create/update the admin user:

```bash
bun run seed-admin
```

**You should see:**
```
✅ Admin user updated
📧 Admin Credentials:
  Email: admin@atlasprime.trade
  Password: Admin@AtlasPrime2024!
✅ Seeding complete!
```

---

### **Step 3: Restart Dev Server**

Stop your current dev server (Ctrl+C) and restart it:

```bash
bun run dev
```

---

### **Step 4: Clear Browser Cache**

**Important:** Clear your browser cache and cookies!

**Chrome/Edge:**
- Press `Ctrl + Shift + Delete` (Windows/Linux) or `Cmd + Shift + Delete` (Mac)
- Select "Cookies and other site data" and "Cached images and files"
- Click "Clear data"

**Firefox:**
- Press `Ctrl + Shift + Delete` (Windows/Linux) or `Cmd + Shift + Delete` (Mac)
- Select "Cookies" and "Cache"
- Click "Clear Now"

**Safari:**
- Press `Cmd + ,` to open Preferences
- Go to Privacy tab
- Click "Manage Website Data"
- Click "Remove All"

---

### **Step 5: Try Login Again**

Now try logging in with these credentials:

- **Email:** `admin@atlasprime.trade`
- **Password:** `Admin@AtlasPrime2024!`

---

## 🆘 Still Having Issues?

### **Check Browser Console for Errors:**

1. Open Developer Tools (Press `F12`)
2. Go to the "Console" tab
3. Try logging in
4. Look for any red error messages
5. Send those error messages for help

### **Try Incognito/Private Mode:**

1. Open a new incognito/private window
2. Navigate to your site
3. Try logging in

### **Check if Server is Running:**

Make sure your dev server is running on `http://localhost:3000`

```bash
# Check if server is running
curl http://localhost:3000/api/auth/login
```

---

## 📝 Common Issues & Solutions:

### Issue: "Invalid email or password"
**Solution:** Make sure you ran `bun run seed-admin` to create the user in the database

### Issue: "An error occurred during login"
**Solution:**
1. Run `bunx prisma generate`
2. Restart the dev server
3. Clear browser cache

### Issue: Login button does nothing
**Solution:**
1. Clear browser cache completely
2. Try incognito mode
3. Check browser console for errors

### Issue: Server not responding
**Solution:**
1. Check if dev server is running
2. Restart with `bun run dev`
3. Check port 3000 is not in use

---

## 🔑 Default Login Credentials:

**Admin Account:**
- Email: `admin@atlasprime.trade`
- Password: `Admin@AtlasPrime2024!`
- Role: SUPER_ADMIN

**After Login:**
- Access admin panel at `/admin`
- Full platform access
- All trading features enabled

---

## 💾 Database Connection:

Make sure your `.env` file has:

```env
DATABASE_URL="your_postgresql_connection_string?sslmode=require"
JWT_SECRET="your_jwt_secret"
```

---

## 🚀 Quick Fix Command (Run All Steps):

```bash
cd atlasprime-exchange
bunx prisma generate
bun run seed-admin
pkill -f "bun run dev"
bun run dev
```

Then clear your browser cache and try logging in!

---

**If you still cannot login after following all these steps, please check:**
1. Database is accessible
2. .env file is configured correctly
3. No firewall blocking port 3000
4. Browser console for specific error messages
