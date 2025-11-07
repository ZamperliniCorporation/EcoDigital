// Caminho: app/dashboard/page.tsx

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/types/supabase';

import EngagementRanking from '@/components/EngagementRanking';
import ActivityFeed from '@/components/ActivityFeed';
import ImpactKpiCard from '@/components/ImpactKpiCard';

interface Profile { company_id: string | null; }
interface Kpis { total_collaborators: number; missions_completed: number; active_challenges: number; }

const UsersIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> );
const CheckCircleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> );
const ZapIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> );

export default async function DashboardPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { redirect('/login'); }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', session.user.id)
    .single<Profile | null>();
  
  if (!profile || !profile.company_id) { 
    return <div>Erro: Perfil ou empresa não encontrados.</div>; 
  }

  // Tipos auxiliares
  type ActivityRow = Database['public']['Tables']['activity_feed']['Row'];
  type ProfileRow = Database['public']['Tables']['profiles']['Row'];
  type RankingRow = { avatar_url: string; experience_points: number; full_name: string };

  // Calcula colaboradores "ativos agora" como perfis com atividade nos últimos 5 minutos
  const fiveMinutesAgoIso = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { data: recentActivities } = await supabase
    .from('activity_feed')
    .select('profile_id')
    .eq('company_id', profile.company_id)
    .gte('created_at', fiveMinutesAgoIso);

  const activeNow = Array.isArray(recentActivities)
    ? new Set(recentActivities.map((a: { profile_id: string }) => a.profile_id)).size
    : 0;

  const { data: kpis } = await supabase
    .rpc('get_company_kpis', { p_company_id: profile.company_id } as any)
    .single<Kpis>();
  
  const { data: rankingData } = await supabase
    .rpc('get_company_ranking', { p_company_id: profile.company_id } as any);

  // Busca atividades para estimar missões concluídas por colaborador
  // Heurística: mensagens contendo "miss" indicam eventos de missão
  // Busca missões completadas por usuário na activity_feed
  const { data: activitiesData } = await supabase
    .from('activity_feed')
    .select('profile_id, message, created_at, profiles!inner(full_name)')
    .eq('company_id', profile.company_id)
    .order('created_at', { ascending: false })
    .limit(2000);

  const activities = (activitiesData ?? []) as Array<ActivityRow & { profiles: { full_name: string | null } }>;
  
  // Conta missões completadas por usuário
  const missionCountByUserId = new Map<string, number>();
  const pendingCountByUserId = new Map<string, number>();
  const userNames = new Map<string, string>();
  
  console.log('Analisando atividades para missões:', activities.length);
  
  // Log das primeiras atividades para debug
  if (activities.length > 0) {
    console.log('Primeiras 3 atividades:', activities.slice(0, 3).map(a => ({
      message: a.message,
      userName: a.profiles?.full_name,
      created_at: a.created_at
    })));
  }
  
  for (const item of activities) {
    const text = (item.message || '').toLowerCase();
    const userName = item.profiles?.full_name || 'Usuário';
    
    // Armazena nome do usuário
    if (item.profile_id) {
      userNames.set(item.profile_id, userName);
    }
    
    // Detecta missões concluídas - lógica mais flexível
    const hasMissionKeyword = (
      text.includes('missão') || text.includes('missao') || 
      text.includes('task') || text.includes('tarefa') ||
      text.includes('challenge') || text.includes('desafio') ||
      text.includes('atividade') || text.includes('ação') ||
      text.includes('acao')
    );
    
    const hasCompletedKeyword = (
      text.includes('concluí') || text.includes('concluido') || 
      text.includes('complet') || text.includes('finaliz') || 
      text.includes('termin') || text.includes('realiz') ||
      text.includes('feito') || text.includes('acabou') ||
      text.includes('finalizou') || text.includes('terminou')
    );
    
    const isMissionCompleted = hasMissionKeyword && hasCompletedKeyword;
    
    // Detecta missões pendentes
    const hasPendingKeyword = (
      text.includes('pendente') || text.includes('atribuí') || 
      text.includes('assigned') || text.includes('novo') ||
      text.includes('nova') || text.includes('criada') ||
      text.includes('iniciada')
    );
    
    const isMissionPending = hasMissionKeyword && hasPendingKeyword;
    
    // Log detalhado para debug
    if (hasMissionKeyword) {
      console.log(`Atividade com palavra-chave de missão:`, {
        userName,
        message: text.substring(0, 100),
        hasCompletedKeyword,
        hasPendingKeyword,
        isMissionCompleted,
        isMissionPending
      });
    }
    
    if (isMissionCompleted && item.profile_id) {
      const currentCount = missionCountByUserId.get(item.profile_id) || 0;
      missionCountByUserId.set(item.profile_id, currentCount + 1);
      console.log(`✅ Missão completada por ${userName}: ${text.substring(0, 50)}...`);
    }
    
    if (isMissionPending && item.profile_id) {
      const currentCount = pendingCountByUserId.get(item.profile_id) || 0;
      pendingCountByUserId.set(item.profile_id, currentCount + 1);
      console.log(`⏳ Missão pendente por ${userName}: ${text.substring(0, 50)}...`);
    }
  }
  
  console.log('📊 Missões completadas por usuário:', Object.fromEntries(missionCountByUserId));
  console.log('⏳ Missões pendentes por usuário:', Object.fromEntries(pendingCountByUserId));

  // Filtra apenas os colaboradores, excluindo admins
  const { data: collaborators } = await supabase
    .from('profiles')
    .select('*')
    .eq('company_id', profile.company_id)
    .eq('role', 'employee'); // <-- apenas employees

  // Monta dados iniciais para o componente de ranking com missões concluídas
  const ranking = (rankingData ?? []) as RankingRow[];
  const initialRankingData: Array<{
    full_name: string | null;
    avatar_url: string | null;
    experience_points: number;
    missions_pending?: number;
    missions_completed?: number;
    id?: string;
  }> = (ranking && ranking.length > 0)
    ? ranking.map((r) => ({
        full_name: r.full_name ?? null,
        avatar_url: r.avatar_url ?? null,
        experience_points: (r.experience_points ?? 0),
        missions_pending: 0,
        missions_completed: 0,
      }))
    : ((collaborators ?? []) as ProfileRow[]).map((c) => ({
        full_name: c.full_name ?? null,
        avatar_url: c.avatar_url ?? null,
        experience_points: Number((c as any).experience_points ?? (c as any).xp_points ?? 0),
        missions_pending: 0,
        missions_completed: 0,
        id: c.id,
      }));

  // Enriquecer com total de missões concluídas quando tivermos id
  const enrichedRankingData = initialRankingData.map((item) => {
    // Tentar associar via nome não é confiável; preferimos quando há id
    // Para dados vindos do ranking RPC, não temos id, então deixamos 0 até backend suportar
    const byIdCompleted = item.id ? (missionCountByUserId.get(item.id) || 0) : 0;
    const byIdPending = item.id ? (pendingCountByUserId.get(item.id) || 0) : 0;
    
    console.log(`Usuário ${item.full_name} (ID: ${item.id}): ${byIdCompleted} completadas, ${byIdPending} pendentes`);
    
    return { ...item, missions_completed: byIdCompleted, missions_pending: byIdPending };
  });
  
  console.log('🎯 Dados finais do ranking:', enrichedRankingData);

  return (
    <div className="bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Principal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ImpactKpiCard title="Colaboradores Ativos" value={activeNow} icon={<UsersIcon />} />
        <ImpactKpiCard title="Missões Concluídas" value={kpis?.missions_completed || 0} icon={<CheckCircleIcon />} />
        <ImpactKpiCard title="Desafios Ativos" value={kpis?.active_challenges || 0} icon={<ZapIcon />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:order-1">
        <EngagementRanking 
            initialData={enrichedRankingData} 
          collaborators={collaborators || []} 
        />
        </div>
        <div className="lg:order-2">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
