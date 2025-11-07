// src/components/LoadingScreen.tsx
import React from 'react';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

interface LoadingScreenProps {
  message?: string; // Uma mensagem customizável opcional
}

export function LoadingScreen({ message = 'Carregando...' }: LoadingScreenProps) {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image
        source={require('../../assets/Logo.png')} // Usando o novo caminho do logo
        className="w-32 h-32 mb-8"
        resizeMode="contain"
      />

      {/* Barra de Progresso Indeterminada */}
      <View className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <MotiView
          from={{ translateX: -100 }}
          animate={{ translateX: 290 }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
          }}
          className="w-20 h-1.5 bg-ecodigital-green rounded-full"
        />
      </View>

      <Text className="text-gray-600 mt-6 text-base">{message}</Text>
    </View>
  );
}