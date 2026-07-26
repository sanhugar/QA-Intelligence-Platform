# RELEASE_EXECUTION_CHECKLIST.md
## Release Baseline Execution Checklist — v2.3

**Role:** ATI Platform Release Manager  
**Date:** 2026-07-26  
**Strategy:** Option B (combined WP-2.2 + WP-2.3 commit) per [RELEASE_BASELINE_PLAN.md](../implementation/RELEASE_BASELINE_PLAN.md)  
**Release note:** [RELEASE_BASELINE_v2.3.md](./RELEASE_BASELINE_v2.3.md)

**This checklist is for manual execution.** Do not treat agent runs as a substitute for your local `git` verification before commit/tag/push.

---

## Pre-flight verification (run locally)

### 1. Working tree & commit state

```powershell
cd D:\Projects\QA-Intelligence-Platform
git status
git branch -vv
git log -3 --oneline
git tag -l "wp-2*"
```

**Expect before commit:** dirty working tree with WP-2.2 + WP-2.3 files; HEAD still at WP-2.1 (`c2420a3` or equivalent); tags `wp-2.2-complete` / `wp-2.3-complete` **absent**.

**Expect after commit:** `git status` shows clean tree (nothing to commit).

### 2. No secrets / generated artifacts

```powershell
git status --porcelain
# Confirm no .env, *.pem, dist/, coverage/, node_modules/ are staged for add
```

### 3. Build

```powershell
npx pnpm@9.15.0 --filter @ati/shared-constants --filter @ati/logger --filter @ati/observability --filter @ati/auth --filter @ati/api --filter @ati/worker run build
```

**Agent pre-check (2026-07-26):** BUILD = PASS

### 4. Tests

```powershell
npx pnpm@9.15.0 --filter @ati/auth --filter @ati/observability --filter @ati/logger --filter @ati/shared-constants test
npx pnpm@9.15.0 --filter @ati/api test
npx pnpm@9.15.0 --filter @ati/worker test
```

**Agent pre-check (2026-07-26):** PKG / API / WORKER = PASS

---

## Recommended commit message

```text
feat(platform): implement Auth Foundation (WP-2.2) and Observability Baseline (WP-2.3)

Deliver closed WP-2.2 (@ati/auth + host wiring) and WP-2.3 (@ati/observability,
correlation, Pino single-path logging, coarse auth metrics) as one releasable
baseline because host auth metrics depend on observability runtime.
```

---

## Exact commit commands (PowerShell)

Review `git status` first, then:

```powershell
cd D:\Projects\QA-Intelligence-Platform

git add README.md apps packages docs/development docs/implementation docs/roadmap docs/releases pnpm-lock.yaml

git status

git commit -m "feat(platform): implement Auth Foundation (WP-2.2) and Observability Baseline (WP-2.3)" -m "Deliver closed WP-2.2 (@ati/auth + host wiring) and WP-2.3 (@ati/observability, correlation, Pino single-path logging, coarse auth metrics) as one releasable baseline because host auth metrics depend on observability runtime."

git status
git log -1 --oneline
```

**Checklist**

- [ ] Staged set reviewed (includes `packages/auth`, `packages/observability`, WP-2.2/WP-2.3 docs, `docs/releases/*`, lockfile)
- [ ] No secrets staged
- [ ] Commit succeeded
- [ ] Working tree clean

---

## Exact tag commands

Run **after** the commit, on the new commit SHA:

```powershell
git tag -a wp-2.2-complete -m "WP-2.2 Authentication & Authorization Foundation complete (included in combined baseline with WP-2.3)"

git tag -a wp-2.3-complete -m "WP-2.3 Observability Baseline complete"

git show-ref --tags | Select-String "wp-2\.[23]-complete"
git log -1 --decorate --oneline
```

**Checklist**

- [ ] `wp-2.2-complete` created
- [ ] `wp-2.3-complete` created
- [ ] Both tags point at the combined baseline commit

---

## Exact push commands

Only after commit + tags succeed and you intend to publish:

```powershell
git push -u origin develop

git push origin wp-2.2-complete wp-2.3-complete
```

**Checklist**

- [ ] `develop` pushed
- [ ] Both tags pushed
- [ ] Remote shows new commit and tags

---

## Post-release verification

```powershell
git status
git log -1 --decorate --oneline
git ls-remote --tags origin | Select-String "wp-2\.[23]-complete"
```

**Expect:** clean working tree; HEAD decorated with `wp-2.2-complete` and `wp-2.3-complete`; remote tags present.

---

## Stop conditions (do not push)

- Build or tests fail  
- Unexpected files in staging (secrets, `dist/`, personal notes)  
- Commit rejected by hooks without a clear fix  
- Remote `develop` has diverged unexpectedly  

---

## Summary

| Step | Action |
|------|--------|
| 1 | Verify status / branch / tags |
| 2 | Re-run build + tests locally |
| 3 | `git add` intended paths |
| 4 | Commit with recommended message |
| 5 | Tag `wp-2.2-complete` then `wp-2.3-complete` |
| 6 | Push `develop` then tags |

**Agent did not run any Git commit, tag, or push commands.**
