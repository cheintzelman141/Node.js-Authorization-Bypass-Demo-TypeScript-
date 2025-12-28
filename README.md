# Node.js Authorization Bypass Demo (TypeScript)

## Overview

This repository demonstrates a **realistic authorization bypass vulnerability** in a
Node.js + TypeScript application using JSON Web Tokens (JWT), along with a
defensible, production-grade remediation.

The goal of this project is not to demonstrate a JWT library feature, but to show:

- how authorization flaws occur in real systems
- how privilege escalation happens even with “valid” authentication
- how to fix the issue correctly at the architectural level
- how to prevent regression with tests and CI guardrails

This mirrors how authorization issues are handled in real-world
**Application Security** work.

---

## What This Demonstrates

✅ Authentication succeeds, but authorization is flawed  
✅ Privilege escalation via trusted token claims  
✅ Difference between **AuthN** and **AuthZ** failures  
✅ Proper server-side authorization enforcement  
✅ Regression tests proving the fix  
✅ CI + Semgrep guardrails to prevent reintroduction  

---

## Vulnerability: Authorization Bypass via Trusted JWT Claims

### Description

The vulnerable implementation:

- correctly verifies JWT signatures
- correctly authenticates users
- **incorrectly trusts authorization data (role) from the token payload**

This allows an attacker to modify or forge token claims to escalate privileges.

---

### Why This Is Dangerous

Authorization bypass vulnerabilities can lead to:

- unauthorized access to admin functionality
- data exposure or modification
- account takeover
- full application compromise

These issues are often missed because:
- authentication appears to be “working”
- tokens are signed and valid
- the flaw exists at the **authorization boundary**, not the cryptographic one

---

## OWASP Top 10 Mapping

- **A01 – Broken Access Control**
- **A04 – Insecure Design**

---

## Vulnerable Behavior

The application:

- accepts a signed JWT
- decodes and trusts the `role` claim
- uses the role directly for access control decisions

Example attack:

1. User receives a valid JWT as a normal user
2. Token payload is modified to include `"role": "admin"`
3. Server accepts the token and grants admin access

This demonstrates how **AuthZ fails even when AuthN succeeds**.

---

## Secure Behavior (Remediated)

The secure implementation enforces:

✅ JWT signature verification  
✅ Strict algorithm enforcement  
✅ Use of `sub` (user identifier) only  
✅ Server-side role lookup from authoritative data  
✅ Token claims treated as untrusted input  

Authorization decisions are made exclusively on the server.

---

## Why This Fix Is Correct

This approach:

- removes trust in client-controlled authorization data
- separates authentication from authorization
- aligns with least-privilege principles
- scales to real systems with databases or identity providers
- prevents entire classes of authorization bypass bugs

This reflects **defensible AppSec remediation**, not a superficial patch.

---

## Regression Tests

Tests demonstrate:

- normal users cannot access admin routes
- forged or modified role claims are ignored
- legitimate admin users retain access

These tests ensure:

- the vulnerability is reproducible
- the fix is provably effective
- future changes cannot silently reintroduce the flaw

---

## CI & Guardrails

This repository includes:

- Jest / Supertest regression tests
- Semgrep SAST rules
- GitHub Actions CI pipeline

Every commit:

- runs tests
- scans for unsafe authorization patterns
- blocks vulnerable changes before merge

This is how authorization security is enforced **at scale**.

---

## Running Locally

```bash
npm install
npm test
npm run dev
