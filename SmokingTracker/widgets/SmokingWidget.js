import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Svg, { Rect, Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import StorageService from '../src/services/StorageService';
import { ANIMATION_DURATION } from '../src/utils/constants';
import { formatDate } from '../src/utils/dateHelpers';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// This is a simplified version for the widget
// In production, you'd use iOS Widget Extension or Android App Widget
const SmokingWidget = () => {
  const [todayCount, setTodayCount] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const glowAnim = new Animated.Value(0);
  const smokeAnim = new Animated.Value(0);

  useEffect(() => {
    loadWidgetData();
  }, []);

  const loadWidgetData = async () => {
    try {
      const today = formatDate(new Date());
      const smokingData = await StorageService.getSmokingData();
      const weeklyGoal = await StorageService.getWeeklyGoal();
      
      // Calculate today's count
      const count = smokingData[today] || 0;
      setTodayCount(count);
      
      // Calculate weekly total
      let weekTotal = 0;
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);
        weekTotal += smokingData[dateStr] || 0;
      }
      
      const progress = Math.min((weekTotal / weeklyGoal) * 100, 100);
      setWeeklyProgress(progress);
    } catch (error) {
      console.error('Error loading widget data:', error);
    }
  };

  const handlePress = async () => {
    // Animate
    Animated.parallel([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION.CIGARETTE_GLOW,
        useNativeDriver: false,
      }),
      Animated.timing(smokeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION.SMOKE_FADE,
        useNativeDriver: false,
      }),
    ]).start(() => {
      glowAnim.setValue(0);
      smokeAnim.setValue(0);
    });

    // Update count
    const today = formatDate(new Date());
    try {
      const newCount = await StorageService.incrementTodayCount(today);
      setTodayCount(newCount);
      loadWidgetData(); // Reload to update progress
    } catch (error) {
      console.error('Error updating widget data:', error);
    }
  };

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 6, 0],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 0],
  });

  const smokeOpacity = smokeAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.6, 0],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.touchable}>
        <Svg width={60} height={40} viewBox="0 0 60 40">
          <Defs>
            <RadialGradient id="widgetGlow" cx="50%" cy="50%">
              <Stop offset="0%" stopColor="#FF6B35" stopOpacity="1" />
              <Stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Cigarette body */}
          <Rect x={10} y={15} width={40} height={10} fill="#FFFFFF" stroke="#E5E5EA" strokeWidth="1" />
          
          {/* Orange filter */}
          <Rect x={0} y={15} width={12} height={10} fill="#FF6B35" stroke="#E5E5EA" strokeWidth="1" />
          
          {/* Filter detail */}
          <Rect x={3} y={18} width={6} height={4} fill="#E55100" />
          
          {/* Glow */}
          <AnimatedCircle
            cx={50}
            cy={20}
            r={glowRadius}
            fill="url(#widgetGlow)"
            opacity={glowOpacity}
          />
          
          {/* Smoke path */}
          <Animated.Path
            d="M48 20 Q52 15 48 10 Q52 5 50 0"
            fill="none"
            stroke="#C7C7CC"
            strokeWidth="1.5"
            opacity={smokeOpacity}
          />
        </Svg>
      </TouchableOpacity>
      
      <View style={styles.stats}>
        <Text style={styles.count}>{todayCount}</Text>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: '#E5E5EA' }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${weeklyProgress}%`,
                  backgroundColor: weeklyProgress >= 100 ? '#FF3B30' : '#FF6B35'
                }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{weeklyProgress.toFixed(0)}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 170, // 2 icons wide
    height: 85, // 1 icon tall
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  touchable: {
    padding: 4,
  },
  stats: {
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  count: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -1,
  },
  progressContainer: {
    width: '100%',
    marginTop: 4,
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
  progressText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 2,
    textAlign: 'center',
  },
});

export default SmokingWidget;