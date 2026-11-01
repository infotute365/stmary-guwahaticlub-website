# Deployment and rollback: website editor

This is an operator guide, not evidence of a production deployment. No actual Hetzner service, school database, DNS, certificate or production upload directory was modified. Use the existing [Hetzner deployment guide](../deployment/HETZNER_DEPLOYMENT.md) and [environment reference](../deployment/ENVIRONMENT_VARIABLES.md) alongside this editor-specific guide.

## Prerequisites

- Use a supported Node release within `>=22.14.0 <25`; local execution used Node 22.14.0/npm 11.5.2 and Next 15.5.28. Validate the chosen production patch against the lockfile.
- Preserve the existing Guwahati Club `MONGODB_URI`, database name, users and collections. Do not touch the separate Maligaon application, database, port or Nginx host.
- Supply a stable private `JWT_SECRET` of at least 32 bytes, exact HTTPS `APP_ORIGIN`, `NEXT_PUBLIC_API_URL=/api`, and an absolute writable `UPLOAD_DIR` outside every application release.
- Preserve existing environment variable names and controlled authentication migration instructions. No editor-specific secret or separate admin identity is needed. Existing bootstrap/reset credentials are provisioning-only and must not remain as runtime login sources.
- Keep one PM2 fork process as configured. In-memory rate limits and serialized upload quota need shared coordination before clustering.
- Back up MongoDB and the entire persistent upload directory, including `website/` image families and private manifests. Verify permissions, free space, quota, mount readiness and restore access. A source archive is not a content backup.

The two new collections are additive: `websitecontents` and `websitecontentrevisions`. Existing `auths`, `circulars`, `staffs`, `galleries` and `syllabuses` retain their identities and contracts. No destructive migration, database rename, automatic admin reset or asset rewrite is required. Private editor access initializes the new indexes; the deployment account needs the appropriate collection/index permissions.

## Build and test an isolated release

Create a new release directory and install from the unchanged lockfile with `npm ci` where dependencies are absent. Do not build over a serving `.next` directory. Keep secrets in an external protected environment file linked into the release; do not print its contents. `NEXT_PUBLIC_API_URL` is embedded at build time.

Run in the source checkout:

```text
node scripts/run-website-content-tests.mjs --npm-test --stage05
npm run verify:preservation
node scripts/verify-website-editor.mjs
npm run build
npm audit --omit=dev
node scripts/preview-website-editor.mjs --mode production --verify-final true
```

The test runner creates its own temporary standalone MongoDB and test-only databases. Set `MONGOD_BINARY` or use `--mongod` for a locally installed server binary when necessary. Never point destructive tests at school data. Plain `npm test` without `TEST_MONGODB_URI` skips DB suites; that is insufficient for full acceptance. Do not set `TEST_MONGODB_URI` in production.

The final HTTP fixture uses fixed synthetic HTTPS-origin headers against loopback HTTP, preserves production cookie/origin enforcement, creates a fixture admin, then removes its owned database/files/processes. This is an automated API client; it does not prove a browser can use Secure cookies over local HTTP. For interactive disposable browser QA use `node scripts/preview-website-editor.mjs --port 3210` in development mode, its printed fixture account only, and send `quit` plus Enter to stop.

Complete the manual browser acceptance checklist in [TEST-RESULTS.md](TEST-RESULTS.md) before public rollout. Validate the actual Linux production-only install, runtime permissions, Nginx/TLS configuration, chosen free port and backup restore. The local release-copy restart proved runtime without docs/tests/env files using the installed production dependency tree; it did not run a clean Linux installation or reboot a VPS.

## Safe cutover

1. Identify the actual Guwahati Club process, free high port, release path, private config, database and upload root. Check existing listeners, PM2 and Nginx configuration read-only before changing anything.
2. Pause Guwahati Club writes for a coordinated database/files snapshot. Keep timestamped, private backups and the prior release. Do not run a reset-password/seed command as part of an ordinary upgrade.
3. Keep the same persistent `UPLOAD_DIR`. If moving from legacy `public/uploads`, first back up and perform a checked non-destructive copy preserving relative filenames. Compare checksums; never use `--delete`, overwrite conflicting originals or move the only copy.
4. Start the checked release using `npm run start -- --hostname 127.0.0.1 --port <verified-free-port>` with the real private runtime environment. The launcher validates MongoDB URI presence, signing key, HTTPS origin and external upload root. Do not weaken those checks to make a preview work.
5. Follow the existing isolated PM2/Nginx procedure: atomically update the application `current` link and restart via the new release's ecosystem path with updated environment. Do not change unrelated services. Run `nginx -t` before any authorized proxy reload.
6. Confirm `/api/health` for liveness and a real public data API for database readiness. Health alone does not prove MongoDB or published overrides are available.
7. Verify all 23 public routes, original branding/payment destinations, metadata, login/refresh/logout, private editor access, shared publication and original/history restoration. Exercise existing business modules using approved temporary records only.
8. Upload a verification image, save it, record its public URL and checksum, restart only this application, and verify the same URL/checksum and history. Then restore the original field. Retain the replacement family for history. Separately check mount persistence across an authorized reboot/release switch.

Production cookies are Secure even if `COOKIE_SECURE=false`; configure HTTPS. The proxy must overwrite `X-Real-IP` and the application must be loopback-only before setting `TRUST_PROXY_IP=true`. Match Nginx request limits to application upload limits; private manifests must continue to be served only through the validating application routes, never an unrestricted filesystem alias.

## Rollback

For an application regression, stop Guwahati Club writes, retain diagnostic evidence, point `current` back to the known-good compatible release and restart through its ecosystem path. Keep the current database and persistent uploads. A code rollback must not erase recent school records, content history or image families. An older release without editor readers will show original defaults while retaining new content data for a later forward fix. Recheck auth compatibility before using a pre-auth-refactor release; it may require re-login and the legacy secret/storage mapping described in the deployment guide.

For a content mistake, prefer per-field **Restore original** or historical restoration rather than rolling back code/database. Each restoration appends a revision and checks the current expected revision.

Restore database/files only for confirmed data loss/corruption, under a separately authorized recovery procedure. Restore a coordinated snapshot into an isolated target first; verify users, school records, revisions, manifests and image checksums. Stop writes during any approved live restore and use the matching upload snapshot. Do not restore an old database over newer school records as routine deployment rollback.

Monitor errors, PM2 restarts/memory, database readiness, disk/quota, backups and TLS renewal. Image history is intentionally retained with no automatic garbage collector; plan capacity and reviewed retention without breaking rollback references. Do not log request credentials or private environment values.
