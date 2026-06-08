Deploying this static site to GitHub Pages

1) Create a GitHub repository (if not already created) and add it as a remote. Example:

```bash
git init
git add .
git commit -m "Initial commit: add site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

2) After pushing, GitHub Actions will run the `Deploy to GitHub Pages` workflow on `main` branch pushes and publish the site. Wait a few minutes and check the repository `Settings → Pages` for the published URL.

3) If you prefer a custom domain, add a `CNAME` file at the repo root containing your domain, and configure DNS accordingly.

Notes:
- The workflow uploads the repository contents and deploys them directly. If your site requires a build step, update `.github/workflows/deploy-pages.yml` to run the build and upload the build folder instead of `.`.
- `.nojekyll` is included to prevent GitHub Pages from running Jekyll processing.
