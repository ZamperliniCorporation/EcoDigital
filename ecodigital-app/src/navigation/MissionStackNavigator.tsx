import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppHeader } from '../components/AppHeader';
import { MissionTopTabNavigator } from './MissionTopTabNavigator';
import { MissionDetailScreen } from '../screens/MissionDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen'; // 1. Importe a nova tela

const MissionStack = createNativeStackNavigator();

export function MissionStackNavigator() {
  return (
    <MissionStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerShadowVisible: false,
        headerTintColor: '#111827',
        headerTitleStyle: { fontWeight: 'bold' as const },
      }}
    >
      <MissionStack.Screen 
        name="MissionTabs" 
        component={MissionTopTabNavigator}
        options={{ header: () => <AppHeader title="Missões de Hoje" /> }} 
      />
      <MissionStack.Screen 
        name="MissionDetail" 
        component={MissionDetailScreen}
        options={{ title: 'Detalhe da missão' }}
      />
      {/* 2. Adicione a tela de Perfil ao stack */}
      <MissionStack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Meu Perfil' }}
      />
    </MissionStack.Navigator>
  );
}