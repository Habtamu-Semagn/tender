# Chereta — Implementation Plan

Status: **Phases 1–6 complete** (foundation, auth, organizations + documents,
tenders, bids, evaluations + awards). Backend builds clean, boots, and is verified
end-to-end against a live PostgreSQL. Phase 7 (notifications + dashboards) is next.

## 1. Current project state

| Item | Finding |
| --- | --- |
| Repository | `/home/hab/Desktop/bussiness/chereta` |
| Contents | Two **empty** directories: `backend/`, `frontend/` |
| Git | **Not initialized** — no history, no uncommitted work to preserve |
| Existing code | None. Nothing to inspect, nothing to preserve. |
| Node | `v20.20.2` |
| Docker | `29.8.1` running, Compose `v5.5.1` |
| PostgreSQL | Supabase holds host `5432`; another Postgres holds `5433` |

**Conclusion:** greenfield build. The existing empty `backend/` and `frontend/`
folders are replaced by a proper monorepo layout (`apps/api`, `apps/web`) per the
spec's "adapt this structure to the chosen monorepo tooling" clause.

## 2. Verified environment constraints (measured, not assumed)

These were confirmed against the live registry and the local machine, and each one
drove a concrete decision:

| Constraint | Evidence | Decision |
| --- | --- | --- |
| NestJS **v12** is current (`12.1.3`) | `npm view @nestjs/core version` | Use v12. All Nest packages move together. |
| Nest 12 packages are **ESM-only** | Nest v12 migration guide | App package becomes `"type": "module"`, `module: nodenext`, relative imports carry `.js` extensions. |
| `nest new` / `nest generate` need **Node 22.22.3+**; this box runs **20.20.2** | Nest v12 migration guide, Node requirements table | **Scaffold by hand** — do not rely on the Nest CLI generators. |
| Running Nest 12 on Node needs **20.19+** | same guide | Satisfied (20.20.2). `require(esm)` is unflagged here. |
| **Jest cannot load ESM-only v12 packages below Node 24.9** | same guide, warning box | **Vitest** for backend unit + integration tests. |
| Prisma **v7** is current | `npm view prisma version` → 8.0.0-rc.22 (RC), `@prisma/client` 7.10.0 | Pin stable **7.x**. |
| Prisma 7 **requires a driver adapter**, an `output` path, `prisma-client` provider, and **ESM** | Prisma 7 upgrade guide | `@prisma/adapter-pg`, generated client at `src/generated/prisma`. |
| Prisma 7 datasource `url` is deprecated → moved to `prisma.config.ts` | same guide | Config file carries `url` + `shadowDatabaseUrl`. |
| Next 16 requires Node `>=20.9.0` | `npm view next@16 engines` | Satisfied (20.20.2). |
| Host ports `3000`, `3001`, `5432`, `5433`, `6379`, `8080` are taken | `ss -ltnp`, `docker ps` | Chereta uses **API `4001`**, **web `3002`**, **Postgres `5541`**. |
| npm registry is slow/flaky from this machine | repeated `npm view` timeouts | `--fetch-timeout=600000 --fetch-retries=5`. |

## 3. Architectural decisions

**Stack.** NestJS 12 + Prisma 7 + PostgreSQL 16 (backend) · Next.js 16 App Router +
TypeScript + Tailwind 4 + React Hook Form + Zod (frontend) · npm workspaces monorepo
(`apps/api`, `apps/web`, `packages/contracts`).

**Modular monolith.** One deployable backend; domain modules (`auth`, `users`,
`organizations`, `tenders`, `bids`, `evaluations`, `awards`, `documents`,
`notifications`, `admin`, `audit`) separated by module boundaries and services, so
they can be extracted later without a rewrite.

**One validation language: Zod.** Nest 12 ships first-class Standard Schema support
(`@Body({ schema })` + `StandardSchemaValidationPipe`), and the frontend already
validates with Zod. `packages/contracts` exports the shared schemas, so the same
schema drives DTO validation, TypeScript types, and form validation. No class-validator.

**Money.** `Decimal(18,2)` + explicit `currency` column (default `ETB`). Never floats.

**Time.** `timestamptz`, UTC at rest; `Africa/Addis_Ababa` is the default display
timezone. All deadline checks use server time inside transactions.

**Authorization.** Two independent axes, both enforced server-side:
- **Global role** on `User`: `SUPPLIER` or `ADMIN`.
- **Organization membership** (`OrganizationMember.role`: `OWNER`/`ADMIN`/`PUBLISHER`/
  `MEMBER`) — separate from global roles; a user may belong to many organizations.
