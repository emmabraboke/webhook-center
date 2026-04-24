# WebhookCenter

WebhookCenter is a multi-tenant webhook gateway. Send events to your customers' endpoints with guaranteed delivery — HMAC-signed payloads, automatic retries with exponential backoff, per-attempt logs, and a full management API for endpoints, subscriptions, and team access control.

## Stack

- **NestJS** — modular architecture, dependency injection
- **Prisma ORM** + **PostgreSQL** — database
- **BullMQ** + **Redis** — reliable delivery queue
- **@keyv/redis** — distributed cache (OTP storage, rate limiting)
- **@nestjs/mailer** + Handlebars — transactional email
- **Zod** — environment variable validation
- **Swagger / Scalar** — interactive API documentation

---

## Prerequisites

- Node.js 20+
- PostgreSQL
- Redis

---

## Getting Started

### 1. Clone and install

```sh
git clone https://github.com/emmabraboke/webhook-center
cd webhook-center
npm install
```

### 2. Configure environment

```sh
cp .env.sample .env
```

Fill in the values in `.env` — all required keys are listed with comments in `.env.sample`.

### 3. Database setup

```sh
npx prisma migrate dev
npx prisma generate
```

### 4. Run

```sh
# development
npm run start:dev

# production
npm run start:prod
```

---

## URLs

| Resource | URL |
|---|---|
| API base | `http://localhost:3000/v1` |
| Swagger UI | `http://localhost:3000/documentation` |
| Scalar docs | `http://localhost:3000/docs` |
| Health check | `http://localhost:3000/v1/health` |

---

## API Overview

| Tag | Endpoints |
|---|---|
| Auth | Register, login, verify email, forgot/reset password, refresh token, accept invite, logout, me |
| Business | CRUD businesses |
| Projects | CRUD projects within a business |
| Roles | CRUD roles with permissions (Admin only) |
| Business Members | List, update role, remove members |
| Member Invites | Send, list, revoke invites |
| Webhook Endpoints | CRUD endpoints, roll signing secret |
| Webhook Subscriptions | Subscribe endpoints to event types |
| Events | Ingest events, list events and deliveries |
| Event Deliveries | Get delivery, list attempts, replay failed |
| User | List all users (Admin) |
| Health | Service health status |

---

## Delivery Pipeline

```
POST /v1/projects/:projectId/events
  → WebhookEvent created
  → Find active endpoints subscribed to the event type
  → EventDelivery created per endpoint → queued in BullMQ
  → DeliveryWorker: HMAC-sign payload → POST to endpoint URL → record DeliveryAttempt
  → On failure: exponential backoff (2^n × 30s), up to endpoint maxRetries
  → Manual replay: POST /v1/event-deliveries/:id/replay
```

## Auth Flow

```
POST /v1/auth/register      → sends OTP email → returns { accessToken, refreshToken, otpId }
POST /v1/auth/verify-email  → { otpId, otp } → activates account
POST /v1/auth/login         → blocked if email unverified or account suspended
POST /v1/auth/logout        → increments tokenVersion, invalidates all existing JWTs
```

## RBAC

- `Role` holds a `permissions[]` array — managed by platform admins
- `BusinessMember.roleId` → FK to `Role` (one role per membership)
- `JwtStrategy` attaches `request.user.permissions` from the `:businessId` route param
- `PermissionsGuard` reads already-attached permissions — no extra DB query per request

---

## Docker

**Local development** — spins up the app, PostgreSQL, and Redis together:

```sh
docker compose up
```

**Production** — runs the app container against your managed Postgres and Redis:

```sh
docker build -t webhook-center .
docker run --env-file .env -p 3000:3000 -d webhook-center
```
