# Feature: qa-repos-upgrade

## Objective
Upgrade the GitHub repositories of LeixerM that are most attractive to recruiters for QA Automation roles,
so each showcased repo is clean, runs green in CI, publishes a live test report and explains itself in its README.

## Problem / Why
Audit 2026-10-03 (Engram `portafolio/github-repos-audit`): no repo has more than 4 scenarios, ~9.7k generated
report files are committed, one CI is broken, READMEs are missing or point to local paths, and the strongest
skills (API testing, CI-published reports) are hidden.

## Scope (ordered by recruiter impact)
- R1 `Serenity_Calendar_Leixer` — best repo; becomes the reference template.
- R2 `Proyecto_DemoBlaze_E2E` — unify `Demoblaze` (UI, Serenity Screenplay) + `APIDemoblaze` (API, Karate) into one multi-module repo.
- R3 `Serenity_Ejemplo2_OrangeHRM` — fix failing CI, modernize.
- R4 `LeixerM` profile README — rewrite for QA Automation recruiters.

Out of scope for now: Banistmo expansion, Playwright 30-day challenge, new projects, archiving repos.

## Constraints
- Delivery per repo: branch `chore/recruiter-ready` + pull request. The user merges. No force-push, no direct push to `main`, no repo deletion/archival/rename.
- Work happens in clones under the session scratchpad; the portfolio repo is not touched except this document.
- Code, READMEs and commit messages in English; Conventional Commits; no AI attribution lines.
- Credentials (even public demo accounts) move to config/env, never to new hardcoded literals.
- Old repos (`Demoblaze`, `APIDemoblaze`) stay untouched until the user decides to archive them.

## Acceptance criteria (per repo)
- No generated artifacts tracked (`target/`, `build/`, `.idea/`, drivers); proper `.gitignore`.
- Test suite runs green locally (`./gradlew clean test aggregate` or equivalent) against the live demo site.
- GitHub Actions workflow runs the suite on push/PR and publishes the HTML report to GitHub Pages.
- README.md: purpose, stack badges, CI badge, live report link, architecture tree, how to run, report screenshot.
- Regression check (user requirement 2026-10-03, all PRs): baseline run of the original suite BEFORE upgrading, version diff table (old -> new), and scenario mapping (original -> new, baseline result -> upgraded result) in `docs/regression-check.md` (or `docs/regression-baseline.md`) and in the PR body. No baseline-passing behavior may be dropped or broken. R4 (README only) has no dependencies: N/A.

## Tasks
- [x] R1 — Serenity_Calendar_Leixer: cleanup, data-driven Scenario Outline + edge cases, Java 21, CI on push/PR + Pages, README. Route: delegated (writer trigger: multi-file).
- [x] R4 — LeixerM profile README rewrite. Route: delegated with R1.
- [x] R2 — Proyecto_DemoBlaze_E2E unified UI + API repo. Route: delegated.
- [x] R3 — Serenity_Ejemplo2_OrangeHRM CI fix + modernization. Route: delegated.

## Checks
- Local: `./gradlew clean test aggregate` per repo (Java 21, Gradle wrapper, Chrome headless).
- Remote: PR CI run green.
- User authorization (2026-10-03): after the changes, Claude may trigger CI runs (`gh workflow run` / `gh run rerun` on the PR branches of the four repos) and must validate that every check ends in PASS before reporting completion.

## Delivery
- One PR per repo; forecast large (README + test refactors + removal of thousands of generated files, which are excluded from authored-line counts).
- Native gentle-ai review for these external repositories requires explicit cross-repository authorization; pending user decision.

## Progress / evidence
- 2026-10-03: plan created.
- 2026-10-03 R1 done: branch `chore/recruiter-ready` commits 045c975 (chore: untrack target/.idea), 807fad0 (build: Java 21, Serenity 5.3.11 + plugin 5.3.9, Cucumber 7.34.2, JUnit 6.0.3, Gradle 8.14.5), bbb2842 (test: Scenario Outline + CalendarDates + unit tests), 7520580 (ci: push/PR/dispatch, Pages deploy only on push to main; Pages source already `workflow`), ef8a3c0 (docs: README + docs/report.png), 0e9a499 (build: gradlew +x), 32b54ab (fix(ci): explicit `headless=new` chrome arg; Serenity 5 ignored `headless.mode`). Local `./gradlew clean test aggregate`: 13 passed / 0 failed (7 Cucumber scenarios + 6 unit tests). PR https://github.com/LeixerM/Serenity_Calendar_Leixer/pull/1 — CI run 37139543725 pass (13 passed); first run 37139080908 failed (SessionNotCreated, no headless), fixed by 32b54ab.
- 2026-10-03 R4 done: commit b199ff8 (docs: rewrite profile readme; unused icon files removed, GIF kept). PR https://github.com/LeixerM/LeixerM/pull/1 — repo has no CI checks; all shields.io badge URLs return 200, all linked repos exist.

