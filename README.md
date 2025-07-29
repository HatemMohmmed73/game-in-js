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

## 🏗️ Project Structure (Copy This)

```
├── .github/workflows/
│   └── deploy.yml          # 🚀 Your CI/CD pipeline
├── src/                    # Your app code (modify as needed)
│   └── server.js          # Main application file
├── Dockerfile             # 🐳 Docker configuration
├── package.json           # 📦 Dependencies and scripts
└── README.md             # 📖 This tutorial
```

## 🚀 Quick Start (5 Minutes)

### Step 1: Copy Everything Below

**Copy-paste these files into your project. That's it!**

### Step 2: Customize 3 Values

**Only change these 3 things:**
1. Your app port (default: 3000)
2. Your app name (for Docker image)
3. Your health check endpoint (default: /health)

### Step 3: Deploy

**Push to GitHub and watch the magic happen!**

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
