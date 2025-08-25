import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

class HapticService {
  // Light impact for button presses
  async light() {
    try {
      if (Platform.OS === 'ios') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else if (Platform.OS === 'android') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.log('Haptic feedback not available');
    }
  }

  // Medium impact for logging cigarette
  async medium() {
    try {
      if (Platform.OS === 'ios') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (Platform.OS === 'android') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (error) {
      console.log('Haptic feedback not available');
    }
  }

  // Heavy impact for achievements
  async heavy() {
    try {
      if (Platform.OS === 'ios') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else if (Platform.OS === 'android') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
    } catch (error) {
      console.log('Haptic feedback not available');
    }
  }

  // Success notification
  async success() {
    try {
      if (Platform.OS === 'ios') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (Platform.OS === 'android') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.log('Haptic feedback not available');
    }
  }

  // Warning notification
  async warning() {
    try {
      if (Platform.OS === 'ios') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else if (Platform.OS === 'android') {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    } catch (error) {
      console.log('Haptic feedback not available');
    }
  }

  // Selection changed
  async selection() {
    try {
      if (Platform.OS === 'ios') {
        await Haptics.selectionAsync();
      } else if (Platform.OS === 'android') {
        await Haptics.selectionAsync();
      }
    } catch (error) {
      console.log('Haptic feedback not available');
    }
  }
}

export default new HapticService();