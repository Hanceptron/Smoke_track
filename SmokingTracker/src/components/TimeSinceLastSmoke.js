import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { formatTimeSince } from '../utils/dateHelpers';

const TimeSinceLastSmoke = ({ lastSmokeTime, theme }) => {
  const [timeSince, setTimeSince] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setTimeSince(formatTimeSince(lastSmokeTime));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lastSmokeTime]);

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Text style={[styles.label, { color: theme.text.secondary }]}>Time Since Last</Text>
      <Text style={[styles.time, { color: theme.text.primary }]}>{timeSince}</Text>
      <View style={[styles.progressBar, { backgroundColor: theme.separator }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              backgroundColor: theme.accent,
              width: lastSmokeTime ? '30%' : '0%' // This could be calculated based on goals
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  time: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default TimeSinceLastSmoke;