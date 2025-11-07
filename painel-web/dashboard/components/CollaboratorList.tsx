'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Avatar from "./Avatar";
import { Database } from '@/types/supabase';

// Supondo PAGE_SIZE definido para paginação
const PAGE_SIZE = 10;

type Profile = Database['public']['Tables']['profiles']['Row'];

// Componente de skeleton para loading
const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="flex items-center justify-between p-3 bg-gray-50 rounded-md animate-pulse"
      >
        <div className="flex items-center">
          <div className="mr-4 w-10 h-10 rounded-full bg-gray-300"></div>
          <div>
            <div className="h-4 bg-gray-300 rounded w-40 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
          <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    ))}
  </div>
);

export default function CollaboratorList({
  companyId,
}: {
  companyId: string | null;
}) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<string | null>(null);
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editFeedback, setEditFeedback] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const supabase = createClientComponentClient<Database>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCollaborators = useCallback(async () => {
    if (!companyId) {
      setIsLoading(false);
      setError("ID da empresa não fornecido.");
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
      setProfiles(data as Profile[]);
    }
    setIsLoading(false);
  }, [companyId, supabase]);

  useEffect(() => {
    fetchCollaborators();
  }, [fetchCollaborators]);

  const filteredProfiles = profiles.filter((profile) => {
    const name = profile.full_name || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filteredProfiles.length / PAGE_SIZE);

  const handleDelete = async () => {
    if (!companyId || !selectedProfile) return;
    setDeleteLoading(true);
    const { error } = await supabase.functions.invoke('delete-collaborator', {
      body: { userIdToDelete: selectedProfile.id, companyId },
    });
    if (error) {
      setDeleteLoading(false);
      alert(`Erro ao deletar: ${error.message}`);
    } else {
      await fetchCollaborators();
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setSelectedProfile(null);
    }
  };

  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = startIdx + PAGE_SIZE;
  const currentProfiles = filteredProfiles.slice(startIdx, endIdx);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      {/* Aqui ficariam os modals */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-xl font-bold text-gray-800">Gerenciar Colaboradores</h2>
        {/* Input de pesquisa aqui */}
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredProfiles.length > 0 ? (
        <>
          <div className="space-y-4">
            {currentProfiles.map(profile => (
              <div key={profile.id}></div>
            ))}
          </div>
          {/* Paginação aqui */}
        </>
      ) : (
        <p className="text-gray-500">Nenhum colaborador encontrado.</p>
      )}
    </div>
  );
}