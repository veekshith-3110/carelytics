# 📱 How to Run Expo App on Mobile - Step by Step

## ⚠️ IMPORTANT: Correct Directory

You must be in the correct directory to run the commands:
```
C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
```

## 🚀 Step-by-Step Instructions

### Step 1: Open Terminal/PowerShell

Open a new terminal or PowerShell window.

### Step 2: Navigate to the Correct Directory

```powershell
cd C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
```

Or from the project root:
```powershell
cd aiassist\carelytic
```

### Step 3: Verify You're in the Right Directory

Check if you see these files:
```powershell
dir package.json
dir app.json
```

You should see both files. If not, you're in the wrong directory.

### Step 4: Start the Expo Server

Choose one of these methods:

#### Method 1: Using npm (Easiest)
```powershell
npm start
```

#### Method 2: Using npx expo directly
```powershell
npx expo start --clear
```

#### Method 3: Using the batch script
```powershell
.\start.bat
```

#### Method 4: Using the PowerShell script
```powershell
.\start.ps1
```

### Step 5: Wait for QR Code

After running the command, you should see:
- Metro bundler starting
- QR code appearing in the terminal
- Instructions on how to connect

### Step 6: Install Expo Go on Your Phone

If you haven't already:
- **iOS:** [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android:** [Download from Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Step 7: Connect Your Phone

1. **Make sure both devices are on the same WiFi network**
2. Open Expo Go app on your phone
3. Tap "Scan QR Code"
4. Point camera at the QR code in the terminal
5. Wait for the app to load (30-60 seconds first time)

### Step 8: Verify It's Working

✅ App loads on your phone
✅ Home screen displays
✅ You can navigate between tabs
✅ No error messages

## 🐛 Troubleshooting

### Problem: "Cannot find package.json"
**Solution:** You're in the wrong directory. Navigate to `aiassist\carelytic`

### Problem: "Expo not found"
**Solution:** 
```powershell
npm install
npx expo install --fix
```

### Problem: QR Code Not Appearing
**Solution:** 
- Wait a few seconds for Metro bundler to start
- Check if there are any error messages
- Try: `npx expo start --clear`

### Problem: Can't Connect from Phone
**Solution:**
1. Check WiFi - both devices must be on same network
2. Try tunnel mode: `npx expo start --tunnel`
3. Check firewall - allow port 8081
4. Try manual connection in Expo Go

### Problem: App Crashes on Phone
**Solution:**
1. Check terminal for error messages
2. Clear Expo Go cache (delete and reinstall app)
3. Restart development server
4. Check for missing dependencies

## 📋 Quick Command Reference

```powershell
# Navigate to directory
cd C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic

# Start server
npm start

# Or with clear cache
npx expo start --clear

# Or use tunnel mode (if WiFi issues)
npx expo start --tunnel

# Check dependencies
npx expo install --check

# Fix dependencies
npx expo install --fix
```

## ✅ Success Checklist

- [ ] In correct directory (`aiassist\carelytic`)
- [ ] `package.json` exists
- [ ] Metro bundler starts
- [ ] QR code appears in terminal
- [ ] Expo Go installed on phone
- [ ] Phone and computer on same WiFi
- [ ] QR code scanned successfully
- [ ] App loads on phone
- [ ] No error messages
- [ ] Navigation works

## 🎯 What You Should See

When you run `npm start`, you should see:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor

› Press ? │ show all commands
```

## 🆘 Still Having Issues?

1. Check `RUN_COMMANDS.md` for command reference
2. Check `MOBILE_LOADING_FIX.md` for troubleshooting
3. Check `QUICK_START.md` for detailed instructions
4. Visit [Expo Forums](https://forums.expo.dev)
5. Check [Expo Discord](https://chat.expo.dev)

---

## 🎉 Ready to Run!

**Follow these steps:**
1. Open terminal
2. Navigate to `aiassist\carelytic`
3. Run `npm start`
4. Scan QR code with Expo Go
5. Enjoy your app on mobile!

**The app is ready to run!** 🚀

