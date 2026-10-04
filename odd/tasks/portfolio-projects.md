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
- [x] P1b — User request 2026-10-04: Projects section first (right after the hero), then Experience in a summarized form (one-sentence summary + tech tags per job; full bullet list kept in content, not displayed). Route: delegated (writer trigger: multi-file).
- [x] P2 — After user merges the PRs: verify all report URLs return 200, merge to main, deploy, verify live. Route: inline.

## Progress / evidence
- 2026-10-03: plan created; branch `feat/projects-section` from main @ 20d3c98.
- P1 RED — 565854a `test(e2e): add projects section specs`: `npx playwright test` → 7 failed (new projects specs), 23 passed.
- P1 GREEN — 865f942 `feat(projects): add projects section with live report links`: `npm run check` → 0 errors / 0 warnings / 0 hints; `npm run build` → Complete; `npm run test:e2e` → 30 passed.
- P1 enrichment: `PUBLIC_GITHUB_ENRICH=true npm run build` (real API) → 3 cards with "Actualizado octubre de 2026"; with `GITHUB_API_BASE=http://127.0.0.1:9` (connection refused) → build exit 0, 3 cards, 0 "Actualizado"; with `GITHUB_API_BASE=http://10.255.255.1` (blackhole, 4 s timeout) → build exit 0 in ~7 s, 0 "Actualizado".
- P1 visual: screenshots desktop 1366 dark/light, tablet 820 dark, mobile 375 dark reviewed; horizontal overflow 0 at all widths.
- P1 docs — 9fe3480 `docs: document projects content and github enrichment`.
- Parent spot check: `npm run test:e2e` → 30 passed. Inline fix 1b30a8e `style: restore alternating section backgrounds` (Skills/Certifications alt, Education/Contact plain) → 30 passed; computed order inicio:plain experiencia:alt proyectos:plain habilidades:alt educacion:plain certificaciones:alt contacto:plain.
- RDD (range ae47119..1b30a8e): medium (executable change in playwright.config.ts), slice_budget_reached (467 lines); consent granted; 1 lens (reliability) → approved, 0 blocking; lineage `review-95729b5afd4ad8aa` acknowledged/burned. Advisory: GitHub enrichment module untested (`src/lib/github.ts:27-49`), date formatter untested, hardcoded test counts may drift from repos, unauthenticated API rate limit (60/h).
- P1b RED — 20f6561 `test(e2e): expect projects first and summarized experience`: `npx playwright test` → 3 failed (full section order, nav order, experience summary/no highlights), 29 passed. Replaced the spec "projects section sits between Experiencia and Habilidades".
- P1b GREEN — 9b722e4 `feat(experience): show projects first and summarize experience`: `summary` added to the experience schema and entries (highlights kept, not rendered); card shows role, company · project, period, summary, tech tags; tighter padding/spacing. `npm run check` → 0 errors / 0 warnings / 0 hints; `npm run build` → Complete; `npm run test:e2e` → 32 passed. Computed order inicio:plain proyectos:alt experiencia:plain habilidades:alt educacion:plain certificaciones:alt contacto:plain.
- P1b visual: desktop 1366 dark and mobile 375 dark screenshots (hero through Experience) reviewed; Experience section 948 px tall at 1366, 1252 px at 375; timeline line and 20 px card gaps visible.

- Parent spot check (P1b): `npm run test:e2e` → 32 passed. RDD assess (1b30a8e..HEAD, committed-only): medium (executable change in ExperienceCard.astro), 119 lines, review_due=false (`under_budget`) — stays pending in the slice until a later commit reaches the budget.

- P2 (2026-10-04): user authorized merging the 4 qa-repos-upgrade PRs; merged with merge commits (Calendar 3a72730, DemoBlaze 2e4be68, OrangeHRM a08a944, LeixerM af8939c). Main runs: Calendar 37176936406 success + Pages; OrangeHRM 37176943687 success + Pages; DemoBlaze 37176940329 FAILURE (flaky StaleElementReference in 'Removing a product…', Pages still published) → fix delegated on branch fix/cart-removal-stale-element. All report URLs 200 (Calendar, DemoBlaze root/karate/serenity, OrangeHRM). Portfolio: 32 E2E passed, main fast-forwarded to feat/projects-section (29db71d) and pushed; push again did not trigger CI → dispatched run 37177160592: build-and-test, build-pages, deploy success; live HTML contains #proyectos.

## Next step
Merge the DemoBlaze flaky-test fix PR once green (needs user OK), then re-check the DemoBlaze report is all green. Investigate why pushes to LeixerM.github.io do not trigger the CI workflow.
