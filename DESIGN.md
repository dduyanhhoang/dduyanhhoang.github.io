---
name: The Preprint
description: A personal link hub set as an arXiv-style article — Computer Modern on white paper, nothing large.
colors:
  paper: "#ffffff"
  ink: "#1a1a1a"
  faint: "#565656"
  rule: "#c9c9c9"
  link: "#0b3c8c"
  mark: "#fdf2b0"
  paper-dark: "#14161a"
  ink-dark: "#e6e4de"
  faint-dark: "#a5a29a"
  rule-dark: "#3a3d44"
  link-dark: "#8fb6ee"
  mark-dark: "#46421f"
typography:
  title:
    fontFamily: "CMU Serif, Latin Modern Roman, Georgia, serif"
    fontSize: "clamp(1.5rem, 1.25rem + 1.3vw, 1.95rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.005em"
  headline:
    fontFamily: "CMU Serif, Latin Modern Roman, Georgia, serif"
    fontSize: "1.12em"
    fontWeight: 700
    lineHeight: 1.55
  body:
    fontFamily: "CMU Serif, Latin Modern Roman, Georgia, serif"
    fontSize: "clamp(1rem, 0.95rem + 0.25vw, 1.075rem)"
    fontWeight: 400
    lineHeight: 1.55
  abstract:
    fontFamily: "CMU Serif, Latin Modern Roman, Georgia, serif"
    fontSize: "0.925em"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "CMU Serif, Latin Modern Roman, Georgia, serif"
    fontSize: "0.86em"
    fontWeight: 400
    lineHeight: 1.55
  footnote:
    fontFamily: "CMU Serif, Latin Modern Roman, Georgia, serif"
    fontSize: "0.82em"
    fontWeight: 400
    lineHeight: 1.6
  mono:
    fontFamily: "CMU Typewriter, ui-monospace, monospace"
    fontSize: "0.9em"
    fontWeight: 400
rounded:
  none: "0"
spacing:
  hair: "0.35rem"
  xs: "0.5rem"
  sm: "0.55rem"
  md: "0.9rem"
  touch: "0.62rem"
  block: "clamp(2rem, 6vh, 3rem)"
  footnote-gap: "clamp(2.5rem, 8vh, 4rem)"
components:
  reference-row:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "0"
  reference-row-touch:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0.62rem 0"
  reference-url:
    textColor: "{colors.link}"
    typography: "{typography.mono}"
  reference-number:
    textColor: "{colors.faint}"
    typography: "{typography.body}"
  colophon:
    textColor: "{colors.faint}"
    typography: "{typography.footnote}"
---

# Design System: The Preprint

## Overview

**Creative North Star: "The Preprint"**

The page is set as the artifact its audience already reads ten of a week: a single-column LaTeX article on white paper. A title block, an abstract at a narrowed measure, a numbered section, a hanging-indent bibliography, a footnote rule with a colophon under it. Nothing is a card, nothing is a button, nothing is a hero. The credibility comes from the form being genuinely the form, not a skin quoting it.

Density is a document's density, not an interface's: the whole surface is one 36rem measure centred in the viewport, roughly 856 CSS px tall on desktop, and it reads top to bottom in one pass. Depth does not exist here — a sheet of paper has no z-axis — and neither does motion, imagery or iconography. The one non-black ink is the hyperref blue, and it appears only on the seven URLs. The build refuses display scale outright: the largest type on the page is the title at 1.95rem, under twice body size.

The confirmed anti-reference is the avatar-and-button-stack every link hub ships — a round profile photo over a column of pill buttons with brand-coloured glyph icons. Also rejected, and fully deleted rather than refactored: the prior dark indigo glass / particle-network / gradient-text identity, and an intermediate two-ink risograph poster direction. Neither leaves a token behind.

