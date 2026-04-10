# CLAUDE.md

## Project Overview

UpServ is a service website built with plain HTML, CSS, and JavaScript. No frameworks or build tools are in use — the team has not yet decided on a stack, so keep things simple.

## Structure

- `index.html` — main entry point
- `css/styles.css` — shared styles
- `js/main.js` — shared scripts
- `pages/` — additional HTML pages
- `assets/images/` — image files
- `assets/fonts/` — font files

## Guidelines

- Do not introduce frameworks, build tools, or package managers unless explicitly asked.
- Keep files plain HTML/CSS/JS.
- New pages go in `pages/` and should link back to `index.html`.
- Shared styles go in `css/styles.css`. Page-specific styles can go in `css/<page>.css`.
- Shared scripts go in `js/main.js`. Page-specific scripts can go in `js/<page>.js`.
- Images go in `assets/images/`, fonts in `assets/fonts/`.
