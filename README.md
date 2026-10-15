# Jolly & Honest

A production website for **Jolly & Honest**, a 74-year-old bespoke gents tailoring shop in Navrangpura, Ahmedabad — built as a freelance client project.

**Live:** [jollyhonest.vercel.app](https://jollyhonest.vercel.app)

## What it does

- Marketing site: heritage, services, craftsmanship, customer rating, location/hours with an embedded map
- **Booking flow**: a fitting-request form that collects customer details, writes to Firestore, and creates a Stripe Checkout session for a ₹500 refundable deposit — confirming the appointment and cutting down no-shows
- **Admin dashboard** (`/admin`): a Firebase-Auth-gated page where the owner reviews bookings and payment status

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion · Firebase (Firestore + Auth) · Stripe

## Architecture notes

A few decisions worth calling out:

- **No direct client access to Firestore.** Security rules deny all reads/writes (`firestore.rules`). Every operation goes through a server API route (`/api/bookings`, `/api/stripe/webhook`, `/api/admin/bookings`) using the Firebase Admin SDK, which bypasses rules entirely. This keeps the actual attack surface to three validated, server-controlled endpoints instead of an open database.
- **Validation & spam protection**: Zod schema validation, a honeypot field, and a duplicate-submission check (same phone number within 10 minutes) on the booking endpoint.
- **Admin auth without `firebase-admin/auth`**: `firebase-admin/auth`'s `verifyIdToken()` transitively pulls in `jwks-rsa`, which does a CJS `require()` of the ESM-only `jose` package — this crashes at runtime on Vercel (`ERR_REQUIRE_ESM`), regardless of bundler. Instead, `lib/firebase/verify-token.ts` verifies the Firebase ID token directly with `jose` (imported as proper ESM), doing the same RS256/JWKS check against Google's `securetoken` endpoint without the broken dependency chain.
- **Production builds use webpack, not Turbopack** (`next build --webpack`) — see `package.json`. This was the first workaround attempted for the issue above; kept as the stable, verified build path.
- **Payments**: Stripe Checkout (hosted, redirect-based) rather than Elements, so no card data or client-side Stripe.js touches the app. A webhook confirms payment server-side before a booking is marked `paid`.

## Local development

```bash
npm install
npm run dev
```

Requires these environment variables (see `.env.local`, not committed):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` (6 vars) | Firebase client SDK config — public by design, not secrets |
| `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` | Service account credentials for the Admin SDK |
| `STRIPE_SECRET_KEY` | Stripe API access (test mode while in development) |
| `STRIPE_WEBHOOK_SECRET` | Verifies incoming Stripe webhook signatures |

Firestore rules and indexes are deployed separately via the Firebase CLI:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Deployment

Connected to Vercel for CI/CD — every push to `main` auto-deploys to production. Feature work goes through pull requests reviewed and merged by hand, not pushed directly to `main`.
