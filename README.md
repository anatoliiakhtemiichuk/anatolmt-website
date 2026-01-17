# M&T ANATOL - Massage Therapy Booking System

Premium booking website for a manual therapist in Poland with online booking, pricing, and AI consultation features.

## Tech Stack

- **Frontend:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase
- **Payments:** Stripe
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

### 3. Start development server

```bash
npm run dev
```

Server runs on **http://localhost:1000**

### 4. Open in Chrome (macOS)

```bash
npm run dev:chrome
```

This starts the server AND opens Chrome automatically.

## NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 1000 |
| `npm run dev:chrome` | Start dev server + open Chrome |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/booking` | 5-step booking wizard |
| `/prices` | Pricing (weekday/weekend) |
| `/contact` | Contact form + map |
| `/ai` | AI consultation (10 PLN) |
| `/ai/chat` | AI chat interface |

## Features

- **Online Booking:** Step-by-step wizard (service → date → time → data → summary)
- **Dynamic Pricing:** Weekday vs weekend rates
- **AI Consultation:** Paid feature with Stripe (10 PLN)
- **Mobile-First:** Responsive design
- **Polish Language:** All UI in Polish

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── ai/              # AI consultation feature
│   ├── api/             # API routes
│   ├── booking/         # Booking wizard
│   ├── contact/         # Contact page
│   └── prices/          # Pricing page
├── components/
│   ├── layout/          # Header, Footer
│   └── ui/              # Reusable components
├── lib/                  # Utilities, Supabase, Stripe
└── types/               # TypeScript types
```

## Environment Variables

See `.env.example` for all required variables:

- `NEXT_PUBLIC_SITE_URL` - Site URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `LLM_API_KEY` - LLM API key (OpenAI/Anthropic)

## Database Setup

Run the SQL migration in Supabase:

```bash
# Copy contents of supabase/migrations/001_ai_tables.sql
# Paste in Supabase SQL Editor and run
```

## Progress Log

See [PROGRESS.md](./PROGRESS.md) for detailed milestone history.

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Black | `#0F172A` | Text, dark backgrounds |
| Blue | `#2563EB` | Primary, CTAs, links |
| White | `#FFFFFF` | Backgrounds, text on dark |

## License

Private - All rights reserved.
