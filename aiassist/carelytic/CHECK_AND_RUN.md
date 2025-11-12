# ✅ Check and Run Expo App - Complete Guide

## ⚠️ IMPORTANT: You MUST be in the correct directory!

The correct directory is:
```
C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
```

## 🚀 Step-by-Step Instructions

### Step 1: Open Terminal/PowerShell

Open a new terminal or PowerShell window.

### Step 2: Navigate to the Correct Directory

**Copy and paste this exact command:**
```powershell
cd C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
```

### Step 3: Verify You're in the Right Place

Run this command to check:
```powershell
dir package.json
```

You should see `package.json` in the list. If you get an error, you're in the wrong directory.

### Step 4: Run the Startup Script (Easiest Method)

**Option A: Using Batch File (Windows)**
```powershell
.\run-expo.bat
```

**Option B: Using PowerShell Script**
```powershell
.\run-expo.ps1
```

**Option C: Using npm directly**
```powershell
npm start
```

### Step 5: Wait for QR Code

After running the command, you should see:
- Metro bundler starting
- A QR code in the terminal
- Instructions on how to connect

**Example of what you should see:**
```
Starting Metro Bundler
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █▄▄▄ ▀█▀█▄█ ▄▄▄▄▄ █
█ █   █ ██▄▀ █ ▀▄██ █   █ █
...
› Metro waiting on exp://10.38.5.204:8081
› Scan the QR code above with Expo Go
```

### Step 6: Connect Your Phone

1. **Install Expo Go** (if not already installed):
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. **Make sure both devices are on the SAME WiFi network**

3. **Open Expo Go** on your phone

4. **Tap "Scan QR Code"**

5. **Point camera at the QR code** in the terminal

6. **Wait for app to load** (30-60 seconds first time)

## 🐛 Troubleshooting Common Errors

### Error: "Cannot find package.json"

**Problem:** You're in the wrong directory.

**Solution:**
```powershell
cd C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
dir package.json
```

### Error: "Expo not found"

**Problem:** Dependencies not installed.

**Solution:**
```powershell
npm install
npx expo install --fix
```

### Error: "Port 8081 already in use"

**Problem:** Another process is using the port.

**Solution:**
```powershell
# Kill processes using port 8081
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Or use a different port
npx expo start --port 8082
```

### Error: "Unable to connect to Metro"

**Problem:** Network or firewall issue.

**Solution:**
1. Check WiFi - both devices on same network
2. Try tunnel mode: `npx expo start --tunnel`
3. Check firewall - allow port 8081
4. Restart router if needed

### Error: App Crashes on Phone

**Problem:** Code error or missing dependency.

**Solution:**
1. Check terminal for error messages
2. Clear Expo Go cache (delete and reinstall app)
3. Clear Metro cache: `npx expo start --clear`
4. Check for missing dependencies

## ✅ Verification Checklist

Before running, verify:
- [ ] You're in the correct directory
- [ ] `package.json` exists
- [ ] `app.json` exists
- [ ] `node_modules` exists (or run `npm install`)
- [ ] Expo is installed (`npx expo --version`)

After running, verify:
- [ ] Metro bundler starts
- [ ] QR code appears
- [ ] No red error messages
- [ ] Server is running on port 8081

After scanning QR code, verify:
- [ ] Expo Go connects
- [ ] App starts loading
- [ ] App loads successfully
- [ ] No crash errors

## 🎯 Quick Command Reference

```powershell
# Navigate to directory
cd C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic

# Verify location
dir package.json
dir app.json

# Install dependencies (if needed)
npm install

# Check dependencies
npx expo install --check

# Start server
npm start

# Start with clear cache
npx expo start --clear

# Start with tunnel mode
npx expo start --tunnel
```

## 📱 What to Expect

### When Server Starts:
- Metro bundler initializes
- QR code appears in terminal
- Server URL shown (exp://...)
- Instructions displayed

### When Scanning QR Code:
- Expo Go opens
- Connection starts
- App bundles (first time takes 30-60 seconds)
- App loads on phone

### When App Loads:
- Home screen displays
- Navigation works
- Tabs are clickable
- No error messages

## 🆘 Still Having Issues?

1. **Check the terminal output** for specific error messages
2. **Verify directory** - make sure you're in `aiassist\carelytic`
3. **Check WiFi** - both devices must be on same network
4. **Try tunnel mode** - `npx expo start --tunnel`
5. **Clear cache** - `npx expo start --clear`
6. **Reinstall dependencies** - `npm run fresh-install`

## 📞 Getting Help

If you're still having issues:
1. Check terminal for error messages
2. See `MOBILE_LOADING_FIX.md` for detailed troubleshooting
3. Visit Expo Forums: https://forums.expo.dev
4. Check Expo Discord: https://chat.expo.dev

---

## 🎉 Success!

If everything works, you should see:
- ✅ Server running
- ✅ QR code displayed
- ✅ App loads on phone
- ✅ Navigation works
- ✅ No errors

**The app is ready to use!** 🚀

