import AsyncStorage from '@react-native-async-storage/async-storage';

const SMOKING_DATA_KEY = '@smoking_data';
const THEME_MODE_KEY = '@theme_mode';
const LAST_SMOKE_TIME_KEY = '@last_smoke_time';
const DAILY_LIMIT_KEY = '@daily_limit';

const getSmokingData = async () => {
  try {
    const data = await AsyncStorage.getItem(SMOKING_DATA_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Handle both old and new data formats
      if (parsed.dailyCounts) {
        // Convert old format to new format
        return parsed.dailyCounts;
      }
      return parsed;
    }
    return {};
  } catch (error) {
    console.error('Error getting smoking data:', error);
    return {};
  }
};

const saveSmokingData = async (data) => {
  try {
    await AsyncStorage.setItem(SMOKING_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving smoking data:', error);
  }
};

const incrementTodayCount = async (dateString) => {
  try {
    let data = await getSmokingData();
    
    // Ensure data structure exists
    if (!data || typeof data !== 'object') {
      data = {};
    }
    
    // Use the provided dateString which should be in YYYY-MM-DD format from getToday()
    const todayKey = dateString;
    if (!todayKey) {
      throw new Error('Date string is required');
    }
    
    data[todayKey] = (data[todayKey] || 0) + 1;
    
    await saveSmokingData(data);
    await AsyncStorage.setItem(LAST_SMOKE_TIME_KEY, new Date().toISOString());
    
    return data[todayKey];
  } catch (error) {
    console.error('Error incrementing today count:', error);
    throw error;
  }
};

const getThemeMode = async () => {
  try {
    const theme = await AsyncStorage.getItem(THEME_MODE_KEY);
    return theme === 'true';
  } catch (error) {
    console.error('Error getting theme mode:', error);
    return false;
  }
};

const saveThemeMode = async (mode) => {
  try {
    await AsyncStorage.setItem(THEME_MODE_KEY, String(mode));
  } catch (error) {
    console.error('Error saving theme mode:', error);
  }
};

const getLastSmokeTime = async () => {
  try {
    const time = await AsyncStorage.getItem(LAST_SMOKE_TIME_KEY);
    return time ? new Date(time) : null;
  } catch (error) {
    console.error('Error getting last smoke time:', error);
    return null;
  }
};

const getDailyLimit = async () => {
  try {
    const limit = await AsyncStorage.getItem(DAILY_LIMIT_KEY);
    return limit ? parseInt(limit, 10) : null;
  } catch (error) {
    console.error('Error getting daily limit:', error);
    return null;
  }
};

const saveDailyLimit = async (limit) => {
  try {
    await AsyncStorage.setItem(DAILY_LIMIT_KEY, limit.toString());
  } catch (error) {
    console.error('Error saving daily limit:', error);
  }
};

export default {
  getSmokingData,
  saveSmokingData,
  incrementTodayCount,
  getThemeMode,
  saveThemeMode,
  getLastSmokeTime,
  getDailyLimit,
  saveDailyLimit,
};