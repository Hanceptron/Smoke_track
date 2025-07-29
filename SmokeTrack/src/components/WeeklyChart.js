import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { getLastSevenDays } from '../utils/dateHelpers';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;

const WeeklyChart = ({ smokingData, theme }) => {
  const days = getLastSevenDays();
  
  const chartData = {
    labels: days.map(d => d.dayName),
    datasets: [{
      data: days.map(d => smokingData[d.date] || 0),
    }],
  };

  const chartConfig = {
    backgroundColor: theme.background,
    backgroundGradientFrom: theme.background,
    backgroundGradientTo: theme.background,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.accent,
    labelColor: (opacity = 1) => theme.text.secondary,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
    fillShadowGradient: theme.accent,
    fillShadowGradientOpacity: 1,
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: theme.separator,
      strokeDasharray: '0',
    },
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Text style={[styles.title, { color: theme.text.primary }]}>Weekly Overview</Text>
      <BarChart
        data={chartData}
        width={CHART_WIDTH - 32}
        height={180}
        chartConfig={chartConfig}
        style={styles.chart}
        withInnerLines={true}
        showBarTops={false}
        fromZero={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  chart: {
    marginLeft: -16,
  },
});

export default WeeklyChart;