import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Rect, Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import { ANIMATION_DURATION } from '../utils/constants';

const { width } = Dimensions.get('window');
const CIGARETTE_WIDTH = width * 0.5;
const CIGARETTE_HEIGHT = CIGARETTE_WIDTH * 0.15;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const CigaretteButton = ({ onPress, theme }) => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const smokeAnim = useRef(new Animated.Value(0)).current;
  const smokeOpacity = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    onPress();
    
    // Reset animations
    glowAnim.setValue(0);
    smokeAnim.setValue(0);
    smokeOpacity.setValue(0);
    
    // Start glow animation
    Animated.timing(glowAnim, {
      toValue: 1,
      duration: ANIMATION_DURATION.CIGARETTE_GLOW,
      useNativeDriver: false,
    }).start();
    
    // Start smoke animation
    Animated.parallel([
      Animated.timing(smokeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION.SMOKE_FADE,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(smokeOpacity, {
          toValue: 0.6,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(smokeOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION.SMOKE_FADE - 500,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
  };

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 8, 0],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 0],
  });

  const smokeY = smokeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const smokeScale = smokeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.5],
  });

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={styles.container}
    >
      <Svg
        width={CIGARETTE_WIDTH}
        height={CIGARETTE_HEIGHT + 40}
        viewBox={`0 0 ${CIGARETTE_WIDTH} ${CIGARETTE_HEIGHT + 40}`}
      >
        <Defs>
          <RadialGradient id="glowGradient" cx="50%" cy="50%">
            <Stop offset="0%" stopColor="#FF6B35" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Cigarette body */}
        <Rect
          x={CIGARETTE_WIDTH * 0.15}
          y={20}
          width={CIGARETTE_WIDTH * 0.85}
          height={CIGARETTE_HEIGHT}
          fill="#FFFFFF"
          stroke="#E5E5EA"
          strokeWidth="1"
        />

        {/* Orange filter */}
        <Rect
          x={0}
          y={20}
          width={CIGARETTE_WIDTH * 0.2}
          height={CIGARETTE_HEIGHT}
          fill="#FF6B35"
          stroke="#E5E5EA"
          strokeWidth="1"
        />

        {/* Filter lines */}
        <Rect
          x={CIGARETTE_WIDTH * 0.05}
          y={20 + CIGARETTE_HEIGHT * 0.3}
          width={CIGARETTE_WIDTH * 0.1}
          height={CIGARETTE_HEIGHT * 0.4}
          fill="#E55100"
        />

        {/* Ash/Glow at tip */}
        <AnimatedCircle
          cx={CIGARETTE_WIDTH}
          cy={20 + CIGARETTE_HEIGHT / 2}
          r={glowRadius}
          fill="url(#glowGradient)"
          opacity={glowOpacity}
        />

        {/* Smoke */}
        <AnimatedPath
          d={`M${CIGARETTE_WIDTH - 5} ${20 + CIGARETTE_HEIGHT / 2} 
              Q${CIGARETTE_WIDTH + 10} ${20 + CIGARETTE_HEIGHT / 2 - 10} 
              ${CIGARETTE_WIDTH - 10} ${20 + CIGARETTE_HEIGHT / 2 - 20}
              Q${CIGARETTE_WIDTH + 5} ${20 + CIGARETTE_HEIGHT / 2 - 30}
              ${CIGARETTE_WIDTH} ${20 + CIGARETTE_HEIGHT / 2 - 40}`}
          fill="none"
          stroke={theme.text.tertiary}
          strokeWidth="2"
          opacity={smokeOpacity}
          transform={`translate(0, ${smokeY}) scale(${smokeScale}, ${smokeScale})`}
        />
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});

export default CigaretteButton;