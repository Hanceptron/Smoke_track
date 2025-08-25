import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const StatCard = ({ title, value, subtitle, highlight = false, theme }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;
  const styles = createStyles(theme);

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
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
        },
        theme.shadow('medium'),
      ]}>
        <Text style={[
          styles.title,
          { color: theme.colors.text.tertiary }
        ]}>
          {title.toUpperCase()}
        </Text>
        
        <Text style={[
          styles.value,
          { 
            color: highlight ? theme.colors.accent : theme.colors.text.primary,
          }
        ]}>
          {value}
        </Text>
        
        {subtitle && (
          <Text style={[
            styles.subtitle,
            { color: theme.colors.text.secondary }
          ]}>
            {subtitle}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.base,
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSizes.xs,
    fontWeight: theme.fontWeights.semibold,
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
  },
  value: {
    fontSize: theme.fontSizes['4xl'],
    fontWeight: theme.fontWeights.bold,
    letterSpacing: -1.5,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.fontSizes['4xl'],
  },
  subtitle: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.medium,
    letterSpacing: 0.3,
  },
});

export default StatCard;