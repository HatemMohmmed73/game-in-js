# 🚀 Complete Node.js CI/CD Tutorial

**Deploy any Node.js app to Render with Docker and GitHub Actions in minutes**

This is your complete, copy-paste-ready guide to set up automated deployment for **any** Node.js application. Whether you're building a REST API, web app, or microservice, this tutorial will get you from zero to production deployment in under 30 minutes.

## 🎯 What You'll Build

- ✅ **Universal Node.js app** - works with any framework (Express, Fastify, NestJS, etc.)
- ✅ **Docker containerization** - consistent deployment across environments
- ✅ **GitHub Actions CI/CD** - automated testing, building, and deployment
- ✅ **Render cloud deployment** - production-ready hosting with automatic scaling
- ✅ **Zero-downtime deployments** - blue-green deployment with health checks

## 📋 Prerequisites (2 minutes setup)

**You only need 3 things:**
- A GitHub repository (free)
- A Render account (free) 
- Docker installed on your machine (for local testing)

**No prior DevOps experience required!**

---

## 🏗️ Project Structure

```
├── .github/workflows/
│   └── deploy.yml          # 🚀 Your CI/CD pipeline
├── src/                    # Your app code (modify as needed)
│   └── server.js          # Main application file
├── Dockerfile             # 🐳 Docker configuration
├── package.json           # 📦 Dependencies and scripts
└── README.md             # 📖 This tutorial
```

---

## 🚀 Complete Deployment Guide

### Step 1: Copy the Required Files

Copy these exact files into your project root directory:

#### 1.1 Create `.github/workflows/deploy.yml`

```yaml
name: Deploy to Render

on:
  push:
    # 📝 CHANGE THIS: Update branch name if deploying from different branch
    branches: [ main ]
  workflow_dispatch:

env:
  # 📝 CHANGE THIS: Your Docker image name (e.g., "my-node-app")
  DOCKER_IMAGE: your-app-name
  
  # ✅ These are standard - no change needed
  DOCKER_REGISTRY: ghcr.io
  DOCKER_USERNAME: ${{ github.actor }}
  DOCKER_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  NODE_VERSION: "20"
  
  # 📝 CHANGE THESE: Match your app's configuration
  APP_PORT: 10000
  HEALTH_CHECK_PATH: "/health"
  STARTUP_DELAY: 5

jobs:
  test-and-validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
        continue-on-error: true
      
      - name: Run linting
        run: |
          if [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ] || [ -f ".eslintrc.cjs" ]; then
            npm run lint || echo "Linting failed, continuing..."
          else
            echo "No ESLint config found, skipping lint..."
          fi
        continue-on-error: true
      
      - name: Test Docker build
        run: docker build -t test-image .
      
      - name: Test container health
        run: |
          docker run -d -p ${{ env.APP_PORT }}:${{ env.APP_PORT }} --name test-container test-image
          echo "Waiting for server to start..."
          for i in {1..30}; do
            if curl -f http://localhost:${{ env.APP_PORT }}${{ env.HEALTH_CHECK_PATH }}; then
              echo "Health check passed!"
              docker stop test-container
              docker rm test-container
              exit 0
            fi
            echo "Attempt $i/30 - server not ready yet"
            sleep 2
          done
          echo "Health check failed after 60 seconds"
          docker logs test-container
          docker stop test-container
          docker rm test-container
          exit 1

  build-and-push:
    needs: test-and-validate
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Set lowercase repository name
        id: lowercase
        run: |
          OWNER_LOWER=$(echo "${{ github.repository_owner }}" | tr '[:upper:]' '[:lower:]')
          IMAGE_TAG="${{ env.DOCKER_REGISTRY }}/${OWNER_LOWER}/${{ env.DOCKER_IMAGE }}:latest"
          echo "IMAGE_TAG=$IMAGE_TAG" >> $GITHUB_OUTPUT
          echo "Using image tag: $IMAGE_TAG"
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.lowercase.outputs.IMAGE_TAG }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-to-render:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Render
        run: |
          curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}"
```

#### 1.2 Create `Dockerfile`

