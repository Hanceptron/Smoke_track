import AsyncStorage from '@react-native-async-storage/async-storage';

const SMOKING_DATA_KEY = '@smoking_data';
const THEME_MODE_KEY = '@theme_mode';
const LAST_SMOKE_TIME_KEY = '@last_smoke_time';
const DAILY_LIMIT_KEY = '@daily_limit';

const getSmokingData = async () => {
  try {
    const data = await AsyncStorage.getItem(SMOKING_DATA_KEY);
    return data ? JSON.parse(data) : {};
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
    throw error;
  }
};

const incrementTodayCount = async (today) => {
  try {
    const data = await getSmokingData();
    const currentCount = data[today] || 0;
    const newCount = currentCount + 1;
    data[today] = newCount;
    await saveSmokingData(data);
    
    // Save the current time as last smoke time
    await AsyncStorage.setItem(LAST_SMOKE_TIME_KEY, new Date().toISOString());
    
    return newCount;
  } catch (error) {
    console.error('Error incrementing today count:', error);
    throw error;
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
    throw error;
  }
};

const getThemeMode = async () => {
  try {
    const mode = await AsyncStorage.getItem(THEME_MODE_KEY);
    return mode === 'dark';
  } catch (error) {
    console.error('Error getting theme mode:', error);
    return false;
  }
};

const saveThemeMode = async (isDark) => {
  try {
    await AsyncStorage.setItem(THEME_MODE_KEY, isDark ? 'dark' : 'light');
  } catch (error) {
    console.error('Error saving theme mode:', error);
    throw error;
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

export default {
  getSmokingData,
  saveSmokingData,
  incrementTodayCount,
  getDailyLimit,
  saveDailyLimit,
  getThemeMode,
  saveThemeMode,
  getLastSmokeTime,
};

