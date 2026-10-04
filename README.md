# Portfolio — Guillermo Villar

**Personal project portfolio and blog page.** React + TypeScript, deployed to
GitHub Pages behind a custom domain.

🌐 **Live:** https://www.g-villar.tech
📦 **GitHub Pages:** https://guillermo-villar.github.io/portfolio/

---

## Tech Stack

- **Frontend:** React 18, TypeScript, CSS
- **Routing:** React Router (`HashRouter`, so GitHub Pages serves deep links)
- **Analytics:** PostHog (pageviews and autocapture; no session recording)
- **Deploy:** Manual build → `gh-pages` branch

---

## Development

```bash
npm install
npm start            # localhost:3000
```

### Environment

No environment file is required. The PostHog project token lives in
`src/analytics/posthog.ts`: it is a public, write-only ingestion token that
ships in the browser bundle either way, and it is *not* a personal API key.
`REACT_APP_POSTHOG_KEY` overrides it if you want a fork to report elsewhere.

Analytics are disabled automatically on `localhost` and `127.0.0.1`.

**Never commit a `.env` file.** This repository is public; a webhook URL was
committed here once and had to be purged from history.

### Build

```bash
npm run build        # outputs to build/
```

---

## Deploy

GitHub Pages serves from the `gh-pages` branch.

```bash
npm run build
git checkout gh-pages
# copy build/* contents
git commit -m "deploy: ..."
git push origin gh-pages
```

`public/CNAME` carries the custom domain and must survive every build.

---

## Adding a project

1. Drop the card image (and an optional wider banner) in `public/`.
2. Add an entry to the array in `src/components/Projects.tsx`. Two entries in
   `techStack` is the most the card fits before the title is pushed out.
3. Add a page under `src/pages/` that renders `ProjectsTemplate`. Do **not**
   render `<Header />` there — the template already does.
4. Register the route in `src/App.tsx`.
5. If the stack uses a technology that has no colour yet, add a
   `.circle.<lowercased-name>` rule to `src/styles/projects.css` and
   `src/styles/projecttemplate.css`.

`githubLink` and `liveLink` are both optional: a closed-source project can link
only to its deployment.
