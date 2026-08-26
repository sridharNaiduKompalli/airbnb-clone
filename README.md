# Airbnb Clone - DevOps Showcase Project

A full-stack Airbnb clone designed specifically to demonstrate **DevOps best practices**, containerization, CI/CD automation, Infrastructure as Code (IaC), and cloud orchestration.

This repository contains a modular React SPA frontend, a Node.js Express REST API backend, and comprehensive DevOps integrations that enable seamless local development and production-ready deployments using **free-tier cloud services**.

---

## 🏛️ Architecture Overview

The application is structured into discrete layers, aligning with modern cloud-native architectures:

```
                  ┌───────────────────────────────┐
                  │        Browser Client         │
                  └───────────────┬───────────────┘
                                  │ (HTTPS)
                                  ▼
┌───────────────────────────────────────────────────────────────────┐
│ Kubernetes Ingress / Reverse Proxy (Nginx)                         │
└───────┬───────────────────────────────────────────────────┬───────┘
        │                                                   │
        │ / (Static Files)                                  │ /api/* (API Requests)
        ▼                                                   ▼
┌───────────────────────────────┐           ┌───────────────────────────────┐
│      Frontend Container       │           │       Backend Container       │
│        (React / Vite)         │           │       (Express REST API)      │
└───────────────────────────────┘           └───────────────┬───────────────┘
                                                            │
                                                            ▼
                                            ┌───────────────────────────────┐
                                            │       Database Container      │
                                            │         (PostgreSQL)          │
                                            └───────────────────────────────┘
```

* **Frontend**: Single Page Application built with **React**, **Vite**, and **Tailwind CSS**. Served in production via a custom **Nginx** configuration that acts as a secure reverse proxy for backend API routing.
* **Backend**: **Node.js & Express** REST API handling listings, booking operations, and health telemetry.
* **Database**: **PostgreSQL** (backed up by an in-memory/JSON fallback datastore to allow zero-config instant boots locally).

---

## 🛠️ DevOps Features Included

1. **Multi-Stage Dockerfiles**: Optimized build stages that shrink container image sizes and remove dev dependencies from the final runner layer. Hardened with **non-root user** execution.
2. **Multi-Container Orchestration**: A `docker-compose.yml` blueprint mapping database health states, environment variables, networking bridges, and volume mounts.
3. **CI/CD Pipelines**: A `.github/workflows/ci.yml` pipeline that triggers on pushes and PRs to test the API, compile Vite assets, and build Docker containers.
4. **Kubernetes (K8s) manifests**: Complete deployment, service (ClusterIP), PersistentVolumeClaims, ConfigMaps, Secret specs, and Ingress routing configs for local K8s testing (Minikube).
5. **Infrastructure as Code (IaC)**: Terraform configurations targeting **Render** and database provisioning.

---

## 🚀 1. Local Quickstart (Direct Execution)

Use this method to run the project directly on your host machine without containers.

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or v20)

### Step 1: Start the Backend API
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the hot-reloading development server:
   ```bash
   npm run dev
   ```
   * The API runs at `http://localhost:5000`
   * Health status is available at `http://localhost:5000/health`

### Step 2: Start the Frontend SPA
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   * Open `http://localhost:5173` in your browser.
   * Vite automatically proxies `/api/*` and `/health` requests to `http://localhost:5000`.

---

## 🐳 2. Containerized Execution (Docker Compose)

Spin up the frontend, backend, and PostgreSQL database automatically.

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Spin Up the Stack
Run the following command in the project root directory:
```bash
docker compose up --build
```

* **Frontend App**: `http://localhost:8080`
* **Backend Health**: `http://localhost:8080/health` (routed via Nginx proxy)
* **PostgreSQL Port**: `5432` (exposed locally for debugging)

To tear down the stack and remove persistent data volumes:
```bash
docker compose down -v
```

---

## ☁️ 3. Deploying to Free Cloud Platforms

You can host this entire stack for free using Neon and Render.

### Part A: Database Deployment (Neon)
1. Head to [Neon DB](https://neon.tech/) and sign up for a free tier account.
2. Create a new project and select **PostgreSQL 15+**.
3. Copy your connection string (similar to `postgres://alex:pwd@ep-lively-wild-123.us-east-2.aws.neon.tech/neondb?sslmode=require`).

### Part B: Backend Deployment (Render Web Service)
1. Go to [Render](https://render.com/) and register.
2. Click **New +** and select **Web Service**.
3. Link your GitHub repository.
4. Set the following details:
   * **Root Directory**: `backend`
   * **Runtime**: `Node`
   * **Build Command**: `npm ci`
   * **Start Command**: `node server.js`
   * **Plan**: `Free`
5. Add the following **Environment Variables**:
   * `DATABASE_URL`: *(Insert your Neon DB connection string)*
   * `NODE_ENV`: `production`
   * `PORT`: `5000`
6. Click **Deploy Web Service**. Render will build the container and provide an active URL (e.g., `https://airbnb-backend.onrender.com`).

### Part C: Frontend Deployment (Render Static Site or Vercel)
#### Option 1: Render Static Site
1. Click **New +** and select **Static Site**.
2. Link your repository.
3. Configure settings:
   * **Root Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Publish Directory**: `dist`
4. Add **Environment Variables**:
   * `VITE_API_URL`: *(Your Backend Web Service URL without the trailing slash)*
5. Click **Deploy**. Render will serve your React build and proxy API calls.

---

## ☸️ 4. Kubernetes (K8s) Orchestration Guide

You can deploy the microservice structure to a local Kubernetes cluster (like Minikube).

### Step 1: Start Minikube & Enable Ingress
```bash
minikube start
minikube addons enable ingress
```

### Step 2: Point Local Docker CLI to Minikube
This allows Minikube to read local Docker images without pushing them to Docker Hub.
* **Windows (PowerShell)**:
  ```powershell
  & minikube -p minikube docker-env | Invoke-Expression
  ```
* **macOS/Linux**:
  ```bash
  eval $(minikube docker-env)
  ```

### Step 3: Build the Images
Run these build commands inside their respective directories:
```bash
docker build -t airbnb-backend:latest ./backend
docker build -t airbnb-frontend:latest ./frontend
```

### Step 4: Apply Manifests
Apply the resources in order (Namespace -> Config -> Storage -> Deployments):
```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres-pv.yaml
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/postgres-service.yaml

# Wait for DB to be running before launching backend pods
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ingress.yaml
```

### Step 5: Map Host Resolution
Get your minikube IP:
```bash
minikube ip
```
Add the following line to your local hosts file (`C:\Windows\System32\drivers\etc\hosts` on Windows, or `/etc/hosts` on UNIX):
```text
<MINIKUBE_IP>  airbnb.local
```
Now, navigate to `http://airbnb.local` in your browser to view the cluster-balanced frontend.

### Useful K8s Commands
* **Inspect Pod Status**: `kubectl get pods`
* **Inspect Services**: `kubectl get svc`
* **Backend Logs**: `kubectl logs -l component=backend`
* **Restart Deployments**: `kubectl rollout restart deployment airbnb-backend-deployment`

---

## 🧪 5. Testing and Observability
Verify changes using automated health checks and test scripts.

* **Run Backend Unit Tests**:
  ```bash
  cd backend
  npm run test
  ```
* **DevOps Observability Metric**:
  Querying `GET /health` returns JSON telemetry detailing service uptime, node environmental statuses, and database adapter fallback conditions.
