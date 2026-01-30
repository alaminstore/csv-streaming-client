# CSV Streaming Client

React frontend for real-time CSV import monitoring with customer CRUD operations.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS

## Setup

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Set `VITE_API_BASE_URL` in `.env` (default: `http://localhost:3000`)

## Run

```bash
# Development
npm run dev

# Build
npm run build
```

## Features

- Real-time CSV import progress via SSE
- Customer table with pagination
- CRUD operations (Create, Edit, Delete)
- Success/Error notifications
