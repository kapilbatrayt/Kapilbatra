# Kapil Batra – Portfolio

Static site in a single `index.html` (GSAP from a CDN, no build step).

- **Intro**: the name fades in, the case-study covers spin in a circle, stack in the centre, then burst out onto the desktop
- **Desktop**: wallpaper with the case studies as desktop icons. Click opens a preview, double-click opens the case study, drag moves the icon
- **Dock**: About, Contact, Blog, Extra-curricular and Resume, each opening as a window you can drag, minimise or zoom

```bash
python3 -m http.server 5173   # http://localhost:5173
```

Vercel serves the committed files as-is (see `vercel.json`).

Content lives at the top of the script in `index.html`: `PROJECTS`, `SPOTS` (icon positions), `BLOG`, `EXTRA` and `ABOUT`.
The wallpaper is `images/wallpaper.png`. Until that file exists, a gradient is shown instead.
Windows can be linked directly: `#/about`, `#/contact`, `#/blog`, `#/extra-curricular`, `#/resume`.

The previous React version (`src/app.jsx` → `app.js`, `output.css`) is still in the repo but no longer loaded.