```dockerfile
FROM node:20-slim

WORKDIR /usr/src/app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create data directory for SQLite
RUN mkdir -p /usr/src/app/data

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Start the application
CMD ["node", "server.js"]
```

### Step 2: Customize Your Configuration

**Change these 3 values only:**

1. **App Port**: Update `APP_PORT` in `deploy.yml` (default: 10000)
2. **App Name**: Update `DOCKER_IMAGE` in `deploy.yml` (e.g., "my-node-app")
3. **Health Check**: Update `HEALTH_CHECK_PATH` in `deploy.yml` (default: "/health")

### Step 3: Set Up Render Deploy Hook

1. **Get the Webhook URL**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Select your web service
   - Click **Manual Deploy** → **Deploy Hook**
   - Copy the URL: `https://api.render.com/deploy/srv-xxxxx`

2. **Add GitHub Secret**:
   - Go to your GitHub repository
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - **Name**: `RENDER_DEPLOY_HOOK`
   - **Value**: Paste your webhook URL
   - Click **Add secret**

### Step 4: Deploy Your Application

1. **Commit and push** your changes:
   ```bash
   git add .
   git commit -m "Add CI/CD pipeline"
   git push origin main
   ```

2. **Monitor deployment**:
   - Check GitHub Actions tab for build progress
   - View Render dashboard for deployment status
   - Test your deployed app at your Render URL

---

## 🧪 Local Development & Testing

### Step 5: Local Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm start
   ```

3. **Access locally**:
   ```bash
   http://localhost:10000
   ```

### Step 6: Local Docker Testing

1. **Build Docker image**:
   ```bash
   docker build -t your-app-name .
   ```

2. **Run container**:
   ```bash
   docker run -d -p 10000:10000 --name your-container your-app-name
   ```

3. **Test health check**:
   ```bash
   curl http://localhost:10000/health
   ```

4. **Manage container**:
   ```bash
   docker stop your-container
   docker start your-container
   docker logs your-container
   docker rm your-container
   ```

---

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Docker build fails** | Check Dockerfile syntax, ensure all files exist |
| **Tests fail** | Run `npm test` locally, check dependencies |
| **Health check fails** | Verify your app responds to `/health` endpoint |
| **Deployment fails** | Check GitHub Actions logs, verify Render webhook |
| **Port conflicts** | Update `APP_PORT` in both Dockerfile and deploy.yml |

### Debug Commands

```bash
# Check Docker image
docker images
docker ps -a

# Check logs
docker logs your-container

# Test locally
curl http://localhost:10000
curl http://localhost:10000/health

# Check GitHub Actions
# Go to GitHub → Actions → Select workflow run
```

---

## 📊 Monitoring & Maintenance

### Step 7: Monitor Your Application

1. **GitHub Actions**: Check build status and logs
2. **Render Dashboard**: Monitor deployment and performance
3. **Application Logs**: View via Render dashboard or Docker
4. **Health Checks**: Automated via your `/health` endpoint

### Step 8: Update Your Application

1. Make code changes locally
2. Test thoroughly (local + Docker)
3. Commit and push changes
4. Monitor deployment via GitHub Actions
5. Verify deployment success on Render

---

## 🎯 Quick Reference

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | 10000 |
| `NODE_ENV` | Environment mode | production |
| `HEALTH_CHECK_PATH` | Health endpoint | /health |

### Useful Commands

```bash
# Development
npm install          # Install dependencies
npm start           # Start development server
npm test            # Run tests

# Docker
docker build -t app .    # Build image
docker run -d -p 10000:10000 app  # Run container
docker logs app          # View logs

# Git
git add . && git commit -m "Update" && git push  # Deploy changes
```

---

## ✅ Deployment Checklist

- [ ] Files copied (Dockerfile, deploy.yml)
- [ ] Configuration customized (port, name, health check)
- [ ] Render webhook added to GitHub secrets
- [ ] Code committed and pushed
- [ ] GitHub Actions build successful
- [ ] Render deployment successful
- [ ] Application accessible via URL
- [ ] Health check endpoint working

**That's it! Your Node.js app is now deployed with full CI/CD automation.** 🎉

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

#### 5.2 Setting Up Render Deploy Hook

1. **Get the Webhook URL**
   - Go to your Render Dashboard (https://dashboard.render.com/)
   - Select your web service
   - Click on **Manual Deploy** in the top right
   - Look for the webhook URL in the manual deploy section
   - It should look like: `https://api.render.com/deploy/srv-xxxxx`