- **Evaluator** is *assignment-based* (`EvaluationAssignment`), never a standing
  organization permission.
Every protected endpoint re-derives the caller's permissions from the database
inside the request; a hidden route or disabled button is never treated as authorization.

**Bid confidentiality.** Bid *contents* (`technicalProposal`, `financialProposal`,
`offeredAmount`, bid attachments) are readable by the bidder and, after the
authorized opening stage, by assigned evaluators only. Publishers see submission
*metadata* (count, status, timestamps) before opening, never contents. Documents
live in a private bucket and are reached only through short-lived signed URLs minted
after a server-side authorization check. Every access is recorded in `BidOpening`/
`AuditLog`.

**Tender lifecycle.** An explicit transition table in code
(`TenderStateMachine`) — no arbitrary status writes; publication requires valid
dates, required documents, and evaluation criteria; bidders are notified on
material amendments; cancelled tenders keep their history.

**Async work.** PostgreSQL-backed `BackgroundJob` table polled by a worker — chosen
over Redis/BullMQ because the only real async need is reliable notification/email
delivery, and it avoids a second piece of infrastructure. A transactional outbox
row is written in the same transaction as the business change, so a failed email
never invalidates a submitted bid.

**File storage.** `StorageService` interface with two implementations: S3
(`@aws-sdk/client-s3` + presigned URLs) for production and a local-filesystem driver
for development/tests. Server-generated storage keys, sniffed content types,
per-role size caps, SHA-256 integrity hashes.

## 4. Build order (with a stop-and-prove gate after each step)

1. **Foundation** — monorepo, Docker Compose (Postgres 16 on 5541), Prisma schema,
   first migration on a clean DB, env validation, structured logging, exception
   filter, health endpoints, Swagger, CI.
   *Gate: `prisma migrate deploy` on an empty DB + `GET /health` + `nest`/`next` builds.*
2. **Auth + accounts** — register/login/refresh/verify-email/password reset,
   Argon2id, HttpOnly cookie sessions with CSRF, rate limiting, guards, `/auth/me`.
   *Gate: integration tests proving an unauthenticated caller gets 401 and a
   supplier cannot reach another supplier's data.*
3. **Organizations + verification** — org CRUD, membership, verification queue,
   document uploads, admin decisions.
   *Gate: a non-member cannot read or modify an organization.*
4. **Tenders** — categories, draft → publish lifecycle, search/filter/pagination,
   amendments, public pages.
   *Gate: state-machine tests for every legal and illegal transition.*
5. **Bids** — secure upload, drafts, deadline enforcement, receipts, withdrawal,
   revisions, confidential access.
   *Gate: negative tests — publisher cannot read bid contents pre-opening; a second
   supplier cannot read a bid; late submission is rejected by server time.*
6. **Evaluations + awards** — assignments, COI, scoring, weighted totals,
   recommendations, approval, publication.
   *Gate: an unassigned evaluator gets 403; an unapproved award cannot publish.*
7. **Notifications + dashboards** — in-app center, job queue, email provider,
   role dashboards fed by real queries.
   *Gate: dashboard numbers equal direct SQL counts.*
8. **UI polish + localization** — responsive design system, empty/loading/error
   states, a11y, SEO/sitemap, ETB/Addis timezone formatting, i18n scaffolding.
9. **Hardening + docs** — full suite, production builds, security headers/CORS/rate
   limits verified, the nine docs files, clean-setup walkthrough.

## 5. Decisions I am making now (documented defaults)

1. **Currency** — ETB default; other currencies allowed per tender, always explicit.
2. **Tender states** — the spec's ten states, implemented as one table plus a
   central transition map. `PUBLISHED` implies open for submission unless a separate
   `openingAt` is set.
3. **Weighted scoring** — optional per tender. When enabled, total =
   `Σ(score/maxScore × weight)`, weights must sum to 100; when disabled, the
   configured rule (e.g. lowest compliant price) drives the recommendation and the
   approver must still record a decision. **Lowest price is never auto-selected.**
4. **Bid opening** — two-party authorization is the default configuration
   (`openingRequiresTwoAuthorized`): the tender publisher starts the opening, a
   second authorized organization member confirms. It is a workflow control, and the
   docs will state plainly that a hash + timestamp is not a legal e-seal.
5. **MFA** — deferred as the spec allows ("later enhancement"); the schema carries
   `mfaEnabled` so it can be enabled without migration churn.

## 6. Open items needing owner approval

