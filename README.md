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

<<<<<<< HEAD
=======
---

# Tic-Tac-Toe Project CI/CD Pipeline

This document explains the automated CI/CD (Continuous Integration and Continuous Deployment) workflow for the Tic-Tac-Toe project, powered by GitHub Actions.

---

## Overview

The CI/CD pipeline automatically checks code style, runs tests, builds Docker images, and deploys your app to Render whenever you push or open a pull request.

### Main Pipeline Features

- **Linting**: Ensures code style and formatting (ESLint & Prettier)
- **Testing**: Runs automated tests and collects coverage
- **Docker Build & Push**: Builds Docker images and pushes them to GitHub Container Registry (GHCR)
- **Deployment**: Deploys to Render using a deploy hook

---

## Workflow File

The main workflow is defined in:

```
.github/workflows/deploy.yml
```

---

## How It Works

### Triggers

- **On push** to `main`, `develop`, or any `feature/*`, `release/*`, or `hotfix/*` branch
- **On pull request** to `main` or `develop`
- **Manually** via GitHub Actions workflow dispatch (with environment selection)

### Jobs

#### 1. Lint

- Runs ESLint and Prettier checks
- Ensures code quality and consistent formatting

#### 2. Test

- Runs all project tests
- Uploads test coverage report

#### 3. Build

- Builds a Docker image for the app
- Pushes the image to GitHub Container Registry (GHCR) using a Personal Access Token (PAT)

#### 4. Deploy

- Deploys to the selected environment (development, staging, production) using a custom deploy action (can be customized as needed)

#### 5. Render Deploy

- On every push to `main`, triggers a deployment on Render.com using the `RENDER_DEPLOY_HOOK` secret

---

## Required Secrets

Set these in your repository's **Settings > Secrets and variables > Actions**:

- `GHCR_PAT`: Classic GitHub Personal Access Token with `write:packages`, `read:packages`, and `repo` (if private) scopes — used for Docker image pushes
- `RENDER_DEPLOY_HOOK`: The deploy hook URL from your Render service

---

## How to Use / Maintain

1. **Push code** to any of the configured branches. The pipeline will run automatically.
2. **Check Actions tab** in GitHub for pipeline status and logs.
3. **If you see formatting errors** (Prettier), run `npx prettier --write .` locally and commit the changes.
4. **If Docker push fails**:
   - Make sure your `GHCR_PAT` is a classic token with the correct scopes (see above).
   - Update the secret if needed.
5. **To deploy to Render manually**:
   - Go to the Actions tab, select the workflow, and use the manual dispatch with your desired environment.

---

## Troubleshooting

- **Formatting errors**: Run Prettier locally and commit.
- **Docker push errors**: Check PAT scopes and secret name.
- **Render deploy fails**: Verify the `RENDER_DEPLOY_HOOK` secret is correct.

---

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)
- [GitHub Packages: Docker](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

For questions or help, check your Actions logs or open an issue in the repository.
>>>>>>> 18d3e9a (1)
