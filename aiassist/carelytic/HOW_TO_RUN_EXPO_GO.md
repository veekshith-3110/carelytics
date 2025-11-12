# 📱 How to Run Expo App in Expo Go - Complete Guide

## ✅ Fixed Issues

1. **Removed New Architecture warning** - Removed `newArchEnabled: false` from app.json
2. **App is ready** - All components are working
3. **Expo Go compatible** - Configured for Expo Go

## 🚀 Step-by-Step: How to Run

### Step 1: Start the Server

**Open Terminal/PowerShell and run:**
```powershell
cd C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
npm start
```

### Step 2: Wait for QR Code

You should see:
- Metro bundler starting
- QR code appearing in terminal
- Server URL: `exp://10.38.5.204:8081`

**Example output:**
```
Starting Metro Bundler
[QR CODE HERE]
› Metro waiting on exp://10.38.5.204:8081
› Scan the QR code above with Expo Go
```

### Step 3: Install Expo Go (if not installed)

- **iOS:** [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android:** [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Step 4: Connect Your Phone

1. **Make sure phone and computer are on the SAME WiFi network**
2. **Open Expo Go app** on your phone
3. **Tap "Scan QR Code"** in Expo Go
4. **Point camera at the QR code** in the terminal
5. **Wait for app to load** (first time takes 30-60 seconds)

### Step 5: Verify It's Working

✅ App should load on your phone
✅ Home screen should display
✅ You should see "Welcome!" message
✅ Tabs should work (Home, Explore, Test)
✅ Navigation should work

## 📱 What You Should See in Expo Go

### When App Loads:
- **Home Screen** with "Welcome!" message
- **Tabs at bottom:** Home, Explore, Test
- **Wave emoji** (👋) that animates
- **Scrollable content** with instructions

### Navigation:
- **Tap "Explore" tab** - See feature showcase
- **Tap "Test" tab** - See test screen
- **Swipe between tabs** - Navigation works

## 🐛 Troubleshooting

### Problem: App Shows Error in Expo Go

**Solution 1: Clear Cache**
```powershell
# Stop the server (Ctrl+C)
npx expo start --clear
```

**Solution 2: Restart Expo Go**
- Close Expo Go app completely
- Clear app cache (iOS: delete and reinstall, Android: clear app data)
- Restart Expo Go and scan QR code again

**Solution 3: Check for Errors**
- Look at terminal for error messages
- Check Expo Go for error notifications
- Verify all dependencies are installed

### Problem: App Doesn't Load

**Check:**
1. **WiFi Connection** - Both devices on same network
2. **Firewall** - Allow port 8081
3. **Server Running** - Metro bundler should be running
4. **QR Code Scanned** - Make sure QR code was scanned correctly

**Try:**
```powershell
# Use tunnel mode
npx expo start --tunnel
```

### Problem: Blank Screen or Crash

**Solution:**
1. **Check terminal** for error messages
2. **Clear Metro cache:**
   ```powershell
   npx expo start --clear
   ```
3. **Restart Expo Go app**
4. **Reinstall dependencies:**
   ```powershell
   npm install
   npx expo install --fix
   ```

### Problem: "Unable to connect"

**Solutions:**
1. **Check WiFi** - Both devices on same network
2. **Try tunnel mode:**
   ```powershell
   npx expo start --tunnel
   ```
3. **Check firewall** - Allow Expo/port 8081
4. **Restart router** if needed

## ✅ Expected Behavior

### Terminal Output:
- ✅ Metro bundler starts
- ✅ QR code appears
- ✅ "Android Bundled" message (when app loads)
- ✅ No red error messages
- ✅ Server running on port 8081

### Expo Go App:
- ✅ App loads successfully
- ✅ Home screen displays
- ✅ Navigation works
- ✅ Tabs are clickable
- ✅ No crash errors
- ✅ Smooth scrolling

## 🎯 Quick Commands

```powershell
# Start server
npm start

# Start with clear cache
npx expo start --clear

# Start with tunnel mode
npx expo start --tunnel

# Check dependencies
npx expo install --check

# Fix dependencies
npx expo install --fix
```

## 📋 Checklist

Before running:
- [ ] In correct directory (`aiassist\carelytic`)
- [ ] `package.json` exists
- [ ] Dependencies installed
- [ ] Expo Go installed on phone
- [ ] Phone and computer on same WiFi

After starting server:
- [ ] Metro bundler starts
- [ ] QR code appears
- [ ] No red error messages
- [ ] Server URL shown

After scanning QR code:
- [ ] Expo Go connects
- [ ] App starts loading
- [ ] App loads successfully
- [ ] Home screen displays
- [ ] Navigation works

## 🆘 Still Having Issues?

### Check These:
1. **Terminal for errors** - Look for red error messages
2. **Expo Go version** - Make sure it's updated
3. **Node.js version** - Should be >= 18.0.0
4. **npm version** - Should be >= 9.0.0
5. **WiFi connection** - Both devices on same network

### Get Help:
1. Check terminal output for specific errors
2. See `MOBILE_LOADING_FIX.md` for troubleshooting
3. Visit [Expo Forums](https://forums.expo.dev)
4. Check [Expo Discord](https://chat.expo.dev)

## 🎉 Success!

If everything works:
- ✅ Server starts
- ✅ QR code appears
- ✅ App loads on phone
- ✅ Home screen displays
- ✅ Navigation works
- ✅ No errors

**The app is working in Expo Go!** 🚀

---

## 📝 Quick Reference

**Start Server:**
```powershell
cd C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
npm start
```

**Connect Phone:**
1. Open Expo Go
2. Scan QR code
3. Wait for app to load

**That's it!** 🎉

