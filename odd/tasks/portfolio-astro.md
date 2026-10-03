# Feature: portfolio-astro

## Objective
Personal portfolio site for Leixer Molina (QA / Software Engineer) built from the CV
`Hoja de Vida Leixer_.pdf`, with a modern look and a visual identity that can be changed later
without touching content or components.

## Problem / Why
The CV only exists as a PDF. A web portfolio improves discoverability (SEO, LinkedIn sharing) and,
with its own E2E tests and CI, doubles as evidence of the owner's QA automation skills.

## Scope
- Astro (static output) + TypeScript strict + Tailwind CSS v4.
- Visual identity centralized in design tokens (`src/styles/tokens.css`, `@theme`), light/dark mode.
- CV data in Astro Content Collections, decoupled from presentation.
- Sections: hero, about, experience, skills, education, certifications, contact, CV download.
- Playwright E2E tests + GitHub Actions CI (build + test).

## Constraints
- Code, identifiers, comments in English. Site content and UI copy in Spanish (source CV is Spanish).
- No deploy, push, or remote setup without explicit user authorization.
- Atomic design for components (atoms / molecules / organisms).

## Acceptance criteria
- `npm run build` succeeds with zero type errors (`astro check`).
- `npm run test:e2e` passes against the built site.
- Changing token values in `tokens.css` alone re-themes the whole site.
- All CV content (experience, education, certifications, skills, contact) is rendered from collections.

## Delivery
- Strategy: `ask-on-risk`. Forecast: ~1,200 authored changed lines (lockfile excluded), above the 400 budget.
- No remote exists yet, so the PR chain strategy question is deferred until a remote is authorized.
- Branch: `feat/portfolio-astro` (base `main` @ a66de2e).

## Tasks
- [x] T1 — Scaffold Astro + TS strict + Tailwind v4, scripts (`dev`, `build`, `check`, `test:e2e`). Route: delegated (writer trigger: multi-file).
- [x] T2 — Design tokens + base layout + light/dark theme toggle. Route: delegated.
- [x] T3 — Content collections with full CV data (Zod schemas). Route: delegated.
- [x] T4 — Playwright setup + E2E specs for every section (RED first). Route: delegated.
- [x] T5 — Components and sections implementing the page (GREEN), CV download. Route: delegated.
- [x] T6 — GitHub Actions CI workflow (check, build, e2e). Route: delegated.
- [x] T7 — Profile photo extracted from the CV PDF, optimized with `astro:assets`, replacing the initials avatar (initials kept as fallback). Route: delegated (writer trigger: multi-file).
- [x] T8 — Cinematic restyle inspired by the Battlefield V key art (user request 2026-10-02): dark-first theme, cold blue / ember orange lighting, condensed uppercase display type, atmospheric hero. Must stay token-driven. Route: delegated.

## Checks
- `npm run check`, `npm run build`, `npm run test:e2e`.