**Key Characteristics:**
- Computer Modern, self-hosted and subset — no system display face, no webfont CDN
- One accent ink (hyperref blue), on URLs only
- No image, no icon, no shadow, no motion, no radius
- Article scale: nothing exceeds ~1.8× body size
- Justified abstract, hanging-indent references, real footnote rule
- Print is a first-class rendering, not an afterthought

## Colors

Two inks on paper plus one hyperref blue — the palette of a printed page, with a hand-computed dark counterpart.

### Primary
- **Hyperref Blue** (`{colors.link}`): the single chromatic ink. It carries URLs inside reference rows, the focus ring, and nothing else. Measured 10.30:1 on paper. Never a background, never a fill.

### Neutral
- **Paper** (`{colors.paper}`): the page. It is the only background in the system; no surface ever sits on another surface.
- **Ink** (`{colors.ink}`): body text, title, section headings, reference names and numbers' host row. Measured 17.40:1 on paper — near-black, not black, the way ink sits on stock.
- **Faint Ink** (`{colors.faint}`): the metadata register — dateline, reference numbers, colophon. Measured 7.34:1; quiet but never decorative-grey.
- **Rule** (`{colors.rule}`): hairline only. Its sole appearance is the 1px footnote rule above the colophon.
- **Highlighter** (`{colors.mark}`): `::selection` background. A yellow marker on paper, so even the browser's own affordance stays in-world.

### Dark scheme
The `prefers-color-scheme: dark` set (`paper-dark` / `ink-dark` / `faint-dark` / `rule-dark` / `link-dark` / `mark-dark`) is a full re-inking, not a filter: warm-grey paper, warm off-white ink, a lightened hyperref blue. `color-scheme: light dark` is declared so the canvas, scrollbars and form surfaces follow.

**Unverified — reasoned, never rendered.** The dark palette has never been rendered or captured. Its contrast was checked by hand only: 14.25 / 7.10 / 8.71 for ink, faint and link on dark paper. Treat those three numbers as arithmetic, not as observation.

### Named Rules
**The One Blue Rule.** The hyperref blue appears on URL text and the focus ring. It never fills, never bounds, never headlines. If a new element wants the blue, it is asking to be a link.

**The Single Surface Rule.** There is exactly one background colour on the page. Any element that needs its own background is out of world.

## Typography

**Body Font:** CMU Serif (Computer Modern Roman) — with Latin Modern Roman, Georgia, serif
**Italic:** CMU Serif italic, used for reference names only
**Mono Font:** CMU Typewriter Text — with ui-monospace, monospace

**Character:** Computer Modern is the face of the preprint; using it is the entire argument of the page. It is self-hosted and subset from upstream at build time (`npm run fonts` → `scripts/subset-fonts.mjs`), four faces reduced to printable ASCII plus `©·—–…''""×÷°`, shipping ~87KB total against 810KB upstream. All four are preloaded in `index.html` with `font-display: swap`.

### Hierarchy

The ramp is deliberately compressed and almost entirely *below* body size — LaTeX steps down from the body measure far more often than up.

- **Title** (700, `clamp(1.5rem, 1.25rem + 1.3vw, 1.95rem)`, 1.25, +0.005em): the name, centred, once per page. The ceiling of the system.
- **Headline** (700, 1.12em): numbered section heading, with the number set in its own `.secnum` span at 0.55em right margin.
- **Body** (400, `clamp(1rem, 0.95rem + 0.25vw, 1.075rem)`, 1.55): author line, reference names, everything unmarked. Measure capped at 36rem.
- **Abstract** (400, 0.925em, justified with `hyphens: auto`): narrowed to 30rem inside the 36rem block; second and later paragraphs take a 1.5em first-line indent, no blank-line separation. Its `Abstract` heading is 700 at 1em — bold but not larger.
- **Label** (400, 0.86em, faint): the dateline slot under the author line.
- **Footnote** (400, 0.82em, 1.6, faint): the colophon.
- **Mono** (400, 0.9em, `word-break: break-word`): URLs only, with tabular numerals on reference numbers.

