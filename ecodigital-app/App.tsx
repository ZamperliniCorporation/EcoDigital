// App.tsx (Versão Final de Produção)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { Router } from './src/navigation';
import './global.css'; // Garante que o Tailwind seja carregado

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </NavigationContainer>
  );
}