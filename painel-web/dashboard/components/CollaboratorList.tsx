'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

// Configuração da Paginação
const PAGE_SIZE = 10;

// Truque para o TypeScript aceitar campos extras que talvez não estejam no type gerado
type ProfileRaw = Database['public']['Tables']['profiles']['Row'];
interface Profile extends ProfileRaw {
  job_role?: string; // Adicionando manualmente para parar o erro
  cargo?: string;    // Opção alternativa
}

// --- COMPONENTE SKELETON (LOADING) ---
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md animate-pulse">
        <div className="flex items-center">
          <div className="mr-4 w-10 h-10 rounded-full bg-gray-300"></div>
          <div>
            <div className="h-4 bg-gray-300 rounded w-40 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function CollaboratorList({ companyId }: { companyId: string | null }) {
  // --- ESTADOS ---
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Paginação e Busca
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  // Modais
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  // Form Edit
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const supabase = createClientComponentClient<Database>();

  // --- BUSCA DOS DADOS ---
  const fetchCollaborators = useCallback(async () => {
    if (!companyId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('company_id', companyId)
      .order('full_name', { ascending: true });

    if (error) {
      console.error("Erro ao buscar perfis:", error);
      setError("Não foi possível carregar os colaboradores.");
      setProfiles([]);
    } else {
      setProfiles(data as unknown as Profile[]); // Forçando o tipo para evitar erros
    }
    setIsLoading(false);
  }, [companyId, supabase]);

  useEffect(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  // --- LÓGICA DE FILTRO E PAGINAÇÃO (O QUE FALTAVA) ---
  const filteredProfiles = profiles.filter((profile) => {
    const name = profile.full_name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filteredProfiles.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  
  // Esta variável 'currentProfiles' é a que estava faltando no seu código!
  const currentProfiles = filteredProfiles.slice(startIdx, endIdx);

  // --- AÇÕES ---
  const handleDelete = async () => {
    if (!selectedProfile) return;
    setDeleteLoading(true);
    
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selectedProfile.id);

    if (error) {
      alert(`Erro ao deletar: ${error.message}`);
    } else {
      await fetchCollaborators();
      setDeleteModalOpen(false);
      setSelectedProfile(null);
    }
    setDeleteLoading(false);
  };

  const handleEditSave = async () => {
      // Lógica de salvar aqui (Update no Supabase)
      console.log("Salvando...", editName, editRole);
      setEditModalOpen(false);
  }

  // --- RENDERIZAÇÃO (HTML) ---
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md min-h-[400px] flex flex-col">
      
      {/* CABEÇALHO E PESQUISA */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800">Gerenciar Colaboradores</h2>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
             <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none w-full md:w-64 text-sm"
          />
        </div>
      </div>

      {/* LISTA PRINCIPAL */}
      <div className="flex-grow">
        {isLoading ? (
          <LoadingSkeleton />
        ) : error ? (
          <div className="text-center py-10 bg-red-50 rounded-lg">
            <p className="text-red-500 font-medium">{error}</p>
            <button onClick={fetchCollaborators} className="mt-2 text-sm text-red-700 underline">Tentar novamente</button>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div className="space-y-3">
            {currentProfiles.map((profile) => (
              <div 
                key={profile.id} 
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-100 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-200"
              >
                {/* Info do Usuário */}
                <div className="flex items-center gap-4">
                  
                  {/* AVATAR SEGURO (Substitua pelo seu componente <Avatar /> se preferir) */}
                  {profile.avatar_url ? (
                     <img 
                       src={profile.avatar_url} 
                       alt="Avatar" 
                       className="w-10 h-10 rounded-full object-cover border border-gray-200" 
                     />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm border border-green-200">
                      {(profile.full_name || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm md:text-base">
                      {profile.full_name || 'Usuário sem nome'}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {/* Aqui ele tenta ler job_role, se não existir lê cargo, se não existir põe padrão */}
                      {profile.job_role || profile.cargo || 'Colaborador'}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedProfile(profile);
                      setEditName(profile.full_name || '');
                      setEditRole(profile.job_role || profile.cargo || '');
                      setEditModalOpen(true);
                    }}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Editar"
                  >
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProfile(profile);
                      setDeleteModalOpen(true);
                    }}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Excluir"
                  >
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400 flex flex-col items-center">
            <p>Nenhum colaborador encontrado.</p>
          </div>
        )}
      </div>

      {/* PAGINAÇÃO */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span className="text-sm text-gray-600 font-medium">
            {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30"
          >
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      )}

      {/* MODAL DE EDIÇÃO */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-4">Editar Colaborador</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input 
                        value={editName} 
                        onChange={e => setEditName(e.target.value)}
                        className="w-full border rounded-md p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                    <input 
                        value={editRole} 
                        onChange={e => setEditRole(e.target.value)}
                        className="w-full border rounded-md p-2"
                    />
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button onClick={handleEditSave} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE EXCLUSÃO */}
      {deleteModalOpen && selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-red-600 mb-2">Excluir Colaborador?</h3>
            <p className="text-gray-600 mb-6">
                Tem certeza que deseja remover <strong>{selectedProfile.full_name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                <button 
                    onClick={handleDelete} 
                    disabled={deleteLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                    {deleteLoading ? 'Excluindo...' : 'Sim, excluir'}
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}