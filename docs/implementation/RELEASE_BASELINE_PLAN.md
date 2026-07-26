# RELEASE_BASELINE_PLAN.md
## Release Baseline Preparation — WP-2.2 & WP-2.3

**Role:** ATI Platform Release Manager  
**Date:** 2026-07-26  
**Branch:** `develop`  
**HEAD:** `c2420a3` — `feat(platform): implement Shared Packages Baseline (WP-2.1)`  
**Existing tags:** `architecture-v1.0`, `wp-1.1-complete` … `wp-2.1-complete`  
**Missing tags:** `wp-2.2-complete`, `wp-2.3-complete`

**Constraints for this plan:** Do not commit, tag, or push in this activity. Do not modify implementation.

---

## Repository State

| Item | State |
|------|--------|
| Branch | `develop` @ `c2420a3` (tracks `origin/develop`) |
| Working tree | **Dirty** — WP-2.2 + WP-2.3 uncommitted |
| Staged | Empty |
| Prior complete tag | `wp-2.1-complete` |
| Temporary / backup files | None observed |
| Generated artifacts in git | None (`dist/` gitignored) |
| Status docs | Synchronized to WP-2.3 complete / WP-2.4 not started |
| Build / tests (last Git Readiness) | Green for auth/obs packages + api/worker |

### Why the tree is interleaved

Current `apps/api/src/auth/auth.middleware.ts` (and worker service-auth middleware) **import host ObservabilityRuntime** for coarse auth metrics (WP-2.3 T8).  
`app.module.ts` imports **both** Observability and Auth modules.  
`shared-constants`, `pnpm-lock.yaml`, and status docs reflect the **final** WP-2.3 closed state.

Therefore a pure WP-2.2-only first commit would either:

- omit observability and **break compilation** of auth middleware, or  
- require **implementation edits** to split metrics from auth (out of scope for release prep).

---

## Recommended Release Strategy

### Option A (sequential commits WP-2.2 then WP-2.3) — Preferred in principle, **not safe now**

Would match historical one-WP-per-commit/tag style, but **not feasible without code changes** because WP-2.2 auth host code currently depends on WP-2.3 observability wiring.

### Option B (combined implementation commit) — **Recommended (safest)**

Create **one** commit containing WP-2.2 + WP-2.3 (code + docs + lockfile), then apply **sequential tags on that same commit** for governance continuity:

1. Tag `wp-2.2-complete` (annotated) — Auth foundation included in this baseline  
2. Tag `wp-2.3-complete` (annotated) — Observability baseline (current closed WP)

This preserves releasable green tree, avoids rewrite/split, and keeps tag names aligned with prior `wp-*-complete` practice.

---

## Commit Plan

**Order:** Single commit on `develop` (Option B).

**Include:** All intended WP-2.2 and WP-2.3 sources and docs; exclude `node_modules/`, `dist/`, `coverage/`, secrets.

**Suggested message:**

```text
feat(platform): implement Auth Foundation (WP-2.2) and Observability Baseline (WP-2.3)

Deliver closed WP-2.2 (@ati/auth + host wiring) and WP-2.3 (@ati/observability,
correlation, Pino single-path logging, coarse auth metrics) as one releasable
baseline because host auth metrics depend on observability runtime.
```

**Example commands (do not run in this activity):**

```bash
git status
git add README.md apps packages docs/development docs/implementation docs/roadmap pnpm-lock.yaml
# Review staging carefully; do not add secrets, dist, or coverage
git status
git commit -m "$(cat <<'EOF'
feat(platform): implement Auth Foundation (WP-2.2) and Observability Baseline (WP-2.3)

Deliver closed WP-2.2 (@ati/auth + host wiring) and WP-2.3 (@ati/observability,
correlation, Pino single-path logging, coarse auth metrics) as one releasable
baseline because host auth metrics depend on observability runtime.

EOF
)"
```

On Windows PowerShell, equivalent:

```powershell
git add README.md apps packages docs/development docs/implementation docs/roadmap pnpm-lock.yaml
git commit -m "feat(platform): implement Auth Foundation (WP-2.2) and Observability Baseline (WP-2.3)"
```

---

## Tag Plan

**Order (on the new commit SHA):**

1. `wp-2.2-complete`  
2. `wp-2.3-complete`  

**Example:**

```bash
git tag -a wp-2.2-complete -m "WP-2.2 Authentication & Authorization Foundation complete (included in combined baseline with WP-2.3)"
git tag -a wp-2.3-complete -m "WP-2.3 Observability Baseline complete"
git show-ref --tags | grep wp-2
```

Both tags may point to the **same** commit SHA. That is intentional given the interleaved tree.

---

## Push Plan

**Order:**

1. Push branch `develop`  
2. Push tags  

**Example:**

```bash
git push -u origin develop
git push origin wp-2.2-complete wp-2.3-complete
# or: git push origin --tags
```

Push only after local commit/tag verification and any required approvals.

---

## Risks

| Risk | Mitigation |
|------|------------|
| Option A split breaks build | Use Option B (combined commit) |
| Forgetting WP-2.2 docs in add | Explicitly add `docs/implementation/WP-2.2_*` and `WP-2.3_*` |
| Tagging wrong SHA | Tag only after `git log -1` confirms new commit |
| Pushing secrets | Confirm no `.env` / credential files in `git status` |
| Remote already has divergent history | `git status` / `git log origin/develop..HEAD` before push |
| Dual tags on one commit confuse consumers | Annotate tag messages that WP-2.2 is included in the combined baseline |

---

## Final Recommendation

1. Use **Option B** — one combined commit for WP-2.2 + WP-2.3.  
2. Create annotated tags **`wp-2.2-complete`** then **`wp-2.3-complete`** on that commit.  
3. Push `develop`, then push those tags.  
4. Do **not** attempt a WP-2.2-only first commit without an authorized code split (auth middleware ↔ observability).

**Do not commit / tag / push until a separate Release Execution authorization is given.**

---

## Final Verdict

**READY FOR RELEASE BASELINE**
