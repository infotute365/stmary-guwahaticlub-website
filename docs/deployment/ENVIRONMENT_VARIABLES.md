# St. Mary's Guwahati Club environment variables

Use a private `.env.local` for development. For deployment, keep a mode-0600 `/etc/stmarys-guwahati-club/app.env`, owned by the application user, and link it into each release as `.env.production.local`. Next.js, the seed command and the production launcher use Next.js environment loading; already exported variables take precedence. Do not commit environment files. No secret belongs in `NEXT_PUBLIC_*`.

| Variable | Required | Scope | Meaning |
| --- | --- | --- | --- |
| `NODE_ENV` | Production | Server | `production` on the VPS; `npm run dev` sets development. |
| `MONGODB_URI` | Runtime and seed | Server, secret | Existing Guwahati Club database URI. The example database name is not a migration instruction. Preserve the actual database and its existing collection names. URI-encode credentials; use `authSource` matching the user database. |
| `JWT_SECRET` | Runtime | Server, secret | At least 32 bytes of private random data, stable across restarts. Placeholder values are rejected. See migration below. |
| `APP_ORIGIN` | Production runtime | Server | Exact public HTTPS origin, with no path/query, such as `https://guwahati-club.example.com`. All browser mutation origins must match. Never derive it from proxy headers. Optional in development, where request origin is used. |
| `NEXT_PUBLIC_API_URL` | Optional | Public, embedded at build | `/api` (default). Keep same-origin. Changing it requires rebuilding. Existing frontend media consumers also use it; an unrelated backend URL is not supported by this deployment. |
| `UPLOAD_DIR` | Production | Server | Absolute persistent writable path outside the release, e.g. `/var/lib/stmarys-guwahati-club/uploads`. Development defaults to existing `public/uploads`. Shared by every release and the file-serving routes. |
| `UPLOAD_MAX_BYTES` | Optional | Server | Total upload quota, default `1073741824` (1 GiB), minimum 20 MiB. No automatic file purging. Increase deliberately and monitor free space. Quota enforcement assumes the supplied single-process PM2 configuration. |
| `TRUST_PROXY_IP` | Optional | Server | Default `false`: login throttling uses a shared bucket, safely ignoring supplied IP headers. Set `true` only when the app is loopback-bound behind the supplied Nginx config, which overwrites `X-Real-IP`. |
| `COOKIE_SECURE` | Optional | Server | `true` enables Secure cookies in development; production always uses Secure regardless of this value. It cannot disable production HTTPS requirements. |
| `ADMIN_INITIAL_EMAIL` | Provision/reset only | Server, private | Valid administrator email. Never a runtime login source. Remove after provisioning. |
| `ADMIN_INITIAL_PASSWORD` | Provision/reset only | Server, secret | At least 12 characters, upper/lowercase, number and symbol, maximum 72 UTF-8 bytes (bcrypt limit). Never trimmed, logged or stored plaintext. Remove after provisioning. |
| `PORT` | Operations | Server | Chosen free application port. The PM2 example passes `GC_PORT` as a CLI port instead of assuming 3000. |
| `GC_PORT` | PM2 example | Server/PM2 | Set to the port verified free on the actual VPS; required when evaluating `deploy/ecosystem.config.cjs`. |
| `GC_CWD` | PM2 example | Server/PM2 | Optional absolute deployment path; defaults to `/srv/stmarys-guwahati-club/current`. |
| `TEST_MONGODB_URI` | Integration tests only | Server/test | Explicit disposable database URI with database name starting `stmary_gc_test_`. Tests drop that database. Never configure it in the production environment. Without it the DB integration test is explicitly skipped. |
| `AUTH_SECRET` | Removed | Legacy server secret | Not read by runtime code. Migrate as below; do not keep competing signing secrets. |
| `CLIENT` | Removed | Legacy server | Replace with `APP_ORIGIN`. Not read by runtime code. |

## Controlled authentication migration

1. Back up the private configuration and database before the release. Stop the previous Guwahati Club process during cutover; never run the old and new authentication writers concurrently.
2. Set `JWT_SECRET` to the exact existing private `AUTH_SECRET` value if it meets the validation requirements. Remove `AUTH_SECRET`. This preserves existing HS256 access tokens until their 15-minute expiry. Versionless legacy tokens are accepted only while the account session version is zero. No second/fallback signing key exists.
3. If the existing secret is short/weak, replace it deliberately and communicate that administrators must log in again. Do not reset their database passwords.
4. Existing UUID refresh tokens are accepted only while their saved seven-day expiry remains valid. Their first POST rotation replaces plaintext with a SHA-256 hash in the existing `refreshToken` field. All new tokens use 256 bits of random data. The last 64 consumed hashes support replay detection; replay of an older untracked token is still rejected. Recognized replay revokes the current session.
5. Login replaces the existing single account session. Password change rotates the current session and invalidates previous tokens. Logout and intentional recovery reset revoke saved sessions. Administrator email/password hashes are preserved unless a reset is explicitly invoked.
6. Deploy the frontend and backend together: `/api/auth/refresh-token` now uses POST. GET deliberately returns 404 to prevent state changes through links/prefetch. Successful response bodies and the visible login flow are unchanged.

The app uses HttpOnly, SameSite=Lax, path=/ cookies: access 900 seconds, refresh 604800 seconds. Scripted cookie mutations must send `Origin: <APP_ORIGIN>`; cookie-authenticated mutations without Origin are rejected. Authentication endpoints do not return tokens in JSON. Do not include cookies, request bodies or environment dumps in logs.
