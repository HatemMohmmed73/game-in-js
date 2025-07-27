# 🛠️ Tutorial: Advanced CI/CD with GitHub Actions, Docker, and Render

This guide will walk you through setting up a robust CI/CD pipeline for a Node.js app, including linting, testing, Docker image build & push, and automated deployment to Render.

---

### 1. Project Structure

Your project should look something like this:

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml         # Main CI/CD workflow
├── Dockerfile                 # Docker build instructions
├── package.json
├── README.md
└── ... (your app code)
```

---

### 2. CI/CD Pipeline Overview

The pipeline will:

- Lint and auto-format code (ESLint, Prettier)
- Run all tests and upload coverage
- Build a Docker image and push to GitHub Container Registry (GHCR)
- Deploy to Render using a deploy hook

---

### 3. GitHub Actions Workflow

The workflow file is at `.github/workflows/deploy.yml`.  
It is triggered on:

- Pushes to `main`, `develop`, or any feature/release/hotfix branch
- Pull requests to `main` or `develop`
- Manual dispatch (with environment selection)

**Jobs in the workflow:**

- `lint`: Checks code style with ESLint and Prettier
- `test`: Runs tests and uploads coverage
- `build`: Builds and pushes Docker image to GHCR
- `render-deploy`: Triggers a deployment on Render using a webhook

---

### 4. Docker Integration

Your `Dockerfile` should:

- Use a stable Node.js base image
- Copy dependencies and source code
- Set up environment variables and expose the app port
- Define the default command to run your app

Example:

```dockerfile
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN mkdir -p /usr/src/app/data
ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000
CMD ["node", "server.js"]
```

---

### 5. GitHub Secrets Setup

Go to your repo’s **Settings > Secrets and variables > Actions** and add:

- `GHCR_PAT`: A classic GitHub Personal Access Token with `write:packages`, `read:packages`, and `repo` scopes
- `RENDER_DEPLOY_HOOK`: Your Render deploy hook URL (from your Render dashboard)

---

### 6. How Deployment to Render Works

- On push to `main`, the workflow triggers a `curl` POST to the Render deploy hook.
- Render pulls the latest Docker image from GHCR and deploys your app.

---

### 7. How to Use and Maintain the Pipeline

- **Push code** to any configured branch — the pipeline runs automatically.
- **Check the Actions tab** for status and logs.
- **Fix formatting errors** by running `npx prettier --write .` locally and committing the changes.
- **Fix Docker push errors** by ensuring your `GHCR_PAT` secret is set up correctly.
- **To deploy manually**, use the Actions tab and select workflow dispatch.

---

### 8. Troubleshooting

- **Formatting errors:** Run Prettier locally and commit.
- **Docker push errors:** Check PAT scopes and secret name.
- **Render deploy fails:** Verify the `RENDER_DEPLOY_HOOK` secret is correct.

---

### 9. References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)
- [GitHub Packages: Docker](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
