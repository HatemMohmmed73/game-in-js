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

## Customizing Deployment
- The deploy action (`.github/actions/deploy/action.yml`) can be customized for different environments.
- By default, Render deployment is triggered by webhook and does not require AWS or other cloud secrets.

---

## Troubleshooting
- **Formatting errors**: Run Prettier locally and commit.
- **Docker push errors**: Check PAT scopes and secret name.
- **Render deploy fails**: Verify the `RENDER_DEPLOY_HOOK` secret is correct.
- **AWS errors**: Remove AWS-specific steps if not using AWS.

---

## References
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)
- [GitHub Packages: Docker](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

---

For questions or help, check your Actions logs or open an issue in the repository.
