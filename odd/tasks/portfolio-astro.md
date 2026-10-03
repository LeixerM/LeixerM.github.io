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
- [ ] T3 — Content collections with full CV data (Zod schemas). Route: delegated.
- [ ] T4 — Playwright setup + E2E specs for every section (RED first). Route: delegated.
- [ ] T5 — Components and sections implementing the page (GREEN), CV download. Route: delegated.
- [ ] T6 — GitHub Actions CI workflow (check, build, e2e). Route: delegated.

## Checks
- `npm run check`, `npm run build`, `npm run test:e2e`.

## Progress / evidence
- 2026-10-02: repo initialized (`a66de2e chore: initialize repository`), branch `feat/portfolio-astro` created.
- T1 (commit: `chore: scaffold astro project with tailwind v4`): Astro 7.3.5, Tailwind 4.3.3 via `@tailwindcss/vite`, TypeScript 6.0.3 (`@astrojs/check` 0.9.10 peer range excludes TS 7). `npm run check`: 0 errors / 0 warnings / 0 hints; `npm run build`: 1 page built.
- T2 (commit: `feat(theme): add design tokens, base layout and theme toggle`): tokens in `src/styles/tokens.css` via `@theme` (default palette dropped with `--color-*: initial`), dark override on `:root[data-theme=dark]`, no-flash inline script, persisted toggle. `npm run check`: 0 errors/0 warnings/0 hints; `npm run build`: complete; generated CSS contains `.bg-surface{background-color:var(--color-surface)}` and 0 default-palette colors.

## Next step
T1–T6 via one delegated writer, one work-unit commit per task.
