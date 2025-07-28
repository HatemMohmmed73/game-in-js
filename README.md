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

### 4.🐳 Running with Docker

Your `Dockerfile` should:

- Use a stable Node.js base image
- Copy dependencies and source code
- Set up environment variables and expose the app port
- Define the default command to run your app

### Dockerfile

```dockerfile
FROM node:18-slim

WORKDIR /usr/src/app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Create data directory for SQLite
RUN mkdir -p /usr/src/app/data

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

CMD ["node", "server.js"]
```

### Build the Docker Image

```bash
docker build -t game-in-js .
```

### Run the Container

```bash
docker run -d -p 10000:10000 --name game-container game-in-js
```

### Access the Application

Open your web browser and navigate to:

```
http://localhost:10000
```

### Manage the Container

- **Stop the container**: `docker stop game-container`
- **Start the container again**: `docker start game-container`
- **View logs**: `docker logs game-container`
- **Remove the container**: `docker rm -f game-container`

---

### 5. GitHub Secrets Setup

#### 5.1 Generate GitHub Personal Access Token (GHCR_PAT)

1. Go to your GitHub account settings:
   - Click on your profile photo in the top-right corner
   - Select **Settings**
   - Scroll down to **Developer settings** in the left sidebar
   - Click on **Personal access tokens** > **Tokens (classic)**
   - Click **Generate new token** > **Generate new token (classic)**

2. Configure the token:
   - **Note**: `GHCR_PAT for [Your-Repo-Name]`
   - **Expiration**: Set an expiration or choose "No expiration" for long-lived tokens
   - **Select scopes**:
     - `repo` (Full control of private repositories)
     - `write:packages` (Upload packages to GitHub Package Registry)
     - `read:packages` (Download packages from GitHub Package Registry)

3. Generate and copy the token (you won't be able to see it again!)

4. Add the token to your repository:
   - Go to your repository
   - **Settings** > **Secrets and variables** > **Actions**
   - Click **New repository secret**
   - **Name**: `GHCR_PAT`
   - **Value**: Paste your token
   - Click **Add secret**

#### 5.2 Create Render Deploy Hook (RENDER_DEPLOY_HOOK)

1. Go to your Render Dashboard (https://dashboard.render.com/)
2. Select your web service
3. Click on **Environment** in the left sidebar
4. Scroll down to the **Webhooks** section
5. Click **Add Webhook**
6. Configure the webhook:
   - **Name**: `GitHub Actions Deploy`
   - **Environment**: `Production` (or your preferred environment)
   - **Branch**: `main` (or your default branch)
   - **Auto-deploy**: Enable if you want automatic deployments
7. Click **Create Webhook**
8. Copy the **Webhook URL**
9. Add it to your GitHub repository:
   - Go to your repository
   - **Settings** > **Secrets and variables** > **Actions**
   - Click **New repository secret**
   - **Name**: `RENDER_DEPLOY_HOOK`
   - **Value**: Paste the webhook URL
   - Click **Add secret**

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
