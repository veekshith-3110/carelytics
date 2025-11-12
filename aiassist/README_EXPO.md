# Carelytics - Expo App Setup

This directory contains the Expo React Native app (Carelytic) that works with Expo Go.

## Project Structure

```
aiassist/
├── carelytic/          # Expo React Native app (works with Expo Go)
│   ├── app/            # Expo Router app directory
│   ├── components/     # React Native components
│   ├── package.json    # Expo app dependencies
│   └── app.json        # Expo configuration
│
├── components/         # Next.js web components (not used in Expo)
├── app/                # Next.js app directory (web app)
└── package.json        # Next.js app dependencies
```

## Quick Start - Expo App

### 1. Navigate to Expo App Directory

```bash
cd carelytic
```

### 2. Install Dependencies

```bash
npm install
```

If you encounter errors:
```bash
npm run fresh-install
```

### 3. Start Expo Development Server

```bash
npm start
```

### 4. Open in Expo Go

1. Install Expo Go on your phone:
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code shown in the terminal
3. Make sure your phone and computer are on the same WiFi network

## Configuration

### Expo Go Compatibility

The app is configured for Expo Go:
- ✅ `newArchEnabled: false` - Required for Expo Go
- ✅ All dependencies are Expo Go compatible
- ✅ No custom native modules required
- ✅ Expo SDK 54 with React 19.1.0

### Dependencies

The Expo app uses:
- **Expo SDK 54.0.23**
- **React 19.1.0**
- **React Native 0.81.5**
- **Expo Router 6.0.14** (file-based routing)
- **React Navigation** for navigation

## Available Scripts

```bash
# Start development server
npm start

# Start with Expo Go
npm run start:go

# Clean installation (Windows)
npm run clean:win

# Clean and reinstall
npm run fresh-install

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Lint code
npm run lint
```

## Troubleshooting

### Installation Errors

If `npm install` fails:

1. **Clear cache:**
   ```bash
   npm cache clean --force
   ```

2. **Clean install:**
   ```bash
   npm run fresh-install
   ```

3. **Verify Node.js version:**
   ```bash
   node --version  # Should be >= 18.0.0
   ```

### Connection Issues

If you can't connect to Expo Go:

1. **Check WiFi:** Ensure both devices are on the same network
2. **Use tunnel mode:**
   ```bash
   npx expo start --tunnel
   ```
3. **Check firewall:** Allow Expo on port 8081

### App Crashes

1. **Clear Expo Go cache:** Delete and reinstall Expo Go app
2. **Restart server:** Stop and restart `npm start`
3. **Check logs:** Look for errors in the terminal

## Development

### File Structure

- `app/` - Expo Router pages (file-based routing)
- `app/(tabs)/` - Tab navigation screens
- `components/` - Reusable React Native components
- `constants/` - App constants and themes
- `hooks/` - Custom React hooks
- `assets/` - Images and static assets

### Adding New Screens

Create new files in `app/` directory:
```tsx
// app/profile.tsx
export default function ProfileScreen() {
  return <Text>Profile</Text>;
}
```

### Adding Components

Create components in `components/` directory:
```tsx
// components/MyComponent.tsx
export function MyComponent() {
  return <View>...</View>;
}
```

## Building for Production

For production builds, use EAS Build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Go Setup Guide](./carelytic/EXPO_GO_SETUP.md)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [React Native Docs](https://reactnative.dev/)

## Support

For issues:
1. Check [Expo Forums](https://forums.expo.dev/)
2. Check [Expo GitHub](https://github.com/expo/expo)
3. Check [Expo Discord](https://chat.expo.dev/)

