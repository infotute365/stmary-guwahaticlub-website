# St. Mary's School — Single Next.js Full-Stack App

The project is now one Next.js application. The former Express backend logic lives inside `src/server` and is exposed through Next.js Route Handlers. There is no separate backend process.

## Structure

```text
SeintMaris/
├── app/
│   ├── (site)/
│   ├── admin/
│   ├── login/
│   ├── api/[...path]/route.js
│   ├── globals.css
│   ├── layout.jsx
│   └── not-found.jsx
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   └── server/
│       ├── controller/
│       ├── middleware/
│       ├── model/
│       ├── util/
│       ├── db.js
│       └── route-adapter.js
├── public/
├── .env.local
└── package.json
```

## Run

```bash
cp .env.example .env.local
npm install
npm run seed:admin
npm run dev
```

Open `http://localhost:3000`.

Set your MongoDB and authentication credentials in `.env.local`. The app requires `MONGODB_URI`, `AUTH_SECRET`, and the initial admin provisioning values (`ADMIN_INITIAL_EMAIL` and `ADMIN_INITIAL_PASSWORD`). Uploaded images and PDFs are stored locally under `public/uploads`, so the VPS must keep that directory on persistent storage and include it in backups.

## Admin bootstrap

```bash
npm run seed:admin
```

This creates the first database-backed administrator only when the account does not already exist. It never overwrites an existing admin password or creates duplicates. Do not use the seed values as the runtime login mechanism; login verifies against the stored password hash in MongoDB.

## API compatibility

The frontend still calls `/api`, but these are now handled directly by Next.js:

`/api/auth/*`, `/api/circulars/*`, `/api/staff/*`, `/api/gallery/*`, `/api/syllabus/*`, `/api/upload/*`, and `/api/health`.

The existing UI and frontend service layer are preserved; only the backend execution layer has moved into the Next.js application.
