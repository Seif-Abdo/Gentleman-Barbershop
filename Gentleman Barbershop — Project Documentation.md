# Gentleman Barbershop — Project Documentation

Prepared for implementation in Google Antigravity · Version 1.0

## 1. Overview

**Gentleman** is a barbershop (صالون جنتل مان). This project delivers a premium black-and-gold website that:

1. Presents the shop (brand, services, contact) to visitors.
2. Collects client feedback and profile data through the shop's existing Google Form.
3. Automatically classifies each client into one of three age groups: **Young**, **Youths**, **Elderly**.
4. Gives the owner a private **analytics dashboard** that turns the responses into decisions (what to improve, who the customers are, which barbers perform best).

### Goals

- Make it effortless for a client to leave feedback from their phone in under 60 seconds.
- Keep Google Forms/Sheets as the system of record (no new database to maintain).
- Give the owner a clear, visual picture of customer satisfaction and demographics.

### Non-goals (v1)

- Online booking and payments.
- Customer accounts and logins for clients.
- Replacing Google Forms with a custom database.

## 2. Source Form and Data Integration

- **Form title:** Gentleman. **Language:** Arabic (Egyptian dialect). **Structure:** 2 pages.
- **Form ID (public):** `1FAIpQLSfUOJC0hmhl8POLFmm20VCk1qLJxaVJvOBx3NBPuNF1Ds7_zQ`
- **Submission endpoint:** `https://docs.google.com/forms/d/e/1FAIpQLSfUOJC0hmhl8POLFmm20VCk1qLJxaVJvOBx3NBPuNF1Ds7_zQ/formResponse`
- **View URL (for field discovery):** same path ending in `/viewform`.

> **Questions confirmed by the owner.** The questionnaire is in section 4. The form has no age question, so age-group classification cannot work until one is added: add it to the Google Form first (section 4, question 1). Then the agent opens the `/viewform` page, reads the embedded `FB_PUBLIC_LOAD_DATA_` script, and generates `form.config.ts` listing every question, its type, `entry.ID`, required flag, options and rating scale. All code reads from that single config so the schema can change in one place.

### How data flows

```
Client (website form UI)
   → POST to Next.js route /api/submit  (validation, rate limit, spam check)
   → server forwards to Google Form /formResponse (entry.IDs)
   → Google Form stores row in linked Google Sheet
   → Next.js route /api/analytics reads the Sheet (Google Sheets API, service account)
   → normalizes rows, derives age group, aggregates
   → Admin dashboard renders charts
```

### Submitting from the website

- Re-create the form as a native, styled, bilingual UI on the site, then post to `/formResponse` **from the server** with `application/x-www-form-urlencoded` and each `entry.ID=value`.
- Because the form has 2 pages, include `pageHistory=0,1` in the POST so Google accepts it as a completed multi-page submission.
- Checkbox questions send the same `entry.ID` multiple times, once per selected option.
- Google returns an HTML page, not JSON. Treat HTTP 200/302 as success; surface a friendly error otherwise and keep the user's answers on screen.
- Fallback: embed the original Google Form in an iframe on the feedback page if the custom submission fails validation in testing.

### Reading data for analytics

- **Requirement:** in the Form's Responses tab, link it to a Google Sheet ("Link to Sheets").
- **Preferred:** Google Sheets API with a **service account** that has Viewer access to that sheet. Credentials live in server-side environment variables only.
- **MVP shortcut:** "Publish to web" as CSV and fetch it server-side. Acceptable for the first demo, but the sheet becomes publicly readable, so avoid it once real phone numbers are collected.
- Cache aggregated results for 60 seconds to stay inside API quotas.

## 3. Users and Roles

| Role | Description | Access |
| --- | --- | --- |
| Visitor / Client | Browses the site, submits feedback | Public pages only |
| Owner / Manager | Reviews analytics | Password-protected `/admin` |
| Developer | Maintains config and deployment | Repo and environment variables |

## 4. Questionnaire and Data Model

The owner's six questions are kept, reordered to move from the client, to the barber, to the shop, to ideas, with each rating placed before its explanation. Question 1 is new and is required for age grouping. The two "pros or cons" questions are split into "liked" and "could improve" so positives and negatives can be analysed separately. Only 4 questions are required; the rest are optional to keep completion under 60 seconds.

