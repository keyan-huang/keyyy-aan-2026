# Keyan Huang Portfolio Website

This folder is the source of truth for Keyan Huang's portfolio. The code is
organized so global changes, homepage content changes, and project changes have
separate owners.

## Where to edit

| Change                                        | File or folder                                 |
| --------------------------------------------- | ---------------------------------------------- |
| Navigation, contact details, footer copy      | `public/content/site.json`                     |
| Colors, fonts, spacing, radii                 | `public/styles/design-tokens.css`              |
| Shared navigation and footer styles           | `public/styles/site-shell.css`                 |
| Shared React navigation and footer            | `components/shared/`                           |
| Homepage copy, skills, tools, experience      | `content/home.ts`                              |
| Project card title, summary, thumbnail, link  | `content/projects/<project>.ts`                |
| Project card component and styles             | `components/home/`                             |
| Responsive React image component              | `components/shared/responsive-image.tsx`       |
| Shared browser interactions and image sizing  | `public/scripts/`                              |
| Global style imports                          | `app/globals.css`                              |
| Homepage-only layout styles                   | `app/home.css`                                 |
| Performance Discussion Form content and media | `public/performance-discussion-form/`          |
| Dashboard customization research and media    | `public/dashboard-customization-user-testing/` |
| Personal Action Workflow content and media    | `public/paf-redesign/`                         |
| Inactive concepts and source material         | `design-options/assets/`                       |

Each new project should receive one metadata file in `content/projects/` and a
self-contained folder in `public/<project-slug>/`. Add the metadata export to
`featuredProjects` or `additionalProjects` in `content/projects/index.ts`;
the corresponding homepage list will render it.
All homepage project cards place the title, introduction, and action in a left
text column beside the thumbnail on the right. The text and action form a compact
group centered vertically beside the image. Featured cards use a 340px-high
thumbnail area on desktop, with 40px card padding. The title-to-description gap is 16px, and Explore sits 24px
below the description rather than being pushed to the bottom of the image.
Explore buttons fit their text without a minimum width or arrow icon, use compact
14px horizontal padding, and retain a minimum 44px touch target. Their default
style is the filled primary-blue pill. Hovering anywhere on a card adds a
six-pixel soft lift and makes its Explore button pulse between the primary and
hover blues; the neutral card border does not change color.
At 760px and below, the text and action stack above the image. The shared layout
lives in `components/home/project-card.css`; images fit without cropping and
titles wrap naturally on small screens. The Dashboard study retains its 90%
image-width inset. Keep `imageSizes.project` in `public/scripts/responsive-images.js`
in sync with these column widths.
Optional `titleLines` sets an intentional two-line homepage title without changing
image sizing. Mirror these line breaks in `static/index.html` and the case studies'
"More projects" cards.
The PAF project is titled "Re-architecting the End-to-End Personal Action Workflow",
with a break before "Personal Action Workflow" in cards and its case-study heading.
Keep "End-to-End" together using non-breaking hyphens (`\u2011` in TypeScript,
`&#8209;` in HTML) in the homepage, case-study heading, and related-project cards.
The whole phrase can move to the next line, but never breaks at either hyphen.

The React homepage lives in `app/page.tsx`; GitHub Pages publishes
`static/index.html`. Keep their markup and content synchronized. Both use the
same homepage, component, and shared-shell styles.
The introduction uses `components/home/scroll-hero.tsx` in React and matching
markup in the static homepage. `public/scripts/hero-scroll-story.js` owns the
shared scroll behavior. The opening state centers the three authored headline
lines and availability text inside a mirrored 5–2–5 grid of twelve illustrations.
The summary is present but hidden. The copy area stays centered at 50% of the
sticky frame in both states. Scrolling keeps that center fixed,
crossfades the headline and availability out, brings the illustrations into an
evenly spaced organic halo, and reveals only the centered 24px summary.
`text-wrap: pretty` plus a nonbreaking "deeply human" prevents a one-word final
line. Reduced-motion users switch between the two states at the midpoint.
The hero availability line is 16px on desktop, 15px on mobile, and sits 6px
above its normal flow position.
Desktop artwork begins at 120–155px; the final mirrored pairs use matching
88–110px sizes. The opening rows and revealed halo follow shallow mirrored arcs
rather than straight lines. Each illustration uses a slightly different,
slow 5–7 second floating cycle; reduced-motion mode disables that movement.
Mobile scales the same composition without allowing artwork to overlap the
summary column. Keep the artwork data and order synchronized between the React
component and `static/index.html`.
The sticky track uses 2200px/240svh on desktop and 1800px/220svh on mobile.
The animation completes across the first 65% of that distance, leaving the final
35% as a pinned reading interval before Selected Projects.

