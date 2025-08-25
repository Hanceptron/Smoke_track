import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, { Rect, Text as SvgText, G, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CHART_PADDING = 48;
const CHART_WIDTH = width - CHART_PADDING;
const CHART_HEIGHT = 180;
const BAR_WIDTH = (CHART_WIDTH - 40) / 7;
const MAX_BAR_HEIGHT = 120;

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const WeeklyChart = ({ smokingData, theme }) => {
  // Get days starting from Sunday
  const days = getLastSevenDaysFromSunday();
  const maxValue = Math.max(...days.map(d => smokingData[d.date] || 0), 10);
  const barAnimations = useRef(
    days.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = barAnimations.map((anim, index) => 
      Animated.spring(anim, {
        toValue: 1,
        tension: 40,
        friction: 8,
        delay: index * 50,
        useNativeDriver: false,
      })
    );
    
    Animated.parallel(animations).start();
  }, [smokingData]);

  // Helper function to get last 7 days starting from Sunday
  function getLastSevenDaysFromSunday() {
    const days = [];
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Calculate the most recent Sunday
    const daysUntilSunday = currentDay;
    const mostRecentSunday = new Date(today);
    mostRecentSunday.setDate(today.getDate() - daysUntilSunday);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(mostRecentSunday);
      date.setDate(mostRecentSunday.getDate() + i);
      
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: dayNames[i],
        isToday: date.toDateString() === today.toDateString(),
      });
    }
    
    return days;
  }

  return (
    <View style={styles.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT} style={styles.svg}>
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={CHART_WIDTH}
          height={CHART_HEIGHT}
          fill={theme.colors.surface}
          opacity={0.1}
          rx={8}
        />
        
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = CHART_HEIGHT - 40 - (i * MAX_BAR_HEIGHT / 4);
          return (
            <G key={`grid-${i}`}>
              <Line
                x1={20}
                y1={y}
                x2={CHART_WIDTH - 20}
                y2={y}
                stroke={theme.colors.text.tertiary}
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity={0.3}
              />
              <SvgText
                x={12}
                y={y + 4}
                fontSize={theme.fontSizes.xs}
                fill={theme.colors.text.tertiary}
                textAnchor="end"
                opacity={0.7}
              >
                {Math.round((i * maxValue) / 4)}
              </SvgText>
            </G>
          );
        })}
        
        {/* Bars */}
        {days.map((day, index) => {
          const value = smokingData[day.date] || 0;
          const barHeight = maxValue > 0 ? (value / maxValue) * MAX_BAR_HEIGHT : 0;
          const x = 20 + (index * ((CHART_WIDTH - 40) / 7)) + ((CHART_WIDTH - 40) / 14 - BAR_WIDTH / 2);
          const y = CHART_HEIGHT - barHeight - 40;
          
          return (
            <G key={day.date}>
              {/* Bar */}
              <AnimatedRect
                x={x}
                y={Animated.multiply(
                  barAnimations[index],
                  CHART_HEIGHT - barHeight - 40
                )}
                width={BAR_WIDTH}
                height={Animated.multiply(barAnimations[index], barHeight)}
                rx={BAR_WIDTH / 4}
                fill={day.isToday ? theme.colors.accent : 
                      value === 0 ? theme.colors.success : 
                      value > 5 ? theme.colors.warning : theme.colors.primary}
                opacity={day.isToday ? 1 : 0.8}
              />
              
              {/* Value label */}
              {value > 0 && (
                <SvgText
                  x={x + BAR_WIDTH / 2}
                  y={y - 8}
                  fontSize={theme.fontSizes.xs}
                  fontWeight={theme.fontWeights.semibold}
                  fill={day.isToday ? theme.colors.accent : theme.colors.text.secondary}
                  textAnchor="middle"
                >
                  {value}
                </SvgText>
              )}
              
              {/* Day label */}
              <SvgText
                x={x + BAR_WIDTH / 2}
                y={CHART_HEIGHT - 20}
                fontSize={theme.fontSizes.xs}
                fontWeight={day.isToday ? theme.fontWeights.semibold : theme.fontWeights.medium}
                fill={day.isToday ? theme.colors.text.primary : theme.colors.text.secondary}
                textAnchor="middle"
              >
                {day.dayName}
              </SvgText>
              
              {/* Today indicator */}
              {day.isToday && (
                <Rect
                  x={x}
                  y={CHART_HEIGHT - 15}
                  width={BAR_WIDTH}
                  height={3}
                  rx={1.5}
                  fill={theme.colors.accent}
                />
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 10,
  },
  svg: {
    // Center the SVG
  },
});

export default WeeklyChart;