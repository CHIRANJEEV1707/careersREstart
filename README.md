# REstart Hiring Platform

This is a [Next.js](https://nextjs.org) project.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## MongoDB Configuration

### Local Development causing SRV Errors
Due to intermittent DNS/TLS issues with MongoDB Atlas SRV records (`mongodb+srv://`) on local networks/Windows, we enforce using a **direct connection string** (`mongodb://`) for local development.

**Correct .env.local format:**
```env
MONGODB_URI=mongodb://user:pass@host1:27017,host2:27017,host3:27017/db?ssl=true&authSource=admin&retryWrites=true&w=majority
```

**Incorrect (Production only):**
```env
MONGODB_URI=mongodb+srv://cluster.mongodb.net/db
```

The application will throw an error if you try to use `mongodb+srv://` locally.

## Features
- **Public:** Job listings, apply form, tracking page.
- **Admin:** Dashboard (`/admin`), application management, status updates.
- **Email:** Transactional emails via Resend.