- 2026-10-03 R1 regression check: baseline main 7f59dcf ran 3/3 PASS on JDK 21 (Gradle 8.13, Serenity 4.2.1, JUnit Vintage) + last published CI report 3/3; upgraded branch 13/13 PASS x2 locally; mapping B1->outline current/15, B2->next/10, B3->current-month examples + @TypeDate (B3 was always-true: no browser action, read memory from another Actor). No regressions. Found old bug: next-month calc kept year (fails every December), fixed by plusMonths. Commit 85c91f8 docs/regression-check.md, PR body has Regression check section. Parent spot check: CI run 37140399332 on 85c91f8 success.
- 2026-10-03 R2 done: `main` seeded with 042220c (chore: initialize repository: README placeholder + .gitignore). Branch `chore/recruiter-ready`: e27820d (build: multi-module, Gradle 8.14.5, Java 21), 1dc5071 (test(api): Karate 2.1.3 / karate-junit6, 11 scenarios), 926a831 (test(ui): Serenity 5.3.11 Screenplay, 5 scenarios + 7 unit tests), 66a92a2 (ci: API then UI, combined Pages site karate/ + serenity/), b08718f (docs: README, screenshots, docs/regression-baseline.md). Baseline (originals unchanged, Java 21): Demoblaze purchase FAIL (date tied to hard-coded Feb 2026 data); APIDemoblaze default run 1/1 PASS (@loginFailed only), all 4 PASS with the tag filter removed in a throw-away copy. All mapped to new scenarios, all PASS. Local `./gradlew clean test aggregate`: 23 passed / 0 failed. PR https://github.com/LeixerM/Proyecto_DemoBlaze_E2E/pull/1, CI run 37140799479 pass (23 passed). Pages enabled (workflow) at https://leixerm.github.io/Proyecto_DemoBlaze_E2E/; description + homepage set.
- 2026-10-03 R3 done: branch `chore/recruiter-ready` commits f4b8208 (chore: untrack 1,104 target/ files + .idea), 4d3531e (fix(test): headless window-size, which was the root cause of the always-red CI: collapsed side menu), 3bae875 (build: Serenity 4.3.4 + Cucumber 7.31.0, intermediate), 0990303 (build: Serenity 5.3.11, Cucumber 7.34.2, JUnit 6.0.3 suite, Gradle 8.14.5, Java 21), 85f4909 (test: Screenplay rebuild with UploadProfilePhoto/CallTheApi/OpenTheLoginPage/WaitFor interactions; create-with-avatar (SHA-256 photo check), search by name, delete; unique employee + @After API cleanup; credentials in serenity.conf with env/sysprop overrides), 033209d (ci: template workflow), fa092cb (docs: README, report.png, docs/regression-baseline.md). Baseline FAIL (collapsed menu); step 1 + step 2 (Serenity 4) FAIL only at the original never-passable image-src check; step 3 (Serenity 5) had one regression (hidden file input not `isPresent`), fixed in the same commit. Local `./gradlew clean test aggregate`: 6 passed / 0 failed (3 scenarios + 3 unit tests) on the last 2 consecutive runs; an earlier run hit a blank demo login page, now handled by one reload. PR https://github.com/LeixerM/Serenity_Ejemplo2_OrangeHRM/pull/1, CI run 37142904399 pass (6 passed). Pages enabled (workflow); homepage set to https://leixerm.github.io/Serenity_Ejemplo2_OrangeHRM/.

- 2026-10-03 Final CI validation (user-authorized): dispatched on PR heads — Calendar run 37143145594 @85c91f8 success; DemoBlaze run 37143148578 @b08718f success; OrangeHRM run 37143151447 @fa092cb success (Pages jobs skipped on non-main by design). All 4 PRs OPEN + MERGEABLE; Regression check section present in the 3 code PRs; LeixerM README PR has no CI (N/A).

## Next step
User reviews and merges the 4 PRs (Pages reports publish on merge to main). Then: archive/redirect Demoblaze + APIDemoblaze (user decision), R3 repo description, Banistmo + Playwright challenge, portfolio Projects section.
