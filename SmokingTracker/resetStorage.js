// Run this once to completely reset AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

const resetStorage = async () => {
  try {
    console.log('Clearing all AsyncStorage data...');
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared successfully');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};

resetStorage();