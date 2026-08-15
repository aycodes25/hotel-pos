# Tawnystay

A boutique hotel booking + restaurant reservation/ordering platform, built
with Next.js (App Router), TypeScript, Prisma, and Tailwind CSS.

"Tawny" is the warm sandy-brown hue that anchors the brand — the whole UI is
built around `#f5f5dc` (cream) and `#f4a460` (sandy brown).

## Features

- **Room booking** — browse room types, check live availability by date,
  book, view/cancel bookings.
- **Restaurant menu & ordering** — browse dishes by category, cart, checkout
  for dine-in / takeaway / delivery.
- **Table reservations** — pick a date/time/party size, get matched to an
  available table in real time.
- **Customer account** — one dashboard for bookings, reservations, and orders.
- **Admin/staff dashboard** — HQ overview (arrivals, occupancy, pending
  orders, revenue), plus CRUD for room types/rooms, tables, menu, and status
  workflows for bookings/reservations/orders.
- **Auth** — email/password with hashed passwords (bcrypt) and signed JWT
  session cookies (jose). Roles: `CUSTOMER`, `STAFF`, `ADMIN`.

## Tech stack

- Next.js 16 (App Router, Server Actions, Turbopack)
- TypeScript
- Prisma ORM — **SQLite** for local dev (zero setup), portable to
  **PostgreSQL** for production (see below)
- Tailwind CSS v4
- Zod for validation

## Getting started

```bash
npm install
cp .env.example .env      # already done for you locally; edit AUTH_SECRET for prod
npx prisma db push        # create the SQLite database from the schema
npm run db:seed           # seed demo rooms, tables, menu, and users
npm run dev
```

Visit http://localhost:3000.

### Demo accounts (from the seed script)

| Role   | Email                  | Password    |
| ------ | ----------------------- | ----------- |
| Admin  | admin@tawnystay.com     | Admin@123   |
| Staff  | staff@tawnystay.com     | Admin@123   |
| Guest  | guest@tawnystay.com     | 

## Project structure

```
prisma/schema.prisma       Data model (User, RoomType, Room, Booking,
                            RestaurantTable, Reservation, MenuCategory,
                            MenuItem, Order, OrderItem, Payment)
prisma/seed.ts              Demo data
src/app/                    Routes (public site, /account, /admin)
src/components/             UI primitives + feature components
src/lib/actions/            Server Actions (auth, bookings, reservations,
                             orders, admin CRUD)
src/lib/auth.ts             Session cookies, password hashing, role guards
src/lib/availability.ts     Room/table availability queries
src/lib/enums.ts            Shared string-union "enums" (see below)
```

## Design notes

- **Enums as strings, not Prisma enums.** SQLite doesn't support native
  enum or array columns, so status/role/type fields are plain `String`
  columns validated against unions defined once in `src/lib/enums.ts`
  (used both by Zod schemas and the UI). `amenities`/`images` on
  `RoomType` are JSON-encoded strings for the same reason. This means the
  **same schema works unchanged on PostgreSQL** — just flip the
  datasource provider (see below) if you want native arrays/enums back.
- **No real payment gateway.** Bookings/orders are created with a
  `Payment` row in `PENDING` status and customers pay at the property /
  on collection / on delivery. Wire up Stripe (or similar) by replacing
  the payment creation in `src/lib/actions/{bookings,orders}.ts`.
- **Availability is checked server-side at booking time**
  (`src/lib/availability.ts`) by looking for date/time overlaps against
  active bookings/reservations, so two guests can't double-book the same
  room or table.

## Moving to PostgreSQL for production

1. In `prisma/schema.prisma`, change the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL` to your Postgres connection string.
3. Run `npx prisma db push` (or set up `prisma migrate` for versioned
   migrations).

No application code changes are required — every "enum" and list field is
already a plain string/JSON, so it round-trips identically on both
databases.
