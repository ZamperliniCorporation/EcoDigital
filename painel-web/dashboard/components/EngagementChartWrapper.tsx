"use client";

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import EngagementChart from './EngagementChart';

const EngagementChartWrapper = () => {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', user.id)
            .single();
          
          if (profile?.company_id) {
            setCompanyId(profile.company_id);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar company_id:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyId();
  }, [supabase]);

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

  return <EngagementChart companyId={companyId || undefined} />;
};

export default EngagementChartWrapper;

