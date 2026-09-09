# Keyan Huang Portfolio Website

This folder is the source of truth for Keyan Huang's portfolio. The code is
organized so global changes, homepage content changes, and project changes have
separate owners.

## Where to edit

| Change                                        | File or folder                        |
| --------------------------------------------- | ------------------------------------- |
| Navigation, contact details, footer copy      | `public/content/site.json`            |
| Colors, fonts, spacing, radii                 | `public/styles/design-tokens.css`     |
| Shared navigation and footer styles           | `public/styles/site-shell.css`        |
| Shared React navigation and footer            | `components/shared/`                  |
| Homepage copy, skills, tools, experience      | `content/home.ts`                     |
| Project card title, summary, thumbnail, link  | `content/projects/<project>.ts`       |
| Project card component and styles             | `components/home/`                    |
| Global style imports                          | `app/globals.css`                     |
| Homepage-only layout styles                   | `app/home.css`                        |
| Performance Discussion Form content and media | `public/performance-discussion-form/` |
| Inactive concepts and source material          | `design-options/assets/`              |

Each new project should receive one metadata file in `content/projects/` and a
self-contained folder in `public/<project-slug>/`. Add the metadata export to
`content/projects/index.ts`; the homepage project list will render it.

The static Performance Discussion Form case study loads the same site settings
and shell styles as the React homepage through `public/scripts/site-shell.js`.
Its `case-study.css` therefore contains only case-study-specific presentation.

Use `status: 'draft'` for a project without a published case study and
`status: 'published'` with an `href` when its page is ready.

## Local preview

Requirements: Node.js 22.13 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Then open the local address shown in the terminal.

Local development uses `vite.local.config.ts` and does not require the hosted
environment's `.openai/hosting.json`. Run `pnpm build:local` to verify this setup.
Before publishing, run `pnpm lint`, `pnpm build:local`, and `pnpm audit:static`.
GitHub Pages enforces the same checks before deployment.
Every header uses the Contact dropdown in `public/scripts/contact-menu.js`,
styled by `public/styles/contact-menu.css`. The React `ContactMenu` component
and the static shell both mount this same implementation using `site.json`.
It uses the native Popover API (Safari 17+, Chrome 114+, Firefox 125+) for
top-layer rendering, click toggling, and outside-click dismissal.

## Production build

```bash
pnpm build
```

The app entry points live in `app/`; editable content and reusable components
live outside them. Shared images live in `public/images/`, while project media
stays inside its project folder. Only files used by the deployed site belong in
`public/`; preserve inactive visual explorations in `design-options/assets/`.
