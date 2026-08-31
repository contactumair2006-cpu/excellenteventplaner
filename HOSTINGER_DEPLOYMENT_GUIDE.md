# 🚀 Hostinger Deployment Guide — Excellent Event Planner / Royal Marquee

This guide provides step-by-step instructions to deploy your website to **Hostinger** seamlessly.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Option A: Hostinger Node.js Application Manager (Recommended)](#option-a-hostinger-nodejs-application-manager-recommended)
3. [Option B: Hostinger VPS with PM2 / Nginx](#option-b-hostinger-vps-with-pm2--nginx)
4. [Option C: Hostinger Shared / Cloud Hosting (Static + .htaccess)](#option-c-hostinger-shared--cloud-hosting-static--htaccess)
5. [Database & Supabase Configuration](#5-database--supabase-configuration)
6. [Admin Panel Access & Verification Checklist](#6-admin-panel-access--verification-checklist)

---

## 1. Prerequisites
- Node.js **v20.x or v22.x** installed.
- Hostinger hosting account (Cloud, Business, Premium, or VPS).
- (Optional) Supabase account if using remote database storage (otherwise built-in local database runs automatically).

---

## Option A: Hostinger Node.js Application Manager (Recommended)

If your Hostinger plan includes the **Node.js Web App** selector in hPanel:

### Step 1: Prepare Project Files
1. Run the production build command on your local machine:
   ```bash
   npm run build:hostinger
   ```
2. Create a `.zip` archive containing the following files and folders:
   - `app.js`
   - `package.json`
   - `package-lock.json`
   - `.output/` (the entire compiled directory)
   - `public/`
   - `.env` (your production environment file)

### Step 2: Upload to Hostinger
1. Log in to **Hostinger hPanel** → Go to **Websites** → Click **Manage**.
2. Go to **Files** → **File Manager** (`public_html` or your domain folder).
3. Upload the `.zip` archive and **Extract** all files into your domain directory.

### Step 3: Configure Node.js in hPanel
1. In hPanel, search for **Node.js** or go to **Advanced** → **Node.js**.
2. Click **Create Application** and set:
   - **Node.js version**: `20.x` or `22.x`
   - **Application mode**: `Production`
   - **Application root**: `/public_html` (or your domain directory)
   - **Application startup file**: `app.js`
3. Click **Save** / **Create**.

### Step 4: Install Dependencies & Start
1. In the Node.js application dashboard in hPanel, click **NPM Install** (or connect via SSH and run `npm install --omit=dev`).
2. Add Environment Variables under the Node.js settings (or in `.env` file):
   ```env
   NODE_ENV=production
   PORT=3000
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_KEY
   SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   SUPABASE_PUBLISHABLE_KEY=YOUR_ANON_KEY
   ```
3. Click **Restart Application** or **Start**.
4. Visit your domain in browser!

---

## Option B: Hostinger VPS with PM2 / Nginx

If you are using a **Hostinger VPS** (Ubuntu / Debian):

### Step 1: Connect to VPS via SSH
```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Install Node.js & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git
sudo npm install -g pm2
```

### Step 3: Upload and Build Application
```bash
cd /var/www
git clone <YOUR_GIT_REPO_URL> royal-marquee
cd royal-marquee

# Install dependencies & build
npm install
npm run build:hostinger
```

### Step 4: Configure PM2 Process Manager
```bash
# Start with PM2
pm2 start app.js --name "royal-marquee"

# Save PM2 state to start automatically on server reboot
pm2 save
pm2 startup
```

### Step 5: Configure Nginx Reverse Proxy
Edit `/etc/nginx/sites-available/royal-marquee`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable site and restart Nginx:
```bash
ln -s /etc/nginx/sites-available/royal-marquee /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 6: Install Free SSL (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Option C: Hostinger Shared / Cloud Hosting (Static + .htaccess)

If you only have standard shared hosting with Apache / LiteSpeed:

1. Build the production output:
   ```bash
   npm run build
   ```
2. Open `.output/public` on your computer.
3. Verify that `.htaccess` is located inside `.output/public` (our build automatically bundles `public/.htaccess`).
4. Upload all files from `.output/public` into `public_html` via Hostinger File Manager or FTP.
5. In hPanel, enable **Force HTTPS** in the SSL section.

---

## 5. Database & Supabase Configuration

The application works in **dual mode**:
1. **Local Mode (Default)**: Out-of-the-box, no external setup needed. All content, menus, inquiries, FAQs, and testimonials are saved securely in browser storage.
2. **Supabase Cloud Mode (Optional)**: Connect your own Supabase database for multi-user central synchronization.

### Setting Up Supabase:
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in Supabase dashboard.
3. Paste and run the contents of [`supabase/setup-own-supabase.sql`](file:///c:/Users/Umair%20Mustafa/Downloads/preview-studio-main/supabase/setup-own-supabase.sql).
4. Copy your **Project URL** and **Anon Public Key** from **Project Settings → API**.
5. Put them in your `.env` file or Hostinger Environment Variables:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
   ```

---

## 6. Admin Panel Access & Verification Checklist

### Admin Access
- **URL**: `https://yourdomain.com/admin` or `https://yourdomain.com/admin/login`
- **Default Admin Credentials**:
  - **Email**: `bm3595352@gmail.com`
  - **Password**: `Tahirmustafa.1`
  *(Password can be updated anytime from the Admin Settings tab)*

### Verification Checklist:
- [x] **Hero Section**: Displays high-resolution venue imagery and working action buttons.
- [x] **Navigation Bar**: Sticky scroll effect, WhatsApp link, click-to-call, and mobile navigation drawer.
- [x] **Menu & Catering**: Interactive package tabs and custom item requests.
- [x] **Gallery**: Full-screen photo lightbox and category filters.
- [x] **Inquiry Form**: Submits customer booking requests and stores them in Admin Inquiries.
- [x] **Admin Dashboard**: Content editor, inquiry lead manager, menu manager, and testimonial approvals.
- [x] **Hostinger Optimization**: Apache `.htaccess` with gzip compression, cache policies, and clean routing.
