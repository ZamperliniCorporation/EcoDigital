import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../api/supabaseClient';
import { ActivityFeedItem } from './ActivityFeedItem';

export function ActivityFeed() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useFocusEffect(
    useCallback(() => {
      async function fetchFeed() {
        setLoading(true);
        setError(null);
        try {
          const { data, error } = await supabase
            .from('activity_feed')
            .select('*, profiles(full_name, avatar_url)')
            .order('created_at', { ascending: false })
            .limit(20);

          if (error) throw error;
          
          setActivities(data || []);
        } catch(err) {
          setError("Não foi possível carregar o feed.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
      fetchFeed();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="small" color="#059669" className="my-4" />;
  }

  if (error) {
    return <Text className="text-red-500 text-center">{error}</Text>;
  }

  if (activities.length === 0) {
    return <Text className="text-gray-500 text-center">Nenhuma atividade recente na equipe.</Text>
  }


  return (
    <View>
      {activities.map((activity, idx) => (
        <ActivityFeedItem key={activity.id} activity={activity} delay={idx * 80} />
      ))}
    </View>
  );
}