export const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getToday = () => formatDate(new Date());

export const getLastSevenDays = () => {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: formatDate(date),
      dayName: dayNames[date.getDay()],
      dayNumber: date.getDate(),
    });
  }
  
  return days;
};

export const formatTimeSince = (lastSmokeTime) => {
  if (!lastSmokeTime) return 'Start tracking';
  
  const now = new Date();
  const last = new Date(lastSmokeTime);
  const diffMs = now - last;
  
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else {
    return `${minutes}m`;
  }
};

export const getWeeklyStats = (smokingData, weeklyGoal) => {
  const days = getLastSevenDays();
  let total = 0;
  let todayCount = 0;
  
  days.forEach((day, index) => {
    const count = smokingData[day.date] || 0;
    total += count;
    if (index === days.length - 1) {
      todayCount = count;
    }
  });
  
  const average = (total / 7).toFixed(1);
  const progressPercentage = weeklyGoal > 0 ? Math.min((total / weeklyGoal) * 100, 100) : 0;
  
  // Calculate trend (comparing to previous week)
  let previousWeekTotal = 0;
  for (let i = 13; i >= 7; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    previousWeekTotal += smokingData[formatDate(date)] || 0;
  }
  
  const trendPercentage = previousWeekTotal > 0 
    ? ((total - previousWeekTotal) / previousWeekTotal * 100).toFixed(0)
    : 0;
  
  return {
    total,
    average,
    todayCount,
    progressPercentage,
    trendPercentage,
    previousWeekTotal,
  };
};