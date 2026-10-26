# Hetzner deployment: St. Mary's Guwahati Club

This is an isolated Next.js 15 application: Internet -> HTTPS/Nginx -> one loopback-bound Node.js process -> MongoDB. Persistent uploads live outside application releases. Do not change the Maligaon service, port, files, Nginx host or database. No deployment has been performed by this refactor.

## Source and runtime structure

```text
app/(site)/                  existing public pages, unchanged
app/admin/                   existing dashboard pages, unchanged
app/login/                   existing login page, unchanged
app/api/[...path]/route.js    existing API entry point
app/uploads/[...path]/       validated public media serving
app/api/uploads/[...path]/   compatibility media serving
src/server/config/database.js    authoritative cached Mongoose connection
src/server/config/auth.js        tokens, cookies and session checks
src/server/config/localStorage.js persistent storage and path checks
src/server/controller/       existing Guwahati Club modules
src/server/middleware/       access and refresh authentication
src/server/model/            existing model/collection registrations
src/server/util/             validation, image processing and serving
src/services/api.js          same API service functions; refresh recovery
scripts/seed-admin.mjs       deliberate one-time provisioning/recovery
scripts/start.mjs            production configuration validation + Next.js
scripts/verify-preservation.mjs  hashes existing website files
deploy/ecosystem.config.cjs  PM2 example, requires a checked free port
deploy/nginx.conf.example    isolated HTTP/HTTPS server blocks
deploy/nginx-proxy.conf.example  shared proxy headers/timeouts
tests/                      unit and disposable MongoDB integration tests
public/                     original assets; development upload default
```

Use a maintained Node.js 22 LTS patch (project minimum 22.14.0), or Node.js 24 LTS. Installed Next.js 15.5.28 requires Node `^18.18.0 || ^19.8.0 || >=20.0.0`; Sharp requires >=20.9.0. The project deliberately has a narrower supported range, `>=22.14.0 <25`. Node.js 22.14.0 was used for local verification; deploy the latest supported security patch. No Docker migration is required.

## Isolate the deployment and select the port

On the actual VPS, first inspect existing services, storage and ports:

```bash
sudo ss -ltnp
pm2 list
sudo nginx -T
```

Select a free high port; this guide calls it `GC_PORT` and does not assume 3000. Check the proposed value:

```bash
export GC_PORT=REPLACE_WITH_VERIFIED_FREE_PORT
sudo ss -ltnp "sport = :$GC_PORT"
```

Continue only if no listener uses it. The local Windows test port says nothing about the Hetzner VPS. Give this application its own unprivileged user and directories (commands require an operator with sudo):

```bash
sudo adduser --disabled-password --gecos '' stmarys-gc
sudo install -d -o stmarys-gc -g stmarys-gc -m 0750 /srv/stmarys-guwahati-club/releases
sudo install -d -o stmarys-gc -g stmarys-gc -m 0750 /var/lib/stmarys-guwahati-club/uploads
sudo install -d -o stmarys-gc -g stmarys-gc -m 0700 /etc/stmarys-guwahati-club
```

Place releases under `/srv/stmarys-guwahati-club/releases/<release-id>` with ownership `stmarys-gc:stmarys-gc`. `/srv/stmarys-guwahati-club/current` points to the selected release. Neither Nginx nor public users need filesystem read access to uploads: the validated application route streams files. Keep private documents elsewhere; this upload API is for existing public school media and PDFs.

## MongoDB

Use the existing Guwahati Club database name from its private URI when upgrading. Do not replace it with the example name or rename `auths`, `circulars`, `staffs`, `galleries` or `syllabuses`. No school-data migration is needed. Review any existing collection/index state before deployment.

