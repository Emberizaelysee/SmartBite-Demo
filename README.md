# SmartBite Demo

A read-only, static demo of [SmartBite](https://github.com/Emberizaelysee/SmartBite) — a restaurant ordering & management platform. Unlike a rebuild, this **is the real SmartBite frontend** (same HTML structure, CSS, and client-side JS, copied as-is), with only its backend calls swapped for a client-side mock so it's safe to host publicly with no server, no database, and no real credentials behind it.

## How it works

The real frontend already talks to its PHP backend exclusively through `fetch()` calls and classic `<form>` submissions to `Backend/api/*.php` endpoints. This demo adds exactly one extra file, `js/demo-shim.js`, which:

- Intercepts `fetch()` calls to those endpoints and answers with realistic mock JSON/HTML (matching the real API's exact response shapes) from `js/demo-data.js` + `js/demo-store.js`, backed by `localStorage`.
- Intercepts the same `<form>` submissions the real pages already use for cart/checkout/auth/reviews/reservations, since a static site can't run PHP.
- Leaves `auth.js`, `auth_navbar.js`, `chatbot.js`, `dashboard.js`, `profile.js`, `reservation.js`, and `review.js` completely untouched — they run exactly as they do in the real app.

No backend, no database, no real accounts, no real payments, no real email, no real AI call. Everything "written" (orders, reservations, reviews, accounts) lives only in your browser's `localStorage` and resets if you clear it.

## Pages

Home/menu, full menu with category & search, cart, checkout, order confirmation, reservations, reviews, sign in/up, forgot password, a customer profile (orders/reservations/reviews/settings), and an admin dashboard (menu, orders, tables, reservations, reviews, users) — sign in as `admin@smartbite.com` to reach it. Any email works for sign-in; password fields are decorative and are never read.

Hosted on GitHub Pages and iframed from the portfolio site's SmartBite project page — kept in its own repo rather than inside the portfolio site so the portfolio site's strict `Content-Security-Policy` / `X-Frame-Options: DENY` headers don't need to be loosened to allow framing.

## Run locally

```bash
python3 -m http.server 8000
```
