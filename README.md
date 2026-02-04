# J.A.R.A - Job Application & Referral Assistant

**J.A.R.A** is an ethical, AI-assisted automation platform that helps users discover jobs, tailor resumes, and track applications using ONLY user-provided data.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Alpha-orange.svg)

## 🏗 Architecture

- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons.
- **Backend**: FastAPI, Python 3.11, Docker.
- **Database**: Supabase (PostgreSQL).
- **AI**: Hybrid logic (Rule-based + Lightweight NLP).

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker
- Supabase Account

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Supabase credentials
pip install playwright
playwright install chromium
uvicorn app.main:app --reload
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with Supabase keys
npm run dev
```

### 3. Cloud Deployment (Free Tier)
For detailed step-by-step instructions on deploying to **Render**, **Vercel**, and **Supabase**, please see the [Deployment Guide](deployment_guide.md).

**Quick Summary**:
- **Backend**: Deploy to Render (Web Service, Docker runtime).
- **Frontend**: Deploy to Vercel (Next.js preset).
- **Database**: Use Supabase (Free tier).
The `Dockerfile` is optimized for slim builds.
1. Connect repo to Render/Railway.
2. Set Root Directory to `backend`.
3. Set Environment Variables (`SUPABASE_URL`, `SUPABASE_KEY`).

**Frontend (Vercel)**:
1. Connect repo to Vercel.
2. Set Root Directory to `frontend`.
3. Set Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, etc.).

## 🛡 Security & Ethics

- **No Data Selling**: User data never leaves your instance.
- **Rate Limiting**: Automation is throttled to prevent spam.
- **Human-in-the-Loop**: All AI actions require user approval.

---
Built with ❤️ by Antigravity.
