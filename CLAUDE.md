# Tremp Bot

A Telegram ride-sharing bot for Route 443 (Israel), connecting drivers and passengers along the route.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Bot framework**: Telegraf v4
- **Database**: better-sqlite3 (local SQLite)
- **Date/time**: dayjs
- **Dev**: tsx for development, tsc for production build

## Commands

- `npm run dev` — Run in development mode (tsx)
- `npm run build` — Compile TypeScript
- `npm start` — Run compiled JS

## Project Structure

```
src/
├── index.ts                 # Entry point: loads env, inits DB, launches bot
├── bot/
│   ├── bot.ts               # Bot setup, command & callback routing
│   ├── commands/             # Command handlers (start, drive, ride, myrides)
│   └── conversations/        # Multi-step conversation flows (rideFlow)
├── config/
│   ├── index.ts             # Active route config, match window, helpers
│   └── routes/route443.ts   # Route 443 stops and directions
├── db/
│   ├── connection.ts        # SQLite connection
│   ├── schema.ts            # Table creation (rides, user_prefs)
│   └── rides.ts             # Ride CRUD and user preferences
├── i18n/
│   ├── index.ts             # Translation function t(key, locale, params)
│   ├── he.ts                # Hebrew strings (default)
│   └── en.ts                # English strings
├── matching/matcher.ts      # Matches riders with drivers
├── models/types.ts          # TypeScript interfaces
└── utils/time.ts            # Time utilities
```

## Key Concepts

- **Route-based**: The bot serves a single active route (currently Route 443) with ordered stops and two directions (eastbound/westbound).
- **Roles**: Users are either `driver` or `passenger`.
- **Matching**: Drivers and passengers are matched by route, direction, compatible stops, and a configurable time window (default 15 min).
- **i18n**: Hebrew is the default locale. All user-facing strings go through `t(key, locale, params)`. Fallback chain: requested locale → Hebrew → raw key.
- **Conversation flow**: Multi-step inputs (stop selection, time, seats) use an in-memory session map — not persisted across restarts.
- **Database**: Two tables — `rides` (ride offers/requests) and `user_prefs` (locale preference).

## Environment

- `BOT_TOKEN` — Telegram bot token (required, loaded from `.env`)

## Conventions

- Hebrew is the primary language for user-facing content.
- Stop IDs use snake_case (e.g., `ben_shemen`, `beit_horon_interchange`).
- Direction is derived from stop order, not user-selected.
- Route configs are separate files under `src/config/routes/`.
