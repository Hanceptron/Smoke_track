// Neumorphic high-tech color scheme
export const colors = {
  light: {
    background: '#F5F5F7',
    surface: '#F5F5F7',
    card: '#F5F5F7',
    text: {
      primary: '#1D1D1F',
      secondary: '#6E6E73',
      tertiary: '#98989D',
    },
    accent: '#FF6B35',
    accentGradient: ['#FF6B35', '#FF8855'],
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    shadow: {
      light: '#FFFFFF',
      dark: '#D8D8DC',
      inner: {
        light: '#FFFFFF',
        dark: '#E8E8ED',
      }
    },
    neumorphic: {
      convex: {
        outer: '12px 12px 24px #BEC3CF, -12px -12px 24px #FFFFFF',
        inner: 'inset 2px 2px 5px rgba(255, 255, 255, 0.6), inset -2px -2px 5px rgba(190, 195, 207, 0.2)',
      },
      concave: {
        outer: '8px 8px 16px #BEC3CF, -8px -8px 16px #FFFFFF',
        inner: 'inset 4px 4px 8px #BEC3CF, inset -4px -4px 8px #FFFFFF',
      },
      flat: {
        outer: '6px 6px 12px #BEC3CF, -6px -6px 12px #FFFFFF',
      }
    }
  },
  dark: {
    background: '#1A1B26',
    surface: '#1A1B26',
    card: '#1A1B26',
    text: {
      primary: '#E4E6EB',
      secondary: '#9CA3AF',
      tertiary: '#6B7280',
    },
    accent: '#FF6B35',
    accentGradient: ['#FF6B35', '#FF8855'],
    success: '#4ADE80',
    warning: '#FFA500',
    danger: '#EF4444',
    shadow: {
      light: '#242531',
      dark: '#101116',
      inner: {
        light: '#202130',
        dark: '#14151F',
      }
    },
    neumorphic: {
      convex: {
        outer: '12px 12px 24px #101116, -12px -12px 24px #242531',
        inner: 'inset 2px 2px 5px rgba(36, 37, 49, 0.6), inset -2px -2px 5px rgba(16, 17, 22, 0.2)',
      },
      concave: {
        outer: '8px 8px 16px #101116, -8px -8px 16px #242531',
        inner: 'inset 4px 4px 8px #101116, inset -4px -4px 8px #242531',
      },
      flat: {
        outer: '6px 6px 12px #101116, -6px -6px 12px #242531',
      }
    }
  }
};

export const getTheme = (isDark = false) => isDark ? colors.dark : colors.light;

// Neumorphic shadow helpers for React Native
export const getShadowStyle = (theme, type = 'convex', intensity = 1) => {
  const isDark = theme.background === colors.dark.background;
  
  if (type === 'convex') {
    return {
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 12 * intensity, height: 12 * intensity },
      shadowOpacity: isDark ? 0.5 : 0.15,
      shadowRadius: 24 * intensity,
      elevation: 12 * intensity,
    };
  } else if (type === 'concave') {
    return {
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: -4 * intensity, height: -4 * intensity },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8 * intensity,
      elevation: 5 * intensity,
    };
  } else {
    return {
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 6 * intensity, height: 6 * intensity },
      shadowOpacity: isDark ? 0.4 : 0.12,
      shadowRadius: 12 * intensity,
      elevation: 8 * intensity,
    };
  }
};

// Gradient helpers
export const getGradientColors = (theme, type = 'surface') => {
  const isDark = theme.background === colors.dark.background;
  
  if (type === 'accent') {
    return theme.accentGradient;
  } else if (type === 'surface') {
    if (isDark) {
      return ['#1E1F2B', '#16171F'];
    } else {
      return ['#EEF0F5', '#E2E4EA'];
    }
  } else if (type === 'button') {
    if (isDark) {
      return ['#22232F', '#18191F'];
    } else {
      return ['#F0F2F7', '#DFE1E7'];
    }
  }
  
  return [theme.background, theme.background];
};