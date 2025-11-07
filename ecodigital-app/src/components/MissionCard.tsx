// src/components/MissionCard.tsx (Versão com Logo Customizada)
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native'; // 1. Adicionado 'Image'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type MissionStatus = 'pending' | 'in_progress' | 'completed';

export interface MissionCardProps {
  id: string;
  iconName: keyof typeof Ionicons.glyphMap; // Mantemos isso para o futuro
  title: string;
  xp: number;
  duration: string;
  status: MissionStatus;
}

const buttonStyles = {
  pending: { text: 'Iniciar', style: 'bg-ecodigital-green' },
  in_progress: { text: 'Retomar', style: 'bg-yellow-500' },
  completed: { text: 'Revisar', style: 'bg-gray-400' },
};

export function MissionCard({ id, title, xp, duration, status }: MissionCardProps) {
  const navigation = useNavigation<any>();
  const button = buttonStyles[status];

  function handleNavigate() {
    navigation.navigate('MissionDetail', { missionId: id });
  }

  return (
    <TouchableOpacity
      onPress={handleNavigate}
      className="w-full bg-white p-5 rounded-2xl shadow-md shadow-gray-200/80 flex-row items-center justify-between mb-4"
    >
      <View className="flex-row items-center flex-1 mr-4">
        {/* 2. A MUDANÇA ESTÁ AQUI */}
        <View className="w-12 h-12 bg-green-100 rounded-full justify-center items-center mr-4 p-2">
          <Image
            source={require('../../assets/Logo.png')}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View>
        <View className="flex-1">
          <Text className="text-gray-800 font-bold text-base" numberOfLines={1}>{title}</Text>
          <Text className="text-gray-500 text-sm mt-1">{duration}</Text>
        </View>
      </View>
      <View className="items-center">
        <Text className="text-ecodigital-green font-bold text-lg">+{xp}</Text>
        <View className={`px-4 py-2 rounded-full mt-2 ${button.style}`}>
          <Text className="text-white font-bold text-xs">{button.text}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}