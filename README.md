# Kapil Batra – Portfolio

Static site in a single `index.html` (Three.js + GSAP from CDNs, no build step).

- **Creative Space** – intro animation (circle → spin → stack → burst) into a draggable 3D sphere of case studies
- **Projects** – case-study grid
- **About** – bio, experience, testimonials, awards
- **Contact** – form (FormSubmit) and resume download

```bash
python3 -m http.server 5173   # http://localhost:5173
```

Vercel serves the committed files as-is (see `vercel.json`). Content lives in the `PROJECTS` and `ABOUT` objects inside `index.html`.

The previous React version (`src/app.jsx` → `app.js`, `output.css`) is still in the repo but no longer loaded.
