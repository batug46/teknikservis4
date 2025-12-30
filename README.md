# 🔧 TeknikServis - Professional Service & E-Commerce Platform

> Modern, full-stack technical service tracking and e-commerce solution built with Next.js 14

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Commercial-green)](LICENSE)

## 🌟 **What You Get**

A complete, production-ready platform for technical service businesses and e-commerce. Perfect for:
- 💻 Computer repair shops
- 📱 Electronics service centers
- 🔧 Technical support companies
- 🛒 Tech product retailers

---

## ✨ **Key Features**

### 🎯 **Service Tracking System**
- Customer device management
- Real-time service status tracking
- Cancellation request handling
- SMS/Email notifications
- Admin approval workflow

### 🛍️ **E-Commerce Platform**
- Product catalog with categories
- Shopping cart & wishlist
- Stock management
- Product reviews & ratings
- Return/refund system

### 👤 **User Management**
- NextAuth.js authentication
- Email verification
- Password reset
- User profiles
- Service history tracking

### 🎨 **Modern UI/UX**
- Dark mode support
- Fully responsive design
- Toast notifications
- Smooth animations
- Mobile-optimized

### 🔐 **Admin Panel**
- Complete dashboard
- User management
- Product CRUD operations
- Service tracking management
- Site settings editor
- Slider management
- Analytics overview

### 🎨 **Customization**
- Dynamic site settings (contact, about, hours)
- Customizable slider
- Logo & branding options
- Color scheme editor

---

## 🚀 **Tech Stack**

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **PostgreSQL** | Relational database |
| **Prisma ORM** | Type-safe database access |
| **NextAuth.js** | Authentication |
| **Tailwind CSS** | Styling |
| **Resend** | Email service |
| **Vercel** | Deployment (recommended) |

---

## 📦 **Installation**

### **Prerequisites**
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### **Quick Start**

1. **Clone & Install**
```bash
git clone <your-repo>
cd teknik-servis4
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
```
Edit `.env` with your credentials (see Configuration section)

3. **Database Setup**
```bash
npx prisma generate
npx prisma migrate deploy
```

4. **Create Admin User**
```bash
# Visit: http://localhost:3000/create-admin
# Use your ADMIN_CREATE_SECRET from .env
```

5. **Run Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## ⚙️ **Configuration**

### **Required Environment Variables**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxx"

# Admin Setup
ADMIN_CREATE_SECRET="your-admin-secret"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

See `.env.example` for complete configuration.

---

## 📚 **Usage Guide**

### **Admin Panel Access**
1. Create admin account at `/create-admin`
2. Login at `/login`
3. Access admin panel at `/admin`

### **Features Overview**

#### **Service Tracking**
1. Customer submits service request
2. Admin creates tracking record
3. Updates sent via email
4. Customer can track status
5. Cancellation requests handled

#### **E-Commerce**
1. Products managed via admin panel
2. Customers browse & add to cart
3. Wishlist & favorites
4. Reviews & ratings
5. Order management

#### **Site Customization**
- Admin → Site Settings
- Edit contact info, hours, about page
- Upload slider images
- Customize branding

---

## 🎨 **Screenshots**

### Homepage
Modern landing page with hero slider, featured products, and services.

### Admin Dashboard
Complete management interface for products, services, and users.

### Service Tracking
Real-time device tracking with status updates.

### Mobile View
Fully responsive design optimized for all devices.

*(Add actual screenshots when deploying live demo)*

---

## 🔧 **Customization**

### **Colors & Branding**
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      // ... customize
    }
  }
}
```

### **Site Settings**
All editable via Admin Panel → Site Settings:
- Contact information
- Business hours
- About page content
- Services & advantages

### **Email Templates**
Edit templates in `src/lib/emailTemplates.js`

---

## 📂 **Project Structure**

```
teknik-servis4/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin panel pages
│   │   ├── api/               # API routes
│   │   ├── products/          # Product pages
│   │   └── ...
│   ├── components/            # React components
│   ├── lib/                   # Utilities & helpers
│   └── styles/               # Global styles
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Database migrations
├── public/                   # Static assets
└── .env                      # Environment variables
```

---

## 🚀 **Deployment**

### **Vercel (Recommended)**

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### **Database Hosting**

Recommended:
- **Neon** (PostgreSQL, free tier)
- **Supabase** (PostgreSQL, free tier)
- **Railway** (PostgreSQL)

---

## 🛡️ **Security Features**

✅ Password hashing (bcrypt)  
✅ CSRF protection  
✅ SQL injection prevention (Prisma)  
✅ XSS protection  
✅ Secure session management  
✅ Email verification  
✅ Role-based access control  

---

## 🐛 **Troubleshooting**

### **Database Connection Issues**
```bash
# Reset database
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

### **Email Not Sending**
- Check Resend API key
- Verify domain settings
- Check spam folder

### **Build Errors**
```bash
# Clear cache
rm -rf .next
npm run build
```

---

## 📝 **License**

**Commercial License** - This is a premium product.  
Purchase includes:
- ✅ Source code
- ✅ Lifetime updates
- ✅ Email support (3 months)
- ✅ Commercial use rights

**NOT Included:**
- ❌ Resale rights
- ❌ Redistribution
- ❌ SaaS deployment

---

## 🤝 **Support**

- **Email**: support@your-email.com
- **Documentation**: [Link to docs]
- **Issues**: Report bugs via email
- **Updates**: Automatic via GitHub

---

## 🎯 **Roadmap**

Upcoming features:
- [ ] Multi-language support
- [ ] SMS notifications (Twilio)
- [ ] Payment integration (Stripe)
- [ ] Inventory alerts
- [ ] Analytics dashboard
- [ ] Export/Import data

---

## 🙏 **Credits**

Built with:
- Next.js by Vercel
- Tailwind CSS
- Prisma
- NextAuth.js
- Lucide Icons

---

## 📞 **Contact**

Questions? Reach out:
- 📧 Email: your@email.com
- 🌐 Website: your-site.com
- 💬 Twitter: @yourhandle

---

**Made with ❤️ for service businesses worldwide**