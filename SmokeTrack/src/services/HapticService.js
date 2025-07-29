import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

class HapticService {
  // Light impact for button presses
  light() {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  // Medium impact for logging cigarette
  medium() {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }

  // Heavy impact for achievements
  heavy() {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  }

  // Success notification
  success() {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }

  // Warning notification
  warning() {
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }

  // Selection changed
  selection() {
    if (Platform.OS === 'ios') {
      Haptics.selectionAsync();
    }
  }
}

export default new HapticService();

// babel.config.js
presets: ['babel-preset-expo'],
plugins: ['react-native-reanimated/plugin'],