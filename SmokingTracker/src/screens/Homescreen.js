import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
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
import { DEFAULT_WEEKLY_GOAL } from '../utils/constants';
import { getTheme } from '../theme/colors';

const HomeScreen = () => {
  const [smokingData, setSmokingData] = useState({});
  const [weeklyGoal, setWeeklyGoal] = useState(DEFAULT_WEEKLY_GOAL);
  const [lastSmokeTime, setLastSmokeTime] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    average: '0',
    todayCount: 0,
    progressPercentage: 0,
    trendPercentage: 0,
  });

  const theme = getTheme(isDarkMode);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const newStats = getWeeklyStats(smokingData, weeklyGoal);
    setStats(newStats);
  }, [smokingData, weeklyGoal]);

  const loadData = async () => {
    const [data, goal, isDark, lastTime] = await Promise.all([
      StorageService.getSmokingData(),
      StorageService.getWeeklyGoal(),
      StorageService.getThemeMode(),
      StorageService.getLastSmokeTime(),
    ]);
    
    setSmokingData(data);
    setWeeklyGoal(goal);
    setIsDarkMode(isDark);
    setLastSmokeTime(lastTime);
  };

  const handleLogCigarette = async () => {
    HapticService.medium();
    const today = getToday();
    const newCount = await StorageService.incrementTodayCount(today);
    
    setSmokingData(prev => ({
      ...prev,
      [today]: newCount,
    }));
    
    const newLastTime = new Date().toISOString();
    setLastSmokeTime(newLastTime);
  };

  const handleSaveGoal = async (newGoal) => {
    await StorageService.saveWeeklyGoal(newGoal);
    setWeeklyGoal(newGoal);
    setShowGoalModal(false);
  };

  const toggleTheme = async () => {
    HapticService.selection();
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await StorageService.saveThemeMode(newMode);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getTrendIcon = () => {
    const trend = parseFloat(stats.trendPercentage);
    if (trend > 0) return '↑';
    if (trend < 0) return '↓';
    return '→';
  };

  const getTrendColor = () => {
    const trend = parseFloat(stats.trendPercentage);
    if (trend > 0) return theme.danger;
    if (trend < 0) return theme.success;
    return theme.text.secondary;
  };

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.text.secondary}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: theme.text.primary }]}>
              Smoking Tracker
            </Text>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
              <Text style={[styles.themeIcon, { color: theme.text.secondary }]}>
                {isDarkMode ? '☀️' : '🌙'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Today's Count Card */}
          <LinearGradient
            colors={[theme.accent, '#E55100']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.todayCard}
          >
            <Text style={styles.todayLabel}>Today</Text>
            <Text style={styles.todayCount}>{stats.todayCount}</Text>
            <Text style={styles.todaySubtitle}>cigarettes</Text>
          </LinearGradient>

          {/* Cigarette Button */}
          <CigaretteButton onPress={handleLogCigarette} theme={theme} />

          {/* Time Since Last */}
          <TimeSinceLastSmoke lastSmokeTime={lastSmokeTime} theme={theme} />

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <StatCard
              title="Weekly Total"
              value={stats.total}
              subtitle={`${stats.progressPercentage.toFixed(0)}% of goal`}
              theme={theme}
            />
            <View style={styles.statSpacer} />
            <StatCard
              title="Daily Average"
              value={stats.average}
              subtitle="per day"
              theme={theme}
            />
          </View>

          {/* Trend Card */}
          <TouchableOpacity
            style={[styles.trendCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
            onPress={() => setShowGoalModal(true)}
          >
            <View style={styles.trendLeft}>
              <Text style={[styles.trendTitle, { color: theme.text.secondary }]}>
                Weekly Trend
              </Text>
              <View style={styles.trendValue}>
                <Text style={[styles.trendIcon, { color: getTrendColor() }]}>
                  {getTrendIcon()}
                </Text>
                <Text style={[styles.trendPercentage, { color: theme.text.primary }]}>
                  {Math.abs(parseFloat(stats.trendPercentage))}%
                </Text>
                <Text style={[styles.trendLabel, { color: theme.text.secondary }]}>
                  vs last week
                </Text>
              </View>
            </View>
            <View style={styles.goalSection}>
              <Text style={[styles.goalLabel, { color: theme.text.secondary }]}>
                Goal
              </Text>
              <Text style={[styles.goalValue, { color: theme.text.primary }]}>
                {weeklyGoal}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Weekly Chart */}
          <WeeklyChart smokingData={smokingData} theme={theme} />

          {/* Progress Bar */}
          <View style={[styles.progressCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.progressTitle, { color: theme.text.primary }]}>
              Weekly Progress
            </Text>
            <View style={[styles.progressBar, { backgroundColor: theme.separator }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: stats.progressPercentage >= 100 ? theme.danger : theme.accent,
                    width: `${Math.min(stats.progressPercentage, 100)}%`
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: theme.text.secondary }]}>
              {stats.total} / {weeklyGoal} cigarettes
            </Text>
          </View>

        </ScrollView>

        {/* Goal Setting Modal */}
        <GoalSetting
          visible={showGoalModal}
          currentGoal={weeklyGoal}
          onSave={handleSaveGoal}
          onCancel={() => setShowGoalModal(false)}
          theme={theme}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -1,
  },
  themeButton: {
    padding: 8,
  },
  themeIcon: {
    fontSize: 24,
  },
  todayCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  todayLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  todayCount: {
    fontSize: 72,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -3,
    lineHeight: 72,
  },
  todaySubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statSpacer: {
    width: 12,
  },
  trendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  trendLeft: {
    flex: 1,
  },
  trendTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  trendValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  trendIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  trendPercentage: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  trendLabel: {
    fontSize: 13,
    fontWeight: '400',
    marginLeft: 6,
  },
  goalSection: {
    alignItems: 'center',
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5EA',
  },
  goalLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  goalValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default HomeScreen;