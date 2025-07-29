export const STORAGE_KEYS = {
  SMOKING_DATA: '@smoking_data',
  WEEKLY_GOAL: '@weekly_goal',
  THEME_MODE: '@theme_mode',
  LAST_SMOKE_TIME: '@last_smoke_time',
};

export const DEFAULT_WEEKLY_GOAL = 35;

export const ANIMATION_DURATION = {
  CIGARETTE_GLOW: 3000, // 3 seconds
  SMOKE_FADE: 5000, // 5 seconds
  BUTTON_PRESS: 100,
};

export const CHART_CONFIG = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '0',
  },
  propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: '#E5E5EA',
    strokeDasharray: '0',
  },
};