import React from 'react';
import { View, Text, Image } from 'react-native';
import { MotiView } from 'moti';
import { PATENTS } from '../constants/ranks';
import { PatentIcon } from './PatentIcon';

// Função utilitária para buscar patente pelo nome
function getPatentByName(name: string) {
  return PATENTS.find((p) => p.name === name);
}

// A "forma" dos dados que esperamos para uma atividade
interface Activity {
  id: string;
  activity_type: 'mission_completed' | 'rank_up';
  metadata: {
    mission_title?: string;
    xp_awarded?: number;
    new_rank_name?: string;
  };
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  } | null;
}

interface ActivityFeedItemProps {
  activity: Activity;
  delay: number; // Prop para a animação em cascata
}

export function ActivityFeedItem({ activity, delay }: ActivityFeedItemProps) {
  const { profiles, activity_type, metadata, created_at } = activity;
  if (!profiles) return null;

  // Lógica para definir o ícone do evento (apenas para rank_up)
  let eventIcon: React.ReactNode = null;
  let isLendaEcoDigital = false;
  if (activity_type === 'rank_up' && metadata.new_rank_name) {
    const patent = getPatentByName(metadata.new_rank_name);
    if (patent) {
      isLendaEcoDigital = patent.name === 'Lenda EcoDigital';
      eventIcon = (
        <PatentIcon
          library={patent.iconLibrary}
          name={patent.iconName}
          size={26}
          color="white"
        />
      );
    }
  }

  // Função de formatação de data
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSeconds < 60) return 'agora mesmo';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m atrás`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  }

  // Texto dinâmico aprimorado
  const renderContent = () => {
    switch (activity_type) {
      case 'mission_completed':
        return (
          <Text className="text-gray-700 leading-5" style={{ flex: 1, flexWrap: 'wrap' }}>
            completou a missão{' '}
            <Text className="font-bold text-gray-800">{metadata.mission_title}</Text>
            {' '}e ganhou{' '}
            <Text className="font-bold text-ecodigital-green">{metadata.xp_awarded} XP</Text>!
          </Text>
        );
      case 'rank_up': {
        // Definir cor do texto e borda para a patente
        const isLenda = metadata.new_rank_name === 'Lenda EcoDigital';
        const rankColor = isLenda ? '#f59e42' : '#059669';
        const rankTextClass = isLenda ? 'text-amber-600' : 'text-ecodigital-green';
        return (
          <Text
            className="text-gray-700 leading-5"
            style={{ flex: 1, flexWrap: 'wrap' }}
          >
            alcançou a patente de{' '}
            <Text className={`font-bold ${rankTextClass}`} style={{ color: rankColor }}>
              {metadata.new_rank_name}
            </Text>
            !{' '}
            {isLenda ? <Text>🏆</Text> : null}
          </Text>
        );
      }
      default:
        return (
          <Text className="text-gray-500 italic" style={{ flex: 1, flexWrap: 'wrap' }}>
            registrou uma nova atividade.
          </Text>
        );
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay }}
    >
      <View
        className="flex-row items-start mb-5"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        {/* Foto e nome do usuário com mais destaque */}
        <View
          style={{
            alignItems: 'center',
            marginRight: 12,
            marginTop: 2,
            minWidth: 60,
          }}
        >
          <Image
            source={
              profiles.avatar_url
                ? { uri: `${profiles.avatar_url}?t=${new Date().getTime()}` }
                : require('../../assets/Logo.png')
            }
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 3,
              borderColor: '#059669',
              backgroundColor: '#e5e7eb',
              marginBottom: 4,
            }}
          />
          <Text
            className="font-extrabold text-ecodigital-green text-center"
            style={{
              fontWeight: 'bold',
              color: '#059669',
              fontSize: 15,
              marginTop: 0,
              maxWidth: 70,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {profiles.full_name}
          </Text>
        </View>

        {/* Conteúdo do Card */}
        <View className="flex-1">
          <View
            className="bg-white p-4 rounded-xl"
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: 14,
              padding: 14,
              borderLeftWidth: 4,
              borderLeftColor:
                activity_type === 'rank_up'
                  ? (isLendaEcoDigital ? '#f59e42' : '#059669')
                  : '#059669',
              shadowColor: '#000',
              shadowOpacity: 0.04,
              shadowRadius: 2,
              elevation: 1,
              minHeight: 54,
              justifyContent: 'center',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', flex: 1 }}>
              {eventIcon && (
                <View
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: isLendaEcoDigital ? '#f59e42' : '#059669',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 8,
                  }}
                >
                  {eventIcon}
                </View>
              )}
              {renderContent()}
            </View>
          </View>
          <Text className="text-xs text-gray-400 mt-2 text-right" style={{ fontStyle: 'italic' }}>
            {formatDate(created_at)}
          </Text>
        </View>
      </View>
    </MotiView>
  );
}