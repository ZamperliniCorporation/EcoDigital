import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

import { LoginScreen } from '../screens/LoginScreen';
import { LoadingScreen } from '../components/LoadingScreen';
import { TabNavigator } from './TabNavigator';
import { ForceChangePasswordScreen } from '../screens/ForceChangePasswordScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export function Router() {
  const { session, user, profile, initializing } = useAuth();

  // Corrige o erro de tipagem: permite requires_password_change ser opcional
  const mustChangePassword =
    typeof (profile as any)?.requires_password_change === 'boolean'
      ? (profile as any).requires_password_change === true
      : false;

  if (initializing) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {session && user ? (
        mustChangePassword ? (
          <Stack.Screen name="ForceChangePassword" component={ForceChangePasswordScreen} />
        ) : (
          <>
            <Stack.Screen name="App" component={TabNavigator} />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ 
                headerShown: true,
                title: 'Meu Perfil',
                headerStyle: { backgroundColor: '#0F172A' },
                headerTintColor: '#F8FAFC',
                headerTitleStyle: { fontWeight: 'bold' }
              }}
            />
          </>
        )
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}