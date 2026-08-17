# SmartBite Demo

A static, client-only demo rebuilding the front end of [SmartBite](https://github.com/Emberizaelysee/SmartBite) — a restaurant ordering & management platform. Built to be safely embeddable as a live demo from [elichaamhanna.netlify.app](https://elichaamhanna.netlify.app/projects/smartbite.html) without exposing any real backend, database, or credentials.

This is **not** the real SmartBite app and does not touch its source repo. It's a from-scratch static rebuild covering the same pages and flows, with every backend interaction mocked:

- **Home / Menu** — browse dishes by category, search, add to cart
- **Cart / Checkout** — mock order placement (payment fields are decorative and never read)
- **Reservations** — mock table booking
- **Reviews** — read and post reviews (stored in `localStorage` only)
- **Sign in / Sign up / Forgot password** — mock auth: any email "signs in", nothing is a real account, password fields are decorative and never read
- **Profile** — mock order & reservation history for the current browser
- **Dashboard** — mock admin view (menu management, recent orders, stats) — sign in via the "Sign in as demo admin" button
- **Chat assistant** — rule-based canned responses, not a real AI call

No backend, no database, no real email, no real payment processing. All "data" lives in the browser's `localStorage` and resets if you clear it.

Hosted on GitHub Pages and iframed from the portfolio site's SmartBite project page — kept in its own repo (rather than inside the portfolio site) so the portfolio site's strict `Content-Security-Policy` / `X-Frame-Options: DENY` headers don't need to be loosened to allow framing.

## Run locally

```bash
python3 -m http.server 8000
```
