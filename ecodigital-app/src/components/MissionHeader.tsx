// src/components/MissionHeader.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MissionHeaderProps {
  title: string;
  description: string;
  xp: number;
}

export function MissionHeader({ title, description, xp }: MissionHeaderProps) {
  return (
    <View className="items-center w-full px-4">
      <View className="w-24 h-24 bg-green-100 rounded-full justify-center items-center mb-6">
        <Ionicons name="cloud-outline" size={48} color="#059669" />
      </View>
      <Text className="text-2xl font-bold text-gray-800 text-center">{title}</Text>
      <Text className="text-base text-gray-500 text-center mt-2">{description}</Text>
      <View className="flex-row items-center space-x-6 mt-6">
        <View className="flex-row items-center">
          <Ionicons name="add-circle-outline" size={20} color="#059669" />
          <Text className="text-base font-semibold text-gray-700 ml-1">+{xp} pts</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={20} color="#059669" />
          <Text className="text-base font-semibold text-gray-700 ml-1">15 min</Text>
        </View>
      </View>
    </View>
  );
}