| # | Page | Arabic wording (Egyptian) | Meaning | Type | Required | Origin |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | 1 | سنك كام؟ | Your age | Number, 5–100 | Yes | **New** |
| 2 | 1 | اسم حلاق المرة السابقة | Name of your last barber | Pick list + "Don't remember / first visit" | Yes | Original, reworded option added |
| 3 | 1 | قيّم حلاق المرة السابقة فقط | Rate your last barber only | Rating 1–5 | Yes | Original |
| 4 | 1 | إيه اللي عجبك في الحلاق؟ | What you liked about the barber | Long text | No | Split from original |
| 5 | 1 | إيه اللي ممكن يتحسن في الحلاق؟ | What the barber could improve | Long text | No | Split from original |
| 6 | 2 | تقييمك للمحل ككل | Your overall rating of the shop | Rating 1–5 | Yes | Original |
| 7 | 2 | إيه اللي عجبك في المحل؟ | What you liked about the shop | Long text | No | Split from original |
| 8 | 2 | إيه اللي ممكن يتحسن في المحل؟ | What the shop could improve | Long text | No | Split from original |
| 9 | 2 | اقتراحك للحصول على أفضل خدمة | Your suggestion for the best service | Long text | No | Original |

Arabic wording for questions 1, 4, 5, 7 and 8 is a proposal; the owner may adjust it. Wording of the original questions stays as it is in the form.

### Rules for the questionnaire

- **Barber names:** the pick list is managed in `config/barbers.ts` and must match the Google Form's options exactly, because Google Forms rejects values that are not in the list. Changing a barber means updating both.
- **Rating scale:** keep the scale the existing form uses (1–5 assumed). If it differs, the dashboard normalises to 5.
- **Adding the age question:** responses submitted before it existed have no age and are classified `unknown`.
- **Splitting pros/cons:** older responses with a single combined field are shown in the comments feed as unlabelled notes. A config flag `splitProsCons` lets the owner return to the original single fields.
- **Optional extras, off by default** (enabled only if the owner asks): visit frequency, service type, and "would you recommend us" (0–10).
- **No name or phone number is collected.** The form stays anonymous.

### Normalised record

Each response row becomes this record. Fields marked *derived* are computed by the site.

| Field | Type | Notes |
| --- | --- | --- |
| `timestamp` | datetime | From the Sheet, parsed in Africa/Cairo time |
| `age` | integer or null | Question 1 |
| `ageGroup` | enum, *derived* | `young` / `youths` / `elderly` / `unknown` (section 5) |
| `barber` | enum | Question 2; "don't remember" is kept but excluded from barber rankings |
| `barberRating` | 1–5 | Question 3 |
| `barberLikes`, `barberImprovements` | text | Questions 4 and 5 |
| `shopRating` | 1–5 | Question 6 |
| `shopLikes`, `shopImprovements` | text | Questions 7 and 8 |
| `suggestion` | text | Question 9 |
| `sentiment` | enum, *derived* | From ratings: 4–5 positive, 3 neutral, 1–2 negative |
| `themes` | string list, *derived* | Topics found in the text fields by keyword dictionaries in `config/themes.ts` (Arabic and English): haircut quality, cleanliness, waiting time, price, behaviour, atmosphere, music, facilities |

## 5. Age Classification

The request defines three groups but not the boundaries. Proposed defaults, **configurable in `config/age-groups.ts`**:

| Group | Arabic label | Default range |
| --- | --- | --- |
| Young | صغار | up to 17 |
| Youths | شباب | 18–44 |
| Elderly | كبار السن | 45 and above |

Rules:

- Classification runs server-side when rows are normalized, never trusted from the client.
- Missing or invalid age → group `unknown`, shown as its own slice and excluded from group averages.
- The dashboard must label thresholds visibly (e.g. "Youths (18–44)") so the owner always knows the definition.
- If the form collects an age *range* instead of a number, map each range to a group in the same config file.

Age is a new required question (section 4, question 1). Responses submitted before it was added have no age and are classified `unknown`.

## 6. Website Scope

### Public pages

1. **Home** — hero with brand logo/wordmark, tagline, gold call-to-action "Share your feedback", short intro.
2. **Services** — list of services (editable in `content/services.ts`; prices optional).
3. **Gallery** — grid of photos with lightbox (placeholder images until real ones are supplied).
4. **Feedback** — the survey: multi-step wizard mirroring the Google Form's 2 pages, progress indicator, inline validation, large touch targets.
5. **Thank you** — confirmation, optional social/Google-review links.
6. **Contact / Location** — address, hours, phone/WhatsApp button, map embed.

### Cross-cutting

- Arabic (RTL) as the default language with an English toggle; all strings in i18n files.
- Mobile-first (most clients will arrive from a QR code in the shop). Provide a printable QR code that points to `/feedback`.
- SEO basics: titles, meta, Open Graph, sitemap, `lang` and `dir` attributes.
- Accessibility: WCAG AA contrast (gold on black passes), keyboard navigation, visible focus rings.

## 7. Admin Dashboard

