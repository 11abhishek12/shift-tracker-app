# Shift & Holiday Tracker

A progressive web application (PWA) built with React and Vite to track an 8-day working shift cycle with integrated holidays, featuring cloud synchronization via Firebase.

## Features
- **Month & Day Views:** Toggle between analyzing an entire month or looking at detailed daily data.
- **Dynamic 8-Day Cycle:** Input a reference date and shift to automatically calculate every shift going forward (A1, A2, B1, B2, C1, C2, Off, Spare).
- **Holidays:** Pre-loaded with 46 different Indian Gazetted and Restricted holidays for 2026. Customizable!
- **Cloud Accounts:** Sign up and log in from any device. Your configurations sync via Firebase Firestore.
- **PWA Ready:** Installable on any Android or iOS device as a native-feeling application.

## Deploying to GitHub Pages

Since this app uses Vite, it requires a build step. To host this for free on GitHub Pages:

### Method 1: GitHub Actions (Recommended)
1. Upload this codebase to a repository on GitHub.
2. Go to your repository **Settings** -> **Pages** -> Source: **GitHub Actions**.
3. Create a `.github/workflows/deploy.yml` file with a standard Vite + Actions configuration:
```yaml
name: Deploy static content to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Method 2: Manual "gh-pages" module
1. From your terminal, run `npm install gh-pages --save-dev`.
2. In `package.json`, add `"homepage": "https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPO-NAME"`
3. Also in `package.json`, add this to scripts: `"deploy": "gh-pages -d dist"`
4. Run `npm run build` followed by `npm run deploy`.

### Important Firebase Note!
For your deployed app to talk to Firebase, you must add your `VITE_FIREBASE_*` variables from `.env.local.example` into your GitHub Repository Secrets (if using Actions), or ensure they are present locally when you run the manual build step.
