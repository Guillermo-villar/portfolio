# Portfolio — Guillermo Villar

**Personal project portfolio and blog page.** Built with React + TypeScript + Flask ML backend.

🌐 **Live:** https://www.g-villar.tech  
📦 **GitHub Pages:** https://guillermo-villar.github.io/portfolio/

---

## Tech Stack

- **Frontend:** React 18, TypeScript, CSS
- **Backend:** Python Flask (ML endpoints: digit detection)
- **Tracking:** n8n webhook (visitor analytics on `visibilitychange`)
- **Deploy:** Manual build → `gh-pages` branch

---

## Development

```bash
npm install
npm start            # localhost:3000
```

### Environment

| File | Purpose |
|---|---|
| `.env.development` | Webhook URL for dev (n8n test) |
| `.env.production` | Webhook URL for production (n8n live) |

Only `REACT_APP_*` vars are exposed to the client.

### Build

```bash
npm run build        # outputs to build/
```

---

## Deploy

GitHub Pages serves from the `gh-pages` branch.

```bash
git checkout gh-pages
# copy build/* contents
git commit -m "deploy: ..."
git push origin gh-pages
```

The site auto-deploys after pushing to `gh-pages` (GitHub Pages source set to `gh-pages` branch).

---

## Visitor Tracking

`src/components/VisitorTracker.tsx` POSTs to an n8n webhook on tab close (`visibilitychange` → `hidden`).  
Payload: `{ visitor, history, summary }`.

Verify via DevTools → Network → switch tabs → look for POST to webhook URL.

---

## ML Backend

`ml-backend/` contains a Flask app for MNIST digit detection.  
Runs separately (not included in the frontend build).
