// copilot-instructions.md

## 📌 Purpose

This document defines strict working rules for AI-assisted development (GitHub Copilot or similar AI tools) for this repository.

The project is an **Event Management API (Node.js LTS + Express LTS)** built as a **minimal Proof of Concept (POC)** using **Test Driven Development (TDD)**.

Copilot must follow these rules at all times.

---

# 🔐 Security & Privacy Rules

## 1. Never Access Secrets or Sensitive Information

Copilot must:

- ❌ Never access `.env` files
- ❌ Never read secrets, API keys, tokens, passwords, certificates
- ❌ Never suggest printing environment variables
- ❌ Never expose `process.env` values in logs
- ❌ Never generate hardcoded secrets

If configuration is needed:

- Use placeholders like `"YOUR_SECRET_HERE"`
- Assume secrets are provided externally

Security always takes priority.

---

# 🧪 Development Methodology Rules

## 2. Strict Test Driven Development (TDD)

This project follows **strict TDD**.

For every feature:

1. Write a failing test first
2. Run the test (it must fail)
3. Implement the minimal code to pass
4. Refactor if necessary
5. Move to the next small step

Copilot must:

- ❌ Never implement functionality before tests exist
- ❌ Never generate full feature implementations upfront
- ✅ Always start with a failing test
- ✅ Work in very small increments
- ✅ Stop after completing one small task

---

## 3. Unit Tests First — No Implementation Unless Asked

Default behavior:

- ✅ Generate unit tests only
- ❌ Do NOT generate implementation code
- ❌ Do NOT scaffold business logic
- ❌ Do NOT auto-complete controllers/services/models

Only implement actual code when explicitly instructed:

> "Now implement the minimal code to make the test pass."

Until that instruction appears:

- Write tests only
- Keep them focused and minimal

---

# 🧱 Architecture Rules

## Keep It Minimal (POC Only)

This is a Proof of Concept.

Copilot must avoid:

- ❌ Clean Architecture layers
- ❌ Domain-driven design abstractions
- ❌ Repository patterns unless required
- ❌ Dependency injection frameworks
- ❌ Complex folder structures
- ❌ Microservices
- ❌ Event sourcing
- ❌ CQRS
- ❌ Over-engineering

Prefer:

- ✅ Simple folder structure
- ✅ Direct Express route → controller
- ✅ In-memory storage (until DB is required)
- ✅ Clear, readable code
- ✅ Beginner-friendly structure

---

# 🗂️ Expected Project Structure

src/
app.js
server.js
routes/
controllers/
models/
tests/

Do not introduce additional architectural layers unless explicitly requested.

---

# 🔔 Communication Rules for Copilot

When assisting:

- Be concise
- Do not generate large code dumps
- Focus only on the current task
- Do not anticipate future features
- Do not refactor unrelated files
- Do not add extra tooling unless asked

Always assume:

We are building this one task at a time.

---

# ⚙️ Tech Stack Constraints

- Node.js (LTS)
- Express (LTS)
- Jest (for testing)
- Supertest (for API testing)
- Socket.io (for real-time notifications later)
- JWT for authentication (later phase)

Do not introduce alternative frameworks.

---

# 🚫 What Not To Do

- Do not auto-generate full CRUD when only one endpoint is requested
- Do not connect to real databases unless explicitly instructed
- Do not modify `package.json` unnecessarily
- Do not introduce TypeScript (unless explicitly requested)
- Do not add linting, formatting, Docker, or CI/CD unless asked

---

# ✅ Summary of Core Rules

1. Never access secrets or `.env` files
2. Always follow strict TDD
3. Write tests first
4. Do NOT implement actual code unless explicitly instructed
5. Keep everything minimal
6. One task at a time
7. Do not over-engineer

---

# How to run unit tests and start the server (local dev)

- Install dependencies:
  - npm install

- Run tests:
  - npm test
  - Or, for a single file: npx jest path/to/test.spec.js

- Run tests in watch mode (recommended during TDD):
  - npx jest --watch

- Start the app (development):
  - npm start
  - (Ensure package.json has a "start" script that runs node src/server.js or similar)

- Run the server while developing with automatic restart (optional, only if added):
  - npx nodemon src/server.js

Include explicit commands in README or commit message when adding/updating scripts.

---

# Coding style & guidelines (recommended)

- Keep code simple and readable.
- Use explicit, descriptive variable names.
- Prefer small functions that do one thing.
- Add JSDoc-style comments for non-obvious functions.
- If linting is later requested, prefer ESLint with the Airbnb or Standard style as a baseline.
- Use Prettier only if formatting automation is explicitly requested.

Recommended style references:
- Airbnb JavaScript Style Guide
- Node.js Best Practices (RisingStack, Node.js docs)

---

# Official documentation references

- Node.js: https://nodejs.org/
- Express: https://expressjs.com/
- Jest: https://jestjs.io/
- Supertest: https://github.com/visionmedia/supertest
- Socket.io: https://socket.io/
- JSON Web Tokens (jwt): https://jwt.io/

---

# 🔁 Workflow reminders for Copilot

- ALWAYS produce the test first. Do not write implementation before the test.
- Keep changes very small and focused — one behavior per commit/suggestion.
- Stop after each completed step and ask the human for confirmation before proceeding.
- Provide concise instructions on how to run the test and start the app.

If unclear about requirements, ask a clarifying question before making changes.