Route: `/admin`, protected (see section 10). Desktop-first but fully usable on a phone.

### Global filters

Date range (today, 7 days, 30 days, 90 days, custom) · Age group · Barber. All widgets respond to filters, and filters are reflected in the URL so views can be shared.

### KPI cards

- Total responses (with change versus the previous period)
- Average overall shop rating
- Average barber rating across all barbers
- Share of positive responses (shop rating 4–5)
- Low-rating alerts: number of responses with a shop or barber rating of 2 or less
- Best and lowest-rated barber (only barbers with at least 5 responses)

### Charts and tables

1. **Age-group distribution** — donut chart: Young / Youths / Elderly (+ unknown).
2. **Shop rating by age group** — bars with response counts, showing which segment is least satisfied.
3. **Barber leaderboard** — horizontal bars of average barber rating, with the number of responses; barbers under 5 responses are marked "low sample".
4. **Barber rating by age group** — heatmap, barber × age group, showing which barber suits which clients.
5. **Rating trend** — line chart of weekly average shop rating and barber rating, with response count.
6. **Rating distribution** — 1–5 star histogram for the shop and for barbers.
7. **Themes** — most mentioned topics (cleanliness, waiting time, price, behaviour, haircut quality, atmosphere), split into positive ("liked") and negative ("could improve") mentions, filterable by age group.
8. **Comments and suggestions feed** — barber notes, shop notes and suggestions with sentiment tag, search and filters; responses rated 2 or less are flagged for follow-up.
9. **Raw data table** — sortable, paginated, with CSV export.

### Insight cards (auto-generated, rule-based)

Short sentences computed from the data, for example: "Elderly clients rate the shop 3.4 versus 4.5 for Youths", "Most common complaint among Youths: waiting time (12 mentions)", "Barber rating for \[name\] fell 0.6 points versus last month", "Responses dropped 30% versus last week". Keep these deterministic; no external AI service required.

### Export

- CSV of filtered data and a one-click PDF/print view of the KPI summary for monthly reviews.

## 8. Design System — Black and Gold

### Palette

| Token | Hex | Use |
| --- | --- | --- |
| `--bg` | `#0B0B0B` | Page background |
| `--surface` | `#141414` | Cards, panels |
| `--surface-2` | `#1C1C1C` | Raised elements, inputs |
| `--border` | `#2A2418` | Dividers (warm dark) |
| `--gold` | `#D4AF37` | Primary accent, CTAs, key numbers |
| `--gold-light` | `#E8CB6E` | Hover, highlights |
| `--gold-dark` | `#9C7A1E` | Pressed, subtle fills |
| `--text` | `#F5F0E1` | Primary text (warm ivory) |
| `--muted` | `#A39E8F` | Secondary text |
| `--danger` / `--ok` | `#C2554D` / `#6FA06B` | Low / high ratings only |

Gold is an accent: use it for roughly 10% of any screen. Optional gold gradient for hero headings: `#9C7A1E → #E8CB6E → #D4AF37`.

### Typography

- Headings: **Playfair Display** (English) and **Cairo** or **Tajawal** (Arabic).
- Body: **Inter** with Cairo for Arabic. Load via `next/font` with `display: swap`.
- Generous letter-spacing on small uppercase labels for a luxury feel.

### Components and feel

- Cards with 1px warm border, 12–16px radius, subtle gold glow on hover.
- Primary button: solid gold, black text; secondary: gold outline, transparent fill.
- Inputs: dark surface, gold focus ring.
- Rating inputs: gold stars or large tap-friendly numbered pills.
- Motion: short fade/slide-up reveals (200–400 ms), respect `prefers-reduced-motion`.
- Chart colors: gold family for the main series, with a defined palette for the three age groups — Young `#E8CB6E`, Youths `#D4AF37`, Elderly `#8C6D1F` — plus neutral grey for unknown. Charts sit on dark surfaces with muted gridlines.
- Imagery: black-and-white barbershop photography with gold overlays; a simple scissors/razor icon set in gold line style.

## 9. Technical Architecture

### Recommended stack

- **Next.js (App Router) + TypeScript**, deployed on Vercel (or any Node host).
- **Tailwind CSS** with the tokens above in `tailwind.config`.
- **Recharts** for charts; **shadcn/ui** primitives restyled to the theme.
- **next-intl** for Arabic/English and RTL.
- **Zod** for validation, shared between client and server.
- **googleapis** (Sheets API v4) on the server.

### Suggested structure

