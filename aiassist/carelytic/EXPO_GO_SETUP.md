# Expo Go Setup Guide

This guide explains how to set up and run the Carelytic app in Expo Go.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Expo Go app installed on your mobile device
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Installation

1. **Navigate to the Expo app directory:**
   ```bash
   cd carelytic
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   If you encounter errors:
   ```bash
   npm run fresh-install
   ```

3. **Verify installation:**
   ```bash
   npx expo install --check
   ```

## Running the App

### Start the Expo Development Server

```bash
npm start
```

Or for Expo Go specifically:
```bash
npm run start:go
```

### Connect Your Device

1. **On the same WiFi network:**
   - Make sure your computer and mobile device are on the same WiFi network

2. **Scan QR Code:**
   - **iOS:** Open the Camera app and scan the QR code
   - **Android:** Open the Expo Go app and scan the QR code

3. **Alternative connection methods:**
   - Press `a` to open on Android emulator
   - Press `i` to open on iOS simulator
   - Press `w` to open in web browser

## Configuration

### app.json

The app is configured for Expo Go compatibility:
- `newArchEnabled: false` - Ensures compatibility with Expo Go
- All dependencies are Expo Go compatible
- No custom native code required

### Supported Features

✅ All Expo SDK 54 features
✅ Expo Router (file-based routing)
✅ React Navigation
✅ Expo Image
✅ Expo Vector Icons
✅ Expo Haptics
✅ Light/Dark mode support
✅ TypeScript support

### Limitations

⚠️ Expo Go has some limitations:
- Cannot use custom native modules
- Some npm packages may not be compatible
- Performance may be slightly slower than development builds

## Troubleshooting

### Installation Issues

If you get installation errors:

1. **Clear cache and reinstall:**
   ```bash
   npm run fresh-install
   ```

2. **Check Node.js version:**
   ```bash
   node --version
   ```
   Should be >= 18.0.0

3. **Check npm version:**
   ```bash
   npm --version
   ```
   Should be >= 9.0.0

### Connection Issues

If you can't connect to the development server:

1. **Check WiFi connection:**
   - Ensure both devices are on the same network
   - Try disabling VPN if active

2. **Use tunnel mode:**
   ```bash
   npx expo start --tunnel
   ```
   Note: Tunnel mode requires Expo account (free)

3. **Check firewall:**
   - Ensure port 8081 is not blocked
   - Allow Expo in Windows Firewall

### App Crashes

If the app crashes:

1. **Clear Expo Go cache:**
   - iOS: Delete and reinstall Expo Go
   - Android: Clear app data in settings

2. **Restart development server:**
   ```bash
   npm start
   ```

3. **Check for errors:**
   - Look at the terminal for error messages
   - Check Expo Go logs

## Development Workflow

1. **Make changes to your code**
2. **Save the file** - Expo will automatically reload
3. **Shake device or press `r`** - Manually reload
4. **Press `m`** - Toggle menu

## Building for Production

For production builds, you'll need to create a development build or use EAS Build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for iOS/Android
eas build --platform ios
eas build --platform android
```

## Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Go Limitations](https://docs.expo.dev/workflow/expo-go/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)

## Support

If you encounter issues:
1. Check the Expo documentation
2. Search Expo forums
3. Check GitHub issues
4. Ask in Expo Discord

