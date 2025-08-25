# Smoking Tracker - Premium Minimalist App

A beautifully designed, Apple Wallet-inspired smoking tracker app built with React Native and Expo.

## 🎯 Features

- **Minimalist Design**: Clean, premium UI inspired by Apple Wallet
- **One-Tap Logging**: Animated cigarette button with haptic feedback
- **Time Tracking**: Shows time since last cigarette
- **Weekly Analytics**: Bar chart visualization and trend analysis
- **Goal Setting**: Customizable weekly targets
- **Dark Mode**: Automatic light/dark theme support
- **Widget Ready**: Prepared for iOS/Android homescreen widgets

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Clone or create the project:
```bash
mkdir SmokingTracker
cd SmokingTracker
```

2. Initialize and install:
```bash
npx create-expo-app . --template blank
npm install @react-native-async-storage/async-storage expo-haptics expo-linear-gradient react-native-svg react-native-chart-kit react-native-reanimated expo-blur
```

3. Copy all the source files into their respective folders as shown in the project structure.

4. Run the app:
```bash
npx expo start
```

## 📱 Deployment Guide

### For App Store (iOS)

1. **Create Apple Developer Account**
   - Sign up at [developer.apple.com](https://developer.apple.com)
   - Pay the $99 annual fee

2. **Configure app.json**
   - Update `bundleIdentifier` to your unique identifier
   - Add your app icon (1024x1024px) in `assets/icon.png`

3. **Build for iOS**
```bash
npx eas build --platform ios
```

4. **Submit to App Store**
```bash
npx eas submit --platform ios
```

### For Google Play (Android)

1. **Create Google Play Developer Account**
   - Sign up at [play.google.com/console](https://play.google.com/console)
   - Pay the $25 one-time fee

2. **Configure app.json**
   - Update `package` to your unique package name
   - Add adaptive icon in `assets/adaptive-icon.png`

3. **Build for Android**
```bash
npx eas build --platform android
```

4. **Submit to Google Play**
```bash
npx eas submit --platform android
```

## 🔧 EAS Build Setup

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Create eas.json:
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

## 🎨 Customization

### Theme Colors
Edit `src/theme/colors.js` to customize the color scheme:
- `accent`: Main orange color (#FF6B35)
- `background`: Light/dark backgrounds
- `card`: Card backgrounds

### Weekly Goal
Default is 35 cigarettes/week. Users can change this in-app.

### Animations
- Cigarette glow: 3 seconds
- Smoke fade: 5 seconds
- Edit durations in `src/utils/constants.js`

## 📦 Widget Implementation

### iOS Widget Extension
1. Use Xcode to add a Widget Extension
2. Use the `SmokingWidget.js` as reference
3. Share data via App Groups

### Android Widget
1. Create an App Widget provider
2. Use the widget component as reference
3. Update via broadcast receivers

## 🛠 Development Tips

### Testing
```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

### Reset Data
Add a button that calls:
```javascript
StorageService.clearAllData()
```

### Performance
- Charts are optimized for 7-day view
- Animations use native driver where possible
- Data persists locally for privacy

## 📋 Pre-deployment Checklist

- [ ] Update bundle identifiers in app.json
- [ ] Create app icons (1024x1024 for iOS)
- [ ] Create splash screens
- [ ] Test on real devices
- [ ] Set up privacy policy
- [ ] Prepare app store descriptions
- [ ] Take screenshots for stores
- [ ] Test haptic feedback on iOS
- [ ] Verify data persistence
- [ ] Check dark mode on both platforms

## 🔐 Privacy

This app stores all data locally on the device. No user data is collected or transmitted.

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
npx expo doctor
```

### Haptic feedback not working
- Only works on iOS physical devices
- Not available in simulators

### Chart not showing
- Ensure react-native-svg is properly linked
- Clear cache: `npx expo start -c`

## 🚀 Future Features

- Export data as CSV
- Health app integration
- Monthly/yearly views
- Achievements system
- Widget animations
- Cost tracking

## 📄 License

MIT License - feel free to use for personal or commercial projects.