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

## Deployment

### Vercel Project

- **Project Name:** `mas`
- **Project ID:** `prj_OaFTENQbRYc0xG1exaU2s17j1ni4`
- **Production Domain:** `anatolmt.pl`

**Important:** Ensure all environment variables are set in the Vercel project settings, especially:
- `SUPABASE_SERVICE_ROLE_KEY` (required for admin operations)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Database Setup

Run all SQL migrations in Supabase SQL Editor in order:

```bash
# Run migrations in order:
supabase/migrations/001_ai_tables.sql
supabase/migrations/002_video_tables.sql
supabase/migrations/003_admin_tables.sql
supabase/migrations/004_site_settings_table.sql
supabase/migrations/005_fix_bookings_schema.sql
supabase/migrations/006_add_missing_booking_columns.sql
supabase/migrations/007_create_page_texts.sql
supabase/migrations/008_fix_price_format_and_tables.sql  # Fixes price format
supabase/migrations/009_fix_blocked_slots_rls.sql        # Fixes blocked_slots RLS
supabase/migrations/010_blocked_slots_no_overlap.sql     # Prevents overlapping slots
supabase/migrations/011_fix_page_texts_rls.sql           # Fixes page_texts RLS
```

### Deployment Checklist

Before deploying to Vercel:

**1. Supabase Configuration:**
- [ ] All migrations run in Supabase SQL Editor (001-011)
- [ ] Verify RLS policies: `SELECT policyname, cmd, roles FROM pg_policies WHERE tablename IN ('bookings', 'blocked_slots', 'page_texts');`
- [ ] Expected: Only SELECT policies for anon/authenticated (service role bypasses RLS)

**2. Vercel Environment Variables:**
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon/public key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only!)
- [ ] `ADMIN_PIN` - 6-digit PIN for admin access
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- [ ] `LLM_API_KEY` - OpenAI/Anthropic API key

**3. Test Endpoints After Deploy:**
```bash
# Test public booking
curl -X POST https://anatolmt.pl/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"service_id":"masaz-klasyczny","date":"2026-03-15","time":"10:00","first_name":"Test","last_name":"User","phone":"+48123456789","email":"test@example.com"}'

# Test admin blocked slots (requires auth)
# Go to Admin -> Dostępność -> create/delete blocked slot

# Test admin content (requires auth)
# Go to Admin -> Treści -> edit/save text
```

**4. Security Verification:**
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT prefixed with `NEXT_PUBLIC_`
- [ ] All admin writes go through `/api/admin/*` routes
- [ ] No direct `supabase.from()` calls in client-side admin pages

### Price Format

**All booking prices are stored in PLN (whole units), not grosze/cents.**

- Example: A 200 PLN booking stores `price_pln = 200`
- Admin UI displays prices directly without division
- Migration 008 converts any old grosze values to PLN

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
