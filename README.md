# Chatify

Chatify is a full-stack realtime chat application with private messaging, friend search, group creation, image sharing, and a production-ready React frontend.

## Live URLs

- Frontend: https://chatify-abhideep.vercel.app
- Backend: https://chatify-backend-8gna.onrender.com
- Repository: https://github.com/abhideepchoubey/Chatify.git

## Features

- Cookie-based authentication with `httpOnly` cookies
- Private one-to-one chat flow
- Friend search and add-friend flow
- Group creation
- Realtime messaging with Socket.io
- Image upload, share, and download
- Cloudinary-backed media storage
- Responsive dark UI with desktop and mobile chat layouts
- Vercel frontend deployment with `/api` proxying to the backend

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- Socket.io-client
- React Router DOM

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- Socket.io
- JWT auth with cookies
- Cloudinary
- Multer

## Project Structure

```text
Chatify/
  backend/
    src/
      controllers/
      db/
      middlewares/
      models/
      routes/
      socket/
      utils/
    .env.example
    package.json
  frontend/
    src/
      api/
      components/
      context/
      pages/
      socket/
    vercel.json
    package.json
  render.yaml
  package.json
  README.md
```

## Local Setup

### 1. Install dependencies

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

Optional root install for formatting:

```bash
npm install
```

### 2. Configure backend environment

Create `backend/.env` from `backend/.env.example`.

Required values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net
ACCESS_TOKEN_SECRET=replace-me
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=replace-me
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:5173,https://chatify-abhideep.vercel.app
CLOUDINARY_CLOUD_NAME=replace-me
CLOUDINARY_API_KEY=replace-me
CLOUDINARY_API_SECRET=replace-me
CLOUDINARY_FOLDER=chatify/messages
```

## Running Locally

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Local frontend URL:

- http://localhost:5173

Local backend URL:

- http://localhost:5000
- API: http://localhost:5000/api

## Auth and Networking

- Frontend auth requests use `withCredentials: true`
- Production frontend uses a Vercel `/api` rewrite to avoid third-party cookie issues on mobile browsers
- Realtime chat uses Socket.io against the Render backend
- Authentication state is restored from `/auth/me`

## Deployment

### Frontend

- Hosted on Vercel
- SPA rewrites are configured in `frontend/vercel.json`
- API requests are proxied through `/api`

### Backend

- Hosted on Render
- Render config is in `render.yaml`
- Cloudinary is used for uploaded images

## Scripts

### Root

```bash
npm run format
npm run format:check
```

### Backend

```bash
npm run dev
npm run start
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
```

## Notes

- If you change the production frontend domain, update `CORS_ORIGIN` on the backend.
- If Cloudinary env vars are missing on the deployed backend, image uploads will fail.
- After switching auth domains in production, users may need to sign in once again so the new first-party cookie is created.

## License

MIT. See `LICENSE`.
