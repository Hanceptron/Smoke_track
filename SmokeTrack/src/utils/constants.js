export const STORAGE_KEYS = {
    SMOKING_DATA: '@smoking_data',
    WEEKLY_GOAL: '@weekly_goal',
    THEME_MODE: '@theme_mode',
    LAST_SMOKE_TIME: '@last_smoke_time',
};

export const DEFAULT_WEEKLY_GOAL = 50; // Default weekly smoking goal

export const ANIMATION_DURATION = {
    CIGARETTE_GLOW: 3000, // 3 seconds for cigarette glow animation
    SMOKE_FADE: 5000, // 5 seconds for smoke fade animation
    BUTTON_PRESS: 100,
}

export const CHART_CONGIG = {
    bacakgroundGradientForm: '#FFFFFF',
    backgroundGradientTo: '#FFFFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`, // Orange color for the chart
    labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`, // Gray color for the chart labels
    style: {
        borderRadius: 16,
    },
propsForDots:{
    r: '0',
},

propsForBackgroundLines: {
    strokeWidth: 1,
    stroke: '#E5E5EA', // Light gray for background lines
    strokeDasharray: '0',
},
    };