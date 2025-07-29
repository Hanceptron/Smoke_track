import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, DEFAULT_WEEKLY_GOAL } from '../utils/constants';

class StorageService {
  // Smoking data methods
  async getSmokingData() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SMOKING_DATA);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading smoking data:', error);
      return {};
    }
  }

  async saveSmokingData(data) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SMOKING_DATA, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving smoking data:', error);
    }
  }

  async incrementTodayCount(date) {
    try {
      const data = await this.getSmokingData();
      data[date] = (data[date] || 0) + 1;
      await this.saveSmokingData(data);
      await this.updateLastSmokeTime();
      return data[date];
    } catch (error) {
      console.error('Error incrementing count:', error);
      return 0;
    }
  }

  // Goal methods
  async getWeeklyGoal() {
    try {
      const goal = await AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_GOAL);
      return goal ? parseInt(goal, 10) : DEFAULT_WEEKLY_GOAL;
    } catch (error) {
      console.error('Error loading weekly goal:', error);
      return DEFAULT_WEEKLY_GOAL;
    }
  }

  async saveWeeklyGoal(goal) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_GOAL, goal.toString());
    } catch (error) {
      console.error('Error saving weekly goal:', error);
    }
  }

  // Theme methods
  async getThemeMode() {
    try {
      const mode = await AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE);
      return mode === 'dark';
    } catch (error) {
      console.error('Error loading theme mode:', error);
      return false;
    }
  }

  async saveThemeMode(isDark) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  }

  // Last smoke time methods
  async getLastSmokeTime() {
    try {
      const time = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SMOKE_TIME);
      return time || null;
    } catch (error) {
      console.error('Error loading last smoke time:', error);
      return null;
    }
  }

  async updateLastSmokeTime() {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SMOKE_TIME, new Date().toISOString());
    } catch (error) {
      console.error('Error saving last smoke time:', error);
    }
  }

  // Clear all data (for testing/reset)
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.SMOKING_DATA,
        STORAGE_KEYS.WEEKLY_GOAL,
        STORAGE_KEYS.THEME_MODE,
        STORAGE_KEYS.LAST_SMOKE_TIME,
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

export default new StorageService();