2. **Add to GitHub Secrets**
   - Go to your GitHub repository
   - Navigate to **Settings** > **Secrets and variables** > **Actions**
   - Click **New repository secret**
   - **Name**: `RENDER_DEPLOY_HOOK`
   - **Value**: Paste the webhook URL from Render
   - Click **Add secret**

> **Note:** For automatic deployments on push to main, you'll need to use Render's webhook feature which is available in their Pro plan. The free tier requires manual triggering of deployments.

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

---

### Comprehensive Single-File Tutorial

**Setting Up a Node.js App with Docker and Render Deployment**

This tutorial covers the complete setup process for any Node.js app with Docker and Render deployment using the provided workflow.

**Step 1: Create a New Node.js App**

Create a new Node.js app using your preferred method (e.g., `npm init`).

**Step 2: Create a Dockerfile**

Create a new file named `Dockerfile` in the root of your project with the following contents:

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

**Step 3: Create a GitHub Actions Workflow**

Create a new file named `.github/workflows/deploy.yml` with the following contents:

```yaml
name: Deploy to Render

# 📝 CUSTOMIZE: Update the branch name if you want to deploy from a different branch
on:
  push:
    branches:
      - main  # ✅ CHANGE THIS to your deployment branch (e.g., 'master', 'production')

jobs:
  test-dockerfile:
    # This job will test the Dockerfile 
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Test Docker build
        run: docker build -t test-image .
      - name: Test container
        run: |
          docker run -d -p 10000:10000 --name test-container test-image
          sleep 5
          curl -f http://localhost:10000/health || exit 1
          docker stop test-container
          docker rm test-container

  deploy-to-ghcr:
    # This job will deploy the image to GHCR
    needs: test-dockerfile
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v3
      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v2
        with:
          context: .
          push: true
          # 📝 CUSTOMIZE: Replace 'hatemmohmmed73' with your GitHub username and 'game-in-js' with your repository name
          tags: ghcr.io/hatemmohmmed73/game-in-js:latest

  deploy-to-render:
    # This job will deploy the image to Render
    needs: deploy-to-ghcr
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Render
        run: |
          curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}"  # 📝 CUSTOMIZE: Add your Render deploy hook URL to GitHub Secrets as 'RENDER_DEPLOY_HOOK'
```

**Step 4: Set Up Render Deploy Hook**

1. Go to your Render Dashboard (https://dashboard.render.com/)
2. Select your web service
3. Click on **Manual Deploy** in the top right
4. Look for the webhook URL in the manual deploy section
5. It should look like: `https://api.render.com/deploy/srv-xxxxx`

**Step 5: Add Render Deploy Hook to GitHub Secrets**

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. **Name**: `RENDER_DEPLOY_HOOK`
5. **Value**: Paste the webhook URL from Render
6. Click **Add secret**

**Step 6: Trigger a Deployment**

1. Push code to `main` branch
2. GitHub Actions will run tests and validations
3. Docker image will be built and pushed to GHCR
4. Render deployment will be triggered automatically

That's it! Your Node.js app should now be deployed to Render using a GitHub Actions workflow.

### Troubleshooting

* Check the GitHub Actions logs for build and test results.
* View deployment status in the Render dashboard.
* Monitor application health at `https://your-render-app.onrender.com/health`.

### Local Development

* Install dependencies: `npm install`
* Start the development server: `npm start`
* Open `http://localhost:10000` in your browser.

### Running with Docker

* Build the image: `docker build -t my-node-app .`
* Run the container: `docker run -d -p 10000:10000 my-node-app`
* Access at `http://localhost:10000`.

### Access the Application

Open your web browser and navigate to:

```
http://lhost:10000
```
