import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import HomeScreen from './src/screens/Homescreen';

export default function App() {
  useEffect(() => {
    // Handle app state changes for widget data sync
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        // Refresh data when app comes to foreground
        // This will be handled by the HomeScreen's loadData
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription?.remove();
    };
  }, []);

  return <HomeScreen />;
}