```
/app
  /(public)/page.tsx, services, gallery, feedback, thank-you, contact
  /admin/page.tsx, login
  /api/submit/route.ts      → validates, forwards to Google Form
  /api/analytics/route.ts   → reads Sheet, normalizes, aggregates
/config
  form.config.ts            → questions, types, entry IDs
  age-groups.ts             → thresholds, labels, colors
/lib
  sheets.ts, normalize.ts, aggregate.ts, insights.ts
/messages  ar.json, en.json
/content   services.ts
```

### Environment variables

```
GOOGLE_FORM_RESPONSE_URL=...
GOOGLE_SHEET_ID=...
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
ADMIN_PASSWORD_HASH=...
SESSION_SECRET=...
```

Never commit secrets; provide `.env.example`.

## 10. Security and Privacy

- `/admin` and `/api/analytics` require authentication: simple owner password (bcrypt hash) with signed, HTTP-only session cookie, login rate limiting. Upgrade path: Google sign-in restricted to the owner's email.
- The client never receives Sheet credentials or raw rows unless authenticated.
- Submission endpoint: rate limit per IP, honeypot field, maximum field lengths, and optional Cloudflare Turnstile to block bots.
- The form collects no name or phone number; keep it anonymous. Age and free-text answers are still personal data, so add a short consent line (Arabic and English) saying answers are used only to improve the shop's service. Egypt's Personal Data Protection Law (Law 151 of 2020) applies, so collect only what is needed.
- Clients may type names or phone numbers into comments: show comments only to the authenticated owner and leave them out of shared or printed summaries.
- Sanitize and escape all comments before rendering.

## 11. Non-Functional Requirements

- Lighthouse mobile score of 90 or higher for performance, accessibility and SEO on public pages.
- Dashboard loads within 3 seconds for up to 10,000 responses (aggregate server-side, paginate raw data).
- Works on the last two versions of Chrome, Safari and Samsung Internet; tested at 360 px width.
- Graceful states: empty (no data yet), loading skeletons, Google API failure with retry.
- Unit tests for age classification, normalization and aggregation; one end-to-end test for submit → appears in dashboard.

## 12. Delivery Plan for Antigravity

Work in this order; verify each milestone before moving on.

1. **Discovery:** fetch `/viewform`, extract questions and `entry.IDs`, write `form.config.ts`, and update the data model in section 4 to match reality.
2. **Scaffold:** Next.js + TypeScript + Tailwind, theme tokens, fonts, RTL/i18n, layout with header/footer.
3. **Public pages:** Home, Services, Gallery, Contact with sample content.
4. **Feedback wizard:** two-step form, validation, server submission to Google Form; confirm rows appear in the linked Sheet.
5. **Data layer:** Sheets reader, normalization, age classification, aggregation, caching, unit tests.
6. **Admin auth and dashboard:** filters, KPI cards, all charts, comments feed, table, CSV export, insight cards.
7. **Polish:** animations, empty/error states, accessibility pass, SEO, QR code page.
8. **Deploy:** environment setup, README with owner instructions (how to link the Sheet, change thresholds, edit services).

## 13. Acceptance Criteria

- A response submitted on the site appears in the Google Sheet and in the dashboard within 2 minutes.
- Each response is assigned the correct age group according to the configured thresholds, with unit tests for boundary ages (17/18, 44/45).
- All pages render correctly in Arabic RTL and English LTR.
- Black/gold theme is consistent; no pure-white surfaces; text contrast meets WCAG AA.
- Unauthenticated users cannot access `/admin` or analytics data.
- Changing a question or age threshold requires editing only the config files.

## 14. Assumptions and Open Questions

1. **Age thresholds** are proposed defaults. Owner to confirm the boundaries, especially where "elderly" begins.
2. Owner to approve adding the age question and splitting the two "pros or cons" questions into "liked" and "could improve" (section 4).
3. Barber names for the pick list, and whether to keep the "don't remember / first visit" option.
4. What rating scale does the existing form use (1–5 assumed)?
5. Does the shop have a logo, photos, address, hours and a WhatsApp number? Placeholders will be used until supplied.
6. Is the Form already linked to a Google Sheet, and can a service account be given Viewer access?
7. Is a custom domain required?

## 15. Kickoff Prompt for Antigravity

Paste this into Antigravity together with this document:

> Build the Gentleman barbershop website described in this document. Start with milestone 1: open the Google Form `/viewform` URL, extract all questions and `entry.` IDs, and generate `config/form.config.ts`; show me the extracted schema and any differences from section 4 before continuing. Then implement milestones 2–8 using Next.js, TypeScript, Tailwind, Recharts and next-intl, with an Arabic-first RTL black-and-gold design exactly as specified. Keep Google Forms/Sheets as the data source, classify age groups server-side using `config/age-groups.ts`, protect `/admin`, and add tests for classification and aggregation. Ask me before making decisions listed under Open Questions.
