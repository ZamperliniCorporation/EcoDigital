import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MissionCard, MissionCardProps } from '../components/MissionCard';
import { supabase } from '../api/supabaseClient';

export function NewMissionsScreen() {
  const [missions, setMissions] = useState<MissionCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(useCallback(() => { fetchMissions(); }, []));

  async function fetchMissions() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.from('missions').select('*, user_missions(status)').is('user_missions', null);
      
    if (error) {
      setError('Não foi possível carregar as missões.');
    } else if (data) {
      const formattedData = data.map(mission => ({
        id: mission.id ?? '',
        title: mission.title ?? 'Missão sem título',
        xp: mission.xp_reward ?? 0,
        duration: '15 min',
        status: 'pending',
        iconName: 'aperture-outline',
      }));
      setMissions(formattedData as MissionCardProps[]);
    }
    setLoading(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom', 'left', 'right']}>
      <FlatList
        data={missions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MissionCard {...item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-16 items-center px-6">
            {loading ? <ActivityIndicator size="large" color="#059669" /> :
             error ? <Text className="text-center text-red-500">{error}</Text> :
             <Text className="text-center text-gray-500">Nenhuma missão nova por aqui!</Text>}
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 24 }}
        className="px-6"
      />
    </SafeAreaView>
  );
}