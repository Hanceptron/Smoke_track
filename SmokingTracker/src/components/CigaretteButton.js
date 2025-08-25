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
            backgroundColor: theme.background,
            opacity: disabled ? 0.4 : 1,
          },
          shadowStyle,
        ]}>
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={disabled}
            style={styles.button}
          >
            <Svg
              width={BUTTON_SIZE * 0.8}
              height={BUTTON_SIZE * 0.4}
              viewBox="0 0 200 80"
            >
              <Defs>
                {/* Filter gradient - orange tones */}
                <LinearGradient id="filterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#D4A574" />
                  <Stop offset="30%" stopColor="#C19660" />
                  <Stop offset="70%" stopColor="#B8885C" />
                  <Stop offset="100%" stopColor="#A67C52" />
                </LinearGradient>
                
                {/* Paper gradient - white with subtle texture */}
                <LinearGradient id="paperGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#F8F8F8" />
                  <Stop offset="20%" stopColor="#FAFAFA" />
                  <Stop offset="80%" stopColor="#F5F5F5" />
                  <Stop offset="100%" stopColor="#EEEEEE" />
                </LinearGradient>
                
                {/* Burning gradient */}
                <RadialGradient id="burningGrad" cx="50%" cy="50%">
                  <Stop offset="0%" stopColor="#FF4500" stopOpacity="1" />
                  <Stop offset="30%" stopColor="#FF6347" stopOpacity="0.8" />
                  <Stop offset="60%" stopColor="#FFA500" stopOpacity="0.4" />
                  <Stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                </RadialGradient>

                {/* Ash gradient */}
                <LinearGradient id="ashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#666666" />
                  <Stop offset="50%" stopColor="#808080" />
                  <Stop offset="100%" stopColor="#999999" />
                </LinearGradient>

                <Filter id="blurFilter">
                  <FeGaussianBlur stdDeviation="1.5" />
                </Filter>
              </Defs>

              {/* Main cigarette body */}
              <G transform="translate(100, 40)">
                {/* Shadow underneath */}
                <Ellipse
                  cx={0}
                  cy={8}
                  rx={85}
                  ry={3}
                  fill={theme.shadow.dark}
                  opacity={0.15}
                />
                
                {/* Paper body */}
                <Rect
                  x={-80}
                  y={-12}
                  width={120}
                  height={24}
                  rx={12}
                  fill="url(#paperGrad)"
                />
                
                {/* Paper texture lines */}
                <G opacity={0.05}>
                  <Path d="M-60,-8 L40,-8" stroke="#CCC" strokeWidth="0.5" />
                  <Path d="M-60,0 L40,0" stroke="#CCC" strokeWidth="0.5" />
                  <Path d="M-60,8 L40,8" stroke="#CCC" strokeWidth="0.5" />
                </G>
                
                {/* Filter (right side) */}
                <Rect
                  x={40}
                  y={-12}
                  width={40}
                  height={24}
                  rx={12}
                  fill="url(#filterGrad)"
                />
                
                {/* Filter cork texture dots */}
                <G opacity={0.3}>
                  <Circle cx={50} cy={-6} r={1.5} fill="#A0522D" />
                  <Circle cx={55} cy={-3} r={1} fill="#8B4513" />
                  <Circle cx={52} cy={0} r={1.2} fill="#A0522D" />
                  <Circle cx={58} cy={2} r={1} fill="#8B4513" />
                  <Circle cx={54} cy={5} r={1.3} fill="#A0522D" />
                  <Circle cx={60} cy={-4} r={1} fill="#8B4513" />
                  <Circle cx={65} cy={0} r={1.2} fill="#A0522D" />
                  <Circle cx={62} cy={4} r={1} fill="#8B4513" />
                  <Circle cx={70} cy={-2} r={1.1} fill="#A0522D" />
                </G>
                
                {/* Filter brand lines */}
                <Rect x={45} y={-12} width={1} height={24} fill="#9B7653" opacity={0.2} />
                <Rect x={70} y={-12} width={1} height={24} fill="#9B7653" opacity={0.2} />
                
                {/* Burning end (left side) - only visible when lit */}
                {isLit && (
                  <G transform="translate(-80, 0)">
                    {/* Ash */}
                    <AnimatedG opacity={emberAnim}>
                      <Rect
                        x={-8}
                        y={-8}
                        width={8}
                        height={16}
                        rx={4}
                        fill="url(#ashGrad)"
                        opacity={0.8}
                      />
                      
                      {/* Glowing ember */}
                      <AnimatedCircle
                        cx={-4}
                        cy={0}
                        r={emberAnim.interpolate({
                          inputRange: [0, 0.7, 1],
                          outputRange: [0, 12, 16],
                        })}
                        fill="url(#burningGrad)"
                        opacity={emberAnim.interpolate({
                          inputRange: [0, 0.7, 1],
                          outputRange: [0, 0.8, 1],
                        })}
                      />
                      
                      {/* Hot center */}
                      <Circle cx={-4} cy={0} r={4} fill="#FF2200" opacity={0.9} />
                      <Circle cx={-4} cy={0} r={2} fill="#FF0000" />
                    </AnimatedG>
                  </G>
                )}
                
                {/* Smoke wisps */}
                {isLit && smokeAnims.map((anim, index) => (
                  <AnimatedG
                    key={index}
                    opacity={anim.interpolate({
                      inputRange: [0, 0.3, 0.7, 1],
                      outputRange: [0, 0.6, 0.3, 0],
                    })}
                    transform={[
                      {
                        translateX: -80 + anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -20 + (index * 10)],
                        })
                      },
                      {
                        translateY: anim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -40 - (index * 10)],
                        })
                      },
                    ]}
                  >
                    <Path
                      d={`M0,0 Q-5,${-10 - index * 5} -3,${-20 - index * 5} T-5,${-35 - index * 5}`}
                      stroke={theme.text.tertiary}
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      filter="url(#blurFilter)"
                    />
                    <Circle
                      cx={-2}
                      cy={-15}
                      r={4 + index * 2}
                      fill={theme.text.tertiary}
                      opacity={0.2}
                    />
                  </AnimatedG>
                ))}
              </G>
            </Svg>
            
            {/* Professional label */}
            <Text style={[styles.buttonLabel, { color: theme.text.tertiary }]}>
              {disabled ? 'LIMIT REACHED' : 'TAP TO LOG'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Subtle floating shadow */}
        <Animated.View
          style={[
            styles.floatingShadow,
            {
              backgroundColor: theme.shadow.dark,
              opacity: 0.06,
              transform: [
                {
                  scale: scaleAnim.interpolate({
                    inputRange: [0.95, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
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