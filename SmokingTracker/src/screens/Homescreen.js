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
  Alert,
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
  const [streak, setStreak] = useState(0);

  const theme = getTheme(isDarkMode);
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const todayFadeAnim = useRef(new Animated.Value(0.5)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  const streakAnim = useRef(new Animated.Value(0)).current;

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
      
      // Calculate streak
      calculateStreak(data || {}, limit || DEFAULT_DAILY_LIMIT);
    } catch (error) {
      console.error('Error loading data:', error);
      
      // Set fallback values
      setSmokingData({});
      setDailyLimit(DEFAULT_DAILY_LIMIT);
      setIsDarkMode(false);
      setLastSmokeTime(null);
      
      // Show user-friendly error message
      Alert.alert(
        'Loading Error',
        'There was an issue loading your data. The app will continue with default settings.',
        [{ text: 'OK' }]
      );
    }
  };

  const calculateStreak = (data, limit) => {
    let streakCount = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (i === 0 && (data[dateStr] || 0) >= limit) {
        // Today already over limit, streak is 0
        break;
      }
      
      if (i > 0 && (!data[dateStr] || data[dateStr] < limit)) {
        streakCount++;
      } else if (i > 0) {
        break;
      }
    }
    
    setStreak(streakCount);
    
    // Animate streak appearance
    if (streakCount > 0) {
      Animated.spring(streakAnim, {
        toValue: 1,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogCigarette = async () => {
    try {
      HapticService.medium();
      const today = getToday();
      const newCount = await StorageService.incrementTodayCount(today);
      
      if (newCount === dailyLimit) {
        // Just reached limit
        HapticService.warning();
      } else if (newCount > dailyLimit) {
        // Over limit
        HapticService.warning();
      }
      
      const newData = {
        ...smokingData,
        [today]: newCount,
      };
      
      setSmokingData(newData);
      
      const newLastTime = new Date().toISOString();
      setLastSmokeTime(newLastTime);
      
      // Recalculate streak
      calculateStreak(newData, dailyLimit);
    } catch (error) {
      console.error('Error logging cigarette:', error);
      Alert.alert(
        'Error',
        'Failed to log cigarette. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSaveLimit = async (newLimit) => {
    try {
      await StorageService.saveDailyLimit(newLimit);
      setDailyLimit(newLimit);
      setShowLimitModal(false);
    } catch (error) {
      console.error('Error saving limit:', error);
      Alert.alert(
        'Error',
        'Failed to save daily limit. Please try again.',
        [{ text: 'OK' }]
      );
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
      Alert.alert(
        'Error',
        'Failed to change theme. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadData();
    } catch (error) {
      console.error('Error refreshing:', error);
      Alert.alert(
        'Refresh Error',
        'Failed to refresh data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setRefreshing(false);
    }
  };

  const getMotivationalMessage = () => {
    const hour = new Date().getHours();
    const progress = (remainingToday / dailyLimit) * 100;
    
    // Time-based messages
    if (hour < 12) {
      if (todayCount === 0) return "Start your day smoke-free";
      if (progress > 50) return "Great morning discipline";
      return "Each choice shapes your day";
    } else if (hour < 17) {
      if (progress > 70) return "You're crushing it today";
      if (progress > 30) return "Stay strong this afternoon";
      return "Every cigarette counts";
    } else {
      if (progress > 50) return "Finish strong today";
      if (progress > 0) return "You can still make today count";
      return "Tomorrow is a new opportunity";
    }
  };

  const getDailyLimitQuote = () => {
    const quotes = [
      { quote: "The secret of change is to focus all of your energy not on fighting the old, but on building the new.", author: "Socrates" },
      { quote: "It's not about being perfect. It's about being better than yesterday.", author: "Unknown" },
      { quote: "Your limitation—it's only your imagination.", author: "Unknown" },
      { quote: "Great things never come from comfort zones.", author: "Unknown" },
      { quote: "Don't wait for opportunity. Create it.", author: "Unknown" },
      { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
      { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
      { quote: "You are stronger than you think.", author: "Unknown" },
    ];
    
    // Use date and month for better seed variation (changes daily)
    const now = new Date();
    const seed = now.getDate() + (now.getMonth() * 31) + now.getFullYear();
    return quotes[seed % quotes.length];
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
              {/* Streak indicator */}
              {streak >= 3 && (
                <Animated.View style={[
                  styles.streakContainer,
                  {
                    opacity: streakAnim,
                    transform: [{
                      scale: streakAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      })
                    }]
                  }
                ]}>
                  <LinearGradient
                    colors={[theme.success, '#2ECC71']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.streakGradient}
                  >
                    <Text style={styles.streakText}>
                      {streak} DAY STREAK
                    </Text>
                  </LinearGradient>
                </Animated.View>
              )}
              
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
              
              {/* Motivational message */}
              <Text style={[styles.motivationalText, { color: theme.text.secondary }]}>
                {getMotivationalMessage()}
              </Text>
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

            {/* Daily Limit Reached Section */}
            {todayCount >= dailyLimit && (
              <Animated.View style={[
                styles.limitReachedSection,
                {
                  opacity: fadeAnim,
                  transform: [{
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    })
                  }]
                }
              ]}>
                <View style={[styles.quoteCard, getShadowStyle(theme, 'concave', 0.4)]}>
                  <LinearGradient
                    colors={isDarkMode ? ['#2C2D3A', '#1F2029'] : ['#FFFFFF', '#FAFAFA']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.quoteGradient}
                  >
                    <View style={styles.quoteHeader}>
                      <View style={[styles.quoteMark, { backgroundColor: theme.accent }]}>
                        <Text style={styles.quoteMarkText}>"</Text>
                      </View>
                    </View>
                    <Text style={[styles.quoteText, { color: theme.text.primary }]}>
                      {getDailyLimitQuote().quote}
                    </Text>
                    <Text style={[styles.quoteAuthor, { color: theme.text.secondary }]}>
                      — {getDailyLimitQuote().author}
                    </Text>
                  </LinearGradient>
                </View>
              </Animated.View>
            )}

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
  limitReachedSection: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  quoteCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  quoteGradient: {
    padding: 24,
  },
  quoteHeader: {
    marginBottom: 16,
  },
  quoteMark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteMarkText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quoteText: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    opacity: 0.8,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default HomeScreen;