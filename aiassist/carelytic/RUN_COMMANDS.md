# 🚀 Run Commands - Quick Reference

## Start Expo Development Server

### Option 1: Using npm (Recommended)
```bash
npm start
```

### Option 2: Using npx expo directly
```bash
npx expo start --clear
```

### Option 3: Using startup scripts
**Windows (Batch):**
```bash
start.bat
```

**Windows (PowerShell):**
```powershell
.\start.ps1
```

**Windows (PowerShell - Interactive):**
```powershell
.\start-expo.ps1
```

## Important: Correct Directory

**⚠️ Make sure you're in the correct directory:**
```bash
cd aiassist/carelytic
```

The full path should be:
```
C:\Users\vemul\OneDrive\Desktop\carelytics\aiassist\carelytic
```

## Verify You're in the Right Directory

Check if `package.json` exists:
```bash
ls package.json
# or
dir package.json
```

You should see:
- `package.json`
- `app.json`
- `app/` directory
- `node_modules/` directory

## After Starting the Server

1. **Wait for QR Code:** The QR code will appear in the terminal
2. **Open Expo Go:** Install Expo Go on your phone if you haven't
3. **Scan QR Code:** Use Expo Go to scan the QR code
4. **Wait for Load:** First load takes 30-60 seconds
5. **Verify:** App should load on your phone

## Troubleshooting Commands

### Clear Cache and Restart
```bash
npx expo start --clear
```

### Check Dependencies
```bash
npx expo install --check
```

### Fix Dependencies
```bash
npx expo install --fix
```

### Clean Install
```bash
npm run fresh-install
```

### Check Expo Version
```bash
npx expo --version
```

### Check Node Version
```bash
node --version
```

### Check npm Version
```bash
npm --version
```

## Common Issues

### Issue: "Cannot find package.json"
**Solution:** Make sure you're in the `aiassist/carelytic` directory

### Issue: "Expo not found"
**Solution:** 
```bash
npm install
npx expo install --fix
```

### Issue: "Port 8081 already in use"
**Solution:**
```bash
# Kill the process using port 8081
# Or change port:
npx expo start --port 8082
```

### Issue: "Cannot connect to Metro"
**Solution:**
- Check WiFi connection
- Try tunnel mode: `npx expo start --tunnel`
- Check firewall settings

## Quick Start Checklist

- [ ] Navigate to `aiassist/carelytic` directory
- [ ] Verify `package.json` exists
- [ ] Run `npm start` or `npx expo start --clear`
- [ ] Wait for QR code to appear
- [ ] Install Expo Go on phone
- [ ] Scan QR code with Expo Go
- [ ] Wait for app to load
- [ ] Verify app works on phone

## Success Indicators

✅ Metro bundler starts
✅ QR code appears in terminal
✅ Expo Go connects
✅ App loads on phone
✅ No red error messages
✅ Navigation works

## Next Steps

Once the app loads:
1. Test all screens
2. Check navigation
3. Verify features work
4. Test on both iOS and Android

---

**Remember:** Always run commands from the `aiassist/carelytic` directory!

