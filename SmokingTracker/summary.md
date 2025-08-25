# Project Summary: SmokingTracker

## Project Overview

This is a mobile application built with React Native (Expo) designed to help users track and reduce their smoking habits. The app allows users to log each cigarette they smoke, set a daily limit, and view their progress over time through various stats and a weekly chart. The UI is designed to be clean and modern, with both light and dark themes.

## Tech Stack

- **Framework:** React Native (with Expo)
- **UI Components:** React Native components, `expo-linear-gradient`, `react-native-svg`, `react-native-chart-kit`, `expo-blur`
- **State Management:** React Hooks (`useState`, `useEffect`, `useRef`)
- **Storage:** `@react-native-async-storage/async-storage`
- **Haptics:** `expo-haptics`
- **Linting/Formatting:** (Not specified, but likely Babel for transpiling)

## File Structure

The project is organized into the following key directories:

- `src/components`: Contains reusable UI components like `CigaretteButton`, `WeeklyChart`, `StatCard`, etc.
- `src/screens`: The main screen of the application, `Homescreen.js`.
- `src/services`: Modules for handling side effects, such as `StorageService.js` for data persistence and `HapticService.js` for device vibrations.
- `src/theme`: Theming and color definitions.
- `src/utils`: Helper functions for date manipulation and other constants.
- `App.js`: The main entry point of the application.

## Core Functionality

- **Log Cigarettes:** Users can tap a button to log a cigarette, which updates their daily count.
- **Daily Limit:** Users can set a daily smoking limit. The UI provides feedback when the limit is reached.
- **Dashboard:** The main screen displays:
    - The number of cigarettes smoked today.
    - The remaining number of cigarettes until the daily limit is reached.
    - The time since the last cigarette was smoked.
    - A weekly chart showing the number of cigarettes smoked each day.
    - A streak counter for days the user has stayed under their daily limit.
- **Dark/Light Theme:** The app supports both dark and light themes.
- **Haptic Feedback:** The app uses haptic feedback to enhance the user experience on iOS devices.

## Potential Issues and Failures

- **Duplicated Code in `StorageService.js`:** The `StorageService.js` file contains duplicated function definitions for `getDailyLimit` and `saveDailyLimit`, as well as a duplicated `export default` statement. This will cause a syntax error and needs to be resolved.
- **Platform-Specific Haptics:** The `HapticService.js` uses `Platform.OS === 'ios'` checks, meaning haptic feedback will not work on Android devices. This leads to an inconsistent user experience across platforms.
- **Inconsistent Weekly Chart:** The `WeeklyChart.js` component starts the week on Sunday. This might not be the standard for all users, and it would be better to make this configurable or base it on the user's locale.
- **Predictable "Random" Quotes:** In `Homescreen.js`, the `getDailyLimitQuote` function uses the current day of the month to select a quote. This means the same quote will be shown on the same day of every month, which is not truly random.
- **Basic Error Handling:** Error handling throughout the application is minimal and mostly relies on `console.error`. This is not ideal for a production application, as it doesn't provide any feedback to the user if something goes wrong.
- **No Tests:** The project lacks any form of automated testing (unit, integration, or end-to-end). This makes it difficult to verify the correctness of the application and introduces a risk of regressions when adding new features or refactoring existing code.
