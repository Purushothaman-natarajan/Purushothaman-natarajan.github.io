# Purushothaman Natarajan | AI Systems Engineer

This repository hosts my personal portfolio website, deployed at [purushothaman-natarajan.github.io](https://purushothaman-natarajan.github.io/).

---

## 🛠️ Architecture & Features

- **Static Pages Deployment**: Managed automatically via GitHub Pages workflow (`deploy-static.yml`).
- **Dynamic GitHub Stats**: Updated monthly via a GitHub Actions workflow (`update-github-stats.yml`) running a custom Node.js script (`fetch-github-stats.mjs`) to cache repo stats in `data/github-stats.json`.
- **Interactive UX Elements**: Responsive command palette (`Ctrl+K` or `/`), interactive neural background animation, and a custom cursor.

---

## 🚀 Local Development

To run the static site locally:
```bash
npx serve .
```

To run the GitHub stats fetcher locally:
```bash
node scripts/fetch-github-stats.mjs
```
