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