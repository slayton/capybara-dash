# 🚀 GitHub Pages Deployment Guide

## Files Added for GitHub Pages

### 1. GitHub Actions Workflow
**File:** `.github/workflows/deploy.yml`
- Automatically builds and deploys to GitHub Pages on every push to `main`
- Uses Node.js 18 and npm for build process
- Deploys to `gh-pages` branch

### 2. Vite Configuration Updates
**File:** `vite.config.ts`
- Added `outDir: 'dist'` for consistent build output
- Added `emptyOutDir: true` to clean builds
- Set `base: './'` for relative paths (GitHub Pages compatibility)

### 3. Documentation Files
- `README.md` - Project overview and instructions
- `PROMPT_SUMMARY.md` - Development history
- `GAME_DEVELOPMENT_BEST_PRACTICES.md` - Lessons learned
- `DEPLOYMENT_GUIDE.md` - This file

## Deployment Steps

### Method 1: Automatic (Recommended)
1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch
   - Click Save

3. **Wait for deployment:**
   - GitHub Actions will automatically build and deploy
   - Check the "Actions" tab to monitor progress
   - Game will be available at: `https://your-username.github.io/your-repo-name/`

### Method 2: Manual Build
1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages manually:**
   ```bash
   # Install gh-pages package
   npm install --save-dev gh-pages
   
   # Deploy dist folder
   npx gh-pages -d dist
   ```

## Repository Settings Required

### GitHub Pages Settings
1. Go to **Settings** → **Pages**
2. Set **Source** to "Deploy from a branch"
3. Select **Branch**: `gh-pages`
4. Select **Folder**: `/ (root)`
5. Click **Save**

### Actions Permissions (if needed)
1. Go to **Settings** → **Actions** → **General**
2. Under "Workflow permissions":
   - Select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"
3. Click **Save**

## Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run build`
- Fix any compilation errors
- Ensure all dependencies are installed: `npm install`

### Deployment Fails
- Check Actions tab for error logs
- Verify GitHub Pages is enabled
- Ensure `gh-pages` branch exists and has content

### Game Not Loading
- Check browser console for errors
- Verify paths are correct (should be relative)
- Clear browser cache and reload

### Assets Not Found
- Ensure `base: './'` in `vite.config.ts`
- Check that `dist/` folder contains all necessary files
- Verify asset paths in built HTML file

## File Structure After Build

```
dist/
├── index.html          # Main game page
├── assets/
│   └── index-[hash].js # Bundled game code
└── other files...      # Additional assets
```

## Testing Deployment Locally

You can test the built version locally:

```bash
# Build the project
npm run build

# Serve the dist folder
npx serve dist
# or
python3 -m http.server 8000 --directory dist
```

Then open http://localhost:5000 (or 8000) to test.

## Performance Notes

- **Bundle size:** ~1.5MB (includes Phaser 3 engine)
- **Gzip compressed:** ~343KB
- **Load time:** Should be fast on most connections
- **Browser compatibility:** Modern browsers (Chrome, Firefox, Safari, Edge)

## URL Structure

Once deployed, your game will be available at:
```
https://[your-username].github.io/[repository-name]/
```

For example:
```
https://johndoe.github.io/capybara-dash/
```

## Custom Domain (Optional)

To use a custom domain:
1. Add a `CNAME` file to the `public/` folder with your domain
2. Configure DNS records at your domain provider
3. Enable "Enforce HTTPS" in GitHub Pages settings

---

**Your game is now ready for the world to play! 🎮**