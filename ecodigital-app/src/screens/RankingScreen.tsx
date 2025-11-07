import React, { useState, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../api/supabaseClient';
import { AppHeader } from '../components/AppHeader';
import { RankingListItem, RankingListItemProps } from '../components/RankingListItem';
import { SkeletonListItem } from '../components/SkeletonListItem';

export function RankingScreen() {
  const [ranking, setRanking] = useState<Omit<RankingListItemProps, 'delay'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(useCallback(() => { fetchRanking(); }, []));

  async function fetchRanking() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, xp_points')
        .eq('role', 'employee')
        .order('xp_points', { ascending: false, nullsFirst: false })
        .limit(10);
      
      if (error) throw error;
      setRanking(data as Omit<RankingListItemProps, 'delay'>[] || []);
    } catch (err) {
      console.error('Erro ao buscar ranking:', err);
      setError('Não foi possível carregar o ranking.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom', 'left', 'right']}>
      <AppHeader title="Ranking" />
      {/* Subtítulo com padding e destaque sutil */}
      <View className="px-6">
        <Text
          className="text-center text-sm font-semibold text-gray-300"
          style={{
            paddingTop: 16,
            paddingBottom: 16,
            color: '#A3A3A3', // gray-400/gray-300
          }}
        >
          Acompanhe o ranking dos colaboradores mais engajados da comunidade, baseado na pontuação de experiência (XP).
        </Text>
      </View>
      <FlatList
        data={ranking}
        keyExtractor={(item, index) => `rank-${index}-${item.full_name}`}
        renderItem={({ item, index }) => (
          <RankingListItem 
            rank={index + 1}
            avatar_url={item.avatar_url}
            full_name={item.full_name}
            xp_points={item.xp_points}
            delay={index * 100}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="mt-6 px-6">
            {loading ? (
              <>
                {Array.from({ length: 7 }).map((_, i) => <SkeletonListItem key={i} />)}
              </>
            ) : error ? (
              <Text className="text-center text-red-500">{error}</Text>
            ) : (
              <Text className="text-center text-gray-500">Não há colaboradores para exibir.</Text>
            )}
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 24 }}
        className="px-6"
      />
    </SafeAreaView>
  );
}