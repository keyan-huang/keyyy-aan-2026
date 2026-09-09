# Keyan Huang Portfolio Website

This folder contains the standalone source for Keyan Huang's 2026 portfolio website.

It is intentionally separated from the Performance Discussion Form case study stored at the repository root.

## Local preview

Requirements: Node.js 22.13 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Then open the local address shown in the terminal.

Local development uses `vite.local.config.ts` and does not require the hosted
environment's `.openai/hosting.json`. Run `pnpm build:local` to verify this setup.
The Connect dropdown uses the shared Base UI component in `components/ui/`.

The three project images (`imgImage164.png`, `imgImage168.png`, `imgImage167.png`)
and portrait (`imgImg28071.png`) are empty in the repository and require original
image files before they can display.

## Production build

```bash
pnpm build
```

The portfolio source lives in `app/`, and its images live in `public/images/`.
