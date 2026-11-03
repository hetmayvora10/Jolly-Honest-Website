# Jolly & Honest

A production website for **Jolly & Honest**, a 74-year-old bespoke gents tailoring shop in Navrangpura, Ahmedabad — built as a freelance client project.

**Live:** [jollyhonest.vercel.app](https://jollyhonest.vercel.app)

## What it does

- Marketing site: heritage, services, craftsmanship, customer rating, location/hours with an embedded map
- **Booking flow**: a fitting-request form that collects customer details, writes to Firestore, and creates a Stripe Checkout session for a ₹500 refundable deposit — confirming the appointment and cutting down no-shows
- **Admin dashboard** (`/admin`): a server-rendered page, restricted to an allowlist, where the owner reviews bookings, payment status and store orders
- **Demo store** (`/shop`): Men, Women, Kids and Indian Traditional collections, product pages, a bag, customer sign-up/sign-in, Stripe checkout and order history. Every store page carries a banner saying it's a portfolio demo: the real shop is a bespoke tailor, products are illustrative, and payments run in Stripe test mode. Product imagery is typographic placeholder art until the owner supplies photos (set `image` on a product in `lib/catalog.ts`).

## Stack

Next.js (App Router) · React · TypeScript · Tailwind CSS · Framer Motion · Firebase (Firestore + Auth) · Stripe

## Architecture notes

A few decisions worth calling out:

- **No direct client access to Firestore.** Security rules deny all reads/writes (`firestore.rules`). Every operation goes through server code (API routes and server components) using the Firebase Admin SDK, which bypasses rules entirely — so every read is explicitly scoped: customers only ever load orders whose `uid` matches their session, and someone else's order ID returns the same 404 as a made-up one.
- **Sessions are HttpOnly cookies, not browser-stored tokens.** Firebase Auth (in-memory only) checks the password, then `/api/auth/session` verifies the fresh ID token (signed in within 5 minutes) and sets a `SameSite=Lax`, HttpOnly cookie holding an HS256 JWT signed with `SESSION_SECRET`. Nothing auth-related is written to localStorage, sessionStorage or IndexedDB.
- **Checkout is priced on the server.** The browser sends product IDs, sizes, colours and quantities; `lib/pricing.ts` reprices everything from the catalogue and rejects unknown products, sizes or colours. The webhook only marks an order paid when Stripe's `amount_total` matches the stored total.
- **CSRF**: every state-changing route goes through `rejectCrossSite()` (Origin must match, body must be `application/json`) on top of the SameSite cookie. Post-sign-in redirects only accept same-site paths.
- **Validation & spam protection**: Zod schema validation, a honeypot field, and a duplicate-submission check (same phone number within 10 minutes) on the booking endpoint.
- **Admin auth without `firebase-admin/auth`**: `firebase-admin/auth`'s `verifyIdToken()` transitively pulls in `jwks-rsa`, which does a CJS `require()` of the ESM-only `jose` package — this crashes at runtime on Vercel (`ERR_REQUIRE_ESM`), regardless of bundler. Instead, `lib/firebase/verify-token.ts` verifies the Firebase ID token directly with `jose` (imported as proper ESM), doing the same RS256/JWKS check against Google's `securetoken` endpoint without the broken dependency chain.
- **Production builds use webpack, not Turbopack** (`next build --webpack`) — see `package.json`. This was the first workaround attempted for the issue above; kept as the stable, verified build path.
- **Payments**: Stripe Checkout (hosted, redirect-based) rather than Elements, so no card data or client-side Stripe.js touches the app. A signature-verified webhook confirms payment server-side before a booking is marked `paid`, and ignores duplicate deliveries and unpaid sessions.
- **Admin access is an allowlist, not just a login.** Customers can create accounts, so the admin page and API also require the session's email to be in `ADMIN_EMAILS`. With it unset, nobody gets in.
- **Hardening**: per-IP rate limiting on bookings (counted in Firestore so it holds across serverless instances, with IPs hashed), same-origin and `application/json` checks on the booking API, a Content Security Policy plus standard security headers, no published source maps, rate limits on sign-in and checkout, account-enumeration-safe auth messages, and `no-store` on customer data. Covered by `tests/security.spec.ts`, `tests/auth.spec.ts` and `tests/store.spec.ts`.

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
| `ADMIN_EMAILS` | Comma-separated emails allowed into `/admin`; empty means no one |
| `SESSION_SECRET` | 32+ random characters for signing session cookies (`openssl rand -base64 48`); sign-in fails closed without it |

Firestore rules and indexes are deployed separately via the Firebase CLI:

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

## Deployment

Connected to Vercel for CI/CD — every push to `main` auto-deploys to production. Feature work goes through pull requests reviewed and merged by hand, not pushed directly to `main`.
