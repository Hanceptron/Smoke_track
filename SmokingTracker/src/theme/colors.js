// Simplified color definitions - use theme.js for the main theme system
export const colors = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
    },
    accent: '#FF6B35',
    accentGradient: ['#FF6B35', '#FF8855'],
    success: '#4ADE80',
    warning: '#FFA500',
    danger: '#EF4444',
    shadow: {
      light: '#FFFFFF',
      dark: 'rgba(0, 0, 0, 0.1)',
    },
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    card: '#334155',
    text: {
      primary: '#F1F5F9',
      secondary: '#CBD5E1',
      tertiary: '#94A3B8',
    },
    accent: '#FF6B35',
    accentGradient: ['#FF6B35', '#FF8855'],
    success: '#4ADE80',
    warning: '#FFA500',
    danger: '#EF4444',
    shadow: {
      light: 'rgba(255, 255, 255, 0.1)',
      dark: 'rgba(0, 0, 0, 0.3)',
    },
  }
};

export const getTheme = (isDark = false) => isDark ? colors.dark : colors.light;

// Simplified shadow helpers
export const getShadowStyle = (theme, intensity = 1) => {
  const isDark = theme.colors.background === colors.dark.background;
  
  return {
    shadowColor: isDark ? '#000000' : '#000000',
    shadowOffset: { width: 0, height: 4 * intensity },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 8 * intensity,
    elevation: 4 * intensity,
  };
};

// Simplified gradient helpers
export const getGradientColors = (theme, type = 'accent') => {
  if (type === 'accent') {
    return [theme.colors.accent, '#FF8855'];
  }
  
  return [theme.colors.surface, theme.colors.card];
};