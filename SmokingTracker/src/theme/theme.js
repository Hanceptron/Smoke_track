// Central theme configuration for SmokingTracker app

export const colors = {
  light: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#FF6B35',
    success: '#4ADE80',
    warning: '#FFA500',
    danger: '#EF4444',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: {
      primary: '#1F2937', // High contrast for main text
      secondary: '#374151', // Improved contrast for secondary text
      tertiary: '#6B7280', // Still accessible for tertiary text
      inverse: '#FFFFFF',
    },
    border: 'rgba(0, 0, 0, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    primary: '#1e3c72',
    secondary: '#2a5298',
    accent: '#FF6B35',
    success: '#4ADE80',
    warning: '#FFA500',
    danger: '#EF4444',
    background: '#0F172A',
    surface: '#1E293B',
    card: '#334155',
    text: {
      primary: '#F8FAFC', // High contrast for main text in dark mode
      secondary: '#D1D5DB', // Improved contrast for secondary text
      tertiary: '#9CA3AF', // Still accessible for tertiary text
      inverse: '#1F2937',
    },
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const fontWeights = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const spacing = {
  xs: 4,
  sm: 8,
  base: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const borderRadius = {
  sm: 8,
  base: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

// Theme creation function
export const createTheme = (isDark = false) => {
  const colorScheme = isDark ? colors.dark : colors.light;
  
  return {
    colors: colorScheme,
    fontSizes,
    fontWeights,
    spacing,
    borderRadius,
    shadows,
    isDark,
    // Computed gradients
    gradients: {
      primary: [colorScheme.primary, colorScheme.secondary],
      accent: [colorScheme.accent, '#FF8855'],
      surface: isDark 
        ? ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
        : ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.4)'],
    },
    // Helper functions
    shadow: (size = 'medium') => shadows[size],
    // Accessibility helpers
    getContrastText: (backgroundColor) => {
      // Simple contrast calculation - for production, use a proper contrast library
      const isLight = backgroundColor === colors.light.surface || backgroundColor === colors.light.card;
      return isLight ? colorScheme.text.primary : colorScheme.text.inverse;
    },
  };
};

// Default theme
export const theme = createTheme();
export const darkTheme = createTheme(true);