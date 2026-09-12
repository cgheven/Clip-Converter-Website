# ClipGrab

Paste a video link, pick a resolution, download the file.

```
clipgrab/
├── frontend/    Next.js UI          → Vercel
└── backend/     Express + yt-dlp    → Contabo VPS
```

**Brand color:** `#2B59FF` (cobalt). Type: Bricolage Grotesque + Inter.

---

## What's built

**Frontend** — 6 pages, all static-prerendered, 85 kB first load:

| Route | Purpose |
|---|---|
| `/` | Downloader + how-it-works summary |
| `/how-it-works` | Full walkthrough of the pipeline |
| `/faq` | 8-question accordion |
| `/privacy` | Data handling |
| `/terms` | Usage rules |
| `404` | Not found |

Fully responsive (tested at 390px and 1280px), keyboard accessible, respects `prefers-reduced-motion`.

**Backend** — Express API:

| Endpoint | Does |
|---|---|
| `POST /api/formats` | Returns title, thumbnail, and a clean list of quality options |
| `POST /api/download` | Starts a job, returns `jobId` immediately |
| `GET /api/status/:jobId` | Live progress %, stage, queue position |
| `GET /api/file/:jobId` | Streams the finished file |
| `GET /health` | Uptime, active jobs, queue depth |

Includes: job queue with concurrency cap, real progress parsing from yt-dlp, 30-min formats cache, per-IP rate limiting, helmet + compression, auto-cleanup of files after 20 min, and human-readable error mapping.

---

## Before you go public — read this

`yt-dlp` works by talking to each platform's internal endpoints. That means:

- **YouTube, Instagram and Facebook all prohibit third-party downloading in their ToS.** A personal tool is low-risk. A public, monetized site is legally fragile — takedowns and hosting bans are common for tools in this category.
- **yt-dlp breaks periodically** when platforms change. Budget `pip install -U yt-dlp` every few weeks as ongoing maintenance, not one-time setup.
- **Instagram usually needs cookies** for anything beyond fully public posts. See the cookies section below.

Decide personal vs public before investing more. It changes how much you should build on top of this.

---

## 1. Run it locally

### Install the tools

```bash
# yt-dlp
pip install -U yt-dlp

# ffmpeg
sudo apt install ffmpeg      # Ubuntu
brew install ffmpeg          # Mac

# verify
yt-dlp --version && ffmpeg -version | head -1
```

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev          # → http://localhost:4000
```

**Test the API before touching the UI.** If this fails, the frontend can't help you debug it:

```bash
curl -X POST http://localhost:4000/api/formats \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=aqz-KE-bpKQ"}'
```

You should get JSON with an `options` array.

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev          # → http://localhost:3000
```

Now test the full flow end-to-end with a YouTube link and an Instagram reel.

---

## 2. Push to GitHub

One repo, both folders — Vercel and the VPS each pull from it.

```bash
cd clipgrab
git init
git add .
git commit -m "ClipGrab: frontend + backend"
git branch -M main
git remote add origin https://github.com/YOUR_USER/clipgrab.git
git push -u origin main
```

---

## 3. Deploy backend → Contabo VPS

Run it in its **own folder on its own port**, isolated from your existing site.

```bash
ssh youruser@your-vps-ip

# System dependencies (once)
sudo apt update
sudo apt install -y python3-pip ffmpeg
pip3 install -U yt-dlp
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Deploy
mkdir -p ~/apps && cd ~/apps
git clone https://github.com/YOUR_USER/clipgrab.git
cd clipgrab/backend
cp .env.example .env
nano .env        # set ALLOWED_ORIGINS to your real Vercel URL
npm install --production

# Keep it alive
sudo npm i -g pm2
pm2 start server.js --name clipgrab-api
pm2 save
pm2 startup      # run the command it prints
```

### Nginx + HTTPS (recommended over exposing port 4000)

```nginx
# /etc/nginx/sites-available/clipgrab
server {
    listen 80;
    server_name api.yourdomain.com;

    client_max_body_size 0;
    proxy_read_timeout 900s;     # long downloads need this
    proxy_send_timeout 900s;

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;      # lets files stream instead of buffering
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/clipgrab /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d api.yourdomain.com
```

Verify: `curl https://api.yourdomain.com/health`

---

## 4. Deploy frontend → Vercel

1. Vercel dashboard → **Add New → Project** → import your GitHub repo
2. **Root Directory:** `frontend` ← important, this is a monorepo
3. **Environment Variables:** `NEXT_PUBLIC_API_URL` = `https://api.yourdomain.com`
4. Deploy

Then go back to the VPS and put your real Vercel domain in `ALLOWED_ORIGINS`, and `pm2 restart clipgrab-api`. CORS will block the frontend until you do.

---

## 5. Ongoing workflow

```bash
# Frontend change
git push                    # Vercel auto-deploys

# Backend change
git push
ssh vps
cd ~/apps/clipgrab && git pull
pm2 restart clipgrab-api    # this step is manual
```

**Monthly maintenance:**
```bash
pip3 install -U yt-dlp && pm2 restart clipgrab-api
```

**Useful commands:**
```bash
pm2 logs clipgrab-api       # live logs
pm2 monit                   # CPU/RAM
df -h                       # check disk isn't filling
curl localhost:4000/health  # queue depth
```

---

## 6. Instagram cookies

If Instagram links fail with a private/login error:

1. Install a "Get cookies.txt LOCALLY" browser extension
2. Log into Instagram, export cookies
3. Upload as `backend/cookies.txt`
4. In `.env`: `COOKIES_FILE=./cookies.txt`
5. `pm2 restart clipgrab-api`

**Never commit `cookies.txt`.** It's a live session token — anyone with it can access that account. Use a throwaway account, not your main one.

---

## 7. Tuning

All in `backend/.env`:

| Setting | Raise it if | Lower it if |
|---|---|---|
| `MAX_CONCURRENT_JOBS` | VPS has spare CPU and users wait in queue | CPU pegs at 100% |
| `FILE_TTL_MINUTES` | Users report expired links | Disk fills up |
| `JOB_TIMEOUT_MINUTES` | Long videos keep failing | Jobs hang and block the queue |
| `DOWNLOAD_RATE_LIMIT` | Legitimate users hit limits | You're getting abused |

Note: rate limits are per-IP, which is weak on mobile networks and VPNs where many users share one IP. If this goes public and gets traffic, add lightweight accounts or token-based quotas.
