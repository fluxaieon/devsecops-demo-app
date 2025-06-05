# DevSecOps Demo App

This is a demo project.# Trigger pipeline
# Trigger pipeline again


# DevSecOps Demo App

This project demonstrates a secure CI/CD pipeline for a simple full-stack (Node.js + React) web application using GitHub Actions and JFrog Artifactory. It highlights common security pitfalls and how to fix them through automation and policy enforcement in a DevSecOps workflow.

---

## 🚀 Overview

| Branch | Description |
|--------|-------------|
| `main` | Contains insecure application code that **fails SAST** (Semgrep) due to privileged or insecure configurations |
| `devsecops-demo-pass-pipeline` | Contains the secure version of the code and Dockerfiles that **passes all pipeline security tests** |

---

## 🔐 Pipeline Security Checks (GitHub Actions)

The GitHub Actions workflow (`.github/workflows/devsecops-pipeline.yml`) executes the following security stages:

| Stage | Tool Used | Description |
|-------|-----------|-------------|
| **Build & Push** | Docker + JFrog Artifactory | Builds backend and frontend Docker images and pushes to private registry |
| **SAST** | Semgrep | Performs static analysis on both frontend and backend for security misconfigurations |
| **SCA (optional)** | JFrog Xray | Can be integrated for OSS vulnerability scans |
| **DAST (optional)** | OWASP ZAP | Dynamic scan to find runtime vulnerabilities |
| **Deploy (optional)** | Helm + Kind | Can be triggered manually for Helm deployment to local Kind cluster |

---

## ⚠️ Known Security Issue in `main` Branch

The `main` branch uses insecure Docker images that:
- Run as `root` inside containers
- Lack CSRF protection in Express apps
- Violate best practices and **fail Semgrep rules**

---

## ✅ Fixes in `devsecops-demo-pass-pipeline`

The following security fixes are applied:
- Docker images use non-root numeric UID `1001`
- CSRF middleware (`csurf`) added in both frontend and backend Express servers
- SAST now passes with **zero blocking issues**

---

## Known Issue 
- OWASP ZAP Warning : 

Permission Denied:

    Unable to copy yaml file to /zap/wrk/zap.yaml [Errno 13] Permission denied
    ZAP can't write to the mounted volume due to file system permission issues inside the GitHub Actions runner container.

Target Inaccessible (Most Critical):

    Job spider failed to access URL http://localhost:3000 ... Connection refused
    This happens because ZAP is running in a container, but it's trying to reach localhost:3000 — which refers to the container itself, not your frontend app.

Since your app isn't running inside the same container or accessible from it, ZAP can't reach it.

---

## 🛠 How to Run This Project (Manual DevSecOps Demo)

> Requirements: Docker, GitHub account, JFrog Artifactory (trial is fine), Kind + Helm (optional for deploy)

### 1. Clone and Switch to Secure Branch

```bash
git clone https://github.com/<your-user>/devsecops-demo-app.git
cd devsecops-demo-app
git checkout devsecops-demo-pass-pipeline

---
# Login to JFrog (replace with your creds)
docker login trial<xyz>.jfrog.io

# Backend
cd backend
docker build -t trial<xyz>.jfrog.io/docker-devsecops-local/devsecops-demo-app-backend:latest .
docker push trial<xyz>.jfrog.io/docker-devsecops-local/devsecops-demo-app-backend:latest

# Frontend
cd ../frontend
docker build -t trial<xyz>.jfrog.io/docker-devsecops-local/devsecops-demo-app-frontend:latest .
docker push trial<xyz>.jfrog.io/docker-devsecops-local/devsecops-demo-app-frontend:latest

# Login to JFrog (replace with your creds)
docker login trial<xyz>.jfrog.io

# Backend
cd backend
docker build -t trial<xyz>.jfrog.io/docker-devsecops-local/devsecops-demo-app-backend:latest .
docker push trial<xyz>.jfrog.io/docker-devsecops-local/devsecops-demo-app-backend:latest

# Frontend
cd ../frontend
docker build -t trial<xyz>.jfrog.io/docker-devsecops-local/devsecops-demo-app-frontend:latest .
docker push trial<xyz>.jfrog.io/docker-devsecops-local/devsecops-demo-app-frontend:latest

# Helm install (from project root)
helm upgrade --install elo-app ./charts/elo-app --namespace dev --create-namespace

# Verify
kubectl get pods -n dev
kubectl logs -n dev -l app=devsecops-app -c backend
kubectl logs -n dev -l app=devsecops-app -c frontend

git add .
git commit -m "Trigger secure pipeline"
git push origin devsecops-demo-pass-pipeline


devsecops-demo-app/
├── backend/
│   ├── index.js
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── server.js
│   ├── Dockerfile
│   ├── package.json
│   └── public/
├── charts/elo-app/
│   ├── Chart.yaml
│   ├── templates/
│   │   └── deployment.yaml
│   └── values.yaml
├── .github/workflows/devsecops-pipeline.yml
└── README.md


References:

Semgrep: https://semgrep.dev/ 

OWASP ZAP : https://www.zaproxy.org

JFrog Artifactory : https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://jfrog.com/artifactory/&ved=2ahUKEwiq9d2H7diNAxXs3jgGHYlkNOMQFnoECCIQAQ&usg=AOvVaw1wwsKUemrz2YEfObH5jPNV

Kubernetes Kind : https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://kind.sigs.k8s.io/&ved=2ahUKEwiA4uGR7diNAxX_1zgGHQS2FPYQFnoECBYQAQ&usg=AOvVaw2TejnqsY1pFP0Qa5QJ0v6F

