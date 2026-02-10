# 🗄️ Database Setup Guide

Welcome to the **Neighborhood Services** database setup! Follow these steps to get your local environment running.

---

## 1. Prerequisites

- **Node.js** (v18+)
- **MongoDB Community Server** (Running locally on default port `27017`)
  - [Download for Windows/Mac](https://www.mongodb.com/try/download/community)

---

## 2. Environment Setup

1. Create a `.env` file in the root directory (if not exists).
2. Add your MongoDB connection string.

**Important:** Our code uses `MONGODB_URI`. Make sure your key matches exactly!

```env
# .env file content

MONGODB_URI=mongodb+srv://eslimyara2_db_user:Ry52ZXgGFNP9mSLz@cluster0.372b2zy.mongodb.net/neighborhood-services?retryWrites=true&w=majority

# MONGODB_URI=mongodb://localhost:27017/neighborhood-services # local db

JWT_SECRET=your_secret_key_here
# use node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" to generate it

PORT=3000 
```

---

## 3. Install Dependencies

Make sure you have all packages installed:

```bash
npm install
```

---

## 4. Seed the Database (Only if your database is local)

We have a script to populate your local database with initial test data (Neighborhoods, Users, Providers).

```bash
# Run the seed script
npx tsx scripts/seed.ts
```

**Expected Output:**

```
🌱 Connecting to MongoDB...
🧹 Clearing existing data...
qh Creating Neighborhoods...
👤 Creating Users...
🛠️ Creating Providers...
✅ Database seeded successfully!
```

---

## 5. Verify Data (Optional)

You can use **MongoDB Compass** to check the data:

1. Open Compass.
2. Connect to `mongodb://localhost:27017`.
3. Open database `neighborhood-services`.
4. Check collections: `users`, `providers`, `neighborhoods`.

---

## ⚠️ Troubleshooting

**Error: `MongooseServerSelectionError: connect ECONNREFUSED`**

- Is your MongoDB server running?
- Windows: Check Services -> "MongoDB Server".
- Mac: `brew services start mongodb-community`.

**Error: `Please define the MONGODB_URI...`**

- Check your `.env` file. Did you name it `MONGODB_URI`?
- Did you restart your server/script after changing `.env`?
