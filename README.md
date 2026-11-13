# Offline-First PWA Storefront

**A full-stack e-commerce Progressive Web Application with offline browsing, a persistent cart, and a queued order sync workflow.**

### Authors
- Siddharth Goyal (24BCS11899)
- Tanushvi Madaan (24BCS11528)

**Institution:** Chandigarh University  
**Department:** Computer Science and Engineering  
**Supervisor:** Vankatesh K (E19930)  
**Academic year:** 2026

## Overview
The storefront is a React-based Progressive Web App (PWA) connected to a Node.js/Express API and MongoDB. It supports product browsing, search and category filtering, product details, wishlist, cart, checkout, and an order history view. IndexedDB keeps client-side information, including an offline order queue. A service worker caches the app shell and selected network responses so repeat browsing can work without an internet connection (provided required content was previously cached).

**Note:** This is an educational demonstration, not a production payment-processing store. Offline support and order synchronization require verification against a running deployment, and queued submissions may need robust retry/idempotency improvements before real use.

## Technology Stack
| Area | Technology |
|---|---|
| Frontend | React 18, Vite, React Router |
| PWA | vite-plugin-pwa, Workbox, web manifest |
| Local persistence | IndexedDB |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Frontend deployment | Vercel |
| Backend deployment | Render |
| Cloud database | MongoDB Atlas |

## Features
- Browse products by category; search and view product details
- Shopping cart and wishlist
- Checkout and order history
- IndexedDB-backed local cart and offline order queue
- Synchronization when network connectivity returns
- Installable PWA on supported browsers
- Service worker asset and API response caching

## Project Structure
```text
.
├── client/
│   ├── public/icons/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── db/
│   │   └── config.js
│   ├── vite.config.js
│   ├── vercel.json
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   └── package.json
└── README.md
```

## Run Locally
**Requirements:** Node.js 20+, npm, MongoDB locally or a MongoDB Atlas connection.

1. In one terminal, set up and start the server:
   ```bash
   cd server
   npm install
   ```
   Copy `server/.env.example` to `server/.env`, then set `MONGO_URI` to your database connection string. For local use, retain `PORT=5000`, `CLIENT_ORIGIN=http://localhost:5173`, `NODE_ENV=development`.
   ```bash
   npm run dev
   ```
2. In another terminal, start the frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Open `http://localhost:5173`.
3. Seed sample products **once** using Postman or this command:
   ```bash
   curl -X POST http://localhost:5000/api/products/seed/run
   ```
4. Check API health: `http://localhost:5000/api/health`.

**Local API setup:** `client/vite.config.js` proxies `/api` to port `5000`. You do not need a frontend `.env` file for local development.

## Deployment: MongoDB Atlas + Render + Vercel

### 1. Publish to GitHub
Do not upload `node_modules`, `server/.env`, or private credentials; `.gitignore` excludes them. At the repository root:
```bash
git init
git add .
git commit -m "Initial full-stack PWA storefront"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/offline-first-pwa-storefront.git
git push -u origin main
```
Create an empty GitHub repository with that name before running the remote/push commands.

### 2. MongoDB Atlas
Create an Atlas cluster and a database user. Copy the **Drivers / Connect your application** MongoDB URI. In Atlas Network Access, permit the backend's outbound IP addresses (Render documents how to locate them). Do not put credentials in GitHub or the browser.

### 3. Render — Backend
- New **Web Service** → connect GitHub repository
- **Root Directory:** `server`
- **Runtime/Language:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment variables:**
  - `MONGO_URI` = your MongoDB Atlas connection URI
  - `NODE_ENV` = `production`
  - `CLIENT_ORIGIN` = your Vercel frontend URL, e.g. `https://your-project.vercel.app` (no trailing slash)
  - `PORT` can be omitted; Render supplies it.
- Deploy and test `https://YOUR-RENDER-NAME.onrender.com/api/health`.

### 4. Vercel — Frontend
- Add New → Project → import **same** GitHub repository
- **Root Directory:** `client`
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:** `VITE_API_URL` = `https://YOUR-RENDER-NAME.onrender.com` (no trailing slash and no `/api`)
- Deploy; `client/vercel.json` allows refreshing React Router URLs.
- After you know the Vercel domain, update Render's `CLIENT_ORIGIN` to match that precise HTTPS URL; redeploy/restart backend if needed.
- **Seed demo data once:** in Postman send `POST https://YOUR-RENDER-NAME.onrender.com/api/products/seed/run`. Only do this on a demo backend you control; this educational endpoint is publicly accessible and should be protected/disabled before production use.

### 5. Verify public demo
- Backend `/api/health` returns JSON status `ok`.
- Frontend home and products pages load sample products.
- Search, detail, cart and checkout work with the live backend.
- In browser DevTools → Network, select Offline, reload a previously visited page; check cache behavior.
- Queue an order offline; reconnect; check resulting order and server state.
- Check browser DevTools → Application → Manifest and Service Workers for installability.

## API Endpoints
| Method | Route | Function |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/products` | Product listing / filters |
| GET | `/api/products/:slug` | Product details |
| POST | `/api/products/seed/run` | Seed demo catalog (demo only) |
| GET | `/api/categories` | Categories |
| POST | `/api/orders` | Submit online order |
| POST | `/api/orders/sync` | Submit queued offline orders |
| GET | `/api/orders?clientId=...` | Retrieve order history |

## Environment Variables
Never commit your real `server/.env` file or expose `MONGO_URI` in the frontend.

**Server** (`server/.env.example`): `MONGO_URI`, `CLIENT_ORIGIN`, `NODE_ENV`, optional `PORT`.  
**Client** (`client/.env.example`): optional `VITE_API_URL` for a separate API origin.

## Known Limitations / Further Improvements
- No real payment gateway or authenticated user accounts.
- Seed endpoint should be restricted before any real deployment.
- Order endpoints need authentication, ownership checks, input validation, and request rate limits for production.
- Offline synchronization should add idempotency keys and partial-success handling to prevent duplicates or lost orders during retries.
- Images hosted on external services might not be available offline until cached.
- Verify all routes and offline behavior in the actual deployment.

## Project Report
A university project report accompanies the repository separately. The report's diagrams and illustrative UIs are explanatory; for final assessment, capture screenshots of the live deployment and actual tests.
