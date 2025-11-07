import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { NewMissionsScreen } from '../screens/NewMissionsScreen';
import { InProgressScreen } from '../screens/InProgressScreen';
import { CompletedScreen } from '../screens/CompletedScreen';

const TopTab = createMaterialTopTabNavigator();

export function MissionTopTabNavigator() {
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#059669',
        tabBarInactiveTintColor: '#6B7280',
        tabBarIndicatorStyle: {
          backgroundColor: '#059669',
          height: 3,
        },
        tabBarLabelStyle: {
          fontWeight: 'bold',
          textTransform: 'capitalize',
        },
        tabBarStyle: {
          backgroundColor: '#FFF',
          elevation: 0, // Remove sombra no Android
          shadowOpacity: 0, // Remove sombra no iOS
        }
      }}
    >
      <TopTab.Screen name="Novas" component={NewMissionsScreen} />
      <TopTab.Screen name="Em Andamento" component={InProgressScreen} />
      <TopTab.Screen name="Concluídas" component={CompletedScreen} />
    </TopTab.Navigator>
  );
}