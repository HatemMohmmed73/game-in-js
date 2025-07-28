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
# Use official Node.js LTS slim image
FROM node:18-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=10000

# Expose the app port
EXPOSE 10000

# Start the application
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

### 9. Setup deploy.yml for Any Node.js App

Follow these steps to set up the `deploy.yml` workflow in any Node.js project:

1. **Create the workflow directory and file**

   ```bash
   mkdir -p .github/workflows
   touch .github/workflows/deploy.yml
   ```

2. **Copy the following configuration** into `.github/workflows/deploy.yml`:

   ```yaml
   name: CI/CD Pipeline

   on:
     push:
       branches: [main, develop, "feature/*", "release/*", "hotfix/*"]
     pull_request:
       branches: [main, develop]
     workflow_dispatch:
       inputs:
         environment:
           description: "Environment to deploy to"
           required: true
           default: "staging"
           type: choice
           options:
             - development
             - staging
             - production

   # Environment configurations - CUSTOMIZE THESE FOR YOUR PROJECT
   env:
     # Name for your Docker image (usually your app's name in lowercase)
     DOCKER_IMAGE: your-app-name

     # Docker registry settings (using GitHub Container Registry by default)
     DOCKER_REGISTRY: ghcr.io
     DOCKER_USERNAME: ${{ github.actor }}
     DOCKER_TOKEN: ${{ secrets.GHCR_PAT || github.token }}

     # App configuration - UPDATE THESE TO MATCH YOUR DOCKERFILE
     NODE_VERSION: "20" # Node.js version to use for testing/linting
     APP_PORT: 3000 # Port your app listens on (must match EXPOSE in Dockerfile)
     HEALTH_CHECK_PATH: "/health" # Health check endpoint (set to "" to disable)
     STARTUP_DELAY: 5 # Seconds to wait for the app to start before health checks

   jobs:
     # Lint and test jobs go here (see full example in the repository)
     # ...

     build:
       name: Build and Push Docker Image
       runs-on: ubuntu-latest
       needs: [lint, test] # Remove if lint/test jobs don't exist

       steps:
         - name: Checkout code
           uses: actions/checkout@v4

         # Get metadata for Docker tags
         - name: Docker meta
           id: meta
           uses: docker/metadata-action@v5
           with:
             images: ${{ env.DOCKER_REGISTRY }}/${{ github.repository }}/${{ env.DOCKER_IMAGE }}
             tags: |
               type=ref,event=branch
               type=ref,event=tag
               type=sha,format=long

         # Login to GitHub Container Registry
         - name: Log in to GHCR
           uses: docker/login-action@v3
           with:
             registry: ${{ env.DOCKER_REGISTRY }}
             username: ${{ github.actor }}
             password: ${{ secrets.GHCR_PAT || github.token }}

         # Build and push Docker image
         - name: Build and push
           uses: docker/build-push-action@v5
           with:
             context: .
             push: ${{ github.event_name != 'pull_request' }}
             tags: ${{ steps.meta.outputs.tags }}
             labels: ${{ steps.meta.outputs.labels }}
             cache-from: type=gha
             cache-to: type=gha,mode=max

     deploy:
       name: Deploy to Render
       runs-on: ubuntu-latest
       needs: build
       if: (github.ref == 'refs/heads/main' && github.event_name == 'push') || github.event_name == 'workflow_dispatch'

       steps:
         - name: Get image tag
           id: meta
           uses: docker/metadata-action@v5
           with:
             images: ${{ env.DOCKER_REGISTRY }}/${{ github.repository }}/${{ env.DOCKER_IMAGE }}
             tags: |
               type=ref,event=branch

         # Trigger Render deployment using webhook
         - name: Trigger Render Deploy Hook
           if: env.RENDER_DEPLOY_HOOK != ''
           run: |
             echo "Triggering Render deployment..."
             curl -X POST "$RENDER_DEPLOY_HOOK"
           env:
             RENDER_DEPLOY_HOOK: ${{ secrets.RENDER_DEPLOY_HOOK || '' }}
   ```

3. **Customize the following variables** in the workflow file:
   - `DOCKER_IMAGE`: Your application's name (lowercase)
   - `NODE_VERSION`: The Node.js version your app uses
   - `APP_PORT`: The port your app listens on (must match Dockerfile's `EXPOSE`)
   - `HEALTH_CHECK_PATH`: The health check endpoint (or empty string to disable)
   - `STARTUP_DELAY`: Time to wait for app startup before health checks

4. **Set up required secrets** in your GitHub repository:
   - `GHCR_PAT`: GitHub Personal Access Token with `write:packages` scope
   - `RENDER_DEPLOY_HOOK`: Webhook URL from your Render dashboard

5. **Ensure your Dockerfile** is properly configured to:
   - Expose the correct port (matching `APP_PORT`)
   - Include any necessary environment variables
   - Properly handle the application's entry point

6. **Commit and push** the workflow file to trigger the pipeline.

### 10. References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)
- [GitHub Packages: Docker](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