The homepage loading overlay is rendered by
`components/shared/portfolio-loader.tsx` and matching static markup.
`public/scripts/portfolio-loader.js` tracks the navigation logo, all twelve
critical hero illustrations, and font readiness, updating the progress bar
before fading the overlay out. JavaScript adds the activation class before body
paint; without JavaScript, the loader remains hidden. Reduced-motion mode stops
the loader art swap and removes loader transitions. Five dedicated 400px
thumbnails display at 180px for 2× high-density rendering, reusing the footer's
rotating artwork language without loading the multi-megabyte originals.
Displayed progress starts at 0% and advances against both elapsed time and
settled resources, enforcing a 2.6-second minimum before the explicit blue bar
reaches 100%.
The root layout and static homepage inline the loader's critical white
background and centering styles before external CSS, preventing a dark first
paint while `home.css` downloads. Completion uses a 700ms eased opacity fade
before the overlay becomes hidden.

Selected Projects features the Performance Discussion Form and PAF redesign.
The smaller "Additional Projects" section appears before About Keyan and contains
Dashboard Customization Testing Study, EggV, and Plastic Universe, in that order. Keep both lists
synchronized in `app/page.tsx` and `static/index.html`; their metadata lives in
`content/projects/`. The top navigation contains Work, About, and Contact.
The section retains `#fun`, preserving previously shared anchors.

Additional cards use `ProjectCard` with `compact` enabled: 24px padding,
24px titles, 16px summaries, and 180px-high thumbnail areas with images capped
at 280px wide. The section heading is 32px on desktop and 24px on mobile,
smaller than Selected Projects. On mobile, compact titles reduce to 22px and
thumbnail areas to 140px high. Keep `imageSizes.additionalProject` synchronized
with the compact image sizing; full-resolution originals remain unchanged.

### Plastic Universe

The image-led case study lives in `public/plastic-universe/`; homepage metadata
lives in `content/projects/plastic-universe.ts`. It uses simple text blocks and
image galleries, progressing from secondary research, the Noah Travis persona,
and original branding boards to pencil sketches and character iterations,
finished Plastic Pals posters, infographic development, exhibition concepts, and
the opening night. The shared site shell provides image zoom and navigation.

