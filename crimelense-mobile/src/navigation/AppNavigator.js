import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LiveMapScreen from '../screens/LiveMapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CrimeRiskScoreScreen from '../screens/CrimeRiskScoreScreen';
import CommunityFeedScreen from '../screens/CommunityFeedScreen';
import AIInsightsScreen from '../screens/AIInsightsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#0a101d',
    card: '#10182b',
    text: '#ffffff',
    border: 'rgba(0, 229, 255, 0.15)',
    primary: '#00e5ff',
  },
};

const TabIcon = ({ label, color }) => (
  <Text style={{ color, fontSize: 10, marginTop: 2 }}>{label}</Text>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: '#00e5ff',
      tabBarInactiveTintColor: '#94a3b8',
      tabBarLabelStyle: styles.tabBarLabel,
    }}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Map" component={LiveMapScreen} />
    <Tab.Screen name="Risk" component={CrimeRiskScoreScreen} />
    <Tab.Screen name="Community" component={CommunityFeedScreen} />
    <Tab.Screen name="Insights" component={AIInsightsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00e5ff" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0a101d' } }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a101d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: '#10182b',
    borderTopColor: 'rgba(0, 229, 255, 0.15)',
    borderTopWidth: 1,
  },
  tabBarLabel: {
    fontSize: 11,
  },
});

export default AppNavigator;
