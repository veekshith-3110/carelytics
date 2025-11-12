# Mobile Loading Issues - Troubleshooting Guide

## Common Issues and Fixes

### 1. App Not Loading on Mobile

#### Issue: QR Code Not Working
**Solution:**
- Make sure both devices are on the same WiFi network
- Try using tunnel mode: `npx expo start --tunnel`
- Check firewall settings (allow port 8081)
- Try connecting via IP address manually in Expo Go

#### Issue: Connection Timeout
**Solution:**
```bash
# Clear cache and restart
npm run clean:win
npm start -- --clear
```

#### Issue: Metro Bundler Not Starting
**Solution:**
```bash
# Kill any existing processes
npx expo start --clear
```

### 2. App Crashes on Load

#### Check for Errors:
1. Look at the terminal for error messages
2. Check Expo Go app logs
3. Verify all assets exist

#### Common Fixes:
```bash
# Reinstall dependencies
npm run fresh-install

# Clear Expo cache
npx expo start --clear

# Reset Metro bundler
npx expo start --reset-cache
```

### 3. Assets Not Loading

#### Verify Assets Exist:
- Check `assets/images/` directory
- Ensure all image files are present
- Verify image paths in code

#### Fix Missing Assets:
```bash
# Check if assets are in the right place
ls assets/images/

# If missing, copy from parent directory
```

### 4. Dependencies Issues

#### Check Compatibility:
```bash
npx expo install --check
```

#### Fix Dependencies:
```bash
npx expo install --fix
```

### 5. Network Issues

#### Try Different Connection Methods:

1. **LAN (Same WiFi):**
   ```bash
   npx expo start
   ```

2. **Tunnel Mode (Different Networks):**
   ```bash
   npx expo start --tunnel
   ```
   Note: Requires Expo account (free)

3. **Manual IP Connection:**
   - Find your computer's IP address
   - In Expo Go, enter: `exp://YOUR_IP:8081`

### 6. Expo Go App Issues

#### Clear Expo Go Cache:
- **iOS:** Delete and reinstall Expo Go
- **Android:** Clear app data in Settings

#### Update Expo Go:
- Make sure you have the latest version
- Update from App Store/Play Store

## Quick Fix Checklist

- [ ] Both devices on same WiFi
- [ ] Expo Go app is latest version
- [ ] Node.js version >= 18.0.0
- [ ] All dependencies installed
- [ ] No firewall blocking port 8081
- [ ] Metro bundler is running
- [ ] QR code is scanned correctly
- [ ] App.json is configured correctly

## Testing Steps

1. **Start Server:**
   ```bash
   cd carelytic
   npm start
   ```

2. **Check QR Code:**
   - QR code should appear in terminal
   - Make sure it's visible and not corrupted

3. **Scan with Expo Go:**
   - Open Expo Go on phone
   - Tap "Scan QR Code"
   - Point camera at QR code

4. **Wait for Load:**
   - App should start loading
   - First load may take 30-60 seconds
   - Watch terminal for errors

5. **Check for Errors:**
   - Terminal shows loading progress
   - Any red errors need to be fixed
   - Yellow warnings are usually OK

## Still Not Working?

1. **Check Expo Status:**
   - Visit https://status.expo.dev
   - Check for service outages

2. **Try Development Build:**
   - If Expo Go doesn't work, create a development build
   - Use EAS Build for custom native code

3. **Check Logs:**
   ```bash
   # Enable verbose logging
   EXPO_DEBUG=true npx expo start
   ```

4. **Get Help:**
   - Expo Forums: https://forums.expo.dev
   - Expo Discord: https://chat.expo.dev
   - GitHub Issues: https://github.com/expo/expo/issues

## Success Indicators

✅ Metro bundler starts without errors
✅ QR code appears in terminal
✅ Expo Go connects successfully
✅ App loads on mobile device
✅ No red error messages
✅ App displays correctly

## Next Steps After Loading

Once the app loads:
1. Test all screens
2. Check navigation
3. Test features
4. Verify assets load
5. Test on both iOS and Android