1. **TIN / business registration visibility** — kept private by default (spec says
   "do not expose ... publicly by default"). Confirm private-by-default is acceptable
   even for verified organizations.
2. **Budget disclosure** — implemented as a three-way setting
   (`PUBLIC` / `PARTICIPANTS` / `PRIVATE`) rather than a single global rule.
3. **Amharic** — i18n infrastructure ships in Phase 8, but **English strings only**
   until translations exist. I will not claim Amharic support before the strings are
   actually translated and font/wrapping checked.
4. **Legal review** — all retention, e-signature, procurement-threshold and
   tax-rate behaviour is configurable and unverified. The UI must not state that
   Chereta is government-affiliated or regulation-compliant.

## 7. Verified end-to-end (live server on :4001, real PostgreSQL)

Each item below was exercised over HTTP against a running API, not asserted from
source.

- **Request validation is real.** The Zod `StandardSchemaValidationPipe` is
  registered globally in `main.ts`. Proven: `?limit=2` reaches the service as a
  **number** (not the string `"2"`), `?limit=abc` returns **400** with a
  field-level message (`"limit: Invalid input: expected number, received NaN"`),
  and an unknown enum value returns 400 listing the valid options. Before this
  was wired, the `schema` metadata was stored but never consumed — invalid input
  slipped past Zod and surfaced as Prisma 500s. This is the single most important
  correctness fix in the project: request validation is the primary defense
  against malformed and malicious input.
- **Auth** — register (Argon2id, masked phone in logs), login (access token,
  `expiresIn: 900`), `/auth/me` with Bearer, 401 without a token.
- **Organizations** — create (OWNER membership auto-created), `/organizations/me`
  returns real data, admin-only endpoints 403 for a SUPPLIER, 401 unauthenticated.
- **Documents** — magic-number content sniffing rejects a text file named `.pdf`
  and an executable; a real PDF uploads with a SHA-256 checksum; signed download
  serves the file with a valid token and 401s a tampered one.
- **Tenders** — public list/search/status/region/budget filters; create draft
  (unverified org → 403, verified org → 201); owner reads own **draft** (200)
  while an anonymous caller gets 404; publish (DRAFT→PUBLISHED, appears publicly);
  amend extends a deadline (201) but shortening is rejected (400); cancel;
  a non-member creating a tender or reading an org's private list → 403.
- **Public-route actor attachment** — a `@Public()` route stays reachable
  anonymously *and* still resolves the caller when a valid token is present, so
  "tender detail" reveals the caller's own drafts. An anonymous request performs
  no extra DB work; a garbage token is ignored, never a 401.
- **State machine** — 15 unit tests cover legal/illegal transitions, role
  permission, and the publish precondition gates (verified org, criteria, weights).
- **Bids** — create/get draft, update contents, submit (sealed, 201 with an
  integrity hash + receipt), withdraw before the deadline (fresh draft created
  after), and `my-bids` dashboard. Security verified live: the submitting
  organization is derived from membership (never the body); edit-after-submit and
  re-submit both 409; a **publisher sees bid metadata only** — a leak scan of the
  metadata response found none of `technicalProposal`, `offeredPrice`, the price
  value, or proposal text; a non-member listing a tender's bids → 403; an
  unauthenticated read → 401; submitting to a closed tender → 409 with a
  server-time deadline message.
- **Bid state machine** — 13 unit tests cover the confidential lifecycle
  (contents sealed until OPENED), deadline enforcement, and role gates (a bidder
  cannot open their own bid; only an admin awards).
- **Evaluations + awards** — assign an evaluator (publisher+), declare
  conflict-of-interest, score with server-computed weighted totals, submit
  (recomputes the total, requires COI). Recommend a bid (publisher+), approve
  (admin-only), publish. Security verified live: an **unassigned** evaluator
  scoring or reading an assignment → 403; submitting without a COI declaration →
  409; a score over the criterion maximum → 400; scoring after submit → 409; a
  **non-member approving an award → 403**; and an **unapproved award cannot be
  published** — a REJECTED decision and an already-published decision both → 409.
  Publishing an approved award moved the tender to AWARDED. Weighted totals are
  recomputed server-side (verified: scores 80/70/90 of 100 at weights 50/20/30 →
  stored total 81.00) and covered by 6 unit tests.
- **Seed** — `npm run db:seed` loads 10 categories, 4 users, 3 organizations, and
  5 realistic Ethiopian tenders with eligibility, required documents, and weighted
  evaluation criteria. Dev-only password `DevOnly!Password1`.
