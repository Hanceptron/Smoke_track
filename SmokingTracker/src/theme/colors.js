// Apple Wallet inspired color scheme
export const colors = {
  light: {
    background: '#FFFFFF',
    card: '#F2F2F7',
    cardBorder: '#E5E5EA',
    text: {
      primary: '#000000',
      secondary: '#8E8E93',
      tertiary: '#C7C7CC',
    },
    accent: '#FF6B35', // Orange accent
    success: '#34C759',
    warning: '#FF9500',
    danger: '#FF3B30',
    separator: '#E5E5EA',
    shadow: 'rgba(0, 0, 0, 0.04)',
  },
  dark: {
    background: '#000000',
    card: '#1C1C1E',
    cardBorder: '#38383A',
    text: {
      primary: '#FFFFFF',
      secondary: '#8E8E93',
      tertiary: '#48484A',
    },
    accent: '#FF6B35', // Orange accent
    success: '#32D74B',
    warning: '#FF9F0A',
    danger: '#FF453A',
    separator: '#38383A',
    shadow: 'rgba(255, 255, 255, 0.04)',
  }
};

export const getTheme = (isDark = false) => isDark ? colors.dark : colors.light;

export const getGradientColors = (theme, type) => {
  switch (type) {
    case 'button':
      return [theme.accent, theme.success];
    case 'surface':
      return [theme.card, theme.background];
    default:
      return [theme.text.primary, theme.text.secondary];
  }
}

export const getShadowStyle = (theme, type, intensity = 1) => {
  switch (type) {
    case 'convex':
      return {
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: 2 * intensity },
        shadowOpacity: 0.1 * intensity,
        shadowRadius: 4 * intensity,
        elevation: 2 * intensity,
      };
    case 'concave':
      return { 
        shadowColor: theme.shadow,
        shadowOffset: { width: 0, height: -1 * intensity },
        shadowOpacity: 0.08 * intensity,
        shadowRadius: 3 * intensity,
        elevation: 1 * intensity,
      };
    default:
      return {};
  }
};