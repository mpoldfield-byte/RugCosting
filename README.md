# Brintons Rug Quote Builder

Internal rug pricing and quote tool for Brintons Carpets Ltd. Companion to the carpet pricing app ([PricingV1](https://pricing-v1.vercel.app/)), sharing the same design language.

Built with Next.js 14.

## What it does

Builds multi-product rug quotes for commercial hospitality projects:

- **AI file import** — upload a PDF, Excel, CSV, or image of rug schedules; Claude extracts the rug sizes automatically
- Add rug line items (area name, description, width & length in feet + inches, quantity)
- Auto-calculates SFT per rug and project total SFT
- Pick any combination of the 10 rug products (Opal, Regius, Calisia, Agnus, Isfahan, Noble, Crescendo, Tempo, Ballata, Hand Tufted)
- Toggle between Custom and Quickweave pricing independently per product
- Auto-selects the correct volume bracket based on project total SFT
- Toggle which product attributes appear in the final quote (max colors, yarn, construction, non-slip pad, QW palettes)
- Exports a multi-column quote to Excel matching the standard Brintons rug quote template

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- An Anthropic API key (for the AI file import feature) — get one at [console.anthropic.com](https://console.anthropic.com/)

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env.local` file in the project root:

```
ANTHROPIC_API_KEY=sk-ant-...
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Configured for deployment on [Vercel](https://vercel.com).

1. Push this repository to GitHub
2. Import the repo in Vercel
3. In the Vercel project settings → **Environment Variables**, add `ANTHROPIC_API_KEY` with your key value (scope: Production, Preview, Development)
4. Vercel auto-detects Next.js and deploys with no additional configuration

Or via the Vercel CLI:

```bash
npm i -g vercel
vercel
```

Then add the env var in the Vercel dashboard as described above.

## Tech Stack

- [Next.js 14](https://nextjs.org/) (App Router, Node.js runtime for API routes)
- [React 18](https://react.dev/)
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) — Claude Sonnet 4.5 for file extraction
- [SheetJS](https://sheetjs.com/) — Excel parsing (server) & Excel export (browser CDN)

## Project Structure

```
├── app/
│   ├── api/
│   │   └── extract-rugs/
│   │       └── route.js    # Server API route — uploads file, calls Claude, returns rugs
│   ├── layout.js           # Root layout
│   └── page.js             # Main rug quote builder
├── public/
│   └── brintons-logo.png
├── next.config.mjs
├── package.json
├── .env.local              # (not committed) — your ANTHROPIC_API_KEY
└── README.md
```

## Pricing Reference

All pricing comes from the standard Brintons rug quote template and assumes:

- **Custom** — minimum 4,500 SFT; 2 volume brackets (4,500–8,000 / 8,001–16,000 SFT)
- **Quickweave** — minimum 1,125 SFT; 5 volume brackets
- **Hand Tufted** — priced project-by-project (PPP)
- Prices include cutting, binding, and attached non-slip pad

## Internal Use Only

This application is for internal use at Brintons Carpets Ltd. and is not intended for public distribution.
