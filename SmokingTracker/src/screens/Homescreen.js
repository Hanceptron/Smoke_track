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
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
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
                {/* Daily Status */}
                <View style={styles.dailyStatus}>
                  <Text style={[styles.dailyStatusText, { 
                    color: remainingToday === 0 ? theme.danger : theme.text.secondary 
                  }]}>
                    {remainingToday === 0 
                      ? 'Daily limit reached' 
                      : `${remainingToday} remaining today`}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                <View style={[
                  styles.themeButtonInner,
                  { backgroundColor: theme.shadow.dark, opacity: 0.1 }
                ]}>
                  <Text style={[styles.themeIcon, { opacity: 0.6 }]}>
                    {isDarkMode ? '◐' : '◑'}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Header Progress Bar */}
            <View style={[styles.headerProgress, { backgroundColor: theme.shadow.dark, opacity: 0.1 }]}>
              <Animated.View
                style={[
                  styles.headerProgressFill,
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

            {/* Today's Count - Enhanced */}
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
              <Text style={[styles.todayLabel, { color: theme.text.secondary }]}>
                TODAY
              </Text>
              <View style={styles.todayCountRow}>
                <Animated.Text style={[styles.todayNumber, { color: theme.accent }]}>
                  {displayCount}
                </Animated.Text>
              </View>
              <Text style={[styles.todayUnit, { color: theme.text.primary }]}>
                CIGARETTES
              </Text>
              
              {/* Reverse Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={[styles.progressBarBg, { backgroundColor: theme.shadow.dark, opacity: 0.15 }]}>
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
            <CigaretteButton 
              onPress={handleLogCigarette} 
              theme={theme}
              disabled={todayCount >= dailyLimit}
            />

            {/* Time Since Last */}
            <TimeSinceLastSmoke lastSmokeTime={lastSmokeTime} theme={theme} />

            {/* Stats Row - No cards, just text */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.text.tertiary }]}>
                  TODAY'S LIMIT
                </Text>
                <Text style={[styles.statValue, { color: theme.text.primary }]}>
                  {remainingToday}
                </Text>
                <Text style={[styles.statSubtext, { color: theme.text.secondary }]}>
                  left to smoke
                </Text>
              </View>

              <View style={styles.statDivider}>
                <View style={[styles.dividerLine, { backgroundColor: theme.text.tertiary, opacity: 0.2 }]} />
              </View>

              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: theme.text.tertiary }]}>
                  THIS WEEK
                </Text>
                <Text style={[styles.statValue, { color: theme.text.primary }]}>
                  {weeklyStats.average}
                </Text>
                <Text style={[styles.statSubtext, { color: theme.text.secondary }]}>
                  daily average
                </Text>
              </View>
            </View>

            {/* Daily Limit Setting - Minimalistic */}
            <TouchableOpacity
              onPress={() => {
                HapticService.light();
                setShowLimitModal(true);
              }}
              activeOpacity={0.7}
              style={styles.limitButton}
            >
              <View style={styles.limitContent}>
                <View>
                  <Text style={[styles.limitLabel, { color: theme.text.tertiary }]}>
                    DAILY LIMIT
                  </Text>
                  <Text style={[styles.limitValue, { color: theme.text.primary }]}>
                    {dailyLimit}
                  </Text>
                </View>
                <View style={[styles.limitArrow, { opacity: 0.3 }]}>
                  <Text style={[styles.limitArrowText, { color: theme.text.secondary }]}>
                    ›
                  </Text>
                </View>
              </View>
              <View style={[styles.limitUnderline, { backgroundColor: theme.accent, opacity: 0.3 }]} />
            </TouchableOpacity>

            {/* Weekly Chart */}
            <View style={styles.chartSection}>
              <Text style={[styles.chartTitle, { color: theme.text.primary }]}>
                Weekly Overview
              </Text>
              <WeeklyChart smokingData={smokingData} theme={theme} />
            </View>

            <View style={styles.bottomSpacer} />
          </Animated.ScrollView>

          {/* Daily Limit Setting Modal */}
          <GoalSetting
            visible={showLimitModal}
            currentGoal={dailyLimit}
            onSave={handleSaveLimit}
            onCancel={() => setShowLimitModal(false)}
            theme={theme}
          />
        </SafeAreaView>
      </View>
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
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  dailyStatus: {
    marginTop: 2,
  },
  dailyStatusText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  headerProgress: {
    height: 3,
    width: '100%',
    overflow: 'hidden',
  },
  headerProgressFill: {
    height: '100%',
  },
  themeButton: {
    padding: 8,
  },
  themeButtonInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 20,
  },
  todaySection: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  todayLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    opacity: 0.6,
    marginBottom: 12,
  },
  todayCountRow: {
    marginBottom: 4,
  },
  todayNumber: {
    fontSize: 72,
    fontWeight: '800',
    letterSpacing: -3,
    lineHeight: 72,
  },
  todayUnit: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 24,
  },
  progressContainer: {
    width: width - 80,
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 40,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 13,
    fontWeight: '500',
  },
  statDivider: {
    paddingHorizontal: 30,
  },
  dividerLine: {
    width: 1,
    height: 50,
  },
  limitButton: {
    marginHorizontal: 24,
    marginBottom: 40,
  },
  limitContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  limitLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  limitValue: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  limitArrow: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  limitArrowText: {
    fontSize: 24,
    fontWeight: '300',
  },
  limitUnderline: {
    height: 1,
    width: '100%',
  },
  chartSection: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  chartTitle: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default HomeScreen;