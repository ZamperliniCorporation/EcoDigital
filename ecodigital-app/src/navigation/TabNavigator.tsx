import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { ProgressScreen } from '../screens/ProgressScreen';
import { RankingScreen } from '../screens/RankingScreen';
import { MissionStackNavigator } from './MissionStackNavigator'; // A importação correta

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          // Sombra para Android
          elevation: 10,
          // Sombra completa e correta para iOS
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'help-circle-outline';

          if (route.name === 'Missões') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Progresso') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Ranking') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* A linha crucial: A aba 'Missões' renderiza nosso StackNavigator */}
      <Tab.Screen name="Missões" component={MissionStackNavigator} />
      
      <Tab.Screen name="Progresso" component={ProgressScreen} />
      <Tab.Screen name="Ranking" component={RankingScreen} />
    </Tab.Navigator>
  );
}