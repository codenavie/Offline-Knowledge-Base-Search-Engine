# Offline Knowledge Base Search Engine

Production-ready offline search system with a modular Node.js backend and Vue 3 frontend.

## Stack
- Frontend: Vue 3 + Vite (JavaScript only)
- Backend: Node.js + Express
- Storage: Local JSON index (`server/storage/index.json`)
- Search: Classical IR (tokenization + inverted index + TF-IDF ranking)

## Architecture
- `server/routes` API routes
- `server/controllers` request handling
- `server/services` business logic
- `server/core` parser/indexer/ranker
- `server/storage` persistent index store
- `client` Vue application

## Features
- Upload and index `PDF`, `DOCX`, `TXT`
- Text extraction via `pdf-parse` and `mammoth`
- Normalization + tokenization + stop-word removal + basic stemming
- Inverted index with positional postings
- TF-IDF relevance ranking
- Phrase search via quoted query: `"zero trust"`
- Snippet generation with highlighted matches
- Duplicate content detection via checksum
- In-memory cached index + persisted local JSON
- Secure upload validation + file size limit + error middleware

## API
- `GET /health`
- `POST /api/upload` (multipart form-data, key: `file`)
- `GET /api/search?q=...`
- `GET /api/documents`
- `GET /api/documents/:id`
- `DELETE /api/documents/:id`

## Local Setup
1. Create `server/.env` from `server/.env.example`
2. Install deps: `npm install`
3. Run full app: `npm run dev`
4. Backend: `http://localhost:4000`
5. Frontend: `http://localhost:5173`

## Environment Variables
### Server (`server/.env`)
- `NODE_ENV=production`
- `PORT=10000`
- `CLIENT_URL=http://localhost:5173`
- `MAX_FILE_SIZE_MB=50`

### Frontend (`client/.env.production`)
- `VITE_API_BASE=https://offline-knowledge-base-search-engine.onrender.com/api`

## Production Deployment
### Backend on Render
- Build command: `npm install`
- Start command: `npm run start --workspace server`
- Set `CLIENT_URL` to your GitHub Pages URL.

You can also bootstrap with `render.yaml` in this repo.

### Frontend on GitHub Pages
- `client/vite.config.js` has base path set for project pages.
- Auto-deploy workflow is included at `.github/workflows/pages.yml`.
- On push to `main`, Pages deploys from `client/dist`.

## Manual Frontend Deploy (optional)
- Build: `npm run build --workspace client`
- Publish: `npm run deploy:client`

## Verification Checklist
- Backend health: `https://<render-service>.onrender.com/health`
- Frontend live: `https://<username>.github.io/<repo>/`
- Browser Network calls should target `https://<render-service>.onrender.com/api/...`
