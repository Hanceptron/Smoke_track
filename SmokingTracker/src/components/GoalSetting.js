import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import HapticService from '../services/HapticService';
import { getShadowStyle, getGradientColors } from '../theme/colors';

const GoalSetting = ({ visible, currentGoal, onSave, onCancel, theme }) => {
  const [tempLimit, setTempLimit] = useState(currentGoal.toString());
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 30,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  const handleSave = () => {
    if (tempLimit.trim() === '') return;
    
    const limit = parseInt(tempLimit, 10);
    if (!isNaN(limit) && limit > 0) {
      HapticService.success();
      
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        onSave(limit);
      });
    }
  };

  const handleCancel = () => {
    HapticService.light();
    setTempLimit(currentGoal.toString());
    
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      onCancel();
    });
  };

  const shadowStyle = getShadowStyle(theme, 1.2);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <BlurView intensity={100} style={StyleSheet.absoluteFill} />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centeredView}
        >
          <Animated.View style={[
            styles.modalContainer,
            shadowStyle,
            { transform: [{ scale: scaleAnim }] }
          ]}>
            <LinearGradient
              colors={[theme.colors.surface, theme.colors.card]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalContent}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.text.primary }]}>
                  Daily Limit
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
                  Set your maximum cigarettes for today
                </Text>
              </View>
              
              {/* Input Container */}
              <View style={[
                styles.inputWrapper,
                { backgroundColor: theme.colors.background }
              ]}>
                <View style={[
                  styles.inputContainer,
                  { 
                    backgroundColor: theme.colors.background,
                    shadowColor: theme.colors.shadow,
                    shadowOffset: { width: -4, height: -4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                  }
                ]}>
                  <TextInput
                    style={[styles.input, { color: theme.colors.text.primary }]}
                    value={tempLimit}
                    onChangeText={setTempLimit}
                    keyboardType="number-pad"
                    placeholder="10"
                    placeholderTextColor={theme.colors.text.tertiary}
                    autoFocus
                    selectTextOnFocus
                  />
                  <Text style={[styles.unit, { color: theme.colors.text.secondary }]}>
                    max today
                  </Text>
                </View>
              </View>
              
              {/* Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleCancel}
                  activeOpacity={0.8}
                  style={[styles.buttonWrapper, shadowStyle]}
                >
                  <LinearGradient
                    colors={[theme.colors.surface, theme.colors.card]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                  >
                    <Text style={[styles.buttonText, { color: theme.colors.text.primary }]}>
                      Cancel
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleSave}
                  activeOpacity={0.8}
                  style={[styles.buttonWrapper, styles.saveButton, shadowStyle]}
                >
                  <LinearGradient
                    colors={[theme.colors.accent, '#FF8855']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                  >
                    <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                      Set Limit
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              
              {/* Motivational text */}
              <View style={styles.motivation}>
                <Text style={[styles.motivationText, { color: theme.colors.text.tertiary }]}>
                  Set a realistic limit and stick to it
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.8,
  },
  inputWrapper: {
    borderRadius: 20,
    padding: 4,
    marginBottom: 28,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 16,
  },
  input: {
    flex: 1,
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -1,
  },
  unit: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    flex: 1.2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  motivation: {
    alignItems: 'center',
    marginTop: 20,
  },
  motivationText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export default GoalSetting;