### Named Rules
**The Nothing-Is-Large Rule.** No type on any surface exceeds the title's 1.95rem ceiling, and no new element may introduce a display step. Hierarchy is made with weight, centring, measure and white space — not size.

**The Two-Face Rule.** Serif for prose, typewriter for machine strings (URLs, identifiers, code). A third family is a defect.

**The Justified-Measure Rule.** Justification with hyphenation is allowed only in the abstract, and only above 460px; below that the abstract sets ragged-right, because a 30rem justify does not exist on a phone.

## Layout

One centred column, no grid: `.paper` is `max-width: 36rem` with `margin-inline: auto` and fluid padding `clamp(2.5rem, 9vh, 5rem)` top / `clamp(1.35rem, 6vw, 2rem)` sides / 3rem bottom. There are no breakpoints in the layout sense — the column simply stops growing. Vertical rhythm comes from viewport-aware block gaps: `clamp(1.75rem, 5vh, 2.5rem)` before the abstract, `clamp(2rem, 6vh, 3rem)` before a section, `clamp(2.5rem, 8vh, 4rem)` before the footnote rule. Within a block the scale is small and fixed: 0.35 / 0.5 / 0.55 / 0.9rem.

Reference rows are a two-column baseline-aligned grid, `2.4rem 1fr` with a 0.35rem gutter, narrowing to `2rem 1fr` under 460px — this is the hanging indent, done as grid rather than as text-indent so the number column stays a true column.

Density switches on input, not on width alone. At `(pointer: coarse), (max-width: 460px)` the inter-row margin collapses to zero and is replaced by 0.62rem block padding on the row itself, so the tap target grows without changing the printed rhythm. Measured pitch: 35.3 CSS px desktop, 46.8 CSS px mobile (target ≥44).

**Unverified — reasoned, never rendered.** Only the `max-width: 460px` arm of that query has been exercised by a capture. The `pointer: coarse` arm — a large touch screen above 460px — is reasoned, not observed. Phones are covered by width regardless.

The desktop page is ~856 CSS px inside a 900px viewport: one screen, no scroll. At 390px the colophon opens at ~920 CSS px, just past an 844px fold — deliberate, since the seventh reference should be the last thing above it.

### Print
Printing is a native rendering of this artifact, not a stylesheet afterthought: `@page { margin: 25mm 22mm }`, the column released to full page width with zero padding, reference padding tightened to 0.15rem, and `break-inside: avoid` on references, sections and abstract. The print `:root` re-declares black ink on white paper with black links, and `paper.css` is imported after `base.css` so it overrides the dark-scheme `:root` by source order — a dark-scheme visitor prints on white.

**Unverified — reasoned, never rendered.** No print preview has been produced. The cascade above is reasoned from source order, not observed.

