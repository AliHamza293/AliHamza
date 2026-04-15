# Unity Game Developer Portfolio — Full CMS Edition

A complete portfolio + blog + admin panel built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**.

---

## 🚀 Run Locally

```bash
# 1. Install
npm install

# 2. Set up environment (already done — see .env.local)
# Default password: admin123

# 3. Start
npm run dev

# 4. Open
http://localhost:3000         ← Portfolio
http://localhost:3000/blog    ← Blog
http://localhost:3000/admin   ← Admin Panel
```

---

## 🔐 Admin Panel — http://localhost:3000/admin

Default password: **admin123**

### What you can do in Admin:
| Feature | Description |
|---------|-------------|
| ➕ Add Project | Title, description, YouTube link or image URL, tech stack |
| ✏️ Edit Project | Change any field, update media |
| 🗑️ Delete Project | Remove from portfolio instantly |
| 📝 Write Post | Rich content editor, publish/draft toggle |
| 👁️ Publish/Unpublish | Toggle post visibility instantly |
| 💬 Approve Comments | Review before they appear publicly |
| 🗑️ Delete Comments | Remove spam or inappropriate comments |

---

## 🎬 Adding YouTube Videos to Projects

1. Go to **Admin → Projects → Add Project** (or Edit)
2. Under **Media Type**, select **YouTube**
3. Paste your YouTube URL:
   ```
   https://www.youtube.com/watch?v=YOUR_VIDEO_ID
   ```
4. A preview appears instantly
5. Save — the video is embedded on your portfolio

---

## ☁️ Deploy to Vercel (Free)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "portfolio launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/unity-portfolio.git
git push -u origin main
```

### Step 2 — Deploy on Vercel
1. Go to **vercel.com** → New Project → Import your repo
2. Click **Deploy**

### Step 3 — Set Environment Variables on Vercel
In Vercel dashboard → Your Project → **Settings → Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `ADMIN_PASSWORD` | Your secret password (e.g. `MyStr0ngP@ss!`) |
| `NEXTAUTH_SECRET` | A random 32+ character string |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` |

> ⚠️ **Important:** On Vercel's free tier, the file-based store resets on each deployment.
> For permanent data, use a free database — see **Persistent Storage** below.

---

## 💾 Persistent Storage (For Vercel)

Vercel's serverless functions write to `/tmp` which resets. For permanent data:

### Option A — PlanetScale (Free MySQL)
1. Sign up at planetscale.com
2. Create a database
3. Add `DATABASE_URL` to Vercel env vars

### Option B — Upstash Redis (Free — Easiest)
1. Sign up at upstash.com
2. Create a Redis database
3. Install: `npm install @upstash/redis`
4. Replace file operations in `lib/store.ts` with Redis calls

### Option C — Supabase (Free PostgreSQL)
Full-featured, generous free tier. Works great with Next.js.

> The current file-based system works perfectly for **local development** and **testing**.
> For production, choose one of the above.

---

## 📁 Folder Structure

```
unity-portfolio/
├── app/
│   ├── admin/page.tsx          ← 🔐 Full admin panel
│   ├── blog/page.tsx           ← 📰 Blog listing
│   ├── blog/[slug]/page.tsx    ← 📄 Blog post + comments
│   ├── api/
│   │   ├── auth/route.ts       ← Login/logout
│   │   ├── projects/route.ts   ← Projects CRUD
│   │   ├── posts/route.ts      ← Posts CRUD
│   │   └── comments/route.ts   ← Comments CRUD
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/                 ← All UI sections
├── lib/
│   ├── store.ts                ← Data layer (read/write JSON)
│   └── auth.ts                 ← JWT session management
├── data/
│   └── store.json              ← Auto-created on first run
└── .env.local                  ← Your secrets (not committed)
```

---

## 📬 Sharing Posts on LinkedIn/Facebook

Each blog post has built-in share buttons:
- **LinkedIn** — one click shares with URL
- **Facebook** — one click shares with URL
- **X/Twitter** — shares with title + URL
- **Copy Link** — copies URL to clipboard

For best LinkedIn/Facebook previews, add Open Graph meta tags.
Update `app/blog/[slug]/page.tsx` to export metadata with `og:image`.

---

## 🔑 Changing Your Admin Password

Update `ADMIN_PASSWORD` in:
- `.env.local` (local dev)
- Vercel Environment Variables (production)

No code changes needed.
