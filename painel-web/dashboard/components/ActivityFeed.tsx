// app/dashboard/components/ActivityFeed.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { ActivityFeedItem } from './ActivityFeedItem'; // Importa o novo componente
import Spinner from './Spinner'; // Importa um spinner para o loading

type FeedItem = Database['public']['Tables']['activity_feed']['Row'] & { // A tipagem já é compatível
  profiles: {
    full_name: string | null;
    avatar_url: string | null; // Corrigido: Adicionado avatar_url que já era buscado
  } | null;
};

export default function ActivityFeed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const supabase = createClientComponentClient<Database>();

  // Adicionamos estados de loading e erro
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar os dados, agora com useCallback
  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('activity_feed')
        .select(`*, profiles ( full_name, avatar_url )`) // Buscamos também o avatar_url
        .order('created_at', { ascending: false })
        .limit(20); // Limitamos a 20 como no seu app

      if (fetchError) throw fetchError;
      if (data) setFeedItems(data as FeedItem[]);

    } catch (err: any) {
      setError("Não foi possível carregar o feed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchFeed();

    // Ouve por novos eventos em tempo real
    const channel = supabase
      .channel('activity-feed-changes')
      .on<FeedItem>(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_feed' }, // Continua ouvindo por inserções
        () => {
          // Ao receber uma nova atividade, simplesmente busca a lista atualizada
          // Isso garante que os dados de 'profiles' venham corretamente
          fetchFeed();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchFeed]);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg h-full">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Feed de Atividades</h2>
      <ul className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {feedItems.length > 0 ? (
          feedItems.map((item, index) => <ActivityFeedItem key={item.id} activity={item} index={index} />)
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhuma atividade recente na equipe.</p>
        )}
      </ul>
    </div>
  );
}