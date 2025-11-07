// app/dashboard/page.tsx
"use client";

import { Archive, ArrowDownToLine, Zap, Leaf } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import PlanetAnimation from "@/components/PlanetAnimation";
import { Progress } from "@/components/ui/Progress";
import EngagementChartWrapper from '@/components/EngagementChartWrapper';

// Definimos o tipo para o perfil do usuário
type Profile = {
  full_name: string | null;
}

const DashboardPage = () => {
  const supabase = createClientComponentClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  // Simulando a barra de progresso em 66%
  const [progressValue] = useState(66);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
    };
    fetchProfile();
  }, [supabase]);

  const achievements = [
    { icon: <Archive size={24} className="text-blue-500" />, stat: "150 GB", description: "de dados limpos na nuvem" },
    { icon: <Zap size={24} className="text-yellow-500" />, stat: "1.2 MWh", description: "de energia economizada" },
    { icon: <ArrowDownToLine size={24} className="text-green-500" />, stat: "8,740", description: "missões concluídas" },
  ];

  // Componente da tag "ModoEco"
  const ModoEcoTag = () => (
    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-ecodigital-green/10 border border-ecodigital-green text-ecodigital-green font-semibold text-sm shadow-sm select-none">
      <Leaf size={16} className="inline-block text-ecodigital-green" />
      ModoEco
    </span>
  );

  // Fundo decorativo melhorado e mais compacto para a área até a barra de progresso
  const HeroBackground = ({ children }: { children: React.ReactNode }) => (
    <div className="relative mb-6 rounded-2xl overflow-hidden shadow-lg">
      {/* Gradiente de fundo */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: "linear-gradient(120deg, #f0fdf4 0%, #e0f7ef 60%, #e0f2fe 100%)",
        }}
      />
      {/* Bolhas verdes suaves */}
      <div className="absolute left-[-60px] top-[-40px] w-44 h-44 bg-ecodigital-green/20 rounded-full blur-2xl z-0 animate-[pulse_7s_ease-in-out_infinite]"></div>
      <div className="absolute right-[-40px] top-16 w-28 h-28 bg-ecodigital-green/15 rounded-full blur-xl z-0 animate-[pulse_9s_ease-in-out_infinite]"></div>
      <div className="absolute left-1/2 bottom-[-40px] w-32 h-32 bg-ecodigital-green/10 rounded-full blur-xl z-0 animate-[pulse_8s_ease-in-out_infinite] opacity-80" style={{ transform: "translateX(-50%)" }}></div>
      {/* Detalhe de folha no canto inferior direito */}
      <div className="absolute bottom-0 right-0 z-0 opacity-20">
        <Leaf size={64} className="text-ecodigital-green/30 rotate-[20deg]" />
      </div>
      {/* ModoEco no canto superior esquerdo */}
      <div className="absolute top-3 left-3 z-10">
        <ModoEcoTag />
      </div>
      {/* Conteúdo principal */}
      <div className="relative z-10 px-4 py-4 md:px-8 md:py-5">
        {children}
      </div>
    </div>
  );

  // Só renderiza o dashboard quando o nome do usuário estiver carregado
  if (!profile?.full_name) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <span className="text-gray-500 text-lg">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <HeroBackground>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Oi, {profile.full_name}!
            </h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Aqui está um resumo do impacto positivo da sua empresa.</p>
          </div>
          <div className="flex-1 flex items-center justify-center min-w-[220px] md:min-w-[320px]">
            <div className="max-w-[420px] md:max-w-[520px] w-full">
              {/* Aumentando o tamanho do planeta */}
              <PlanetAnimation />
            </div>
          </div>
        </div>
      </HeroBackground>

      {/* Seção da Barra de Progresso */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <p className="font-semibold text-ecodigital-gray-dark text-sm md:text-base">Progresso da Meta Mensal</p>
          <p className="font-bold text-ecodigital-green text-base md:text-lg">{progressValue}%</p>
        </div>
        <Progress value={progressValue} />
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3 md:mb-4">Feitos Atuais</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {achievements.map((item, index) => (
            <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-lg flex items-center gap-4 md:gap-6 hover:shadow-xl transition-shadow">
              <div className="bg-gray-100 p-3 md:p-4 rounded-full">
                {item.icon}
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{item.stat}</p>
                <p className="text-gray-500 text-sm md:text-base">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

       {/* NOVO: Seção do Gráfico de Engajamento */}
       <div>
        <EngagementChartWrapper />
      </div>
    </div>
  );
};

export default DashboardPage;