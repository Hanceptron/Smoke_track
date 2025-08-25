# UI/UX Critique and Fixes for SmokingTracker

This document outlines a series of UI/UX issues found in the SmokingTracker application and provides recommendations for fixing them. The goal is to create a more cohesive, visually appealing, and user-friendly experience.

## General & Theming

### 1. Inconsistent Styling and Lack of a Central Theme

- **Issue:** Components have their own, often hardcoded, styles. This leads to an inconsistent look and feel across the app. For example, font sizes, colors, and spacing are not standardized.
- **Fix:** 
    - Create a central theme file (e.g., `src/theme/theme.js`) that exports a theme object. This object should contain standardized values for colors, fonts (sizes, weights), spacing (margins, paddings), and border radii.
    - Refactor all components to use this central theme object for their styling. This will ensure a consistent design system and make future updates much easier.

### 2. Unused Theme Properties and Functions

- **Issue:** The `src/theme/colors.js` file contains several unused properties and functions, such as `liquidGlass`, `getNeumorphicStyle`, `getLiquidGlassProps`, `getGlassStyle`, and `getShadowStyle`. Additionally, a non-existent `LiquidGlassWrapper` component is imported and used in several components, which will cause the application to crash.
- **Fix:**
    - Remove the unused theme properties and functions from `colors.js` to simplify the code and reduce confusion.
    - Remove the `LiquidGlassWrapper` component from all files that use it, and replace it with standard `View` components. Apply styles from the central theme to these `View` components to achieve the desired look.

### 3. Hardcoded Styles

- **Issue:** Many components use hardcoded style values (e.g., `fontSize: 11`, `marginVertical: 20`). This makes the app difficult to maintain and adapt to different screen sizes.
- **Fix:** Replace all hardcoded style values with values from the central theme object. For example, instead of `fontSize: 11`, use something like `fontSize: theme.fontSizes.small`.

## Component-Specific Critiques

### 1. `Homescreen.js`

- **Issue:** The `StatCard` component is not used. Instead, the stats are displayed as simple text, which is less visually appealing and inconsistent with the overall design.
- **Fix:** Replace the simple text stats with the `StatCard` component. This will create a more visually appealing and consistent UI.

- **Issue:** The `getRandomQuote` function is not used.
- **Fix:** Use the `getRandomQuote` function to display a random quote when the daily limit is reached. This will provide a more engaging user experience.

### 2. `CigaretteButton.js`

- **Issue:** The `CigaretteButton` component is overly complex, with a large amount of SVG code that is difficult to read and maintain. The animation is also complex and could be simplified.
- **Fix:** Simplify the SVG code by removing unnecessary details and complexity. The animation can also be simplified to a more subtle and performant animation.

### 3. `WeeklyChart.js`

- **Issue:** The chart starts the week on Sunday, which may not be the standard for all users. The chart also lacks some visual polish.
- **Fix:** 
    - Allow the user to configure the start of the week in the app's settings.
    - Improve the visual design of the chart by adding features like a subtle background grid, better-looking tooltips, and a more visually appealing color scheme.

### 4. `GoalSetting.js`

- **Issue:** The modal for setting the daily goal is functional but could be more visually appealing.
- **Fix:** Improve the design of the modal by using the central theme for styling and adding a more visually appealing layout. For example, use a card-like design with a subtle shadow and a clear call-to-action button.

## Readability and Accessibility

### 1. Color Contrast

- **Issue:** Some text elements have low contrast with their background, making them difficult to read, especially for users with visual impairments.
- **Fix:** Review all text elements and ensure they have a sufficient contrast ratio with their background. Use a color contrast checker tool to verify the contrast ratios.

By addressing these issues, the SmokingTracker app can be significantly improved, resulting in a more professional, user-friendly, and maintainable application.
