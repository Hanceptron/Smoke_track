import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const StatCard = ({ title, value, subtitle, highlight = false, theme }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={[
        styles.title,
        { color: theme.text.tertiary }
      ]}>
        {title.toUpperCase()}
      </Text>
      
      <Text style={[
        styles.value,
        { 
          color: highlight ? theme.accent : theme.text.primary,
        }
      ]}>
        {value}
      </Text>
      
      {subtitle && (
        <Text style={[
          styles.subtitle,
          { color: theme.text.secondary }
        ]}>
          {subtitle}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  value: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -1.5,
    marginBottom: 4,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export default StatCard;