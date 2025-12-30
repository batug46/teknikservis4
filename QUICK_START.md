# 🚀 Quick Start Guide - TeknikServis

**Get your platform running in 15 minutes!**

---

## ✅ **Prerequisites Checklist**

Before starting, make sure you have:

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] Git installed ([Download](https://git-scm.com/))
- [ ] A PostgreSQL database (see Database Setup below)
- [ ] A code editor (VS Code recommended)
- [ ] A Resend account ([Sign up free](https://resend.com/))

---

## 📦 **Step 1: Extract & Install** (2 minutes)

1. **Extract the downloaded ZIP file**
```bash
# Navigate to the extracted folder
cd teknik-servis4
```

2. **Install dependencies**
```bash
npm install
```

Wait for installation to complete (~2 minutes)

---

## 🗄️ **Step 2: Database Setup** (5 minutes)

### **Option A: Neon (Recommended - Free)**

1. Go to [neon.tech](https://neon.tech/)
2. Sign up (free)
3. Create new project
4. Copy connection string

### **Option B: Supabase**

1. Go to [supabase.com](https://supabase.com/)
2. Create new project
3. Go to Settings → Database
4. Copy connection string (change port to 5432)

### **Option C: Local PostgreSQL**

```bash
# Install PostgreSQL
# Create database
createdb teknikservis
```

Connection string format:
```
postgresql://user:password@localhost:5432/teknikservis
```

---

## ⚙️ **Step 3: Environment Configuration** (3 minutes)

1. **Copy environment template**
```bash
cp .env.example .env
```

2. **Edit .env file** with your details:

```env
# Your database connection string from Step 2
DATABASE_URL="postgresql://YOUR_CONNECTION_STRING"

# Your site URL
NEXTAUTH_URL="http://localhost:3000"

# Generate a secret key (or use: openssl rand -base64 32)
NEXTAUTH_SECRET="your-super-secret-key-here"

# Get from resend.com after signup
RESEND_API_KEY="re_your_api_key"

# Choose a secret for admin creation
ADMIN_CREATE_SECRET="my-admin-secret-123"

# Your site URL
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

**Important:** Change these values! Don't use defaults in production.

---

## 🎨 **Step 4: Database Migration** (2 minutes)

Run these commands in order:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (creates all tables)
npx prisma migrate deploy

# (Optional) Seed example data
npx prisma db seed
```

---

## 👑 **Step 5: Create Admin Account** (2 minutes)

1. **Start development server**
```bash
npm run dev
```

2. **Open browser**
```
http://localhost:3000/create-admin
```

3. **Fill in the form**
- Secret Key: Use your `ADMIN_CREATE_SECRET` from .env
- Name: Your Name
- Email: admin@yourdomain.com
- Password: Strong password (min 6 chars)

4. **Click Create**

✅ Admin account created!

---

## 🎉 **Step 6: Explore Your Platform** (1 minute)

### **Admin Panel**
```
http://localhost:3000/admin
```
Login with the admin credentials you just created.

### **Customer View**
```
http://localhost:3000
```
Browse as a customer would see it.

---

## 🎨 **Step 7: Basic Customization** (Optional)

### **Add Your First Product**

1. Go to Admin Panel → Products
2. Click "Add Product"
3. Fill details:
   - Name, Price, Description
   - Image URL (use https://picsum.photos/400/300 for testing)
   - Category, Stock
4. Save

### **Update Contact Info**

1. Admin Panel → Site Settings
2. İletişim tab
3. Update:
   - Phone number
   - Email
   - Address
4. Save

### **Add Slider Images**

1. Admin Panel → Slider
2. Click "Add Slide"
3. Title, Image URL, Link (optional)
4. Save

---

## ✅ **Verification Checklist**

Test these to make sure everything works:

- [ ] Can access homepage (localhost:3000)
- [ ] Can login to admin panel
- [ ] Can see products
- [ ] Can add product to cart
- [ ] Can create service tracking record
- [ ] Email sending works (check spam folder)
- [ ] Dark mode toggle works

---

## 🚀 **Next Steps**

### **Immediate**
1. Change all default passwords
2. Add your products
3. Customize site settings
4. Test email flows

### **Before Going Live**
1. Update environment variables for production
2. Set up domain name
3. Configure production database
4. Test all features thoroughly

---

## 🐛 **Troubleshooting**

### **"Module not found" errors**
```bash
rm -rf node_modules
npm install
```

### **Database connection fails**
- Check DATABASE_URL in .env
- Verify database is running
- Test connection string

### **Prisma errors**
```bash
npx prisma generate
npx prisma migrate reset
```

### **Port 3000 already in use**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill
# Or change port
npm run dev -- -p 3001
```

### **Emails not sending**
- Verify RESEND_API_KEY
- Check spam folder
- Verify email domain

---

## 📚 **Additional Resources**

- **Full Documentation**: README.md
- **Environment Setup**: .env.example
- **Support**: support@your-email.com

---

## 🎯 **Quick Command Reference**

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create new migration
npx prisma generate      # Regenerate client

# Maintenance
npm run lint             # Check code quality
npm run format           # Format code
```

---

## ✨ **You're All Set!**

Your platform is ready to use. Start customizing and adding content!

**Need help?** Email support@your-email.com

---

**Happy building! 🚀**
