import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, DEFAULT_WEEKLY_GOAL } from '../utils/constants';

class StorageService {
  constructor() {
    this.initialized = false;
    this.initializeData();
  }

  async initializeData() {
    if (this.initialized) return;
    
    try {
      // Force clear all data to prevent parsing errors
      console.log('Initializing StorageService - clearing all data');
      await AsyncStorage.clear();
      
      // Set proper defaults
      await AsyncStorage.setItem(STORAGE_KEYS.SMOKING_DATA, JSON.stringify({}));
      await AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_GOAL, DEFAULT_WEEKLY_GOAL.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, 'light');
      
      this.initialized = true;
      console.log('StorageService initialized successfully');
    } catch (error) {
      console.error('Error initializing StorageService:', error);
    }
  }

  // Smoking data methods
  async getSmokingData() {
    await this.initializeData();
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.SMOKING_DATA);
      if (!raw) return {};
      
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      console.error('Error loading smoking data, clearing corrupted data:', error);
      // Clear corrupted data and reset to default
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.SMOKING_DATA);
        await AsyncStorage.setItem(STORAGE_KEYS.SMOKING_DATA, JSON.stringify({}));
      } catch (clearError) {
        console.error('Error clearing corrupted smoking data:', clearError);
      }
      return {};
    }
  }

  async saveSmokingData(data) {
    await this.initializeData();
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SMOKING_DATA, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving smoking data:', error);
    }
  }

  async incrementTodayCount(date) {
    await this.initializeData();
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
    await this.initializeData();
    try {
      const goal = await AsyncStorage.getItem(STORAGE_KEYS.WEEKLY_GOAL);
      if (!goal) return DEFAULT_WEEKLY_GOAL;
      
      const parsed = parseInt(goal, 10);
      return (!isNaN(parsed) && parsed > 0) ? parsed : DEFAULT_WEEKLY_GOAL;
    } catch (error) {
      console.error('Error loading weekly goal, clearing corrupted data:', error);
      // Clear corrupted data and reset to default
      try {
        await AsyncStorage.removeItem(STORAGE_KEYS.WEEKLY_GOAL);
        await AsyncStorage.setItem(STORAGE_KEYS.WEEKLY_GOAL, DEFAULT_WEEKLY_GOAL.toString());
      } catch (clearError) {
        console.error('Error clearing corrupted weekly goal:', clearError);
      }
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

  // Reset corrupted data
  async resetCorruptedData() {
    try {
      console.warn('Resetting all data due to corruption');
      await this.clearAllData();
      // Initialize with proper defaults
      await this.saveSmokingData({});
      await this.saveWeeklyGoal(DEFAULT_WEEKLY_GOAL);
      await this.saveThemeMode(false);
    } catch (error) {
      console.error('Error resetting corrupted data:', error);
    }
  }
}

export default new StorageService();