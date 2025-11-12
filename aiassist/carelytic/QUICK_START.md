# Quick Start Guide - Run Expo App on Mobile

## Step 1: Start the Development Server

```bash
cd carelytic
npm start
```

Or use the startup script:
```powershell
.\start-expo.ps1
```

## Step 2: Install Expo Go on Your Phone

- **iOS:** [App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android:** [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Step 3: Connect Your Phone

### Option A: Same WiFi Network (Recommended)
1. Make sure your phone and computer are on the same WiFi network
2. Open Expo Go on your phone
3. Scan the QR code shown in the terminal
4. Wait for the app to load (first load may take 30-60 seconds)

### Option B: Tunnel Mode (Different Networks)
1. Start with tunnel mode:
   ```bash
   npx expo start --tunnel
   ```
2. Scan the QR code
3. Note: Requires Expo account (free to sign up)

### Option C: Manual Connection
1. Find your computer's IP address
2. In Expo Go, tap "Enter URL manually"
3. Enter: `exp://YOUR_IP:8081`

## Step 4: Verify It's Working

✅ You should see the app load on your phone
✅ The home screen should display
✅ You can navigate between tabs
✅ No red error messages

## Troubleshooting

### App Not Loading?

1. **Check WiFi Connection:**
   - Both devices must be on the same network
   - Try disconnecting and reconnecting WiFi

2. **Clear Cache:**
   ```bash
   npx expo start --clear
   ```

3. **Check Firewall:**
   - Allow port 8081 in Windows Firewall
   - Allow Expo in firewall settings

4. **Try Tunnel Mode:**
   ```bash
   npx expo start --tunnel
   ```

5. **Restart Everything:**
   ```bash
   # Stop the server (Ctrl+C)
   npm run clean:win
   npm start
   ```

### Connection Timeout?

- Check if Metro bundler is running
- Verify QR code is visible
- Try tunnel mode
- Check Expo Go app version (update if needed)

### App Crashes?

- Check terminal for error messages
- Clear Expo Go app cache
- Restart development server
- Check for missing dependencies

## Common Issues

### Issue: "Unable to connect to Metro"
**Fix:** 
- Check WiFi connection
- Try tunnel mode
- Restart Metro bundler

### Issue: "Module not found"
**Fix:**
```bash
npm run fresh-install
npx expo install --fix
```

### Issue: "Asset not found"
**Fix:**
- Verify assets exist in `assets/images/`
- Check asset paths in code
- Clear cache and restart

## Success Checklist

- [ ] Metro bundler starts successfully
- [ ] QR code appears in terminal
- [ ] Expo Go app installed on phone
- [ ] Phone and computer on same WiFi
- [ ] QR code scanned successfully
- [ ] App loads on phone
- [ ] No error messages
- [ ] Can navigate between screens

## Next Steps

Once the app loads:
1. Test all screens and navigation
2. Check that features work
3. Test on both iOS and Android
4. Verify assets load correctly
5. Test light/dark mode

## Getting Help

If you're still having issues:
1. Check `MOBILE_LOADING_FIX.md` for detailed troubleshooting
2. Visit [Expo Forums](https://forums.expo.dev)
3. Check [Expo Discord](https://chat.expo.dev)
4. Review [Expo Documentation](https://docs.expo.dev)

## Quick Commands

```bash
# Start Expo
npm start

# Start with Expo Go
npm run start:go

# Start with tunnel
npx expo start --tunnel

# Clear cache and start
npx expo start --clear

# Check dependencies
npx expo install --check

# Fix dependencies
npx expo install --fix
```

---

**The app should now load on your mobile device!** 🎉

If you're still experiencing issues, check the troubleshooting section or see `MOBILE_LOADING_FIX.md` for more help.

