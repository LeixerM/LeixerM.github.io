# Feature: portfolio-projects

## Objective
Add a "Proyectos" section to https://leixerm.github.io/ showcasing the three upgraded QA automation repos,
each with what it proves, stack, test count, and links to the repo and its live test report.

## Problem / Why
Recruiters see the CV but not the evidence. The upgraded repos (feature `qa-repos-upgrade`) now publish live
Serenity/Karate reports; the portfolio should surface them.

## Scope
- New content collection `projects` (curated data, Spanish copy) — no project text hardcoded in components.
- Optional build-time enrichment from the public GitHub API (last update, primary language) with a short timeout
  and graceful fallback: the build never fails and E2E tests never depend on it.
- New section `#proyectos` between Experiencia and Habilidades; nav entry; cards in the cinematic identity (tokens only).
- E2E specs written first (RED), then implementation (GREEN).

## Constraints
- Branch `feat/projects-section`. Do NOT merge/publish to `main` until the user merges the 4 qa-repos-upgrade PRs
  (report URLs for DemoBlaze and OrangeHRM return 404 before that).
- Tokens-only styling; accessibility AA; responsive at 375px.

## Acceptance criteria
- 3 project cards render from the collection with title, summary, stack tags, test count, repo link, report link.
- External links open in a new tab with `rel="noopener noreferrer"`.
- `npm run check`, `npm run build`, `npm run test:e2e` green; build succeeds offline (GitHub API unreachable).

## Tasks
- [x] P1 — Projects collection + E2E specs (RED) + section/cards/nav (GREEN) + optional GitHub enrichment. Route: delegated (writer trigger: multi-file).
- [ ] P2 — After user merges the PRs: verify all report URLs return 200, merge to main, deploy, verify live. Route: inline.

## Progress / evidence
- 2026-10-03: plan created; branch `feat/projects-section` from main @ 20d3c98.
- P1 RED — 565854a `test(e2e): add projects section specs`: `npx playwright test` → 7 failed (new projects specs), 23 passed.
- P1 GREEN — 865f942 `feat(projects): add projects section with live report links`: `npm run check` → 0 errors / 0 warnings / 0 hints; `npm run build` → Complete; `npm run test:e2e` → 30 passed.
- P1 enrichment: `PUBLIC_GITHUB_ENRICH=true npm run build` (real API) → 3 cards with "Actualizado octubre de 2026"; with `GITHUB_API_BASE=http://127.0.0.1:9` (connection refused) → build exit 0, 3 cards, 0 "Actualizado"; with `GITHUB_API_BASE=http://10.255.255.1` (blackhole, 4 s timeout) → build exit 0 in ~7 s, 0 "Actualizado".
- P1 visual: screenshots desktop 1366 dark/light, tablet 820 dark, mobile 375 dark reviewed; horizontal overflow 0 at all widths.
- P1 docs — 9fe3480 `docs: document projects content and github enrichment`.

## Next step
P2 — after the user merges the qa-repos-upgrade PRs, verify report URLs return 200, then merge/deploy.
