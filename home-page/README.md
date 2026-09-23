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
| Dashboard customization research and media    | `public/dashboard-customization-user-testing/` |
| Inactive concepts and source material          | `design-options/assets/`              |

Each new project should receive one metadata file in `content/projects/` and a
self-contained folder in `public/<project-slug>/`. Add the metadata export to
`content/projects/index.ts`; the homepage project list will render it.
All project cards use a full-width title above their content and a bottom-right
action with equal edge insets. Their shared layout lives in
`components/home/project-card.css`; titles wrap naturally on small screens.
Optional `titleLines` sets an intentional two-line homepage title without changing
image sizing. Mirror these line breaks in `static/index.html` and the case studies'
"More projects" cards.

The React homepage lives in `app/page.tsx`; GitHub Pages publishes
`static/index.html`. Keep their markup and content synchronized. Both use the
same homepage, component, and shared-shell styles.

Design Experiments is temporarily hidden in both `app/page.tsx` and
`static/index.html`; its content and styles are retained. To restore it, remove
`hidden` from both `#fun` sections and restore the Experiments navigation entry
in `public/content/site.json` and the static homepage header. The balloon stays
decorative while its destination is hidden and becomes a link again when restored.

The static Performance Discussion Form case study loads the same site settings
and shell styles as the React homepage through `public/scripts/site-shell.js`.
Its `case-study.css` therefore contains only case-study-specific presentation.

The Dashboard Customization Study case study also uses the shared shell.
Its report and test script are HTML in `public/dashboard-customization-user-testing/index.html`;
long-form material uses native expandable sections, with the complete testing
report expanded by default. The hero reuses the inline-drawer prototype image.
Keep its source discrepancy notes with the report
until the original counts are reconciled. Prototype access credentials must not
be added to the page or its images. Original Figma exports are archived outside
the website; only display assets belong in its `images/` folder.

Each case study ends with a separate "More projects" section linking to the other
two studies, using only their titles and existing hero images. Keep these links
in sync when projects change. Presentation is shared in
`public/styles/related-projects.css`. These cards sit outside `.case-study` so
their images navigate to projects rather than opening the case-study lightbox.
The section shares the footer background and removes the gap before the adjacent
footer; this treatment does not affect the homepage footer.

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
