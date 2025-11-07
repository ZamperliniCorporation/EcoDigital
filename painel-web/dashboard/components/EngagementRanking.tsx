// Caminho: components/EngagementRanking.tsx

import Image from 'next/image';
import { Crown } from 'lucide-react';
import RankIcon from './RankIcon';

type RankingItem = {
  full_name: string | null;
  avatar_url: string | null;
  experience_points: number | null;
  missions_pending?: number;
  missions_completed?: number;
};

type Collaborator = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  experience_points?: number | null;
  xp_points?: number | null;
  role?: string | null;
};

type EngagementRankingProps = {
  initialData: RankingItem[];
  collaborators: Collaborator[];
};

export default function EngagementRanking({ initialData, collaborators }: EngagementRankingProps) {
  // Se não há dados de ranking, usar os colaboradores diretamente
  const displayData = initialData && initialData.length > 0
    ? initialData
    : collaborators.map(collaborator => ({
        full_name: collaborator.full_name,
        avatar_url: collaborator.avatar_url,
        // Preferir xp do perfil quando não há experience_points explícitos
        experience_points: (collaborator.experience_points ?? collaborator.xp_points ?? 0),
        missions_pending: 0,
        missions_completed: 0
      }));

  // Ordena por pontos (desc) e mantém itens com menor pontuação abaixo
  const sortedData = [...displayData].sort((a, b) => {
    const axp = a.experience_points ?? 0;
    const bxp = b.experience_points ?? 0;
    return bxp - axp;
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-full">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Ranking de Colaboradores</h2>
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {sortedData.length > 0 ? (
          sortedData.map((user, index) => {
            // Ícones de coroa para as 3 primeiras posições
            const getCrownIcon = () => {
              if (index === 0) {
                return <Crown className="h-6 w-6 text-yellow-500" />;
              } else if (index === 1) {
                return <Crown className="h-6 w-6 text-gray-400" />;
              } else if (index === 2) {
                return <Crown className="h-6 w-6 text-amber-600" />;
              }
              return <span className="text-lg font-semibold text-gray-500 mr-4 w-6 text-center">{index + 1}</span>;
            };

            return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center flex-1 min-w-0">
                <div className="mr-3 w-5 text-center flex justify-center flex-shrink-0">
                  {getCrownIcon()}
                </div>
                
                {/* Avatar e Ícone de Patente lado a lado */}
                <div className="flex items-center mr-3 space-x-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user.full_name || 'Avatar'}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-bold text-sm">
                        {user.full_name?.charAt(0) || '?'}
                      </span>
                    )}
                  </div>
                  
                  {/* Ícone de Patente ao lado do avatar */}
                  <div className="flex-shrink-0">
                    <RankIcon 
                      xp={user.experience_points || 0} 
                      size={20}
                      className=""
                    />
                  </div>
                </div>
                
                {/* Informações do colaborador */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{user.full_name || 'Nome não informado'}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    {typeof user.missions_completed !== 'undefined' && (
                      <span className="text-xs text-gray-600">
                        Missões: {user.missions_completed}
                      </span>
                    )}
                    {typeof user.missions_pending !== 'undefined' && (
                      <span className="text-xs text-orange-600">
                        Pendentes: {user.missions_pending}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* XP */}
              <div className="text-right flex-shrink-0">
                <span className="font-bold text-green-600 text-sm">{user.experience_points || 0} XP</span>
              </div>
            </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum colaborador encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}