## Progress / evidence
- 2026-10-02: repo initialized (`a66de2e chore: initialize repository`), branch `feat/portfolio-astro` created.
- T1 (commit `2db7ee4 chore: scaffold astro project with tailwind v4`): Astro 7.3.5, Tailwind 4.3.3 via `@tailwindcss/vite`, TypeScript 6.0.3 (`@astrojs/check` 0.9.10 peer range excludes TS 7). `npm run check`: 0 errors / 0 warnings / 0 hints; `npm run build`: 1 page built.
- T2 (commit `8aa9d90 feat(theme): add design tokens, base layout and theme toggle`): tokens in `src/styles/tokens.css` via `@theme` (default palette dropped with `--color-*: initial`), dark override on `:root[data-theme=dark]`, no-flash inline script, persisted toggle. `npm run check`: 0 errors/0 warnings/0 hints; `npm run build`: complete; generated CSS contains `.bg-surface{background-color:var(--color-surface)}` and 0 default-palette colors.
- T3 (commit `1831f00 feat(content): add cv content collections`): `src/content.config.ts` with `file`/`glob` loaders and `astro/zod` schemas for profile, experience (3 Markdown entries, `end: null` = current), education (3), certifications (3), skills (3 groups). Page title/description now read from the profile entry. `npm run build` (includes check): 0 errors/0 warnings/0 hints, rendered `<title>Leixer Molina | Ingeniero de Software · QA Engineer</title>`.
- T4 (commit `04f0eff test(e2e): add playwright specs for portfolio sections`): Playwright 1.63 (chromium only), webServer = build + `astro preview` on 127.0.0.1:4321; 21 specs in `tests/e2e/`. RED observed: `npm run test:e2e` -> 17 failed, 4 passed (SEO metadata, no console errors and both theme specs pass because T2 already shipped them). `npm run check`: 0 errors/0 warnings/0 hints.
- T5 (commit `d99e981 feat(ui): build portfolio sections with atomic components`): atoms (Icon, Button, Tag, Avatar), molecules (SectionHeader, ExperienceCard, SkillGroup, CredentialCard, ContactLink, ThemeToggle), organisms (SiteHeader, Hero, Experience/Skills/Education/Certifications/Contact sections, SiteFooter); index composes organisms only. Fonts self-hosted via Fontsource (no external requests). CV copied to `public/cv/leixer-molina-cv.pdf`. Initials avatar (no Python available to extract the photo). GREEN observed: `npm run test:e2e` -> 21 passed; `npm run build`: 0 errors/0 warnings/0 hints. Screenshots reviewed in light/dark at desktop and mobile widths.
- T6 (commit `ci: add github actions workflow and readme`, the branch tip after T5): `.github/workflows/ci.yml` (Node lts/*, npm ci, check, build, chromium install, e2e, report upload on failure) and README. `npm run check`: 0 errors/0 warnings/0 hints; `npm run build`: complete; `npm run test:e2e`: 21 passed. CI not executed remotely (no remote configured).

- RDD review (range a66de2e..bd8d3c2, committed-only, untracked excluded): assessed `high` (shell_source in `.github/workflows/ci.yml`); consent granted; 4 lenses (risk, resilience, readability, reliability) → `approved`, 0 blocking findings; acknowledged, lineage `review-f19119413e8f7610`, authority burned. Reviewed boundary is now `bd8d3c2`.
- Advisory follow-ups (non-blocking): section ids duplicated in `src/config/site.ts`; `formatPeriod` untested (`src/lib/format.ts`); Playwright webServer rebuilds in CI after `npm run build` (`playwright.config.ts:20`); NaN hero stats if experience is empty (`Hero.astro:14`); unused icons / `SectionId` type; duplicated CV download filename; floating Node version in CI; `networkidle` in console-error spec; period order not validated in schema; build-time stats go stale.
- T7: photo extracted with Node (pdf-lib + pngjs installed in the session scratchpad, not in the project): image XObject 183 (237x191, FlateDecode, ICCBased RGB, no SMask) is the portrait; the others are 101-103 px contact icons. Saved as `src/assets/profile.png`, referenced from `profile.json` via the `image()` schema helper (optional `photo` field), rendered in the Avatar atom with `astro:assets` `<Image>` (alt "Foto de Leixer Molina"), initials kept as fallback. RED: new spec "hero shows the profile photo, fully loaded" -> 1 failed. GREEN: `npm run check` 0 errors/0 warnings/0 hints; `npm run test:e2e` (includes build) 22 passed.
- Environment note: a pre-existing `astro dev` server (not started by the writer) occupies 127.0.0.1:4321, so `npm run test:e2e` reuses it (`reuseExistingServer`) and tests live source, not the build. Production verification was also run with a scratchpad Playwright config serving `astro preview` on port 4322.
- T8: cinematic dark identity. Tokens (`src/styles/tokens.css`): dark is now the `@theme` default (near-black blue-slate bg/surfaces, cold `primary`, ember `accent`), daylight variant under `:root[data-theme='light']`; new `ember`/`ember-hover`/`on-ember`, `border-strong`, `glow-cold`, `glow-ember`, `smoke`, `--font-display` (Oswald, replaces Montserrat `--font-heading`), `--tracking-display`, `--tracking-eyebrow`, `--radius-button`, `--shadow-glow-cold`, `--shadow-glow-ember`, atmosphere vars (`--gradient-atmosphere|vignette|ring|section|rule`, `--texture-grain` SVG noise, `--grain-opacity`, `--glow-*-strength`) consumed by `@utility` wrappers in `global.css`. No-flash script defaults to dark without a stored choice. Hero: full-viewport atmospheric section, huge condensed uppercase name, portrait with conic glow ring + cold/ember soft-light overlay, ember CTA. Contrast checked (dark text 18.1, muted 7.6, primary 10.2, ember CTA 7.5; light text 16.1, muted 7.1, primary 5.4, accent 5.5, CTA 5.5). Theme spec updated because it asserted the old prefers-color-scheme default: RED observed with the old layout (2 failed, 1 passed), GREEN after. `npm run check` 0/0/0; `npm run build` complete; `npm run test:e2e` 23 passed; production preview run (port 4322) 23 passed. Screenshots desktop 1366x900 / mobile 375x812, both themes, no horizontal overflow (scrollWidth - innerWidth = 0).

## Next step
All tasks done locally. Pending user decisions: add a remote, set the real `site` URL in `astro.config.mjs` (placeholder `https://leixerm.github.io`), push / PR / deploy. Photo source is only 237x191 px (as embedded in the CV); a higher-resolution original would sharpen the hero portrait.
