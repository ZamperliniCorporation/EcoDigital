import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Alert, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../api/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { MissionHeader } from '../components/MissionHeader';
import { MissionChecklist, MissionStep } from '../components/MissionChecklist';

type MissionDetailRouteParams = { MissionDetail: { missionId: string; }; };
type MissionStatus = 'pending' | 'in_progress' | 'completed';

interface MissionDetails {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  mission_steps: MissionStep[];
  user_status: MissionStatus;
}

export function MissionDetailScreen() {
  const route = useRoute<RouteProp<MissionDetailRouteParams, 'MissionDetail'>>();
  const navigation = useNavigation();
  const { user, refreshUserProfile } = useAuth();
  const { missionId } = route.params;

  const [mission, setMission] = useState<MissionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evidence, setEvidence] = useState<string | null>(null);

  useEffect(() => {
    if (missionId) fetchMissionDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionId]);

  async function fetchMissionDetails() {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*, mission_steps(step_text, order), user_missions(status)')
        .eq('id', missionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        const userStatus: MissionStatus = data.user_missions && data.user_missions.length > 0
            ? (data.user_missions[0].status as MissionStatus)
            : 'pending';
        setMission({
          ...data,
          mission_steps: (data.mission_steps || []).sort((a: any, b: any) => a.order - b.order),
          user_status: userStatus,
        });
      } else {
        setError('Missão não encontrada.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro inesperado ao buscar missão.');
      setMission(null);
    }
    setLoading(false);
  }

  async function handleStartMission() {
    if (!user || !mission) return;
    setActionLoading(true);
    try {
      const { error } = await supabase.from('user_missions').insert({
          user_id: user.id,
          mission_id: mission.id,
          status: 'in_progress',
        });
      if (error) throw error;
      Alert.alert('Sucesso', 'Missão iniciada. Complete os passos e envie a evidência.');
      fetchMissionDetails();
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível iniciar a missão.');
      console.error(err);
    }
    setActionLoading(false);
  }

  async function handleSelectEvidence() {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "É preciso permitir o acesso à galeria para enviar uma evidência.");
      return;
    }
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    if (!pickerResult.canceled) {
      setEvidence(pickerResult.assets[0].uri);
    }
  }

  async function handleFinishMission() {
    if (!evidence) {
      Alert.alert('Evidência faltando', 'Por favor, selecione uma imagem como prova antes de finalizar.');
      return;
    }
    if (!user || !mission) return;

    setActionLoading(true);
    try {
      const fileExt = evidence.split('.').pop()?.toLowerCase() ?? 'jpg';
      const filePath = `${user.id}/${mission.id}/${Date.now()}.${fileExt}`;
      const base64 = await FileSystem.readAsStringAsync(evidence, { encoding: 'base64' });
      const fileData = decode(base64);

      const { error: uploadError } = await supabase.storage
        .from('mission_proofs')
        .upload(filePath, fileData, {
          contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: awardedXp, error: rpcError } = await supabase.rpc(
        'complete_mission_and_award_xp', 
        { mission_id_arg: mission.id }
      );
      if (rpcError) throw rpcError;

      if (typeof refreshUserProfile === 'function') {
        await refreshUserProfile();
      }

      Alert.alert('Missão Concluída!', `Você ganhou ${awardedXp} pontos de XP!`);
      navigation.goBack();

    } catch (error) {
      console.error('Erro ao finalizar missão:', error);
      Alert.alert('Erro', 'Não foi possível finalizar a missão. Tente novamente.');
    } finally {
      setActionLoading(false);
    }
  }

  function renderActionButton(): React.ReactNode {
    if (!mission) return null;

    if (mission.user_status === 'pending') {
      return (
        <TouchableOpacity disabled={actionLoading} onPress={handleStartMission} className="w-full bg-ecodigital-green py-4 rounded-xl items-center">
          <Text className="text-white font-bold text-lg">{actionLoading ? 'Iniciando...' : 'Iniciar missão'}</Text>
        </TouchableOpacity>
      );
    }
    if (mission.user_status === 'in_progress') {
      return (
        <TouchableOpacity disabled={actionLoading} onPress={handleFinishMission} className="w-full bg-amber-500 py-4 rounded-xl items-center">
          <Text className="text-white font-bold text-lg">{actionLoading ? 'Enviando...' : 'Finalizar missão'}</Text>
        </TouchableOpacity>
      );
    }
    if (mission.user_status === 'completed') {
      return (
        <View className="w-full bg-gray-200 py-4 rounded-xl items-center">
          <Text className="text-gray-500 font-bold text-lg">Missão concluída</Text>
        </View>
      );
    }
    return null;
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  if (error || !mission) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white px-8">
        <Text className="text-red-500 text-center text-lg mb-4">{error || 'Missão não encontrada.'}</Text>
        <TouchableOpacity onPress={fetchMissionDetails} className="mt-2 px-6 py-3 bg-ecodigital-green rounded-xl">
          <Text className="text-white font-bold">Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          <View className="pt-8">
            <MissionHeader title={mission.title} description={mission.description} xp={mission.xp_reward} />
            <MissionChecklist steps={mission.mission_steps} />

            <View className="w-full px-4 mt-8">
              <Text className="text-lg font-bold text-gray-800 mb-3">Evidência requerida</Text>
              <TouchableOpacity onPress={handleSelectEvidence} className="w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl justify-center items-center bg-gray-50 overflow-hidden">
                {evidence ? (
                  <Image source={{ uri: evidence }} className="w-full h-full" />
                ) : (
                  <>
                    <Ionicons name="arrow-up-circle-outline" size={32} color="#9CA3AF" />
                    <Text className="text-gray-500 mt-2">Toque para fazer upload</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-t-gray-100">
          {renderActionButton()}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}