For a new database, install a supported MongoDB release using the [official installation instructions](https://www.mongodb.com/docs/manual/installation/). Through an authenticated `mongosh` administration session, select the isolated example database and create a dedicated user. `passwordPrompt()` avoids putting the password in command history:

```javascript
use stmarys_guwahati_club
db.createUser({ user: 'guwahati_club_app', pwd: passwordPrompt(), roles: [{ role: 'readWrite', db: 'stmarys_guwahati_club' }] })
```

Enable MongoDB authorization and bind to loopback/private interfaces in `/etc/mongod.conf`; never expose 27017 to the Internet. On a shared server, coordinate database service configuration/restarts with its administrator: do not disrupt Maligaon. Existing authentication/replica-set setup must be preserved. Use a separate backup account with appropriate backup permissions. For a remote database, restrict firewall/source addresses and use verified TLS.

The runtime URI should identify this database and its dedicated user, for example `mongodb://guwahati_club_app:<URI_ENCODED_PRIVATE_PASSWORD>@127.0.0.1:27017/stmarys_guwahati_club?authSource=stmarys_guwahati_club`. Configure the actual URI privately, never in a command copied into logs.

## Environment and initial administrator

Create `/etc/stmarys-guwahati-club/app.env` privately from `.env.example`, owned by `stmarys-gc`, mode 0600. Link it into each release as `.env.production.local`. See [all variables and migration instructions](ENVIRONMENT_VARIABLES.md). Required runtime settings are `NODE_ENV=production`, the existing `MONGODB_URI`, `JWT_SECRET`, exact HTTPS `APP_ORIGIN`, `NEXT_PUBLIC_API_URL=/api`, and an external `UPLOAD_DIR`. Configure the quota and `TRUST_PROXY_IP` deliberately. Do not print the file or use `pm2 env` in shared logs.

```bash
sudo chmod 0600 /etc/stmarys-guwahati-club/app.env
# In the new release directory, as stmarys-gc:
ln -s /etc/stmarys-guwahati-club/app.env .env.production.local
npm ci
```

Only for the first account, set `ADMIN_INITIAL_EMAIL` and a strong `ADMIN_INITIAL_PASSWORD` privately, then run:

```bash
NODE_ENV=production npm run seed:admin
```

Seeding uses the centralized DB connection, the existing Auth model and bcrypt cost 12. It never overwrites an existing password on rerun and refuses initial provisioning of another email when an admin exists. Run provisioning as a single operator task, not concurrently or during every startup. Remove bootstrap variables after provisioning; runtime login uses MongoDB hashes exclusively.

Intentional recovery targets the exact configured existing email, refuses disabled/missing accounts, requires a strong replacement password and revokes old sessions:

```bash
NODE_ENV=production npm run seed:admin -- --reset-password
```

`--repair-password` remains a compatibility alias. Do not run either flag during normal deployment. Existing administrator credentials remain valid without seeding. Run reset only after confirming the target account and backing up the database. The script never logs credentials and disconnects on completion; failure gives a redacted error to avoid URI disclosure.

## Build, verify and start

As the application user in the release directory:

```bash
npm ci
npm test
npm run verify:preservation
npm run build
npm audit --omit=dev
npm run start -- --hostname 127.0.0.1 --port "$GC_PORT"
```

`npm test` runs unit tests. To include the real database suite, use a disposable database on a test MongoDB service, never the school database:

```bash
TEST_MONGODB_URI=mongodb://127.0.0.1:27017/stmary_gc_test_deployment npm test
```

That suite deletes the explicitly named test database afterward. Run it outside production credentials; the test URI must contain a `stmary_gc_test_...` database name. The build does not need to query MongoDB or embed server secrets. Production start validates the required server settings before listening. Do not build inside the currently serving release; that can break its static chunks.

## PM2

Install PM2 under the application user's maintained Node installation, or use your existing package-management policy. Keep this app in its own user PM2 namespace. After creating/updating the `current` symlink and confirming the port is still free:

```bash
cd /srv/stmarys-guwahati-club/current
export GC_PORT=REPLACE_WITH_VERIFIED_FREE_PORT
pm2 start deploy/ecosystem.config.cjs --only stmarys-guwahati-club
pm2 save
pm2 startup
```

Execute only the exact sudo startup command PM2 prints for `stmarys-gc`, then save again. Use one fork process as supplied: the application rate buckets, upload admission limit and serialized quota are per-process. A cluster or multiple instances require shared rate/quota coordination first. Rotate PM2 logs and alert on repeated restarts; do not log bodies, cookies, tokens or database URIs.

```bash
pm2 logs stmarys-guwahati-club --lines 100
GC_PORT="$GC_PORT" pm2 restart /srv/stmarys-guwahati-club/current/deploy/ecosystem.config.cjs --only stmarys-guwahati-club --update-env
pm2 save
```

Use the ecosystem-path restart after changing the `current` symlink so PM2 updates its script and working directory. Restarting only the process name can retain an old release path. The launcher forwards termination signals to Next.js.

## Nginx and HTTPS

Create DNS A/AAAA records for the actual Guwahati Club domain. Inspect existing Nginx virtual hosts first; add a separate configuration. Replace every `GC_DOMAIN` and `GC_PORT` in the two templates. Install the proxy snippet as `/etc/nginx/snippets/stmarys-guwahati-club-proxy.conf` and the server configuration under the distribution's `sites-available`/`sites-enabled` mechanism. The two zone declarations belong in `http` context, which normally includes `sites-enabled` on Ubuntu/Debian.

For first certificate issuance, install only the HTTP server block first; enable the full HTTPS block after certificates exist. Create `/var/www/letsencrypt`, configure its ACME location as supplied, and run:

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo certbot certonly --webroot -w /var/www/letsencrypt -d REPLACE_WITH_ACTUAL_DOMAIN
# Enable the completed HTTPS block after replacing all placeholders.
sudo nginx -t
sudo systemctl reload nginx
sudo certbot renew --dry-run
```

Review the existing firewall before changes. Allow only the required public HTTP/HTTPS ports and maintain your SSH access; do not expose the application port or MongoDB. Bind Next.js to 127.0.0.1. If using an additional CDN/load balancer, review trusted address handling before changing `TRUST_PROXY_IP`; the supplied config assumes Nginx is the public edge.

Nginx overwrites host, scheme and IP headers; the application origin authority is still `APP_ORIGIN`. Set `TRUST_PROXY_IP=true` only under this isolation. Otherwise leave false (shared throttling). The 21 MiB proxy request limit matches application multipart limits: max four 5 MiB images, or one 15 MiB PDF; JSON is capped at 128 KiB. The app admits two simultaneous upload requests, and Nginx caps two per client IP. Login throttles are layered in Nginx and the app. No wildcard CORS is configured. HTTPS includes HSTS without `includeSubDomains`; verify HTTPS before enabling it. App security headers preserve existing image allowlists and rendering.

The examples forward `/_next/static/`, media and API requests to Next.js. Static chunks retain Next.js caching, API responses use `no-store`, and uploads use one-hour public caching plus nosniff and a sandbox policy. Nginx preserves JSON error responses (`proxy_intercept_errors off`) and reports upstream failures in its dedicated error log. These public upload routes never serve hidden files, symlinks, executable extensions or arbitrary filesystem paths.

## Preserve existing uploads and release safely

Before first external-storage cutover, stop Guwahati Club writes (do not stop Maligaon). Back up the existing `public/uploads` directory. Use a non-destructive dry run followed by a copy that preserves every relative name:

```bash
rsync -a --dry-run /ABSOLUTE/OLD_GUWAHATI_RELEASE/public/uploads/ /var/lib/stmarys-guwahati-club/uploads/
rsync -a /ABSOLUTE/OLD_GUWAHATI_RELEASE/public/uploads/ /var/lib/stmarys-guwahati-club/uploads/
sudo chown -R stmarys-gc:stmarys-gc /var/lib/stmarys-guwahati-club/uploads
sudo find /var/lib/stmarys-guwahati-club/uploads -type d -exec chmod 0750 {} \;
sudo find /var/lib/stmarys-guwahati-club/uploads -type f -exec chmod 0640 {} \;
```

Check all source/target absolute paths before running; use only the named Guwahati upload directory. Do not use `--delete`, move files or rewrite database URLs. Compare checksums/counts and request representative existing `/uploads/...` and `/api/uploads/...` files before cutover. Resolve any conflicting pre-existing destination names with the operator before copying. Keep the old files as rollback evidence.

For subsequent releases: install/build in a new release, link the same external environment, preserve the same `UPLOAD_DIR`, back up, atomically repoint `current`, restart the isolated PM2 process via its ecosystem path, and run the checks below. Uploads are outside `.next` and the release; rebuilding or switching releases does not copy/delete them. On a mount-backed directory, make service startup depend on the mount being available.

## Backups, logging and recovery

Schedule encrypted, access-controlled, off-VPS database and upload backups with retention. Use a private MongoDB Database Tools configuration file (mode 0600) for URI/credentials instead of placing passwords in command arguments. For example, after configuring the official tool's private `--config` file:

```bash
mongodump --config=/etc/stmarys-guwahati-club/backup.yml --db=ACTUAL_GUWAHATI_DATABASE --archive=/PRIVATE_BACKUP_DIRECTORY/guwahati.archive.gz --gzip
rsync -a /var/lib/stmarys-guwahati-club/uploads/ /PRIVATE_BACKUP_DIRECTORY/uploads/
```

Use versioned/timestamped backup destinations rather than overwriting the only backup. Stop writes or coordinate consistent snapshots during backup; a standalone live dump plus separate file copy is not an atomic snapshot. Test restore into an isolated database/directory periodically; verify media references and authentication. Do not restore over live data as a routine app rollback. A separate backup identity should not be reused as the runtime app user.

Monitor PM2 uptime/restarts/memory, application error counts, Nginx upstream errors, upload quota/free disk, backup completion and certificate renewal. `/api/health` reports application liveness without requiring MongoDB; separately probe `/api/circulars` for database readiness. MongoDB failure returns controlled 503 responses. Avoid including query/body/cookie data in diagnostics.

Rollback: keep the previous release and private environment backup. Stop the Guwahati Club process, repoint `current` to the known-good release, and restart via that release's ecosystem configuration (or its existing isolated launcher). Keep the same database and persistent uploads; do not restore an old database snapshot or remove new files. Before using a pre-refactor release, set its required `AUTH_SECRET` to the same private key and give its expected `public/uploads` path a link to persistent storage. Old auth code cannot consume hashed refresh tokens, so require admins to log in again. Newly added session fields are additive and do not rename collections. Do not run the old and new application concurrently. Verify health, public data, login and uploaded files before reopening writes.

## Troubleshooting and post-deployment checks

| Symptom | Check |
| --- | --- |
| 404 API/media | Exact `/api/...` path and HTTP method; refresh is POST. Check uploaded relative filename, `UPLOAD_DIR`, both serving routes, and correct release. Invalid/hidden/unsupported files are deliberately not served. |
| 401 | Saved account/password hash, active admin role, token expiry/session version. Re-login after deliberate secret rotation/reset; check the frontend retry and POST refresh. |
| 403 login/mutations | Exact browser Origin vs `APP_ORIGIN`; correct public HTTPS domain; scripts with cookies must send Origin. Never weaken this by trusting forwarded hosts. |
| 400/413/415 | Input/ID validity, password strength, JSON content type, per-file and request sizes. Class 11/12 updates retain the existing stream requirement. |
| 429 | Login/refresh/upload throttles or concurrent upload limit. With `TRUST_PROXY_IP=false`, buckets are shared; inspect trusted proxy isolation before enabling real IPs. |
| 500/503/507 | Server configuration, MongoDB state, file permissions or quota. Do not print URIs/secrets. Preserve logs without request credentials. |
| Mongo timeout | Mongo service, URI encoding, authSource, database user permission, firewall/DNS/TLS and private connectivity. Failed initial connections can retry; established clients let the Mongo driver reconnect. |
| Cookies absent/looping | HTTPS, Secure/HttpOnly/SameSite=Lax, path=/, same-origin `/api`, no cross-domain frontend URL, proxy scheme, clock and 900/604800-second lifetimes. Cookies remain Secure in production. |
| Upload permission failure | Application user can traverse/write external root, disk has room, mount exists, no symlinked child path, quota has capacity. Nginx serves through the application and does not need upload filesystem ownership. |
| 502 | PM2 running, correct working directory/build, matching verified port in PM2/Nginx, loopback listener and proxy error log. |
| Old chunks after release | Build outside current release; retain previous releases briefly for active browsers; verify Next static paths and reload. |

After deploy and after a controlled PM2 restart, VPS restart and release switch, verify:

1. `/api/health` returns its existing status/timestamp shape, and `/api/circulars` confirms database readiness.
2. Public pages/navigation, school branding, images and PDFs match the existing website.
3. Existing admin login, dashboard access, inactive/draft list visibility and public filtering work.
4. Circular/staff/gallery/syllabus CRUD, gallery image titles/deletion, single/multiple images and PDFs work with a test record that is removed afterward.
5. Password change and logout/re-login work; no tokens appear in response JSON. Expired access recovers using POST refresh; a replayed refresh is rejected.
6. Unauthenticated writes/uploads and cross-origin mutations fail. Check `Secure`, `HttpOnly`, `SameSite=Lax` and cookie lifetimes through browser developer tools without sharing cookie values.
7. An uploaded verification file retains the same URL and SHA-256 after rebuild, PM2 restart, VPS reboot and the next release. Backups and rollback are tested.

Actual Hetzner port availability, DNS, certificate issuance, Nginx syntax on that machine, permissions, backup restores and reboot persistence remain operator checks. A Docker setup was not found in this target project. If your infrastructure already uses Docker, keep it: bind the same external upload directory into the container, inject private runtime variables, expose only the internal app port to Nginx, and back up MongoDB and the volume separately; a container rebuild must not replace uploads.

The reverse-proxy approach follows [Next.js self-hosting guidance](https://nextjs.org/docs/app/guides/self-hosting). See [Nginx proxy documentation](https://nginx.org/en/docs/http/ngx_http_proxy_module.html) for the supplied forwarding/timeouts and [Mongoose connection lifecycle](https://mongoosejs.com/docs/connections.html) for driver-managed reconnect behavior.
