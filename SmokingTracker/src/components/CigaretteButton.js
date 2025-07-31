import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { 
  Rect, 
  Circle, 
  Path, 
  Defs, 
  LinearGradient, 
  RadialGradient, 
  Stop,
  G,
  Filter,
  FeGaussianBlur
} from 'react-native-svg';
import { getShadowStyle } from '../theme/colors';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.32;
const CIGARETTE_LENGTH = BUTTON_SIZE * 0.65;
const CIGARETTE_WIDTH = CIGARETTE_LENGTH * 0.07; // Even thinner for more realistic look

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const CigaretteButton = ({ onPress, theme }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const ashAnim = useRef(new Animated.Value(0)).current;
  const smokeAnims = useRef([
    {
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(0.3),
      path: new Animated.Value(0),
    },
    {
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(0.3),
      path: new Animated.Value(0),
    },
    {
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(0.3),
      path: new Animated.Value(0),
    },
  ]).current;

  // Continuous ember glow
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1200,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [glowAnim]);

  const handlePress = () => {
    onPress();
    
    // Button press animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Ash falling animation
    Animated.sequence([
      Animated.timing(ashAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(ashAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: false,
      }),
    ]).start();

    // Reset smoke animations
    smokeAnims.forEach(anim => {
      anim.opacity.setValue(0);
      anim.translateY.setValue(0);
      anim.scale.setValue(0.3);
      anim.path.setValue(0);
    });

    // Realistic smoke animations
    smokeAnims.forEach((anim, index) => {
      Animated.sequence([
        Animated.delay(index * 1000),
        Animated.parallel([
          // Opacity
          Animated.sequence([
            Animated.timing(anim.opacity, {
              toValue: 0.4,
              duration: 1000,
              useNativeDriver: false,
            }),
            Animated.timing(anim.opacity, {
              toValue: 0,
              duration: 3000,
              useNativeDriver: false,
            }),
          ]),
          // Rise
          Animated.timing(anim.translateY, {
            toValue: -CIGARETTE_LENGTH * 0.8,
            duration: 4000,
            useNativeDriver: false,
          }),
          // Expand
          Animated.timing(anim.scale, {
            toValue: 2,
            duration: 4000,
            useNativeDriver: false,
          }),
          // Path sway
          Animated.timing(anim.path, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: false,
          }),
        ]),
      ]).start();
    });
  };

  const shadowStyle = getShadowStyle(theme, 'convex', 0.6);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            backgroundColor: theme.background,
            transform: [{ scale: scaleAnim }],
          },
          shadowStyle,
        ]}
      >
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={1}
          style={styles.button}
        >
          <Svg
            width={BUTTON_SIZE}
            height={BUTTON_SIZE}
            viewBox={`0 0 ${BUTTON_SIZE} ${BUTTON_SIZE}`}
          >
            <Defs>
              {/* Filter gradient */}
              <LinearGradient id="filterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FFA500" />
                <Stop offset="30%" stopColor="#FF8C00" />
                <Stop offset="100%" stopColor="#D2691E" />
              </LinearGradient>
              
              {/* Paper gradient */}
              <LinearGradient id="paperGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#FAFAFA" />
                <Stop offset="100%" stopColor="#E8E8E8" />
              </LinearGradient>
              
              {/* Ember gradient */}
              <RadialGradient id="emberGradient" cx="50%" cy="50%">
                <Stop offset="0%" stopColor="#FF4500" stopOpacity="1" />
                <Stop offset="30%" stopColor="#FF6347" stopOpacity="0.8" />
                <Stop offset="60%" stopColor="#FF7F50" stopOpacity="0.4" />
                <Stop offset="100%" stopColor="#FFA07A" stopOpacity="0" />
              </RadialGradient>

              {/* Smoke blur */}
              <Filter id="smokeBlur">
                <FeGaussianBlur stdDeviation="2" />
              </Filter>
            </Defs>

            {/* Cigarette positioned vertically in center */}
            <G transform={`translate(${BUTTON_SIZE / 2}, ${BUTTON_SIZE / 2})`}>
              {/* Shadow */}
              <Rect
                x={2}
                y={-CIGARETTE_LENGTH / 2 + 2}
                width={CIGARETTE_WIDTH}
                height={CIGARETTE_LENGTH}
                rx={CIGARETTE_WIDTH / 2}
                fill={theme.shadow.dark}
                opacity={0.2}
              />
              
              {/* Filter (bottom part) */}
              <Rect
                x={-CIGARETTE_WIDTH / 2}
                y={CIGARETTE_LENGTH / 2 - CIGARETTE_LENGTH * 0.25}
                width={CIGARETTE_WIDTH}
                height={CIGARETTE_LENGTH * 0.25}
                rx={CIGARETTE_WIDTH / 2}
                fill="url(#filterGradient)"
              />
              
              {/* Filter cork pattern */}
              <Circle
                cx={0}
                cy={CIGARETTE_LENGTH / 2 - CIGARETTE_LENGTH * 0.15}
                r={CIGARETTE_WIDTH * 0.15}
                fill="#D2691E"
                opacity={0.3}
              />
              <Circle
                cx={CIGARETTE_WIDTH * 0.2}
                cy={CIGARETTE_LENGTH / 2 - CIGARETTE_LENGTH * 0.08}
                r={CIGARETTE_WIDTH * 0.1}
                fill="#8B4513"
                opacity={0.2}
              />
              
              {/* Paper (main body) */}
              <Rect
                x={-CIGARETTE_WIDTH / 2}
                y={-CIGARETTE_LENGTH / 2}
                width={CIGARETTE_WIDTH}
                height={CIGARETTE_LENGTH * 0.75}
                fill="url(#paperGradient)"
              />
              
              {/* Paper texture lines */}
              <Rect
                x={-CIGARETTE_WIDTH / 2 + 1}
                y={-CIGARETTE_LENGTH / 2 + 5}
                width={CIGARETTE_WIDTH - 2}
                height={0.5}
                fill="#DDD"
              />
              
              {/* Burning area */}
              <G transform={`translate(0, ${-CIGARETTE_LENGTH / 2})`}>
                {/* Ash */}
                <AnimatedCircle
                  cx={0}
                  cy={ashAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 10],
                  })}
                  r={CIGARETTE_WIDTH / 2}
                  fill="#666"
                  opacity={ashAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 0],
                  })}
                />
                
                {/* Ember glow */}
                <AnimatedCircle
                  cx={0}
                  cy={0}
                  r={glowAnim.interpolate({
                    inputRange: [0.3, 0.8],
                    outputRange: [CIGARETTE_WIDTH * 0.8, CIGARETTE_WIDTH * 1.2],
                  })}
                  fill="url(#emberGradient)"
                  opacity={glowAnim}
                />
                
                {/* Ember core */}
                <Circle
                  cx={0}
                  cy={0}
                  r={CIGARETTE_WIDTH * 0.4}
                  fill="#FF0000"
                  opacity={0.9}
                />
              </G>
            </G>

            {/* Smoke wisps */}
            {smokeAnims.map((anim, index) => {
              const swayX = anim.path.interpolate({
                inputRange: [0, 0.25, 0.5, 0.75, 1],
                outputRange: [0, 10, -5, 8, 0],
              });

              return (
                <AnimatedG
                  key={index}
                  transform={[
                    { translateX: BUTTON_SIZE / 2 + swayX },
                    { translateY: BUTTON_SIZE / 2 - CIGARETTE_LENGTH / 2 + anim.translateY },
                    { scale: anim.scale },
                  ]}
                  opacity={anim.opacity}
                >
                  <Path
                    d={`M0,0 Q${5 + index * 3},${-10} ${3 + index * 2},${-20} T${5},${-35}`}
                    fill="none"
                    stroke={theme.text.tertiary}
                    strokeWidth="8"
                    strokeLinecap="round"
                    opacity={0.3}
                    filter="url(#smokeBlur)"
                  />
                  <Circle
                    cx={0}
                    cy={-10}
                    r={6}
                    fill={theme.text.tertiary}
                    opacity={0.2}
                  />
                </AnimatedG>
              );
            })}
          </Svg>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Inner shadow for depth */}
      <View
        style={[
          styles.innerShadow,
          {
            backgroundColor: 'transparent',
            borderColor: theme.shadow.light,
            borderWidth: 1.5,
            opacity: 0.2,
          },
        ]}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 30,
  },
  buttonContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerShadow: {
    position: 'absolute',
    width: BUTTON_SIZE - 4,
    height: BUTTON_SIZE - 4,
    borderRadius: (BUTTON_SIZE - 4) / 2,
    top: 2,
  },
});

export default CigaretteButton;