"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { Database } from '@/types/supabase';

type WeeklyData = {
  week_start: string;
  week_end: string;
  week_label: string;
  missions_completed: number;
};

interface EngagementChartProps {
  companyId?: string;
}

const EngagementChart = ({ companyId }: EngagementChartProps) => {
  const [engagementData, setEngagementData] = useState<Array<{ week: string; missoes: number }>>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchWeeklyData = async () => {
      console.log('Buscando dados semanais para companyId:', companyId);
      
      try {
        // Primeiro, tenta buscar dados da activity_feed diretamente
        const { data: activities, error: activitiesError } = await supabase
          .from('activity_feed')
          .select('created_at, activity_type, company_id') // Buscamos o tipo de atividade
          .eq('company_id', companyId || '')
          .order('created_at', { ascending: false })
          .limit(1000);

        console.log('Atividades encontradas:', activities?.length || 0);
        console.log('Erro nas atividades:', activitiesError);

        if (activities && activities.length > 0) {
          const weeklyStats = generateWeeklyStatsFromActivities(activities);
          console.log('Dados semanais gerados:', weeklyStats);
          setEngagementData(weeklyStats);
        } else {
          // Dados de exemplo para demonstração
          const sampleData = [
            { week: 'Semana 1', missoes: 5 },
            { week: 'Semana 2', missoes: 8 },
            { week: 'Semana 3', missoes: 12 },
            { week: 'Semana 4', missoes: 15 },
            { week: 'Semana 5', missoes: 10 },
            { week: 'Semana 6', missoes: 18 },
            { week: 'Semana 7', missoes: 22 },
            { week: 'Semana 8', missoes: 25 },
          ];
          console.log('Usando dados de exemplo:', sampleData);
          setEngagementData(sampleData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados semanais:', error);
        // Fallback para dados estáticos em caso de erro
        const fallbackData = [
          { week: 'Semana 1', missoes: 0 },
          { week: 'Semana 2', missoes: 0 },
          { week: 'Semana 3', missoes: 0 },
          { week: 'Semana 4', missoes: 0 },
          { week: 'Semana 5', missoes: 0 },
          { week: 'Semana 6', missoes: 0 },
          { week: 'Semana 7', missoes: 0 },
          { week: 'Semana 8', missoes: 0 },
        ];
        console.log('Usando dados de fallback:', fallbackData);
        setEngagementData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, [supabase, companyId]);

  // Função para gerar estatísticas semanais a partir da activity_feed
  const generateWeeklyStatsFromActivities = (activities: any[]) => {
    const weeklyStats: { [key: string]: number } = {};
    const now = new Date();
    
    // Gera as últimas 8 semanas
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);
      
      const weekLabel = `Semana ${8 - i}`;
      weeklyStats[weekLabel] = 0;
      
      // Conta missões concluídas nesta semana
      activities.forEach(activity => {
        if (!activity.created_at) return; // Garante que a data existe

        const activityDate = new Date(activity.created_at);
        const isMissionCompleted = activity.activity_type === 'mission_completed';
        
        if (isMissionCompleted && activityDate >= weekStart && activityDate <= weekEnd) { // Lógica simplificada e mais precisa
          weeklyStats[weekLabel]++;
        }
      });
    }
    
    return Object.entries(weeklyStats).map(([week, missoes]) => ({
      week,
      missoes: missoes as number
    }));
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Engajamento Semanal (Missões Concluídas)</h3>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Carregando dados...</div>
        </div>
      </div>
    );
  }
  console.log('Dados finais para o gráfico:', engagementData);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Engajamento Semanal (Missões Concluídas)</h3>
      
      {/* Debug info */}
      <div className="mb-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
        <strong>Debug:</strong> {engagementData.length} semanas carregadas | Company ID: {companyId || 'N/A'}
      </div>
      
      <div style={{ width: '100%', height: 300 }}>
        {engagementData.length > 0 ? (
          <ResponsiveContainer>
            <LineChart
              data={engagementData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="week" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                  backdropFilter: 'blur(4px)',
                  border: '1px solid #e0e0e0',
                  borderRadius: '0.5rem' 
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="missoes" stroke="#10B981" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Nenhum dado disponível para exibir
          </div>
        )}
      </div>
    </div>
  );
};

export default EngagementChart;