### Named Rules
**The One Measure Rule.** Every element lives inside the same 36rem column. Narrowing (the abstract's 30rem) is a typographic step; widening is not available.

**The Thumb-Pads-The-Row Rule.** Touch density is bought with padding on the row, never with extra margin between rows — the printed rhythm has to survive the phone.

## Elevation & Depth

There is no elevation. No `box-shadow`, no `filter`, no `transform`, no translucency, no layered surface exists anywhere in the build, and no transition or animation of any kind is declared. Depth is not simulated because the world is a sheet of paper, which has none. Separation is achieved by white space, by the single 1px footnote rule, and by the faint ink register.

### Named Rules
**The No-Z-Axis Rule.** Paper has one plane. A shadow, a lifted card, a blur or a modal overlay is out of world here regardless of how subtle it is.

**The One Rule Rule.** The page draws exactly one line: the 33%-wide (max 12rem) hairline above the colophon, the LaTeX footnote rule. Dividers, borders and underlines-as-decoration are not part of the vocabulary; the only other underline in the system is a link hover.

## Shapes

There is no shape language, and that is the language. Zero radius everywhere — no element declares one. No borders, no boxes, no outlines except the 2px focus ring at 2px offset. The only drawn geometry on the entire page is the footnote rule and the invisible two-column grid of the reference list. Silhouette is made entirely by the ragged bottom edge of justified text and the alignment of a hanging indent.

## Components

### Reference Row (signature component)
The page's only interactive element, and the whole routing mechanism. A reference row is a bibliography entry that happens to be a link.

- **Structure:** `<li>` → `<a class="ref">` containing `[n]` in a faint tabular-numeral column, then the destination name in italic followed by the bare URL in typewriter.
- **Shape:** none — no radius, no background, no border, at any state.
- **Color:** row text in ink, number in faint ink, URL in hyperref blue.
- **Hover:** the row itself never underlines; only the URL underlines, at 0.18em offset. hyperref colours the URL, so hover marks the URL — but the whole row is the anchor, because most arrivals are a thumb.
- **Focus:** 2px hyperref-blue outline at 2px offset (inherited from the global `:focus-visible`).
- **Density:** 35.3px pitch by mouse; 46.8px pitch on coarse pointer or under 460px.
- **Content form:** the URL is always spelled out in full, never masked behind label text. A printed reference has to be re-typeable off paper.

### Title Block
Centred. Name at title scale, then an author line at body scale, then a dateline in faint ink. The dateline carries a place, not a date: a permanent address should not age, so the LaTeX `\date` is deliberately left empty. The affiliation slot is empty by a recorded product decision (see PRODUCT.md Positioning), not by design rule.

### Abstract
A titled, bold-`Abstract`-headed block at 0.925em, narrowed to 30rem, justified with hyphenation, subsequent paragraphs indented 1.5em with no blank line. It is the page's argument in one paragraph.

### Colophon
Footnote-scale faint text under the system's single hairline, generated by a `::before` block on the element itself. Carries copyright and the typographic credit.

### Links (global)
Undecorated hyperref blue at rest, underlined at 0.18em offset on hover. No visited state, no icon, no external-link marker.

## Do's and Don'ts

### Do:
- **Do** keep every new element inside the single 36rem measure, and use the abstract's 30rem narrowing as the only permitted step inward.
- **Do** set machine strings — URLs, identifiers, DOIs — in CMU Typewriter at 0.9em, spelled out in full.
- **Do** carry new colour needs back to the six existing inks; add a token only if the page genuinely gains a register, and re-ink the dark scheme in the same commit.
- **Do** buy touch density with block padding on the row (0.62rem) under `(pointer: coarse), (max-width: 460px)`, leaving margins at zero.
- **Do** re-run `npm run fonts` when new glyphs enter the copy — the subsets only contain printable ASCII plus `©·—–…''""×÷°`, and an unsubsetted character falls back to Georgia.
- **Do** treat print as a shipping rendering: any new block gets a `break-inside` decision.
- **Do** state a claim at body scale. This page has no promotional register to escalate into.

### Don't:
- **Don't** introduce a display step. The title's 1.95rem is the ceiling for every current and future surface.
- **Don't** add a shadow, a lifted card, a blur, a gradient or a transform. There is no z-axis in this world.
- **Don't** ship an icon, a glyph font, an avatar, or a brand logo mark — including on the link rows, where every competitor puts them.
- **Don't** animate. No transition, no reveal-on-scroll, no motion of any kind is declared in this build, and the page is one screen tall on desktop.
- **Don't** mask a URL behind label-only text, or replace the `[n]` reference numbers with bullets, dashes or icons.
- **Don't** use the hyperref blue as a fill, a border or a heading colour.
- **Don't** add a second background surface — no cards, no panels, no sections with their own paper.
- **Don't** use a system font stack for anything visible; the four Computer Modern faces are the identity.
- **Don't** justify text anywhere but the abstract, and never below 460px.
