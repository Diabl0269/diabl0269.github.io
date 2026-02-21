# Tal Efronny's Landing Page — Project Instructions

## Project Overview
Personal landing page for Tal Efronny, deployed to GitHub Pages at https://diabl0269.github.io

- **GitHub repo**: Diabl0269/diabl0269.github.io
- **Deployment**: GitHub Pages from `main` branch (auto-deploys on push)
- **Git config**: user.email = talefronny@gmail.com

## Tech Stack
Pure static HTML + CSS + JS. No frameworks, no build tools, no npm, no bundler.

## File Structure
- `index.html` — All semantic HTML, inline SVG icons, GraviSynth animated diagram, meta tags
- `style.css` — All styling, animations, responsive design
- `script.js` — Canvas animation, scroll observers, Spotify lazy-load
- `assets/avatar.png` — DiabolusLark avatar image
- `pre-plan.md` — Reference document with all links, content text, and URLs

## Development Notes
- No build step — just open `index.html` in a browser to preview
- Google Fonts loaded externally: Orbitron (display) + Exo 2 (body)
- All social/music icons are inline SVGs (no icon library)
- Spotify embed is lazy-loaded via IntersectionObserver
- Canvas animation respects `prefers-reduced-motion`
- Responsive breakpoints: 375px (mobile), 768px (tablet), 1440px (desktop)

## Design Tokens
CSS custom properties in `style.css`:
- Colors:
  - `--bg-primary`: #0a0a0f
  - `--accent-cyan`: #00f0ff
  - `--accent-magenta`: #ff00aa
  - `--accent-violet`: #8b5cf6
- Fonts:
  - `--font-display`: Orbitron
  - `--font-body`: Exo 2

## Workflow
1. Work on `main` branch (GitHub Pages user sites deploy from main)
2. No build step required
3. Push to `main` to auto-deploy to GitHub Pages
