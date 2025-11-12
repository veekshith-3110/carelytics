# 🚀 How to Fix "npm start" Error

## ❌ The Problem

You're getting this error:
```
npm error code ENOENT
npm error path C:\Users\vemul\OneDrive\Desktop\carelytics\package.json
```

**Reason:** You're running `npm start` from the **wrong directory**!

The Expo app is located in: `aiassist\carelytic` (not in the root)

---

## ✅ Solution: Use One of These Methods

### Method 1: Use the Helper Script (EASIEST) ⭐

**Option A: Double-click the file**
- Double-click `START_APP.bat` in the root directory
- It will automatically navigate to the correct folder and start the server

**Option B: Run in PowerShell**
```powershell
.\START_APP.ps1
```

### Method 2: Navigate Manually

**Step 1:** Open PowerShell or Command Prompt

**Step 2:** Navigate to the correct directory:
```powershell
cd C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
```

**Step 3:** Start the server:
```powershell
npm start
```

### Method 3: One-Line Command

**PowerShell:**
```powershell
cd C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic; npm start
```

**Command Prompt:**
```cmd
cd C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic && npm start
```

---

## ✅ What You Should See (Success)

When it works correctly, you'll see:

```
Starting project at C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
Starting Metro Bundler
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █▄▄▄ ▀█▀█▄█ ▄▄▄▄▄ █
[... QR Code ...]
› Metro waiting on exp://10.38.5.204:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
› Using Expo Go
Android Bundled 689ms node_modules\expo-router\entry.js (1406 modules)
```

---

## 📱 Next Steps

1. **Wait for QR code** to appear in terminal
2. **Open Expo Go** on your phone
3. **Scan the QR code**
4. **Wait for app to load** - You should see "Carelytics Health Platform"

---

## 🐛 Still Having Issues?

### Check 1: Verify Directory
```powershell
# Check if you're in the right place
Get-Location
# Should show: C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic

# Check if package.json exists
Test-Path package.json
# Should return: True
```

### Check 2: Verify Files
```powershell
# List files in current directory
ls
# Should show: package.json, app.json, node_modules, etc.
```

### Check 3: Reinstall Dependencies (if needed)
```powershell
cd C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
npm install
npm start
```

---

## 📋 Quick Reference

**Correct Directory:**
```
C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
```

**Commands:**
```powershell
# Navigate
cd C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic

# Start server
npm start

# Or use helper script from root
.\START_APP.ps1
```

---

## ✅ Summary

**The Error:** Running `npm start` from wrong directory  
**The Fix:** Navigate to `aiassist\carelytic` first, OR use `START_APP.bat`  
**The Result:** Server starts, QR code appears, app loads in Expo Go!

---

**Need More Help?** Make sure you're always in the `aiassist\carelytic` directory before running `npm start`!

