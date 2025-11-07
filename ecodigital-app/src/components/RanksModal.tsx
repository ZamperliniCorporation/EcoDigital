import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PATENTS } from '../constants/ranks';
import { PatentIcon } from './PatentIcon'; // 1. Importamos nosso componente de ícone inteligente
import { LinearGradient } from 'expo-linear-gradient';

interface RanksModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function RanksModal({ isVisible, onClose }: RanksModalProps) {
  // Ordena as patentes da maior para a menor para exibição correta
  const sortedPatents = [...PATENTS].sort((a, b) => b.minXp - a.minXp);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/70">
        <TouchableOpacity onPress={onClose} className="flex-1" />
        <SafeAreaView className="bg-white rounded-t-2xl" edges={['bottom']}>
          <View className="p-6 items-center">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full mb-4" />
            <Text className="text-2xl font-bold text-gray-800">Patentes EcoDigital</Text>
            <Text className="text-gray-500 mt-2 text-center mb-6">
              Faça missões, acumule XP e se torne uma <Text className="font-bold text-ecodigital-green">Lenda EcoDigital</Text>!
            </Text>

            <View className="w-full">
              {sortedPatents.map((patent) => {
                const isTopRank = patent.name === 'Lenda EcoDigital';
                return (
                  <View key={patent.name} className="overflow-hidden rounded-xl mb-3">
                    {isTopRank && (
                      <LinearGradient
                        colors={['#fde68a', '#f9fbe7']}
                        className="absolute inset-0"
                      />
                    )}
                    <View className={`flex-row items-center justify-between p-4 rounded-xl ${isTopRank ? '' : 'bg-gray-50'}`}>
                      <View className="flex-row items-center">
                        {/* 2. Usamos o PatentIcon para renderizar o emblema correto */}
                        <PatentIcon 
                          library={patent.iconLibrary} 
                          name={patent.iconName} 
                          size={28} 
                          color={isTopRank ? '#ca8a04' : '#059669'} 
                        />
                        <Text className={`text-lg font-bold ml-4 ${isTopRank ? 'text-amber-600' : 'text-gray-800'}`}>{patent.name}</Text>
                      </View>
                      <Text className="text-lg text-ecodigital-green font-black">{patent.minXp} XP</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}