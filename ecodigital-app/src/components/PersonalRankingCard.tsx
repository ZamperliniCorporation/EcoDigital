import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { supabase } from '../api/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { getPatentForXp, PATENTS } from '../constants/ranks';
import { RanksModal } from './RanksModal';
import { PatentIcon } from './PatentIcon';

// Função utilitária para extrair as iniciais do nome (igual ao RankingListItem)
function getInitials(name: string | null | undefined): string {
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

export function PersonalRankingCard() {
  const { profile } = useAuth();
  const [rankData, setRankData] = useState<{ rank: number; total: number } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function fetchRank() {
      if(!profile) return;
      const { data } = await supabase.rpc('get_user_rank');
      if (data) setRankData(data);
    }
    fetchRank();
  }, [profile]);

  if (!profile) return null;

  const patent = getPatentForXp(profile.xp_points);
  const nextPatentIndex = PATENTS.findIndex(p => p.name === patent.name) - 1;
  const nextPatent = nextPatentIndex >= 0 ? PATENTS[nextPatentIndex] : null;
  const progressPercentage = nextPatent ? (profile.xp_points / nextPatent.minXp) * 100 : 100;

  return (
    <>
      <RanksModal isVisible={modalVisible} onClose={() => setModalVisible(false)} />

      <View className="bg-white p-5 rounded-2xl shadow-lg shadow-gray-200/80">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <View className="relative">
              {profile.avatar_url ? (
                <Image
                  source={{ uri: profile.avatar_url }}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <View
                  className="w-16 h-16 rounded-full items-center justify-center"
                  style={{ backgroundColor: '#10B981' }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 28 }}>
                    {getInitials(profile.full_name)}
                  </Text>
                </View>
              )}
              {/* 2. O emblema agora usa o componente PatentIcon */}
              <View className="absolute -bottom-1 -right-1 bg-ecodigital-green p-1.5 rounded-full border-2 border-white">
                <PatentIcon 
                  library={patent.iconLibrary} 
                  name={patent.iconName} 
                  size={18} 
                  color="white" 
                />
              </View>
            </View>
            
            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-gray-800">{profile.full_name}</Text>
              <Text className="text-base font-semibold text-gray-500 mt-1">{patent.name}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons name="information-circle-outline" size={28} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-1">
            <View className="flex-row items-center">
              {/* 3. O ícone de progresso também usa o PatentIcon */}
              <PatentIcon 
                library={patent.iconLibrary} 
                name={patent.iconName} 
                size={20} 
                color="#059669" 
              />
              <Text className="text-gray-500 text-sm font-medium ml-2">Progresso para a próxima patente</Text>
            </View>
            <Text className="text-gray-600 text-sm font-bold">
              {profile.xp_points} / {nextPatent ? nextPatent.minXp : profile.xp_points} XP
            </Text>
          </View>
          <View className="w-full bg-gray-200 rounded-full h-2">
            <View 
              className="bg-ecodigital-green h-2 rounded-full" 
              style={{ width: `${progressPercentage}%` }} 
            />
          </View>
        </View>
        
        {rankData && (
          <View className="mt-4 pt-4 border-t border-gray-100">
            <Text className="text-center text-gray-600 font-semibold">
              Sua posição no Ranking: <Text className="text-2xl font-bold text-ecodigital-green-dark">{rankData.rank}º</Text> de {rankData.total}
            </Text>
          </View>
        )}
      </View>
    </>
  );
}