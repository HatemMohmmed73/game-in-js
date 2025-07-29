# 🎮 Tic-Tac-Toe Game with CI/CD Pipeline

A Node.js based Tic-Tac-Toe game with a complete CI/CD pipeline using GitHub Actions, Docker, and Render for deployment. This project demonstrates a modern development workflow with automated testing, containerization, and deployment.

---

### 1. Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD workflow
├── public/                   # Frontend assets
│   └── game.js               # Game client code
├── server.js                 # Backend server
├── Dockerfile                # Docker configuration
├── package.json              # Project dependencies
├── render.yaml               # Render deployment config
└── README.md                 # This file
```

---

### 2. CI/CD Pipeline Overview

The pipeline automates the following:

- ✅ Code validation and syntax checking
- ✅ Automated testing with npm
- ✅ Docker image building and testing
- ✅ Push to GitHub Container Registry (main branch only)
- ✅ Automatic deployment to Render (main branch only)
- ✅ Manual deployment trigger for any environment

---

### 3. GitHub Actions Workflow

The workflow file is at `.github/workflows/deploy.yml` and includes the following jobs:

#### Test and Validate Job

- Validates package.json
- Runs tests if test script exists
- Performs linting if lint script exists
- Builds and tests Docker image
- Verifies container health checks

#### Build Job

- Builds Docker image using Buildx
- Pushes to GitHub Container Registry
- Tags images with branch and commit SHA
- Uses build caching for faster builds

#### Deploy Job

- Triggers on push to main branch
- Sends webhook to Render for deployment
- Supports manual triggering for any environment
- Provides deployment status feedback

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

### 5. Environment Variables

#### 5.1 Workflow Environment Variables

```yaml
# In .github/workflows/deploy.yml
env:
  DOCKER_IMAGE: tic-tac-toe-app
  DOCKER_REGISTRY: ghcr.io
  DOCKER_USERNAME: ${{ github.actor }}
  DOCKER_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  NODE_VERSION: "20"
  APP_PORT: 10000
  HEALTH_CHECK_PATH: "/health"
  STARTUP_DELAY: 5
```

#### 5.2 Required Secrets

| Secret Name          | Description                                              |
| -------------------- | -------------------------------------------------------- |
| `GITHUB_TOKEN`       | Automatically provided by GitHub Actions for GHCR access |
| `RENDER_DEPLOY_HOOK` | Webhook URL from Render dashboard for deployments        |

#### 5.3 Setting Up Render Deploy Hook

1. In Render Dashboard, go to your web service
2. Navigate to **Environment** > **Webhooks**
3. Click **Add Webhook** with these settings:
   - Name: `GitHub Actions Deploy`
   - Environment: `Production`
   - Branch: `main`
4. Copy the webhook URL and add it to your GitHub repository secrets as `RENDER_DEPLOY_HOOK`

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

### 6. Deployment Workflow

#### Automatic Deployment (on push to main)

1. Push code to `main` branch
2. GitHub Actions runs tests and validations
3. Docker image is built and pushed to GHCR
4. Render deployment is triggered automatically

#### Manual Deployment

1. Go to GitHub Actions
2. Select the workflow run
3. Click "Run workflow"
4. Choose environment (development/staging/production)

#### Monitoring Deployments

- Check GitHub Actions logs for build and test results
- View deployment status in Render dashboard
- Monitor application health at `https://your-render-app.onrender.com/health`

---

### 7. Local Development

#### Prerequisites

- Node.js 18+
- Docker (optional)

#### Running Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Open http://localhost:10000 in your browser

#### Running with Docker

1. Build the image:

   ```bash
   docker build -t tic-tac-toe .
   ```

2. Run the container:

   ```bash
   docker run -d -p 10000:10000 tic-tac-toe
   ```

3. Access at http://localhost:10000

---

### 8. Troubleshooting

#### Common Issues

1. **Docker Build Fails**
   - Ensure Dockerfile exists in root directory
   - Check for syntax errors in Dockerfile
   - Verify all required files are included in the build context

2. **Tests Fail**
   - Run tests locally with `npm test`
   - Check for environment-specific issues
   - Ensure all dependencies are installed

3. **Deployment Issues**
   - Verify RENDER_DEPLOY_HOOK secret is set
   - Check Render dashboard for deployment logs
   - Ensure GitHub Actions has necessary permissions

4. **Health Check Failures**
   - Verify APP_PORT matches your application's port
   - Check if the health check endpoint is implemented
   - Increase STARTUP_DELAY if needed

---

### 9. CI/CD Pipeline Features

- **Automated Testing** - Runs on every push and PR
- **Docker Integration** - Builds and tests container
- **Branch Protection** - Ensures main branch stability
- **Health Checks** - Validates container startup
- **Manual Triggers** - Deploy any branch to any environment
- **Build Caching** - Faster pipeline execution
- **Secure Secrets** - Safe handling of credentials

### 10. Local Development Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/tic-tac-toe.git
cd tic-tac-toe

# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build and run with Docker
docker build -t tic-tac-toe .
docker run -p 10000:10000 tic-tac-toe
```

### 11. License

This project is open source and available under the [MIT License](LICENSE).

### 12. Troubleshooting

#### Common Issues

| Issue                     | Solution                                            |
| ------------------------- | --------------------------------------------------- |
| Docker build fails        | Check Dockerfile syntax and paths                   |
| Tests failing             | Run `npm test` locally to debug                     |
| Deployment not triggering | Verify RENDER_DEPLOY_HOOK secret                    |
| Health check failures     | Check app logs and increase STARTUP_DELAY if needed |

For additional help, check the [GitHub Issues](https://github.com/your-username/tic-tac-toe/issues) or open a new one.

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
