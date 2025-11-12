# Installation Troubleshooting Guide

This guide helps resolve common `npm install` issues in this project.

## Quick Fix

If you're experiencing installation errors, try the following:

### Option 1: Use the PowerShell Script (Windows)
```powershell
.\install.ps1
```

### Option 2: Use the Bash Script (Mac/Linux)
```bash
chmod +x install.sh
./install.sh
```

### Option 3: Manual Clean Installation
```bash
# Clean install using npm scripts
npm run fresh-install
```

## Common Issues and Solutions

### 1. Peer Dependency Warnings/Errors

**Problem:** Packages complain about React version mismatches or peer dependencies.

**Solution:** The `.npmrc` file is already configured with `legacy-peer-deps=true` to handle these issues. If you still see errors:

```bash
# Ensure .npmrc exists and contains:
# legacy-peer-deps=true
npm install --legacy-peer-deps
```

### 2. Corrupted Cache

**Problem:** Installation fails due to corrupted npm cache.

**Solution:**
```bash
npm cache clean --force
npm cache verify
npm install
```

### 3. Stale node_modules

**Problem:** Outdated or corrupted `node_modules` directory.

**Solution:**
```bash
# Windows (PowerShell)
npm run clean:win
npm install

# Mac/Linux
npm run clean
npm install
```

### 4. Permission Errors

**Problem:** EACCES or permission denied errors.

**Solution (Windows):**
- Run PowerShell/Command Prompt as Administrator
- Or change npm's default directory (see npm documentation)

**Solution (Mac/Linux):**
- Avoid using `sudo` with npm
- Fix npm permissions (see npm documentation)

### 5. Node Version Issues

**Problem:** Incompatible Node.js version.

**Solution:** This project requires:
- Node.js >= 18.0.0
- npm >= 9.0.0

Check your versions:
```bash
node --version
npm --version
```

Update Node.js from [nodejs.org](https://nodejs.org)

### 6. React 19 Compatibility

**Problem:** Some packages may show warnings about React 19 compatibility.

**Solution:** The project uses `legacy-peer-deps=true` to handle these. Most packages work fine with React 19, but if you encounter runtime issues, the warnings can be safely ignored in most cases.

## Project Configuration

### `.npmrc` Settings

The project includes an `.npmrc` file with the following settings:
```
legacy-peer-deps=true
fund=false
audit=false
progress=true
loglevel=warn
```

These settings:
- Allow installation despite peer dependency warnings
- Reduce unnecessary output during installation
- Improve installation performance

### Package Scripts

Available npm scripts:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run clean:win` - Clean installation (Windows)
- `npm run clean` - Clean installation (Mac/Linux)
- `npm run fresh-install` - Clean and reinstall (Windows)

## Still Having Issues?

If you're still experiencing problems:

1. **Check Node.js version:** Ensure you're using Node.js 18 or higher
2. **Clear all caches:** Run `npm cache clean --force`
3. **Remove node_modules:** Delete the `node_modules` folder and `package-lock.json`
4. **Reinstall:** Run `npm install` again
5. **Check for specific errors:** Look for specific error messages and search for solutions online

## Verification

After installation, verify everything works:

```bash
# Check installed packages
npm list --depth=0

# Run build (if applicable)
npm run build

# Start development server
npm run dev
```

## Support

If you continue to experience issues, please:
1. Note the exact error message
2. Check your Node.js and npm versions
3. Review the error logs for specific package conflicts
4. Check if the issue is related to a specific package

