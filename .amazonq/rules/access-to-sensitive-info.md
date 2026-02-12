# Access to Sensitive Information — Rules

Purpose: prevent accidental or intentional exposure of secrets, credentials, and other sensitive data in this repo.

Rules
- Never access, read, or commit secrets or sensitive files (examples: `.env`, keys, tokens, passwords, certificates, private SSH keys).
- Never log, print, or expose `process.env` values or any runtime secrets in code, tests, or CI output.
- Never hardcode secrets in source files or tests. Use placeholders like `"YOUR_SECRET_HERE"` when an example value is required.
- Do not attempt to retrieve secrets from external stores during development or tests. Assume secrets are provided at runtime by the environment.
- Avoid code that would require secret access (no printing of environment, no embedding credentials in test fixtures).
- If you need configuration for local dev/tests, use clearly marked sample files (e.g., `.env.sample`) with non-sensitive placeholders only.

If sensitive data is discovered
- Immediately notify the repo owners and follow the incident response policy (rotate/revoke, remove from history, scrub and replace).
- Do not post or share the secret in issue trackers, PRs, or chat.

Enforcement
- All PRs must be reviewed for secret exposure.
- Integrate secret-scanning in CI and block merges on positive findings.

Minimal guideline: When in doubt, do not access or expose it — use placeholders and assume secrets are injected externally.