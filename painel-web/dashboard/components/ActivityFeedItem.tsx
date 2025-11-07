"use client";

import Image from 'next/image';
import { Database } from '@/types/supabase';
import RankIcon from './RankIcon'; // Reutilizaremos o RankIcon existente
import { motion } from 'framer-motion';

// Tipagem para um item do feed, espelhando a estrutura do seu app
type Activity = Database['public']['Tables']['activity_feed']['Row'] & {
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  // Adiciona tipagem explícita para as propriedades necessárias
  activity_type?: string | null;
  metadata?: any;
  message?: string | null;
};

interface ActivityFeedItemProps {
  activity: Activity;
  index: number; // Adicionado para animação em cascata
}

// Função para formatar a data de forma relativa
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

export function ActivityFeedItem({ activity, index }: ActivityFeedItemProps) {
  const { profiles, activity_type, metadata, created_at } = activity;

  if (!profiles) return null;

  // Extrai metadados com segurança
  const meta = metadata as any;
  const xpAwarded = meta?.xp_awarded ?? 0;

  // Renderiza o conteúdo principal do card
  const renderContent = () => {
    switch (activity_type) {
      case 'mission_completed':
        return (
          <p className="text-gray-700 leading-tight">
            completou a missão{' '}
            <span className="font-bold text-gray-800">{meta?.mission_title || 'desconhecida'}</span>
            {' '}e ganhou{' '}
            <span className="font-bold text-ecodigital-green">{xpAwarded} XP</span>!
          </p>
        );
      case 'rank_up':
        return (
          <p className="text-gray-700 leading-tight">
            alcançou uma nova patente!
          </p>
        );
      default:
        // Fallback para o formato antigo de 'message'
        return <p className="text-gray-600 leading-tight">{activity.message || 'Nova atividade registrada.'}</p>;
    }
  };

  return (
    <motion.li
      className="flex items-start gap-3 p-2 transition-all hover:bg-gray-50 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {/* Coluna do Avatar */}
      <div className="flex-shrink-0 flex flex-col items-center w-16">
        <Image
          src={profiles.avatar_url || '/images/default-avatar.png'} // Tenha uma imagem padrão
          alt={`Avatar de ${profiles.full_name}`}
          width={48}
          height={48}
          className="rounded-full border-2 border-ecodigital-green bg-gray-200 object-cover"
        />
        <p className="font-bold text-ecodigital-green text-xs text-center mt-1 break-words" style={{ maxWidth: '64px' }}>
          {profiles.full_name}
        </p>
      </div>

      {/* Coluna do Conteúdo */}
      <div className="flex-1">
        <div className={`relative bg-white p-3 rounded-lg border-l-4 ${activity_type === 'rank_up' ? 'border-yellow-500' : 'border-ecodigital-green'} shadow-sm`}>
          <div className="flex items-center gap-3">
            {/* Ícone de Patente para 'rank_up' */}
            {activity_type === 'rank_up' && (
              <div className="flex-shrink-0">
                <RankIcon xp={xpAwarded} size={32} />
              </div>
            )}
            <div className="flex-1">
              {renderContent()}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-right mt-1 italic">
          {created_at ? formatDate(created_at) : ''}
        </p>
      </div>
    </motion.li>
  );
}