The content and media come from the
[Figma website section](https://www.figma.com/design/xnLIdFys8xcgk0G1zxYoKH/Portfolio-Design-File?node-id=1693-412).
Images were extracted byte-for-byte from the original raster data embedded in
Figma's SVG export, not captured as canvas screenshots or enlarged exports.
The complete source export remains outside the repository; only the 33 displayed
images belong in `public/plastic-universe/images/`. Keep their native dimensions
and transparency. The source credits Helen Prum for exhibition photography;
photo-credit text and the closing credit paragraph are omitted from the page.
The introductory Team field remains.
The homepage card uses `public/plastic-universe/thumbnail.png`, the original
1734 x 675 PNG export of the
[Figma thumbnail frame](https://www.figma.com/design/xnLIdFys8xcgk0G1zxYoKH/Portfolio-Design-File?node-id=1692-3784).
Its seven characters and white background are shown without cropping. This wide
lineup is exempt from the compact cards' 280px image cap, so it can fill more of
the existing thumbnail area without making the card taller. The case-study hero
remains the exhibition photograph.

Source image indexes in the export (IDs end in `_72_3586`):

- Branding typography, character palette, and supporting palette: 0, 1, 2.

- Character sketches and iterations: 5, 6, 14, 3, 4.
- Early digital cast, in displayed order: 12, 13, 8, 7, 9, 11, 10.
- Finished character posters: 15, 17, 16, 18.
- Infographic process and final artwork: 19, 22, 24.
- Exhibition hero, concepts, wall, panels, and globe: 27, 25, 26, 29, 40, 37, 41, 47.
- Girl touching the globe and opening night: 50, 51, 52.

From "From the page into the room" onward, orientation-matched gallery rows use
proportional column widths to align the full photographs without cropping or
fixed-height letterboxing. Concepts and wide installation shots are paired;
portrait details and the girl touching the globe share a row, followed by the
opening-night pair. These rows stack on mobile. Update the row ratios if those
source photographs change.

Research and persona text follow the Figma narrative: secondary research,
complexity/contamination/consumer habits, and the eight-year-old Noah Travis
persona. These are design inputs, not claims of interviews or usability testing.
The persona and its design implications live in a native, initially collapsed
`details` card titled "Persona - Noah"; its summary retains the `#persona` anchor
and supports keyboard interaction without additional JavaScript. The white card
has a rounded `#3915A2` outline, dark summary text, and a matching accent marker.
The header stays unfilled on hover, and expanded content stays white without a divider.
The branding section displays the original Paralucent/Azo Sans specimen and
palette exports; the portfolio's own typography remains unchanged. Palette
images have a dark neutral backdrop to retain their white labels.

Run `pnpm images:prepare` after changing media. The page intentionally preserves
the original exhibition graphics; the accompanying note distinguishes the design
work from location-specific recycling guidance.

### EggV

The EggV experiment lives in `public/eggv/index.html` with its own
`case-study.css` and the shared site shell. Its copy preserves the Figma summary
with light grammar edits. Its homepage card uses the shared compact card layout,
outline, and blue pill action. Its centered thumbnail
is the original transparent 1512 x 982 PNG exported from the
[EggV Figma cover](https://www.figma.com/design/sGwKpM4WzoCiPoDukfOqS0/EggV?node-id=3815-175),
stored in `public/eggv/thumbnail.png`. It fits the compact thumbnail area
without cropping or distorting the artwork. Both
homepages use the shared responsive-image pipeline. All homepage card actions
are labeled "Explore" and use identical typography, padding, and minimum 44px
touch targets. All React cards use `ProjectCard` and its shared action.
The detail page uses `public/eggv/images/` for the event photos, product screens,
and Toyota award/headquarters photos. The Figma export names map to:

| Figma layer      | Website image                  |
| ---------------- | ------------------------------ |
| `IMG_6789 1`     | `hackathon-event.png`          |
| `image 1`        | `hackathon-team.png`           |
| `Map`            | `charging-map.png`             |
| `maintnance`     | `maintenance.png`              |
| `technical page` | `technical-details.png`        |
| `Advise`         | `vehicle-advice.png`           |
| `IMG_6809 1`     | `toyota-challenge-award.png`   |
| `image 3`        | `toyota-headquarters-team.png` |
| `IMG_1031 1`     | `toyota-hackathon.png`         |

Inspiration and What it does sit side by side, followed by the demo, compact
annotated product screens, and the Toyota invitation story. Photos and product
screens use the shared full-screen image viewer.
The closing, full-width university news card uses the supplied UT Dallas logo
in `public/eggv/images/ut-dallas-logo.png` and the source article's exact title,
without a publication date. It stays one compact horizontal row on desktop and
phones. Linked images are excluded
from the image viewer so clicking the logo opens the article, not a lightbox.

The GIF follows Figma's `demo` flow: `eggv 7` (3808:234), `eggv 5` (3808:59),
then `eggv 6` (3808:142). Native frame exports live in
`design-options/assets/eggv-demo/`; the animation contains no cursor or click
indicators. With FFmpeg available on `PATH`, run
`node scripts/build-eggv-demo.mjs` to regenerate `public/eggv/media/eggv-demo.gif`,
its matching H.264 MP4, and the still poster. Each screen holds for 1.5 seconds,
with short crossfades and a white fade in/out. The page plays the MP4 so that
Pause/Resume freezes the current frame and continues at the same timestamp.
`public/eggv/demo.js` connects both the animation surface and the right-hand
button to playback; reduced-motion users start paused. Native video controls
remain available without JavaScript. Clicking other project images still opens
the full-screen image viewer; clicking the demo now toggles playback instead.
Run `pnpm images:prepare` after changing any media.

The static Performance Discussion Form case study loads the same site settings
and shell styles as the React homepage through `public/scripts/site-shell.js`.
Its `case-study.css` therefore contains only case-study-specific presentation.

The Dashboard Customization Testing Study case study also uses the shared shell.
Its report and test script are HTML in `public/dashboard-customization-user-testing/index.html`;
long-form material uses native expandable sections, with the complete testing
report expanded by default. The hero reuses the inline-drawer prototype image.
Only its homepage thumbnail is inset to 90% of the image area; the study hero
and related-project previews retain their own sizing.
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

## Images and reusable components

- `components/shared/` owns the header, footer, contact menu, artwork, and
  responsive image component. `components/home/` owns homepage cards and galleries.
  Keep reusable UI primitives in `components/ui/`; do not delete them just because
  a current page does not use them.
- Original shared artwork, logos, and portraits live in `public/images/`.
  Personal photos live in `public/images/life-gallery/`. Existing Figma-export
  names are retained so saved asset URLs do not break.
- Each project's screenshots live in `public/<project>/images/`; its animations
  live in `public/<project>/media/`. Preserve the originals when replacing assets.
  Inactive design options remain outside the published tree in `design-options/`.
- `public/generated/images/` is disposable, ignored build output, not an asset
  editing location. `pnpm images:prepare` creates content-hashed, lossless copies
  at native resolution and a dimension/candidate manifest. Every accepted copy
  must match the original's oriented, decoded pixels and ICC profile exactly.
  All images keep their original format. For PNGs, only the existing compressed
  image-data stream is recompressed; every color, transparency, and metadata
  chunk is preserved. JPEGs and animations retain their original encoding.
  The pipeline never resizes source images. If
  lossless encoding is larger, changes pixels, or cannot preserve the source
  dimensions, bit depth, or color profile, the original stays in use.
- Dev/build/static commands prepare variants automatically. The first run encodes
  the images; unchanged images are reused on subsequent runs. Run image preparation
  again after changing an original while a dev server is already running.
- React and static pages use the same responsive sizes and candidates through
  `public/scripts/responsive-images.js`. Keep `src` pointing to the original;
  `srcset` selects a smaller file with the same full resolution. Case-study lightboxes and full-size
  download links still open the originals.
- Hero images load eagerly; offscreen images and GIFs load lazily. Intrinsic
  dimensions reserve space while explicit display sizes and existing CSS remain
  authoritative. GIF timing, colors, and interactions are unchanged.

Static HTML remains readable and editable. `scripts/prepare-static.mjs` adds
responsive attributes to the generated Pages copy; never edit `github-pages/`.
The static audit checks all `srcset` files as well as normal image and link URLs.

## Local preview

Requirements: Node.js 22.13 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Then open the local address shown in the terminal.

Local development uses `vite.local.config.ts` and does not require the hosted
environment's `.openai/hosting.json`. Run `pnpm build:local` to verify this setup.
Before publishing, run `pnpm lint`, `pnpm test`, `pnpm typecheck`,
`pnpm build:local`, and `pnpm audit:static`. GitHub Pages enforces the same checks
before deployment. `pnpm format` keeps authored HTML, CSS, TypeScript, and browser
scripts readable; `pnpm format:check` checks formatting without changing files.
Every header uses the Contact dropdown in `public/scripts/contact-menu.js`,
styled by `public/styles/contact-menu.css`. The React `ContactMenu` component
and the static shell both mount this same implementation using `site.json`.
It uses the native Popover API (Safari 17+, Chrome 114+, Firefox 125+) for
top-layer rendering, click toggling, and outside-click dismissal.

### Hero layout comparison

`design-options/hero-options.html` is a local-only design study showing six hero
directions with compare-all and desktop/mobile controls. It keeps the colorful
shelf and playful halo, explores three clean static compositions, and includes
an interactive scroll story. That story begins with the availability line and
headline surrounded by twelve large illustrations on a loose underlying grid;
scrolling moves the artwork above the text into an evenly spaced, staggered
two-sided halo and reveals the summary without moving the headline vertically.
Mirrored center points balance each left/right pair against the centered hero
and page edges; the halo stays outside the summary column. The study reads the
current homepage copy, uses the original artwork and font tokens, and preserves
the shared Contact menu and testimonial interactions. It does not change the
homepage or enter the normal GitHub Pages build.

To preview it using the generated static site:

```bash
pnpm prepare:static
cp design-options/hero-options.html github-pages/hero-options.html
python3 -m http.server 4173 --bind 127.0.0.1 --directory github-pages
```

Open `http://127.0.0.1:4173/hero-options.html`. Preparing the static site again
removes the preview copy; the source study stays in `design-options/`.

### Project-card hover comparison

`design-options/project-card-hover-options.html` compares three local-only
whole-card hover directions using production project markup: soft lift, edge
charge, and light sweep. Copy it into `github-pages/` after preparing the static
site, then open `/project-card-hover-options.html`. Soft lift is the selected
production direction; the page preserves the other two explorations.

## Production build

```bash
pnpm build
```

The app entry points live in `app/`; editable content and reusable components
live outside them. Shared images live in `public/images/`, while project media
stays inside its project folder. Only files used by the deployed site belong in
`public/`; preserve inactive visual explorations in `design-options/assets/`.
