# 🚀 How to Start the Carelytics App

## Quick Start (Easiest Way)

### Option 1: Use the Start Script (Recommended)

**Windows (PowerShell):**
```powershell
.\START_APP.ps1
```

**Windows (Command Prompt):**
```cmd
START_APP.bat
```

### Option 2: Navigate Manually

**Step 1:** Open PowerShell or Command Prompt

**Step 2:** Navigate to the carelytic directory:
```powershell
cd C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
```

**Step 3:** Start the server:
```powershell
npm start
```

## ✅ What You Should See

After running `npm start`, you should see:

1. **Metro Bundler starting**
2. **QR Code** - Scan this with Expo Go app on your phone
3. **Server URL** - Something like `exp://10.38.5.204:8081`
4. **"Using Expo Go"** message
5. **"Android Bundled"** message when the app is ready

## 📱 How to Use in Expo Go

1. **Install Expo Go** on your phone (from Google Play Store or App Store)

2. **Make sure your phone and computer are on the same Wi-Fi network**

3. **Scan the QR code** from the terminal with:
   - **Android:** Expo Go app
   - **iOS:** Camera app (will open in Expo Go)

4. **Wait for the app to load** - You should see "Carelytics Health Platform"

## 🐛 Troubleshooting

### Error: "Could not read package.json"
- **Solution:** Make sure you're in the correct directory: `aiassist\carelytic`
- **Fix:** Use the `START_APP.bat` or `START_APP.ps1` script from the root directory

### Error: "ENOENT: no such file or directory"
- **Solution:** Navigate to the correct directory first
- **Fix:** Run `cd aiassist\carelytic` before `npm start`

### App not loading on phone
- **Check:** Phone and computer are on the same Wi-Fi network
- **Check:** Firewall is not blocking port 8081
- **Try:** Use tunnel mode: `npx expo start --tunnel`

### Still having issues?
1. Make sure you're in: `C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic`
2. Run: `npm start`
3. Wait for QR code to appear
4. Scan with Expo Go

## 📋 Quick Reference

**Correct Directory:**
```
C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
```

**Command to Start:**
```powershell
npm start
```

**Alternative (with tunnel):**
```powershell
npx expo start --tunnel
```

## ✅ Success Indicators

- ✅ QR code appears in terminal
- ✅ "Metro waiting on exp://..." message
- ✅ "Using Expo Go" message
- ✅ "Android Bundled" message
- ✅ App loads on your phone showing "Carelytics Health Platform"

---

**Need Help?** Make sure you're running from the correct directory: `aiassist\carelytic`

