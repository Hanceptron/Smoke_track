// Your existing StorageService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Existing keys
const SMOKING_DATA_KEY = '@smoking_data';
const THEME_MODE_KEY = '@theme_mode';
const LAST_SMOKE_TIME_KEY = '@last_smoke_time';
// Add this new key
const DAILY_LIMIT_KEY = '@daily_limit';

// ... all your existing methods ...

// ADD these new methods
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

// Update your export to include the new methods
export default {
  // ... all your existing methods ...
  getDailyLimit,    // ADD this
  saveDailyLimit,   // ADD this
};