# Shree Suryodaya Khadya Udhyog Limited — Corporate Website

A modern, responsive corporate website for a rice milling company in Gaindakot, Nawalpur, Nepal.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18 + Vite + Tailwind CSS      |
| Backend  | Node.js + Express.js                |
| Database | MongoDB + Mongoose                  |

## Project Structure

```
├── client/          # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Shared UI components
│   │   ├── pages/        # Page components
│   │   └── index.css     # Tailwind + custom styles
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/          # Express backend
│   ├── models/      # Mongoose models
│   ├── routes/      # API route handlers
│   ├── index.js     # Entry point
│   ├── seed.js      # Database seeder
│   └── .env         # Environment variables
│
└── package.json     # Root scripts
```

## Pages

| Route       | Description                          |
|-------------|--------------------------------------|
| `/`         | Home — hero, stats, products, CTA    |
| `/about`    | Company story, milestones, values    |
| `/products` | All rice varieties with filter tabs  |
| `/factory`  | Mill process, machinery, QC          |
| `/contact`  | Contact form + info                  |

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB running locally (`mongodb://localhost:27017`)

### 1. Install dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 2. Configure environment

Edit `server/.env` — the defaults work for local development with MongoDB on port 27017.

### 3. Seed the database

```bash
cd server
node seed.js
```

This inserts 6 rice products and company info into MongoDB.

### 4. Run the development servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev      # or: node index.js
```
Server runs at http://localhost:5000

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
Frontend runs at http://localhost:5173

The Vite dev server proxies `/api/*` requests to the Express backend automatically.

## API Endpoints

| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| GET    | /api/products         | All active products      |
| GET    | /api/products/:id     | Single product           |
| POST   | /api/products         | Create product           |
| PUT    | /api/products/:id     | Update product           |
| DELETE | /api/products/:id     | Delete product           |
| POST   | /api/contact          | Submit contact form      |
| GET    | /api/contact          | All contact messages     |
| GET    | /api/company          | All company info         |
| PUT    | /api/company/:key     | Update company info key  |
| GET    | /api/health           | Health check             |

## Customization

- **Company info** — Update name, phone, email, address in `Footer.jsx` and `Contact.jsx`
- **Products** — Edit seed data in `server/seed.js` and re-run `node seed.js`
- **Colors** — Modify brand palette in `tailwind.config.js`
- **Fonts** — Change Google Fonts link in `client/index.html`

## Production Build

```bash
cd client && npm run build    # outputs to client/dist/
```

Configure Express to serve `client/dist/` as static files for production deployment.
