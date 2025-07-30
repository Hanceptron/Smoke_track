
# Project Summary: Smoking Tracker

This document provides a comprehensive overview of the Smoking Tracker application, intended for an LLM to understand its architecture, functionality, and key components.

## 1. Project Overview

*   **Name:** Smoking Tracker
*   **Purpose:** A mobile application to help users track their cigarette consumption, set goals, and monitor their progress over time.
*   **Platform:** React Native (iOS & Android) using Expo.
*   **Key Features:**
    *   Log daily cigarette intake.
    *   Set and track weekly smoking goals.
    *   View statistics like daily average and weekly total.
    *   Visualize weekly smoking patterns with a chart.
    *   Track time since the last cigarette.
    *   Light and dark mode themes.
    *   Haptic feedback for user interactions.
    *   A home screen widget for quick logging and progress view.

## 2. Core Technologies & Dependencies

The project is built with React Native and relies on the following key libraries:

*   `expo`: Core framework for building and running the app.
*   `react` & `react-native`: The fundamental UI and application logic libraries.
*   `@react-native-async-storage/async-storage`: For persistent data storage on the device (smoking history, goals, theme).
*   `expo-haptics`: Provides physical feedback on user actions.
*   `expo-linear-gradient`: Used for visually appealing gradient backgrounds.
*   `react-native-svg` & `react-native-chart-kit`: For creating the animated cigarette button and the weekly progress chart.
*   `react-native-reanimated`: Powers animations within the app.
*   `expo-blur`: Used for creating blur effects, likely in modals.

## 3. File Structure & Component Breakdown

### `App.js`
*   **Purpose:** The main entry point of the application.
*   **Functionality:**
    *   Renders the `HomeScreen`.
    *   Sets up an `AppState` listener to potentially refresh data when the app becomes active.

### `src/screens/Homescreen.js`
*   **Purpose:** The primary screen of the app, displaying all the main UI components.
*   **State Management:** Uses `useState` and `useEffect` hooks to manage:
    *   `smokingData`: An object storing cigarette counts per day (e.g., `{'2024-07-29': 5}`).
    *   `weeklyGoal`: The user's target for weekly consumption.
    *   `lastSmokeTime`: Timestamp of the last logged cigarette.
    *   `isDarkMode`: The current theme state.
    *   `stats`: Calculated statistics derived from `smokingData` and `weeklyGoal`.
*   **Core Functions:**
    *   `loadData()`: Fetches all necessary data from `StorageService` on component mount.
    *   `handleLogCigarette()`: Increments the cigarette count for the current day.
    *   `handleSaveGoal()`: Updates the weekly goal.
    *   `toggleTheme()`: Switches between light and dark mode.
*   **Component Composition:** Assembles various UI components (`CigaretteButton`, `WeeklyChart`, `StatCard`, etc.) into the final screen layout.

### `src/components/`
This directory contains the reusable UI building blocks of the app.

*   **`CigaretteButton.js`**: A custom, animated SVG button that represents a cigarette. When pressed, it triggers a glowing and smoking animation.
*   **`WeeklyChart.js`**: Displays a bar chart visualizing the user's smoking habits over the past week.
*   **`StatCard.js`**: A generic card component to display a single statistic (e.g., "Weekly Total").
*   **`TimeSinceLastSmoke.js`**: Shows a continuously updating timer indicating how long it has been since the last cigarette.
*   **`GoalSetting.js`**: A modal or view that allows the user to set their weekly smoking goal.

### `src/services/`
Contains modules that handle specific, non-UI tasks.

*   **`StorageService.js`**:
    *   **Purpose:** A singleton class that abstracts all interactions with `AsyncStorage`.
    *   **Methods:** Provides functions to `get`, `save`, and `update` all persistent data, including:
        *   `smokingData`
        *   `weeklyGoal`
        *   `themeMode`
        *   `lastSmokeTime`
*   **`HapticService.js`**: A simple wrapper around `expo-haptics` to trigger different types of haptic feedback (e.g., `medium`, `selection`).

### `src/utils/`
Helper functions and constants.

*   **`constants.js`**: Defines constant values used throughout the app, such as `STORAGE_KEYS`, `DEFAULT_WEEKLY_GOAL`, and `ANIMATION_DURATION`.
*   **`dateHelpers.js`**: Contains functions for date manipulation and statistics calculation, like `getToday()` and `getWeeklyStats()`.

### `widgets/SmokingWidget.js`
*   **Purpose:** A simplified React component that mimics the appearance and functionality of a home screen widget.
*   **Functionality:**
    *   Displays the current day's cigarette count.
    *   Shows a progress bar for the weekly goal.
    *   Allows the user to log a cigarette directly from the widget.
*   **Note:** This is a simulated widget. A production implementation would require native code (Widget Extension for iOS, App Widgets for Android).

## 4. Data Flow

1.  **App Start:** `App.js` loads `Homescreen.js`.
2.  **Data Loading:** `Homescreen.js` calls `loadData()` which uses `StorageService` to retrieve all data from `AsyncStorage`.
3.  **State Update:** The retrieved data is used to set the initial state of the `Homescreen` component.
4.  **User Interaction:**
    *   The user presses the `CigaretteButton`.
    *   `handleLogCigarette()` is called in `Homescreen.js`.
    *   `StorageService.incrementTodayCount()` updates the count in `AsyncStorage`.
    *   The local state (`smokingData`, `lastSmokeTime`) is updated, causing the UI to re-render with the new information.
5.  **Data Persistence:** All changes to user data (logging cigarettes, changing goals, toggling themes) are immediately saved to the device via `StorageService`.

## 5. Potential Areas for Improvement & Suggestions

*   **State Management:** For a larger application, consider a more robust state management library like Redux or Zustand to handle shared state more effectively, especially for the widget.
*   **Widget Implementation:** The current widget is a simulation. A key feature enhancement would be to build a true native widget.
*   **Data Visualization:** The app could offer more advanced charts and data visualizations, such as monthly trends, cost savings, and health milestones.
*   **Notifications:** Implement local notifications to remind users of their progress or to motivate them.
*   **Error Handling:** Enhance error handling, particularly around data storage and retrieval.
*   **Code Structure:** The `Homescreen.js` component is quite large. It could be broken down into smaller, more manageable child components to improve readability and maintainability.
