# Leixer Molina — Portafolio

Personal portfolio built with [Astro](https://astro.build) (static output), TypeScript (strict) and
Tailwind CSS v4. Content comes from the CV and is stored in Astro content collections.

## Requirements

- Node.js 22.12 or newer (LTS recommended)

## Commands

| Command              | What it does                                                  |
| -------------------- | ------------------------------------------------------------- |
| `npm install`        | Install dependencies                                          |
| `npm run dev`        | Start the dev server at `http://localhost:4321`               |
| `npm run check`      | Type-check Astro and TypeScript files (`astro check`)         |
| `npm run build`      | Type-check and build the static site into `dist/`             |
| `npm run preview`    | Serve the production build locally                            |
| `npm run test:e2e`   | Build, serve and run the Playwright E2E suite (Chromium)      |

First E2E run: install the browser with `npx playwright install chromium`.

## Where to change things

- **Visual identity** (colors, fonts, radii, shadows, dark theme): `src/styles/tokens.css` only.
  Tokens are exposed through Tailwind's `@theme`, and components use semantic utilities such as
  `bg-surface`, `text-primary` or `border-border`, so editing the token values re-themes the site.
- **CV content**: `src/content/`
  - `profile.json` — name, title, summary, contact, languages and SEO text
  - `experience/*.md` — one file per position (`end: null` means current)
  - `education.json`, `certifications.json`, `skills.json`
  - Schemas live in `src/content.config.ts`; invalid data fails the build.
- **CV PDF**: `public/cv/leixer-molina-cv.pdf`.
- **Navigation labels / section ids**: `src/config/site.ts`.

## Structure

```text
src/
  components/
    atoms/       Icon, Button, Tag, Avatar
    molecules/   SectionHeader, ExperienceCard, SkillGroup, CredentialCard, ContactLink, ThemeToggle
    organisms/   SiteHeader, Hero, *Section, SiteFooter
  content/       CV data (content collections)
  layouts/       BaseLayout (SEO, theme bootstrap)
  pages/         index.astro (composes organisms)
  styles/        tokens.css (identity), global.css
tests/e2e/       Playwright specs
```

## CI

`.github/workflows/ci.yml` runs `npm ci`, `npm run check`, `npm run build` and the E2E suite on every
push to `main` and on pull requests, uploading the Playwright report when tests fail.
