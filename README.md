# Leixer Molina — Portafolio

Personal portfolio built with [Astro](https://astro.build) (static output), TypeScript (strict) and
Tailwind CSS v4. Content comes from the CV and is stored in Astro content collections.

## Requirements

- Node.js 22.12 or newer (LTS recommended)

## Commands

| Command            | What it does                                             |
| ------------------ | -------------------------------------------------------- |
| `npm install`      | Install dependencies                                     |
| `npm run dev`      | Start the dev server at `http://localhost:4321`          |
| `npm run check`    | Type-check Astro and TypeScript files (`astro check`)    |
| `npm run build`    | Type-check and build the static site into `dist/`        |
| `npm run preview`  | Serve the production build locally                       |
| `npm run test:e2e` | Build, serve and run the Playwright E2E suite (Chromium) |

First E2E run: install the browser with `npx playwright install chromium`.

## Where to change things

- **Visual identity** (colors, fonts, radii, shadows, glows, gradients): `src/styles/tokens.css` only.
  The identity is "cinematic": a near-black blue-slate dark theme (the default when the visitor has
  no stored choice) with cold steel-blue light and ember accents, plus a lighter "daylight" variant
  under `:root[data-theme='light']`. Tokens are exposed through Tailwind's `@theme`, and components
  use semantic utilities only, so editing the token values re-themes the site:
  - colors: `bg`, `surface`, `surface-alt`, `text`, `muted`, `primary` (cold light), `accent`,
    `ember` / `on-ember` (calls to action), `border`, `border-strong`, `glow-cold`, `glow-ember`, `smoke`
  - type: `--font-sans` (Inter), `--font-display` (Oswald, condensed uppercase headings),
    `--tracking-display`, `--tracking-eyebrow`
  - shape and light: `--radius-card`, `--radius-button`, `--shadow-card`, `--shadow-glow-cold`,
    `--shadow-glow-ember`
  - atmosphere (plain CSS variables read by the `bg-atmosphere`, `bg-vignette`, `bg-grain`,
    `bg-ring-gradient`, `bg-section-glow` and `bg-rule` utilities in `global.css`):
    `--gradient-*`, `--texture-grain`, `--grain-opacity`, `--glow-*-strength`
- **CV content**: `src/content/`
  - `profile.json` — name, title, summary, photo (`src/assets/profile.png`), contact, languages and
    SEO text
  - `experience/*.md` — one file per position (`end: null` means current)
  - `education.json`, `certifications.json`, `skills.json`
  - `projects.json` — the "Proyectos" cards: title, summary, highlights, stack, number of automated
    tests, GitHub `repo` (`owner/name`), `repoUrl` and the optional live report (`reportUrl`,
    `reportLabel`). Cards render in `order`.
  - Schemas live in `src/content.config.ts`; invalid data fails the build.
- **GitHub enrichment** (optional): at build time each project card fetches its repository from the
  public GitHub API (no token, 4 s timeout) to show "Actualizado <mes año>" and the primary language.
  Any failure (offline, rate limit, error) simply hides that line; the build never fails. Disable it
  with `PUBLIC_GITHUB_ENRICH=false` (the E2E suite does this in `playwright.config.ts`).
  `GITHUB_API_BASE` overrides the API origin, e.g. `http://127.0.0.1:9` to simulate an unreachable host.
- **CV PDF**: `public/cv/leixer-molina-cv.pdf`.
- **Navigation labels / section ids**: `src/config/site.ts`.

## Structure

```text
src/
  components/
    atoms/       Icon, Button, Tag, Avatar
    molecules/   SectionHeader, ExperienceCard, ProjectCard, SkillGroup, CredentialCard, ContactLink, ThemeToggle
    organisms/   SiteHeader, Hero, *Section, SiteFooter
  content/       CV data (content collections)
  lib/         content helpers, formatting, icons, GitHub enrichment
  layouts/       BaseLayout (SEO, theme bootstrap)
  pages/         index.astro (composes organisms)
  styles/        tokens.css (identity), global.css
tests/e2e/       Playwright specs
```

## CI

`.github/workflows/ci.yml` runs `npm ci`, `npm run check`, `npm run build` and the E2E suite on every
push to `main` and on pull requests, uploading the Playwright report when tests fail.
