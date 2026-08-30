# RuleNest — Property Compliance Intelligence SaaS

> **Know what your property needs. Before the city asks.**

RuleNest is a modern property-compliance intelligence SaaS for self-managing
landlords in the United States. It helps small landlords understand
property-specific rental compliance requirements, track deadlines, monitor
regulatory changes, organize compliance documents, identify missing evidence,
and generate audit-ready compliance reports.

This repository contains the **complete frontend** of the product: a public
marketing website, authentication flows, and a full application dashboard. It
is a frontend prototype — all data is realistic mock data persisted to
`localStorage`, and the architecture is designed so a real backend can be
connected later without restructuring the UI.

---

## Features

### Public website

- **Home** — hero with live dashboard preview, trust/value strip, six feature
  cards, "How it works" steps, Property DNA explainer, Compliance Radar
  section, Document AI pipeline, "Ask My Property" AI section, pricing
  preview, final CTA.
- **Features, How It Works, Pricing, Resources, About** — full standalone
  pages.
- **Auth** — Login, Signup, Forgot password. Prototype auth runs on
  `localStorage`; a demo account ships out of the box.

### Application (`/app/...`)

- **Dashboard** — summary stat cards, compliance overview table (becomes
  stacked cards on mobile), Compliance Radar card, upcoming deadlines, recent
  activity, and the "Ask My Property" AI assistant.
- **Properties** — searchable/filterable property list with an "Add Property"
  modal (persisted).
- **Property detail** — compliance health, Overview / Requirements /
  Documents / Deadlines / Activity tabs, and a Property DNA panel.
- **Compliance Radar** — regulatory change monitoring with severity,
  effective dates, affected properties and a **Before / After** comparison.
- **Documents** — categories, search/filter/sort, browser file-picker upload
  with a simulated Document AI pipeline (extraction → requirement match →
  confidence), expiration tracking.
- **Tasks** — Overdue / Due soon / Upcoming / Completed buckets with
  complete & snooze actions.
- **Inbox** — intelligent compliance inbox with detected property /
  requirement / deadline and task creation.
- **Reports** — five report types with a generated, printable preview.
- **Settings** — profile, notifications, email/SMS preferences, security,
  subscription, property defaults (persisted).

## Tech stack

| Area      | Choice                           |
| --------- | -------------------------------- |
| Framework | React 18                         |
| Build     | Vite 5                           |
| Language  | TypeScript (strict)              |
| Styling   | Tailwind CSS 3                   |
| Routing   | React Router 6                   |
| Icons     | Lucide React                     |
| Data      | Local mock data + `localStorage` |

## Folder structure

```text
rulenest-saas/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── vite-env.d.ts
    ├── components/
    │   ├── ui/            # Button, Card, Badge, Modal, Input, Dropdown…
    │   ├── AddPropertyModal.tsx
    │   ├── AIAssistant.tsx
    │   ├── AuthShell.tsx
    │   ├── Logo.tsx
    │   ├── SectionHeading.tsx
    │   ├── StatusBadge.tsx
    │   └── Toasts.tsx
    ├── context/           # AuthContext, ToastContext, DataContext
    ├── data/mockData.ts   # demo dataset (clearly marked as demo content)
    ├── hooks/useMediaQuery.ts
    ├── layouts/           # PublicLayout, AppLayout (sidebar + topbar)
    ├── lib/               # storage (persistence), utils
    ├── pages/
    │   ├── public/        # Home, Features, HowItWorks, Pricing, …
    │   │   └── auth/      # Login, Signup, ForgotPassword
    │   └── app/           # Dashboard, Properties, PropertyDetail,
    │                      # ComplianceRadar, Documents, Tasks, Inbox,
    │                      # Reports, Settings
    ├── routes/AppRoutes.tsx
    └── types/index.ts
```

## Getting started

Requirements: **Node.js 18+** and npm.

```bash
npm install     # install dependencies
npm run dev     # start the dev server (http://localhost:5173)
```

### Commands

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start the Vite dev server                 |
| `npm run build`   | Type-check and produce a production build |
| `npm run preview` | Preview the production build locally      |

## Demo login

| Field    | Value               |
| -------- | ------------------- |
| Email    | `demo@rulenest.com` |
| Password | `demo123`           |

You can also create an account via **Sign up** — credentials are stored in
`localStorage` only. **Forgot password** is simulated for the prototype.

## Environment variables

None are required today. `.env.example` documents the variables expected when
connecting a backend (`VITE_API_URL`, `VITE_AUTH_MODE`).

## Replacing mock data with a real API

All reads/writes flow through three places:

1. **`src/lib/storage.ts`** — the persistence layer. Replace each function
   body with `fetch` calls to your API (keep the signatures).
2. **`src/context/DataContext.tsx`** — exposes data and mutations to the UI.
   Swap the local implementations for API calls and update state from the
   responses. Components do not need to change.
3. **`src/context/AuthContext.tsx`** — replace `login` / `signup` with your
   auth API and store a token instead of a local user record.

## Future backend architecture (suggested)

- **API**: Node (NestJS/Express) or similar, REST or tRPC.
- **Database**: PostgreSQL — tables map 1:1 to the types in
  `src/types/index.ts` (`User`, `Property`, `PropertyDNA`, `Requirement`,
  `DocumentItem`, `ComplianceTask`, `RegulatoryChange`, `ActivityItem`,
  `InboxItem`, `ReportRecord`).
- **Auth**: email/password + JWT (http-only cookie) or an IdP (Clerk/Auth0).
- **Document AI**: object storage (S3) + an extraction worker; the upload
  pipeline in `src/pages/app/Documents.tsx` already models the states.
- **Regulatory monitoring**: scheduled jobs diffing official sources; results
  feed the `RegulatoryChange` model that powers Compliance Radar.

## Notes & disclaimer

- All properties, people, documents and regulatory items are **demo data**.
- AI responses in the prototype are **simulated in the browser**.
- *RuleNest provides compliance information and workflow assistance and does
  not provide legal advice. Always verify requirements with the relevant
  official authority.*