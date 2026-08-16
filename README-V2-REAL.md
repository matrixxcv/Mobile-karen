# Mobile Karen V2 Real — Supabase-connected build

## What changed
- iPhone catalog pages read products from Supabase instead of `src/data/products.ts`.
- Product details read from Supabase.
- Home featured products read from Supabase.
- Comparison reads from Supabase.
- Accessories page reads from Supabase.
- Admin page can update product price, stock, and active status.
- Existing local product images remain available as fallback/static assets.

## Supabase steps (phone-friendly)
1. In Supabase SQL Editor, create a new query and run `supabase/upgrade-products.sql`.
2. Create another new query and run `supabase/seed-products.sql`.
3. Verify with:
   `select count(*) from public.products;`
   It should return 15.
4. Create `.env.local` in the project root using `.env.example`:
   `VITE_SUPABASE_URL=YOUR_PROJECT_URL`
   `VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_KEY`
5. Do not put a Supabase Secret/Service Role key in `.env.local` or the browser app.

## Local run
`npm install`
`npm run dev`

## Production build
`npm run build`

## Important
Prices are currently seeded as 0 because the original V2 catalog only had a "call for price" placeholder. Set real prices and stock from the Admin page after logging in as the admin account.
