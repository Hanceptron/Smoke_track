import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StorageService from '../services/StorageService';
import HapticService from '../services/HapticService';
import CigaretteButton from '../components/CigaretteButton';
import WeeklyChart from '../components/WeeklyChart';
import StatCard from '../components/StatCard';
import TimeSinceLastSmoke from '../components/TimeSinceLastSmoke';
import GoalSetting from '../components/GoalSetting';
import { getToday, getWeeklyStats } from '../utils/dateHelpers';
import { getTheme, getShadowStyle, getGradientColors } from '../theme/colors';

const { width } = Dimensions.get('window');
const DEFAULT_DAILY_LIMIT = 10;

const HomeScreen = () => {
  const [smokingData, setSmokingData] = useState({});
  const [dailyLimit, setDailyLimit] = useState(DEFAULT_DAILY_LIMIT);
  const [lastSmokeTime, setLastSmokeTime] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState({
    total: 0,
    average: '0',
    trendPercentage: 0,
  });

  const theme = getTheme(isDarkMode);
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const todayFadeAnim = useRef(new Animated.Value(0.5)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  const todayCount = smokingData[getToday()] || 0;
  const remainingToday = Math.max(0, dailyLimit - todayCount);
  const progressPercentage = Math.max(0, (remainingToday / dailyLimit) * 100);

  useEffect(() => {
    loadData();
    // Fade in animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(todayFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    // Update weekly stats
    const stats = getWeeklyStats(smokingData, 999); // No weekly goal needed
    setWeeklyStats(stats);
    
    // Animate display count
    const animationDuration = 500;
    const startValue = displayCount;
    const endValue = todayCount;
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      const easeOutQuad = progress * (2 - progress);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuad);
      
      setDisplayCount(currentValue);
      
      if (progress >= 1) {
        clearInterval(timer);
      }
    }, 16);

    // Animate progress bar
    Animated.spring(progressAnim, {
      toValue: progressPercentage / 100,
      tension: 40,
      friction: 8,
      useNativeDriver: false,
    }).start();
    
    return () => clearInterval(timer);
  }, [smokingData, dailyLimit]);

  const loadData = async () => {
    try {
      const [data, limit, isDark, lastTime] = await Promise.all([
        StorageService.getSmokingData(),
        StorageService.getDailyLimit(),
        StorageService.getThemeMode(),
        StorageService.getLastSmokeTime(),
      ]);
      
      setSmokingData(data || {});
      setDailyLimit(limit || DEFAULT_DAILY_LIMIT);
      setIsDarkMode(isDark || false);
      setLastSmokeTime(lastTime);
      
      // Set initial display count
      const today = getToday();
      setDisplayCount((data && data[today]) || 0);
    } catch (error) {
      console.error('Error loading data:', error);
      setSmokingData({});
      setDailyLimit(DEFAULT_DAILY_LIMIT);
      setIsDarkMode(false);
      setLastSmokeTime(null);
    }
  };

  const handleLogCigarette = async () => {
    try {
      HapticService.medium();
      const today = getToday();
      const newCount = await StorageService.incrementTodayCount(today);
      
      if (newCount > dailyLimit) {
        HapticService.warning();
      }
      
      setSmokingData(prev => ({
        ...prev,
        [today]: newCount,
      }));
      
      const newLastTime = new Date().toISOString();
      setLastSmokeTime(newLastTime);
    } catch (error) {
      console.error('Error logging cigarette:', error);
    }
  };

  const handleSaveLimit = async (newLimit) => {
    try {
      await StorageService.saveDailyLimit(newLimit);
      setDailyLimit(newLimit);
      setShowLimitModal(false);
    } catch (error) {
      console.error('Error saving limit:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      HapticService.selection();
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await StorageService.saveThemeMode(newMode);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadData();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getProgressBarColor = () => {
    if (progressPercentage > 50) return theme.success;
    if (progressPercentage > 20) return theme.warning;
    return theme.danger;
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={isDarkMode ? ['#1A1B26', '#16171F'] : ['#E8EAF0', '#DFE1E7']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={theme.text.secondary}
              />
            }
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            style={{ opacity: fadeAnim }}
          >
            {/* Header */}
            <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
              <View>
                <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
                  Quit Tracker
                </Text>
                <Text style={[styles.headerSubtitle, { color: theme.text.secondary }]}>
                  Reduce your daily intake
                </Text>
              </View>
              <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                <LinearGradient
                  colors={getGradientColors(theme, 'button')}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.themeButtonGradient}
                >
                  <Text style={styles.themeIcon}>
                    {isDarkMode ? '☀️' : '🌙'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Today's Count - Minimalistic */}
            <Animated.View style={[
              styles.todaySection, 
              { 
                opacity: todayFadeAnim,
                transform: [{
                  translateY: todayFadeAnim.interpolate({
                    inputRange: [0.5, 1],
                    outputRange: [20, 0],
                  })
                }]
              }
            ]}>
              <Text style={[styles.todayText, { color: theme.text.secondary }]}>
                Today
              </Text>
              <View style={styles.todayCountRow}>
                <Animated.Text style={[styles.todayNumber, { color: theme.text.primary }]}>
                  {displayCount}
                </Animated.Text>
                <Text style={[styles.todayUnit, { color: theme.text.tertiary }]}>
                  cigarettes
                </Text>
              </View>
              
              {/* Reverse Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={[styles.progressBarBg, { backgroundColor: theme.shadow.dark, opacity: 0.2 }]}>
                  <Animated.View 
                    style={[
                      styles.progressBarFill,
                      {
                        width: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                        backgroundColor: getProgressBarColor(),
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.progressText, { color: theme.text.tertiary }]}>
                  {remainingToday} remaining of {dailyLimit} daily limit
                </Text>
              </View>
            </Animated.View>

            {/* Cigarette Button */}
            <CigaretteButton onPress={handleLogCigarette} theme={theme} />

            {/* Time Since Last */}
            <TimeSinceLastSmoke lastSmokeTime={lastSmokeTime} theme={theme} />

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <StatCard
                title="Today's Limit"
                value={remainingToday}
                subtitle="left to smoke"
                highlight={remainingToday === 0}
                theme={theme}
              />
              <View style={styles.statSpacer} />
              <StatCard
                title="This Week"
                value={weeklyStats.average}
                subtitle="daily average"
                theme={theme}
              />
            </View>

            {/* Daily Limit Setting Card */}
            <TouchableOpacity
              onPress={() => {
                HapticService.light();
                setShowLimitModal(true);
              }}
              activeOpacity={0.8}
              style={[styles.limitCard, getShadowStyle(theme, 'convex', 0.8)]}
            >
              <LinearGradient
                colors={getGradientColors(theme, 'surface')}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.limitGradient}
              >
                <View style={styles.limitContent}>
                  <Text style={[styles.limitTitle, { color: theme.text.secondary }]}>
                    DAILY LIMIT
                  </Text>
                  <Text style={[styles.limitValue, { color: theme.accent }]}>
                    {dailyLimit}
                  </Text>
                  <Text style={[styles.limitEdit, { color: theme.text.tertiary }]}>
                    tap to change
                  </Text>
                </View>
                <View style={styles.limitIcon}>
                  <Text style={styles.limitEmoji}>🎯</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Weekly Chart */}
            <WeeklyChart smokingData={smokingData} theme={theme} />

            {/* Motivation Card */}
            {todayCount >= dailyLimit && (
              <Animated.View style={[
                styles.warningCard,
                getShadowStyle(theme, 'concave', 0.6),
                {
                  opacity: fadeAnim,
                  transform: [{
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    })
                  }]
                }
              ]}>
                <LinearGradient
                  colors={[theme.danger, '#D63031']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.warningGradient}
                >
                  <Text style={styles.warningTitle}>Daily Limit Reached</Text>
                  <Text style={styles.warningText}>
                    Consider stopping for today. Tomorrow is a new opportunity!
                  </Text>
                </LinearGradient>
              </Animated.View>
            )}

            <View style={styles.bottomSpacer} />
          </Animated.ScrollView>

          {/* Daily Limit Setting Modal */}
          <GoalSetting
            visible={showLimitModal}
            currentLimit={dailyLimit}
            onSave={handleSaveLimit}
            onCancel={() => setShowLimitModal(false)}
            theme={theme}
          />
        </SafeAreaView>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1.5,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.8,
  },
  themeButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  themeButtonGradient: {
    padding: 12,
    borderRadius: 20,
  },
  themeIcon: {
    fontSize: 24,
  },
  todaySection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  todayText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    opacity: 0.7,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  todayCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  todayNumber: {
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -2,
    lineHeight: 56,
  },
  todayUnit: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 12,
    opacity: 0.6,
  },
  progressContainer: {
    width: width - 80,
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statSpacer: {
    width: 12,
  },
  limitCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  limitGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  limitContent: {
    flex: 1,
  },
  limitTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  limitValue: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 2,
  },
  limitEdit: {
    fontSize: 12,
    fontWeight: '500',
  },
  limitIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  limitEmoji: {
    fontSize: 30,
  },
  warningCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  warningGradient: {
    padding: 20,
    alignItems: 'center',
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default HomeScreen;