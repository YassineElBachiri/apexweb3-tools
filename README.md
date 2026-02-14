<div align="center">

# ⚡ ApexWeb3 Tools

**The Ultimate Web3 Analytics & Tools Platform**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-Private-red)](#)

> Real-time tokenomics analysis, portfolio tracking, security scanning, crypto conversion, Web3 job listings, and more — all in one platform.

[**Live Demo →**](https://apexweb3.com) · [Report Bug](https://github.com/yourusername/apexweb3-tools/issues) · [Request Feature](https://github.com/yourusername/apexweb3-tools/issues)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [SEO](#-seo)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔬 Analysis Tools
| Tool | Description |
|------|-------------|
| **Tokenomics Analyzer** | Deep-dive token analysis with a 0–100 investment score, supply/inflation metrics, and risk assessment |
| **Security Scanner** | Detect honeypots, rug pulls, and smart contract vulnerabilities before investing |

### 📊 Tracking Tools
| Tool | Description |
|------|-------------|
| **Portfolio Tracker** | Monitor crypto holdings with real-time prices, P&L dashboards, and multi-asset support |
| **Whale Watch** | Track $100K+ smart-money movements and large wallet transactions in real time |

### 💱 Conversion Tools
| Tool | Description |
|------|-------------|
| **Crypto Converter** | Convert between 100+ cryptocurrencies with live exchange rates |
| **Fiat Exchange** | Calculate crypto value in 30+ fiat currencies (USD, EUR, GBP, JPY, etc.) |
| **Salary Estimator** | Convert fiat salary to crypto, simulate DCA strategies, and estimate taxes |

### 🧮 Calculation Tools
| Tool | Description |
|------|-------------|
| **Avg Cost Calculator** | Calculate average buy price, total investment, and break-even points across multiple purchases |

### 💼 Web3 Jobs
| Feature | Description |
|---------|-------------|
| **Job Board** | Browse Web3, DeFi, and Blockchain career opportunities |
| **SEO Detail Pages** | Individual job pages with structured data (JSON-LD `JobPosting` schema) |
| **Tag Filtering** | Filter jobs by technology, role type, or remote status |
| **Analytics Tracking** | Track apply clicks and job views |

### 🏠 Platform
- **Modern Landing Page** — Animated hero, stats, tool cards, testimonials, FAQ, and CTA
- **Mega Menu Navigation** — Categorized tool access with descriptions and badges
- **Global Search** — Search tokens across the entire platform
- **Responsive Design** — Fully responsive across all device sizes
- **Dark Theme** — Premium dark UI with glassmorphism and gradient accents
- **SEO Optimized** — Structured data, meta tags, sitemap, robots.txt

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) + [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) primitives (Accordion, Select, Tooltip, Switch, etc.) |
| **Animations** | [Framer Motion 12](https://www.framer.com/motion/) |
| **Charts** | [Recharts 3](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **SEO** | [next-seo](https://github.com/garmeeh/next-seo), JSON-LD structured data |
| **Command Palette** | [cmdk](https://cmdk.paco.me/) |

### External APIs

| API | Purpose |
|-----|---------|
| [CoinGecko](https://www.coingecko.com/en/api) | Token prices, market data, historical charts |
| [GoPlus Security](https://gopluslabs.io/) | Smart contract security analysis |
| [Moralis](https://moralis.io/) | Wallet tracking, portfolio data |
| [Alchemy](https://www.alchemy.com/) | Blockchain node access |
| [web3.career](https://web3.career/) | Web3 job listings |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────┐
│                   Next.js App                    │
│  ┌───────────┐  ┌───────────┐  ┌─────────────┐  │
│  │  Pages     │  │  API       │  │  Components │  │
│  │  (SSR/SSG) │  │  Routes    │  │  (RSC+CC)   │  │
│  └─────┬─────┘  └─────┬─────┘  └──────┬──────┘  │
│        │              │               │          │
│  ┌─────▼──────────────▼───────────────▼──────┐   │
│  │              lib/ (Business Logic)         │   │
│  │  coingecko.ts │ scoring.ts │ web3Career.ts │   │
│  └─────────────────────┬─────────────────────┘   │
│                        │                         │
│  ┌─────────────────────▼─────────────────────┐   │
│  │           External APIs                    │   │
│  │  CoinGecko │ GoPlus │ Moralis │ web3.career│   │
│  └───────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

- **Server Components** for data fetching (jobs, token data, metadata)
- **Client Components** for interactivity (charts, forms, animations)
- **API Routes** proxy external APIs with caching and error handling
- **ISR** (Incremental Static Regeneration) for job detail pages

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9 (or yarn / pnpm)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/apexweb3-tools.git
cd apexweb3-tools

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys (see section below)

# 4. Start the development server (uses Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root:

```env
# ─── API Keys (Required for production) ───────────────
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key
NEXT_PUBLIC_MORALIS_API_KEY=your_moralis_api_key
NEXT_PUBLIC_GOPLUS_API_KEY=your_goplus_api_key
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
WEB3_CAREER_TOKEN=your_web3_career_token

# ─── Optional ─────────────────────────────────────────
NEXT_PUBLIC_USE_MOCK_DATA=false          # Set to 'true' during development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note:** The app includes a mock data generator (`lib/mock-generator.ts`) for development without API keys. Set `NEXT_PUBLIC_USE_MOCK_DATA=true` to use it.

---

## 📁 Project Structure

```
apexweb3-tools/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage (landing page)
│   ├── layout.tsx                # Root layout (fonts, metadata, nav, footer)
│   ├── globals.css               # Global styles & Tailwind directives
│   ├── robots.ts                 # SEO: robots.txt generation
│   ├── sitemap.ts                # SEO: sitemap.xml generation
│   ├── not-found.tsx             # Custom 404 page
│   │
│   ├── analyzer/                 # Token analysis tool
│   ├── calculator/               # Average cost calculator
│   ├── converter/                # Crypto-to-crypto converter
│   ├── dashboard/                # Main dashboard
│   ├── fiat-converter/           # Crypto-to-fiat converter
│   ├── jobs/                     # Web3 job board
│   │   ├── page.tsx              #   Main listings page
│   │   ├── [slug]/page.tsx       #   Individual job detail (SSG + ISR)
│   │   └── tag/[slug]/page.tsx   #   Tag-filtered listings
│   ├── portfolio/                # Portfolio tracker
│   ├── salary-estimator/         # Salary conversion tool
│   ├── scan/                     # Security scanner
│   ├── token/                    # Token detail pages
│   ├── tracker/                  # Wallet tracker
│   ├── whales/                   # Whale watch dashboard
│   │
│   └── api/                      # API route handlers
│       ├── portfolio/            #   Portfolio data
│       ├── salary/               #   Salary calculations
│       ├── search/               #   Token search
│       ├── security/             #   Security scanning
│       ├── tokenomics/           #   Tokenomics analysis
│       └── whales/               #   Whale transactions
│
├── components/                   # React components
│   ├── ui/                       # Base UI primitives (Button, Card, Badge, etc.)
│   ├── home/                     # Landing page sections
│   │   └── navigation/           #   MegaMenu, etc.
│   ├── jobs/                     # Job board components
│   │   ├── JobCard.tsx           #   Job listing card
│   │   ├── JobsDashboard.tsx     #   Job list + filters
│   │   └── ApplyButton.tsx       #   Apply CTA with analytics
│   ├── tokenomics/               # Tokenomics analysis components
│   ├── portfolio/                # Portfolio components
│   ├── converter/                # Converter components
│   ├── calculator/               # Calculator components
│   ├── fiat-converter/           # Fiat converter components
│   ├── salary-calculator/        # Salary estimator components
│   ├── security/                 # Security scanner components
│   ├── whales/                   # Whale watch components
│   ├── seo/                      # SEO content & FAQ components
│   ├── navigation.tsx            # Main navbar
│   ├── footer.tsx                # Site footer
│   └── search-bar.tsx            # Global search (cmdk)
│
├── lib/                          # Business logic & utilities
│   ├── coingecko.ts              # CoinGecko API client
│   ├── web3Career.ts             # Web3 job API client
│   ├── scoring.ts                # Token investment scoring
│   ├── analytics.ts              # Event tracking
│   ├── slugify.ts                # URL slug generation
│   ├── converter.ts              # Conversion logic
│   ├── calculator.ts             # Cost calculation logic
│   ├── fiatConverter.ts          # Fiat conversion logic
│   ├── salary-calculator.ts      # Salary estimation logic
│   ├── seo.ts                    # SEO utilities
│   ├── utils.ts                  # General utilities (cn, formatTimeAgo, etc.)
│   ├── mock-generator.ts         # Development mock data
│   ├── constants/                # App constants
│   │   ├── tools.ts              #   Tool definitions (categories, icons, etc.)
│   │   └── navigation.ts         #   Navigation links
│   └── seo-content/              # SEO FAQ content per tool
│
├── types/                        # TypeScript type definitions
│   └── job.ts                    # Web3Job, JobFilter interfaces
│
├── public/                       # Static assets
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── postcss.config.mjs            # PostCSS configuration
```

---

## 🔌 API Endpoints

All API routes are under `/api/` and act as proxies to external services with built-in caching and error handling.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tokenomics` | `GET` | Fetch tokenomics data for a given token |
| `/api/search` | `GET` | Search tokens by name or symbol |
| `/api/security` | `GET` | Run security analysis on a contract address |
| `/api/portfolio` | `GET` | Fetch portfolio/wallet data |
| `/api/whales` | `GET` | Get recent whale transactions |
| `/api/salary` | `POST` | Calculate salary conversions |

---

## 🔍 SEO

The platform implements comprehensive SEO:

- **Dynamic Metadata** — Each page generates unique `<title>`, `<meta description>`, and OpenGraph/Twitter tags
- **JSON-LD Structured Data** — `JobPosting` schema on job detail pages, `FAQPage` schema on tool pages
- **Canonical URLs** — Prevent duplicate content issues
- **Sitemap** — Auto-generated at `/sitemap.xml`
- **Robots.txt** — Auto-generated at `/robots.txt`
- **Semantic HTML** — Proper heading hierarchy, `<main>`, `<section>`, `<article>` usage
- **Performance** — ISR for job pages (revalidated hourly), Turbopack for fast dev builds

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Docker

```dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

### Security Headers

The app ships with security headers configured in `next.config.ts`:

| Header | Value |
|--------|-------|
| `X-DNS-Prefetch-Control` | `on` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **TypeScript** — Strict mode, no `any` (except icon types)
- **Components** — Server Components by default, `"use client"` only when needed
- **Styling** — Tailwind CSS utility classes, `cn()` for conditional classes
- **Naming** — PascalCase for components, camelCase for utilities, kebab-case for routes

---

## 📄 License

This project is private and not licensed for public distribution.

---

<div align="center">

**Built with ❤️ by the ApexWeb3 Team**

[Website](https://apexweb3.com) · [Twitter](https://twitter.com/apexweb3)

</div>
