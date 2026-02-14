# Contributing to Tremp Bot

Thank you for your interest in contributing! This guide will help you get started.

## Development Setup

1. Fork the repository and clone your fork:
   ```bash
   git clone https://github.com/<your-username>/tremp-bot.git
   cd tremp-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and add your bot token:
   ```bash
   cp .env.example .env
   ```

4. Run in development mode:
   ```bash
   npm run dev
   ```

5. Build to check for type errors:
   ```bash
   npm run build
   ```

## Coding Conventions

- **Language**: Hebrew is the primary language for all user-facing content. English is the fallback.
- **i18n**: All user-facing strings go through `t(key, locale, params)` in `src/i18n/`. Never hardcode user-facing text.
- **Stop IDs**: Use `snake_case` (e.g., `beit_horon_interchange`).
- **Branch stops**: Must set `hub` to a main-axis stop ID and share that stop's `order` value.
- **TypeScript**: The project uses strict TypeScript. Run `npm run build` before submitting a PR.

## Adding a New Route

1. Create a new file under `src/config/routes/` (e.g., `route90.ts`).
2. Define the route's stops with sequential `order` values. Add branch stops with `hub` references where needed.
3. Update `src/config/index.ts` to import and set the new route as `activeRoute`.

## Adding New Stops to an Existing Route

1. Add the stop to the `stops` array in the relevant route file under `src/config/routes/`.
2. For main-axis stops: assign the next sequential `order` value.
3. For branch stops: set `hub` to the parent main-axis stop ID and use the same `order` value as the hub.

## Submitting Changes

1. Create a feature branch from `master`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure `npm run build` passes.

3. Commit with a clear message describing what and why:
   ```bash
   git commit -m "Add support for Route 90 stops"
   ```

4. Push to your fork and open a Pull Request against `master`.

## Reporting Issues

- Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) for bugs.
- Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) for new ideas.
- Include as much context as possible: steps to reproduce, expected behavior, screenshots if relevant.

## License

By contributing, you agree that your contributions will be licensed under the [AGPL-3.0 License](LICENSE).
