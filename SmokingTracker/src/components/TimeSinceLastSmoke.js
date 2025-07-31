import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { formatTimeSince } from '../utils/dateHelpers';

const TimeSinceLastSmoke = ({ lastSmokeTime, theme }) => {
  const [timeValue, setTimeValue] = useState('');
  const [timeUnit, setTimeUnit] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const updateTime = () => {
      if (!lastSmokeTime) {
        setTimeValue('No cigarettes');
        setTimeUnit('today');
        return;
      }

      const now = new Date();
      const last = new Date(lastSmokeTime);
      const diffMs = now - last;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) {
        setTimeValue('just now');
        setTimeUnit('');
      } else if (diffMins < 60) {
        setTimeValue(diffMins.toString());
        setTimeUnit(diffMins === 1 ? 'minute ago' : 'minutes ago');
      } else if (diffHours < 24) {
        setTimeValue(diffHours.toString());
        setTimeUnit(diffHours === 1 ? 'hour ago' : 'hours ago');
      } else {
        setTimeValue(diffDays.toString());
        setTimeUnit(diffDays === 1 ? 'day ago' : 'days ago');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    }).start();

    return () => clearInterval(interval);
  }, [lastSmokeTime]);

  const getMessage = () => {
    if (!lastSmokeTime) {
      return "Great start! Keep it up";
    }
    
    const now = new Date();
    const last = new Date(lastSmokeTime);
    const diffHours = (now - last) / 3600000;
    
    if (diffHours < 1) return "Take a deep breath";
    if (diffHours < 3) return "Stay strong";
    if (diffHours < 6) return "You're doing well";
    if (diffHours < 12) return "Keep going";
    if (diffHours < 24) return "Almost a full day!";
    return "Amazing progress!";
  };

  return (
    <Animated.View style={[
      styles.container,
      { 
        opacity: fadeAnim,
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 0],
          })
        }]
      }
    ]}>
      <Text style={[styles.mainText, { color: theme.text.secondary }]}>
        {lastSmokeTime ? 'You smoked a cigarette ' : ''}
        {timeValue === 'just now' ? (
          <Text style={[styles.timeValue, { color: theme.accent }]}>{timeValue}</Text>
        ) : timeValue === 'No cigarettes' ? (
          <>
            <Text style={[styles.noSmoke, { color: theme.success }]}>{timeValue}</Text>
            <Text> {timeUnit}</Text>
          </>
        ) : (
          <>
            <Text style={[styles.timeValue, { color: theme.accent }]}>{timeValue}</Text>
            <Text> {timeUnit}</Text>
          </>
        )}
      </Text>
      
      <Text style={[styles.motivation, { color: theme.text.tertiary }]}>
        {getMessage()}
      </Text>
      
      <View style={[styles.divider, { backgroundColor: theme.text.tertiary, opacity: 0.2 }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  mainText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  timeValue: {
    fontWeight: '700',
    fontSize: 20,
  },
  noSmoke: {
    fontWeight: '700',
    fontSize: 20,
  },
  motivation: {
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.7,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    width: 80,
  },
});

export default TimeSinceLastSmoke;