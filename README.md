# Tremp Bot

A Telegram ride-sharing bot for Route 443 (Israel), connecting drivers and passengers along the route.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

## About

**Tremp** (Hebrew for "hitchhike") is a Telegram bot that matches drivers and passengers traveling on Route 443 between the Modi'in area and Jerusalem. Drivers offer rides, passengers request them, and the bot automatically finds compatible matches based on route segments, stop compatibility, and departure times.

## Features

- **Hub/Branch stop model** — Supports branching routes (terminal splits, off-ramps) with strict destination matching
- **Two-phase matching** — Segment overlap on the main axis + strict branch compatibility
- **Bilingual** — Hebrew (default) and English, with full i18n support
- **Lightweight storage** — Local SQLite database via better-sqlite3
- **Configurable routes** — Route definitions are separate config files, easy to add new routes

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm
- A [Telegram Bot Token](https://core.telegram.org/bots#how-do-i-create-a-bot) from @BotFather

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/UrielOfir/tremp-bot.git
   cd tremp-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (see `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Telegram bot token.

4. Run in development mode:
   ```bash
   npm run dev
   ```

   Or build and run in production:
   ```bash
   npm run build
   npm start
   ```

## Bot Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message and language selection |
| `/drive` | Offer a ride as a driver |
| `/ride` | Request a ride as a passenger |
| `/myrides` | View your active rides |
| `/cancel <id>` | Cancel a ride |
| `/lang` | Change language |

## Architecture

The bot serves a single route (currently Route 443) with an ordered sequence of stops. Stops can be:

- **Main-axis stops** — Sequential positions along the route (e.g., junctions on Route 443)
- **Branch stops** — Off-ramps or terminal splits that reference a main-axis hub (e.g., "Route 6 North" branches off "Mitspe Modi'in Junction")

Matching is a two-phase process:
1. **Segment overlap** — Does the driver's route cover the passenger's route? (compared using hub-resolved stop orders)
2. **Branch compatibility** — If the passenger needs a specific branch, the driver must be going to that exact branch

For full technical details, see [CLAUDE.md](CLAUDE.md).

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
