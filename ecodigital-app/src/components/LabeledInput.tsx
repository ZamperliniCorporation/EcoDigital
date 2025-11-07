// src/components/LabeledInput.tsx (Versão com Ícones)
import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importamos os ícones

interface LabeledInputProps extends TextInputProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap; // O nome do ícone que queremos usar
}

export function LabeledInput({ label, iconName, ...props }: LabeledInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = isFocused ? 'border-ecodigital-green' : 'border-gray-200';
  const labelColor = isFocused ? 'text-ecodigital-green' : 'text-gray-500';
  const iconColor = isFocused ? '#10B981' : '#6B7280'; // Cores para o ícone

  return (
    <View className="w-full mb-6">
      <Text className={`mb-2 font-semibold ${labelColor}`}>{label}</Text>
      <View className={`w-full flex-row items-center bg-white rounded-lg border ${borderColor}`}>
        <Ionicons name={iconName} size={22} color={iconColor} className="pl-4" />
        <TextInput
          className="flex-1 text-gray-900 px-4 py-4 text-base" // Ajustado para não ter background ou borda própria
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
      </View>
    </View>
  );
}