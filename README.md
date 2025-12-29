# Proving the Vulnerability (vulnerable branch)

like string with a role claim will be trusted.  
Example exploit using a real signed token (recommended for a more realistic demo):

1) Create a token for a normal user (example route):  
   `curl http://localhost:3000/login/100`

2) Forge a new token with role=admin and sub=100 using the repo's secret (see scripts/forge-admin-token.ts if present).

3) Call /admin with the forged token:  
   `curl -H "Authorization: Bearer <FORGED_TOKEN>" http://localhost:3000/admin`

Expected result on vulnerable: HTTP 200  
Note: If you keep jwt.decode() on vulnerable, you can also demonstrate the risk of accepting unverified tokens. If you want a cleaner ‘AuthN succeeds, AuthZ fails’ story, change vulnerable to jwt.verify() but still trust payload.role.

3) Run the fixed branch (same exploit should fail)  
Checkout main and start the server:  
`git checkout main`  
`npm run dev`

Re-run the exact same exploit request you used on the vulnerable branch.  
`curl -H "Authorization: Bearer <FORGED_TOKEN>" http://localhost:3000/admin`

Expected result on main: HTTP 403 (or 401 if the token is invalid)

## Prerequisites

- Node.js 18+
- npm

## Proving the Vulnerability (vulnerable branch)

### Step 1 — Run the vulnerable branch
`git checkout vulnerable`  
`npm run dev`

Confirm the app is running (adjust port if needed):  
`curl http://localhost:3000/health`

### Step 2 — Create a normal user token
Use the demo login route to mint a token for a non-admin user:  
`curl http://localhost:3000/login/100`  
Copy the returned JWT.

### Step 3 — Forge a token with elevated privileges
Modify the token payload to include an admin role.  
Example (recommended: real signed token using the repo secret):

```ts
// scripts/forge-admin-token.ts
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "dev-secret-change-me";
const forged = jwt.sign(
  { role: "admin" },
  secret,
  { subject: "100", expiresIn: "1h" }
);

console.log(forged);
```

Run:  
`npx ts-node scripts/forge-admin-token.ts`  
Copy the forged token.

### Step 4 — Access the admin endpoint
`curl -H "Authorization: Bearer <FORGED_TOKEN>" \`  
`  http://localhost:3000/admin`

Expected result on vulnerable:  
HTTP 200 OK  
Admin access is granted because the application trusts the role claim from the token.

## Notes on the Vulnerable Design

- If the vulnerable branch uses jwt.decode(), this also demonstrates the danger of accepting unverified tokens.
- For a cleaner, more realistic AppSec narrative, the vulnerable branch can instead:
  - verify the JWT signature
  - still trust payload.role for authorization
- In both cases, the core issue is client-controlled authorization data.

## Secure Fix (main branch)

### Step 5 — Run the fixed branch
`git checkout main`  
`npm run dev`

Re-run the exact same request using the forged token:  
`curl -H "Authorization: Bearer <FORGED_TOKEN>" \`  
`  http://localhost:3000/admin`

Expected result on main:  
HTTP 403 Forbidden  
(or 401 Unauthorized if the token is invalid)

## Why the Fix Works

The fixed implementation:
- verifies the JWT signature and algorithm
- uses only sub (user id) from the token
- loads roles from server-authoritative data
- treats all token claims as untrusted input

Authorization decisions are enforced exclusively on the server.

## Project Structure

- src/app.ts — application entrypoint
- src/auth/jwt.ts — JWT helpers
- src/auth/middleware.ts — authorization logic
- src/routes/admin.ts — protected admin route
- src/routes/profile.ts — example user route
- src/data/users.ts — server-authoritative user store
- tests/ — regression tests validating access control
- .github/workflows/ci.yml — CI pipeline
- .semgrep.yml — SAST guardrails

## Testing & Guardrails

Regression tests ensure:
- normal users cannot access admin routes
- token tampering does not grant elevated privileges
- legitimate admins retain access

CI enforces these guarantees on every change.

## Key Takeaway

Authorization bugs are rarely cryptographic failures.  
They happen when trust is placed in the wrong place.  
This project demonstrates how Application Security:
- identifies flawed trust boundaries
- fixes them at the design level
- prevents recurrence through tests and automation

## Author

Chris Heintzelman  
Application Security Engineer  
GitHub: https://github.com/cheintzelman141


