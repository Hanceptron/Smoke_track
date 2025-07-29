import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const StatCard = ({ title, value, subtitle, highlight = false, theme }) => {
  const cardStyle = [
    styles.card,
    {
      backgroundColor: highlight ? theme.accent : theme.card,
      borderColor: theme.cardBorder,
    },
  ];

  const titleStyle = [
    styles.title,
    { color: highlight ? '#FFFFFF' : theme.text.secondary },
  ];

  const valueStyle = [
    styles.value,
    { color: highlight ? '#FFFFFF' : theme.text.primary },
  ];

  const subtitleStyle = [
    styles.subtitle,
    { color: highlight ? 'rgba(255,255,255,0.8)' : theme.text.tertiary },
  ];

  if (highlight) {
    return (
      <LinearGradient
        colors={[theme.accent, '#E55100']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={cardStyle}
      >
        <Text style={titleStyle}>{title}</Text>
        <Text style={valueStyle}>{value}</Text>
        {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
      </LinearGradient>
    );
  }

  return (
    <View style={cardStyle}>
      <Text style={titleStyle}>{title}</Text>
      <Text style={valueStyle}>{value}</Text>
      {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 100,
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
});

export default StatCard;