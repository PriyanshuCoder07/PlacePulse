# GitHub Setup Guide for PlacePulse

## Step-by-Step Instructions to Upload Your Project

### Step 1: Initialize Git Repository (Local)

Open PowerShell and navigate to your project root:

```powershell
cd C:\Users\kumar\PlacePulse
```

Initialize a git repository:
```powershell
git init
```

### Step 2: Configure Git (If Not Done Before)

Set your GitHub username and email:
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Add Files to Git

Add all files to staging (the .gitignore files will automatically exclude node_modules, .env, serviceAccount.json, etc.):

```powershell
git add .
```

Check what files are being staged:
```powershell
git status
```

**Important**: Verify that `.env` and `serviceAccount.json` are NOT in the list. They should be excluded by `.gitignore`.

### Step 4: Create Initial Commit

```powershell
git commit -m "Initial commit: Add PlacePulse full-stack application"
```

### Step 5: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and log in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Repository name: `PlacePulse`
4. Description: `A full-stack travel experience sharing platform`
5. Choose **Public** or **Private** (your preference)
6. **Do NOT** initialize with README (you already have one)
7. Click **"Create repository"**

### Step 6: Connect Local Repository to GitHub

Copy the HTTPS URL from your new GitHub repository (should look like: `https://github.com/YOUR_USERNAME/PlacePulse.git`)

Then run:
```powershell
git remote add origin https://github.com/YOUR_USERNAME/PlacePulse.git
```

Verify the connection:
```powershell
git remote -v
```

### Step 7: Push to GitHub

Push your code to GitHub:
```powershell
git branch -M main
git push -u origin main
```

### Step 8: Verify on GitHub

- Go to your GitHub repository URL
- You should see all your files (except `.env`, `node_modules/`, `serviceAccount.json`)
- The `README.md` will be displayed on the repository homepage

## Handling Environment Variables & Secrets

### For You and Your Team:

1. **Frontend Setup** - Copy the example file:
   ```powershell
   cd frontend
   Copy-Item .env.example .env.local
   # Edit .env.local with your Firebase credentials
   ```

2. **Backend Setup** - Copy the example file:
   ```powershell
   cd backend
   Copy-Item .env.example .env
   # Edit .env with your MongoDB URI and Firebase credentials
   ```

3. **Firebase Service Account** - Create manually:
   - Place `serviceAccount.json` in `backend/src/config/`
   - This file is in `.gitignore`, so it won't be committed

### For Collaborators:

They should:
1. Clone the repository
2. Copy `.env.example` to `.env` (or `.env.local` for frontend)
3. Fill in their own credentials
4. Copy Firebase service account JSON

## Future Updates

When you make changes to your project:

```powershell
# See what changed
git status

# Add changes
git add .

# Commit with a meaningful message
git commit -m "Description of changes"

# Push to GitHub
git push
```

## Common Commands Reference

```powershell
# View commit history
git log --oneline

# Check branch
git branch

# Create new branch for feature
git checkout -b feature/feature-name

# Switch branches
git checkout main

# Delete branch
git branch -D branch-name

# View changes before committing
git diff
```

## Troubleshooting

### "fatal: not a git repository"
- Make sure you're in the `C:\Users\kumar\PlacePulse` directory
- Run `git init` again

### "Permission denied" when pushing
- Check if SSH keys are configured, or use HTTPS with personal access token
- Create a Personal Access Token on GitHub: Settings → Developer settings → Personal access tokens

### Files accidentally committed
- If you committed sensitive files before creating `.gitignore`:
  ```powershell
  git rm --cached .env
  git rm --cached backend/src/config/serviceAccount.json
  git commit -m "Remove sensitive files"
  git push
  ```

## Next Steps

1. ✅ Create `.gitignore` files (DONE)
2. ✅ Create `README.md` (DONE)
3. ✅ Create `.env.example` files (DONE)
4. Initialize git repository
5. Make initial commit
6. Create GitHub repository
7. Push your code
8. Add collaborators (if needed)
9. Set up GitHub Actions for CI/CD (optional)

Good luck! 🚀
