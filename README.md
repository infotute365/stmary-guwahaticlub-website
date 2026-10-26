# St. Mary's Guwahati Club - Next.js application

The existing public school website and admin dashboard share a Next.js 15 App Router application. Its existing Guwahati Club controllers and Mongoose models run server-side; no separate Express service is needed.

For local development:

```bash
npm ci
cp .env.example .env.local
# Privately configure MONGODB_URI, JWT_SECRET, APP_ORIGIN=http://localhost:3000.
# Remove NODE_ENV=production and UPLOAD_DIR for project-local development uploads.
# Set bootstrap credentials only if creating the first administrator.
npm run seed:admin
npm run dev
```

Runtime login uses the saved MongoDB password hash. Seeding is deliberate and idempotent; it does not reset existing passwords. Remove bootstrap credentials afterward. Keep `.env.local` private and ignored.

Production instructions, PM2/Nginx templates, persistent-upload migration, backups and rollback are in [the Hetzner guide](docs/deployment/HETZNER_DEPLOYMENT.md). [Environment variables](docs/deployment/ENVIRONMENT_VARIABLES.md) includes the controlled `AUTH_SECRET` to `JWT_SECRET` migration. The authoritative database helper is `src/server/config/database.js`, used by the API adapter and seed command.

```bash
npm test
# Optional real integration suite: disposable MongoDB only; it deletes this test DB.
TEST_MONGODB_URI=mongodb://127.0.0.1:27017/stmary_gc_test_local npm test
npm run verify:preservation
npm run build
npm audit --omit=dev
npm run start -- --hostname 127.0.0.1 --port YOUR_VERIFIED_FREE_PORT
```

Existing API families remain `/api/auth`, `/api/circulars`, `/api/staff`, `/api/gallery`, `/api/syllabus`, `/api/upload` and `/api/health`. Refresh now uses protected POST at the same `/api/auth/refresh-token` URL, deployed together with automatic frontend recovery. Existing response shapes and `/uploads/...` media URLs are retained; `/api/uploads/...` serves compatibility paths used by existing components.

See [verification results and remaining deployment checks](docs/verification/REPORT.md).
