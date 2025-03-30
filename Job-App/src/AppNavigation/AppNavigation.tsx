import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import ListingJobs from '../Screen/ListingJobs';
import SavedJobs from '../Screen/SavedJobs';

const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ size }) => {
            let iconName = '';

            if (route.name === 'Jobs') iconName = 'briefcase-outline';
            else if (route.name === 'Jobs Saved') iconName = 'bookmark-outline';

            return <Ionicons name={iconName} size={size} color="#f86802" />;
          },
          tabBarActiveTintColor: '#f86802',
          tabBarInactiveTintColor: '#f86802',
        })}
      >
        <Tab.Screen name="Jobs" component={ListingJobs} />
        <Tab.Screen name="Jobs Saved" component={SavedJobs} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
