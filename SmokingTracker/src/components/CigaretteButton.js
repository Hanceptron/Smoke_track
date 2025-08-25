import React, { useRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
} from 'react-native';
import Svg, { 
  Path, 
  Circle, 
  Defs, 
  LinearGradient, 
  RadialGradient,
  Stop,
  G,
  Rect,
  Ellipse,
  Filter,
  FeGaussianBlur,
} from 'react-native-svg';
import { getShadowStyle } from '../theme/colors';
import HapticService from '../services/HapticService';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.28;

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CigaretteButton = ({ onPress, theme, disabled = false }) => {
  const [isLit, setIsLit] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const emberAnim = useRef(new Animated.Value(0)).current;
  const smokeAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const handlePress = () => {
    if (disabled) {
      HapticService.warning();
      return;
    }
    
    HapticService.medium();
    onPress();
    
    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 30,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Light up the cigarette
    setIsLit(true);
    
    // Ember animation
    Animated.sequence([
      Animated.timing(emberAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(emberAnim, {
        toValue: 0.7,
        duration: 4500,
        useNativeDriver: false,
      }),
      Animated.timing(emberAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => setIsLit(false));

    // Smoke animations
    smokeAnims.forEach((anim, index) => {
      anim.setValue(0);
      Animated.sequence([
        Animated.delay(index * 800),
        Animated.timing(anim, {
          toValue: 1,
          duration: 4000 - (index * 500),
          useNativeDriver: false,
        }),
      ]).start();
    });
  };

  const shadowStyle = getShadowStyle(theme, 'convex', 0.7);

  // Create interpolated values for SVG compatibility
  const emberRadius = emberAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 8],
  });

  const smokeOpacity = smokeAnims[0].interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.8, 0],
  });

  const smokeTranslateX = smokeAnims[0].interpolate({
    inputRange: [0, 1],
    outputRange: [-50, -60],
  });

  const smokeTranslateY = smokeAnims[0].interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const scaleShadow = scaleAnim.interpolate({
    inputRange: [0.95, 1],
    outputRange: [0.8, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.floatingContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={[
          styles.buttonContainer,
          {
            backgroundColor: theme.colors.surface,
            opacity: disabled ? 0.4 : 1,
            ...getShadowStyle(theme),
          }
        ]}>
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={disabled}
            style={styles.button}
          >
            <Svg
              width={BUTTON_SIZE * 0.6}
              height={BUTTON_SIZE * 0.3}
              viewBox="0 0 120 60"
            >
              <Defs>
                <LinearGradient id="cigaretteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#F0F0F0" />
                  <Stop offset="70%" stopColor="#E8E8E8" />
                  <Stop offset="100%" stopColor="#D4A574" />
                </LinearGradient>
                
                <RadialGradient id="emberGrad" cx="50%" cy="50%">
                  <Stop offset="0%" stopColor="#FF4500" />
                  <Stop offset="100%" stopColor="#FFA500" stopOpacity="0.5" />
                </RadialGradient>
              </Defs>

              {/* Simplified cigarette body */}
              <G transform="translate(60, 30)">
                {/* Main body */}
                <Rect
                  x={-50}
                  y={-8}
                  width={80}
                  height={16}
                  rx={8}
                  fill="url(#cigaretteGrad)"
                />
                
                {/* Filter tip */}
                <Rect
                  x={30}
                  y={-8}
                  width={20}
                  height={16}
                  rx={8}
                  fill="#D4A574"
                />
                
                {/* Burning end when lit */}
                {isLit && (
                  <AnimatedG opacity={emberAnim} transform="translate(-50, 0)">
                    <AnimatedCircle
                      cx={0}
                      cy={0}
                      r={emberRadius}
                      fill="url(#emberGrad)"
                    />
                  </AnimatedG>
                )}
                
                {/* Simple smoke effect */}
                {isLit && (
                  <AnimatedG 
                    opacity={smokeOpacity}
                    translateX={smokeTranslateX}
                    translateY={smokeTranslateY}
                  >
                    <Circle cx={0} cy={0} r={3} fill={theme.colors.text.tertiary} opacity={0.4} />
                    <Circle cx={-5} cy={-10} r={2} fill={theme.colors.text.tertiary} opacity={0.3} />
                    <Circle cx={5} cy={-8} r={2.5} fill={theme.colors.text.tertiary} opacity={0.3} />
                  </AnimatedG>
                )}
              </G>
            </Svg>
            
            {/* Professional label */}
            <Text style={[styles.buttonLabel, { color: theme.colors.text.tertiary }]}>
              {disabled ? 'LIMIT REACHED' : 'TAP TO LOG'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Subtle floating shadow */}
        <Animated.View
          style={[
            styles.floatingShadow,
            {
              backgroundColor: theme.colors.shadow,
              opacity: 0.06,
              transform: [{ scale: scaleShadow }],
            },
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  floatingContainer: {
    position: 'relative',
  },
  buttonContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    marginTop: 12,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  floatingShadow: {
    position: 'absolute',
    bottom: -6,
    left: BUTTON_SIZE * 0.15,
    right: BUTTON_SIZE * 0.15,
    height: 12,
    borderRadius: 6,
  },
});

export default CigaretteButton;