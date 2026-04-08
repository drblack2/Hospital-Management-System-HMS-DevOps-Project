# GitHub Actions CI/CD Setup Guide

## 📋 What We've Set Up

Your CI/CD pipeline will:
- ✅ **Automatically trigger** on every push to `main` or `develop` branch
- ✅ **Build** Docker images for both backend and frontend
- ✅ **Test** the backend
- ✅ **Push** images to Docker Hub with automatic tagging
- ✅ **Deploy** ready images for production use

---

## 🚀 Step-by-Step Setup

### **Step 1: Create a Docker Hub Account (if you don't have one)**

1. Go to https://hub.docker.com
2. Sign up for a free account
3. Confirm your email

---

### **Step 2: Create Docker Hub Access Token**

1. Log in to Docker Hub at https://hub.docker.com
2. Go to **Account Settings** → **Security**
3. Click **New Access Token**
4. Name it: `github-hospital-ci` (or any name)
5. Set permissions: **Read & Write**
6. Click **Generate**
7. **Copy the token** (you'll only see it once!)

---

### **Step 3: Add Secrets to GitHub Repository**

1. Go to your GitHub repository: `https://github.com/YOUR-USERNAME/YOUR-REPO`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

**Add these 2 secrets:**

| Secret Name | Value |
|------------|-------|
| `DOCKER_HUB_USERNAME` | Your Docker Hub username |
| `DOCKER_HUB_TOKEN` | The token you copied in Step 2 |

**Example:**
```
DOCKER_HUB_USERNAME = john_doe
DOCKER_HUB_TOKEN = dckr_pat_abc123xyz789...
```

---

### **Step 4: Commit and Push the Workflow File**

```bash
# Make sure you're in your project root
cd C:\Users\91728\OneDrive\Desktop\Devops-project1

# Add the workflow file
git add .github/workflows/ci-cd.yml

# Commit
git commit -m "Add GitHub Actions CI/CD pipeline"

# Push to GitHub
git push origin main
```

---

### **Step 5: Monitor Your First Build**

1. Go to your GitHub repo
2. Click **Actions** tab
3. You'll see your workflow `CI/CD Pipeline` running
4. Wait for it to complete (usually 2-5 minutes)

---

## 📊 What Happens on Each Push

### **On Push to `main` or `develop`:**

```
┌─────────────────┐
│  You push code  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ GitHub Actions triggers     │
│ CI/CD Pipeline workflow     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ 1. Build Backend Image      │
│ 2. Run Backend Tests        │
│ 3. Build Frontend Image     │
│ 4. Push to Docker Hub       │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ ✅ Workflow Complete        │
│ Images ready in Docker Hub  │
└─────────────────────────────┘
```

---

## 🔍 Monitoring & Logs

### **View Workflow Status:**
1. Go to **Actions** tab in GitHub
2. Click on the workflow run
3. Click on the job to see detailed logs

### **Common Status:**
- 🟢 **Success**: Everything worked!
- 🔴 **Failed**: Check logs for errors
- 🟡 **In Progress**: Still running

---

## 🐳 Pull Images from Docker Hub

Once images are pushed, anyone can run them:

```bash
# Pull latest images
docker pull YOUR-USERNAME/hospital-backend:latest
docker pull YOUR-USERNAME/hospital-frontend:latest

# Run them
docker run -p 5000:5000 YOUR-USERNAME/hospital-backend:latest
docker run -p 3000:3000 YOUR-USERNAME/hospital-frontend:latest
```

---

## 📝 Image Naming Convention

Your images will be tagged automatically:

| Tag | When | Example |
|-----|------|---------|
| `latest` | On main branch push | `john/hospital-backend:latest` |
| `develop` | On develop branch push | `john/hospital-backend:develop` |
| `sha-xxx` | Every commit | `john/hospital-backend:sha-abc123` |
| `v1.0.0` | When you create a release | `john/hospital-backend:v1.0.0` |

---

## ⚠️ Troubleshooting

### **Issue: Workflow fails with "unauthorized"**
- ✅ Check Docker Hub credentials in GitHub secrets
- ✅ Make sure token hasn't expired
- ✅ Verify token has Read & Write permissions

### **Issue: "dockerfile not found"**
- ✅ Make sure `backend/dockerfile` and `frontend/Dockerfile` exist
- ✅ Check file names (case-sensitive on Linux)

### **Issue: Tests failing**
- ✅ Check `npm test` scripts in your package.json
- ✅ The workflow will continue even if tests fail (for now)

---

## 🚀 Next Advanced Features (Optional)

### 1. **Auto-Deploy to Production**
```yaml
# After successful build, deploy to production server
- name: Deploy to Production
  run: |
    ssh user@production.com "docker-compose pull && docker-compose up -d"
```

### 2. **Slack Notifications**
```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1
```

### 3. **Version Tagging**
```yaml
- name: Create Release
  if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags/')
```

---

## ✅ Verification Checklist

- [ ] Docker Hub account created
- [ ] Access token generated
- [ ] GitHub secrets added (`DOCKER_HUB_USERNAME` & `DOCKER_HUB_TOKEN`)
- [ ] Workflow file committed and pushed
- [ ] First workflow run completed successfully
- [ ] Images appear in Docker Hub
- [ ] Can pull images locally: `docker pull YOUR-USERNAME/hospital-backend:latest`

---

## 📞 Quick Reference

```bash
# View workflow logs
git log --oneline -5

# Push to trigger workflow
git push origin main

# Check Docker Hub images
docker search YOUR-USERNAME/hospital

# Pull and run latest
docker pull YOUR-USERNAME/hospital-backend:latest
docker run -p 5000:5000 YOUR-USERNAME/hospital-backend:latest
```

---

**🎉 Congratulations!** You now have automated CI/CD pipeline! Every time you push code, it automatically builds, tests, and deploys your Docker images. 🚀
