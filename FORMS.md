# Forms — current state and what's needed to go live

There are 7 forms across the site: jobseeker (`jobs.html`), volunteer (`volunteer.html`), partner
(`partner.html`), mentorship (`mentorship.html`), event interest (`events.html`), contact
(`contact.html`), and the consent checkbox pattern is shared across all of them.

## What already works

- Required-field validation, inline error messages, and focus-jump to the first error.
- A honeypot field (`display:none`-style, visually hidden) that silently drops likely-bot submissions.
- A visible success message after a valid submission.
- Every submit button and field meets the 48px minimum touch-target size.

## What's still needed before launch

**Nothing is actually sent anywhere yet.** `assets/js/main.js` intentionally stops short of a real
network call — look for this block in the `submit` handler:

```js
/* No backend is wired yet — this simulates success locally.
   Replace this block with a real fetch() call to your API/endpoint. */
form.reset();
```

To make forms functional, pick one of these paths:

1. **Simple / fastest:** point each form at a form-backend service (e.g. Formspree, Web3Forms, or a
   similar hosted endpoint) — swap the comment block above for a `fetch()` POST to that service's URL,
   still using the existing validation and success-message logic.
2. **Your own backend:** if the Node/Express + PostgreSQL system already built for this project is
   deployed, point each form's `fetch()` call at the relevant API route (e.g. `/api/volunteers`,
   `/api/jobseekers`) and pass `Content-Type: application/json` with the form's field values.
3. **Google Forms (matches the previous site's approach):** simplest to stand up again quickly, but
   loses the custom validation/success UI already built here — only use this as a stop-gap.

Whichever you choose, also add basic **server-side** validation and rate limiting — the client-side
checks in `main.js` improve the experience but don't stop a determined bad actor from posting directly
to whatever endpoint you wire up.

## Spam protection

The honeypot field is a first line of defence, not a complete one. Once a real backend is wired up,
also consider a lightweight CAPTCHA (e.g. Cloudflare Turnstile) on the public-facing forms most likely
to attract spam: contact, volunteer, and event interest.
