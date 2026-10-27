# Gentleman Barbershop (صالون جنتل مان)

A luxury black-and-gold website and executive analytics dashboard for **Gentleman Barbershop** in Cairo, Egypt. Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Recharts**.

---

## Features

- **Luxury Black & Gold Aesthetics:** Custom tokens (`#0B0B0B`, `#141414`, `#D4AF37`) tailored to the gentleman salon experience.
- **Bilingual & RTL-First:** Native Egyptian Arabic with Right-to-Left (RTL) layout, plus a toggle for English.
- **100% Native Form & Storage:**
  - Independent, self-contained database storage (`data/feedbacks.json`) with zero external Google Forms/Sheets dependencies.
  - Submissions are validated, tagged, and persisted directly with atomic writes.
  - Age classification, sentiment tags, and keyword topic extraction happen automatically.
- **Automated Client Classification:** Automatically categorizes clients into **Young** (<18), **Youths** (18–44), or **Elderly** (45+).
- **Executive Analytics Dashboard (`/admin`):**
  - Password protected (default: `gentleman2026`).
  - Real-time KPIs: Response volume, Shop average score, Barbers average score, Positive share %, Low-rating alerts.
  - Age group donut distribution chart.
  - Shop rating by age group bar chart.
  - Barber leaderboard with average scores and low-sample warnings.
  - Weekly rating trends.
  - Theme sentiment analysis (cleanliness, waiting time, price, haircut quality, atmosphere).
  - Searchable customer comments feed with low-rating highlight.
  - One-click CSV data export.
- **Printable In-Shop QR Stand (`/feedback/qr`):** High-resolution printable QR code for mirrors and reception desks.

---

## Quick Start

### 1. Install & Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run Automated Unit Tests

```bash
npm test
```

Verifies age boundary conditions (17/18, 44/45, null), Arabic text rating conversions, and sentiment scoring.

### 3. Build & Production Run

```bash
npm run build
npm start
```

---

## Configuration Guide for Shop Owner

### 1. Age Group Thresholds
Edit `config/age-groups.ts`:
```ts
export const AGE_GROUPS = {
  young: { maxAge: 17, ... },
  youths: { minAge: 18, maxAge: 44, ... },
  elderly: { minAge: 45, ... },
};
```

### 2. Barbers List
Edit `config/barbers.ts` to add or update staff members, titles, and specialties:
```ts
export const BARBERS = [
  { id: "سعيد", nameAr: "سعيد", titleAr: "كبير الحلاقين", ... },
  ...
];
```

### 3. Services and Pricing
Edit `content/services.ts` to update haircuts, beard sculpts, VIP packages, and prices in EGP.

### 4. Admin Password
Set `ADMIN_PASSWORD` in `.env.local` or in your Railway Variables tab:
```env
ADMIN_PASSWORD=your_secure_password
```
*(Default: `gentleman2026`)*
