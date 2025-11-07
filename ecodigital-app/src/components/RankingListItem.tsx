import React from 'react';
import { View, Text, Image } from 'react-native';
import { MotiView } from 'moti';
import { PatentIcon } from './PatentIcon';
import { getPatentForXp } from '../constants/ranks';

export interface RankingListItemProps {
  rank: number;
  avatar_url: string | null;
  full_name: string | null;
  xp_points: number | null;
  delay: number;
}

// Função utilitária para extrair as iniciais do nome
function getInitials(name: string | null): string {
  if (!name) return 'UA'; // Usuário Anônimo
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() ?? '';
  }
  return (
    (parts[0][0]?.toUpperCase() ?? '') +
    (parts[parts.length - 1][0]?.toUpperCase() ?? '')
  );
}

export function RankingListItem({ rank, avatar_url, full_name, xp_points, delay }: RankingListItemProps) {
  const isPodium = rank <= 3;
  const rankColors = { 1: 'text-amber-500', 2: 'text-slate-400', 3: 'text-orange-400' };

  // Pega a patente do usuário pelo XP
  const patent = getPatentForXp(xp_points ?? 0);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: delay }}
    >
      <View className={`w-full flex-row items-center p-4 rounded-2xl mb-3 ${isPodium ? 'bg-green-50' : 'bg-white'}`}>
        {/* Rank */}
        <View className="items-center mr-3 w-10">
          <Text className={`text-xl font-bold ${isPodium ? rankColors[rank as 1 | 2 | 3] : 'text-gray-400'}`}>
            {rank}°
          </Text>
        </View>
        {/* Avatar */}
        {avatar_url ? (
          <Image
            source={{ uri: avatar_url }}
            className="w-12 h-12 rounded-full mr-4"
          />
        ) : (
          <View
            className="w-12 h-12 rounded-full mr-4 items-center justify-center"
            style={{ backgroundColor: '#10B981' }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
              {getInitials(full_name)}
            </Text>
          </View>
        )}
        {/* Nome, patente e XP */}
        <View className="flex-1 flex-col">
          <Text className="text-gray-800 font-bold text-base">{full_name || 'Usuário Anônimo'}</Text>
          <View className="flex-row items-center mt-0.5">
            <PatentIcon
              library={patent.iconLibrary}
              name={patent.iconName}
              size={16}
              color="#059669"
            />
            <Text className="text-gray-500 text-xs font-semibold ml-2">{patent.name}</Text>
          </View>
        </View>
        {/* XP */}
        <Text className="text-ecodigital-green font-extrabold text-lg">{xp_points || 0} XP</Text>
      </View>
    </MotiView>
  );
}