import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import HapticService from '../services/HapticService';

const GoalSetting = ({ visible, currentGoal, onSave, onCancel, theme }) => {
  const [tempGoal, setTempGoal] = useState(currentGoal.toString());

  const handleSave = () => {
    if (tempGoal.trim() === '') {
      // Or show an error message to the user
      return;
    }
    const goal = parseInt(tempGoal, 10);
    if (!isNaN(goal) && goal > 0) {
      HapticService.success();
      onSave(goal);
    }
  };

  const handleCancel = () => {
    HapticService.light();
    setTempGoal(currentGoal.toString());
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.overlay}>
        <BlurView intensity={80} style={StyleSheet.absoluteFill} />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.centeredView}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text.primary }]}>
              Weekly Goal
            </Text>
            
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Set your target for this week
            </Text>
            
            <View style={[styles.inputContainer, { backgroundColor: theme.background, borderColor: theme.separator }]}>
              <TextInput
                style={[styles.input, { color: theme.text.primary }]}
                value={tempGoal}
                onChangeText={setTempGoal}
                keyboardType="number-pad"
                placeholder="35"
                placeholderTextColor={theme.text.tertiary}
                autoFocus
                selectTextOnFocus
              />
              <Text style={[styles.unit, { color: theme.text.secondary }]}>
                cigarettes
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { backgroundColor: theme.background }]}
                onPress={handleCancel}
              >
                <Text style={[styles.buttonText, { color: theme.text.primary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.saveButton, { backgroundColor: theme.accent }]}
                onPress={handleSave}
              >
                <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
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
  modalContent: {
    width: '100%',
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -1,
  },
  unit: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  saveButton: {
    // backgroundColor set inline
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
});

export default GoalSetting;