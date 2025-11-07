import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { useAuth } from '../contexts/AuthContext';
import { PersonalRankingCard } from '../components/PersonalRankingCard';
import { ActivityFeed } from '../components/ActivityFeed'; // 1. Importamos o Feed

export function ProgressScreen() {
  const { profile } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom', 'left', 'right']}>
      <AppHeader title="Meu Progresso" />
      
      <ScrollView>
        <View className="p-6">
          <Text className="text-3xl text-gray-600">
            Oi, <Text className="font-bold text-ecodigital-green">{profile?.full_name || 'Guerreiro Eco'}</Text>
          </Text>
          <Text className="text-lg text-gray-500 mt-2">
            Acompanhe sua jornada junto com o EcoDigital!
          </Text>
          
          <View className="mt-8">
            <PersonalRankingCard />
          </View>

          {/* 2. O Feed da Equipe agora é renderizado aqui */}
          <View className="mt-8">
            <Text className="text-2xl font-bold text-gray-800 mb-4">Feed da Equipe</Text>
            <View className="bg-white p-5 rounded-2xl shadow-lg shadow-gray-200/80">
              <ActivityFeed />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}