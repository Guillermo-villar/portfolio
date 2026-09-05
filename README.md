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
- **ML demo:** the MNIST model runs client-side, no framework (see below)
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
2. Add an entry to the array in `src/components/Projects.tsx`. The card lays
   the title and the tech chips out in a two-column grid, so a long title is
   ellipsised rather than run over — but two or three `techStack` entries is
   still the most that reads well.
   Set `demoLink` only if there is something real to try; it drives the
   "Try the demo!!" badge. Set `fit: 'contain'` for artwork with type in it
   that must not be cropped.
3. Add a page under `src/pages/` that renders `ProjectsTemplate`. Do **not**
   render `<Header />` there — the template already does.
4. Register the route in `src/App.tsx`.
5. If the stack uses a technology that has no colour yet, add a
   `.circle.<lowercased-name>` rule to `src/styles/projects.css` and
   `src/styles/projecttemplate.css`.

`githubLink` and `liveLink` are both optional: a closed-source project can link
only to its deployment.

---

## Blog posts

`src/data/blogPosts.ts` is the single source of truth. The listing and the post
pages both read from it, and `/blog/:id` resolves the id against it — an
unknown id renders the 404 page rather than a blank screen. Add a post by
appending to the array; ordering is by `date` (ISO), newest first, and needs no
other change.

---

## The in-browser digit demo

`/#/projects/ai-demo/live` runs the MNIST classifier from
[AI-project](https://github.com/Guillermo-villar/AI-project) — a 784 → 128 → 64
→ 10 dense network — entirely in the browser, with no TensorFlow.js.

- `tools/export_mnist_model.py` reads that repo's `mnist_model.h5` and writes
  `public/models/mnist-mlp.bin`: int8 weights with a per-output-unit scale.
  Quantizing costs nothing measurable (97.33% → 97.34% on the MNIST test set)
  and takes 437 KB of float32 down to 108 KB.
- `src/demo/mnistModel.ts` parses that file and evaluates the network.
- `src/demo/preprocess.ts` reproduces MNIST's normalization — crop to the ink,
  scale the long side to 20px, centre by centre of mass in 28×28, threshold at
  0.5. Skipping this is what makes most in-browser MNIST demos guess badly; the
  full pipeline scores the same 97.34% as feeding the test set in directly.

To regenerate the weights:

```bash
pip install h5py
curl -sL -o mnist_model.h5   https://raw.githubusercontent.com/Guillermo-villar/AI-project/HEAD/mnist_model.h5
python tools/export_mnist_model.py mnist_model.h5 public/models/mnist-mlp.bin
```

---

## Images

- `tools/make_images.py` renders `public/og-image.png` (the 1200×630 social
  card, also used as the Web Portfolio project thumbnail) and the square
  `icon-192.png` / `icon-512.png` that `manifest.json` declares.
- `tools/optimize_images.py` re-encodes the oversized files in `public/`.
  Nothing on the site is displayed above 800px.

Both are idempotent — rerun them after changing the source artwork.

---

## Known limitations

- **Clickjacking.** `frame-ancestors` is ignored in a `<meta>` CSP and GitHub
  Pages cannot set response headers, so the site can still be framed. Fixing it
  needs a host that sets headers, or a proxy. The rest of the CSP, plus
  `Referrer-Policy`, ships in `public/index.html`.
- **Clean URLs.** `public/404.html` catches `/<path>` and redirects to
  `/#/<path>`, so a shared clean URL lands on the right page — but it is a
  redirect, not real server-side routing, and crawlers still only see `/`.
