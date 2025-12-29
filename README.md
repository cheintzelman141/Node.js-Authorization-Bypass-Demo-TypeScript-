# Node.js Authorization Bypass Demo (TypeScript)

Hands-on demo of a common **authorization bypass** pattern with JWTs, plus a straightforward remediation. Use this to teach or validate access-control fixes.

## Contents
- [Quick Start](#quick-start)
- [Learning Goals](#learning-goals)
- [Vulnerability Scenario](#vulnerability-scenario)
- [Secure Fix](#secure-fix)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Tooling](#tooling)
- [Next Steps](#next-steps)
- [Author](#author)

## Quick Start
```bash
npm install
npm run dev     # run the TypeScript demo with ts-node
npm run build   # emit compiled JS to dist/
npm start       # run the compiled build
npm test        # placeholder (wire up your preferred test runner)
```
Prereqs: Node.js 18+ and npm.

## Learning Goals
- See how **AuthN** (authentication) can succeed while **AuthZ** (authorization) fails.
- Understand why trusting JWT claims (e.g., `role`) is dangerous.
- Learn to move authorization checks to server-side, authoritative data.

## Vulnerability Scenario
- Accepts a signed JWT.
- Trusts the `role` claim from the token.
- Uses that role directly for access decisions.

Attack path:
1) User gets a valid “basic” token.  
2) Attacker edits the payload to set `"role": "admin"`.  
3) Server grants admin access because it trusts the claim.

## Secure Fix
- Treat token claims as **untrusted input**.
- Verify the token signature and algorithm.
- Use only the `sub` (subject) from the token.
- Fetch roles/permissions from server-side data (not from the client).

## Project Structure
- `src/app.ts` — demo entrypoint.
- `src/auth/jwt.ts` — token helpers (stubbed, replace with a real JWT lib).
- `src/auth/middleware.ts` — simple authorization gate.
- `src/routes/admin.ts` — admin route sample.
- `src/routes/profile.ts` — profile route sample.
- `src/data/users.ts` — mock user store.
- `tests/auth.test.ts` — placeholder for your test suite.
- `.github/workflows/ci.yml` — GitHub Actions pipeline.
- `.semgrep.yml` — placeholder SAST rule; replace with real checks.

## Scripts
- `npm run dev` — run TypeScript directly via ts-node.
- `npm run build` — compile to `dist/`.
- `npm start` — run the compiled build.
- `npm test` — currently a placeholder; add Jest/Vitest and real specs.

## Tooling
- TypeScript for typing and safer refactors.
- GitHub Actions CI (`.github/workflows/ci.yml`).
- Semgrep config stub (`.semgrep.yml`); customize with project rules.

## Next Steps
- Swap the stubbed JWT code for a production library (e.g., `jsonwebtoken`).
- Back authorization with a datastore and enforce roles server-side.
- Add real regression tests for AuthZ, including negative cases.
- Expand Semgrep rules to block risky patterns (trusting client claims).

## Author
Chris Heintzelman — Application Security Engineer  
GitHub: https://github.com/cheintzelman141

