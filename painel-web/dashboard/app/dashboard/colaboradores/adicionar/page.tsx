'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import AddCollaboratorForm from '@/components/AddCollaboratorForm';
import FallingLeaves from '@/components/FallingLeaves';
import { Database } from '@/types/supabase';

interface Profile {
  company_id: string | null;
}

const AddCollaboratorPage = () => {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getCompanyId = async () => {
      console.log('--- INICIANDO DIAGNÓSTICO ---');

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Erro ao obter a sessão:', sessionError);
        setLoading(false);
        return;
      }

      if (session) {
        console.log('Sessão encontrada. ID do usuário logado:', session.user.id);
        
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', session.user.id)
          .single<Profile | null>();

        if (profileError) {
          console.error('Erro ao buscar o perfil:', profileError);
        }
        
        console.log('Resultado da busca no perfil:', profile);

        if (profile?.company_id) {
          console.log('SUCCESS: company_id encontrado:', profile.company_id);
          setCompanyId(profile.company_id);
        } else {
          console.warn('FALHA: O perfil foi encontrado, mas não possui um company_id, ou o perfil não foi encontrado.');
        }
      } else {
        console.warn('Nenhuma sessão de usuário ativa encontrada.');
      }
      setLoading(false);
      console.log('--- FIM DO DIAGNÓSTICO ---');
    };

    getCompanyId();
  }, [supabase]);

  // ... o resto do seu código de retorno (return) permanece o mesmo
  return (
    <div className="animate-fade-in relative min-h-screen flex flex-col items-center justify-start py-8">
      <FallingLeaves />
      <div className="relative z-10 w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800">Adicionar Novo Colaborador</h1>
        <p className="text-gray-500 mt-1 mb-8">
          Preencha os dados para convidar um novo membro para a equipe.
        </p>
        <div className="max-w-2xl w-full bg-white p-6 rounded-xl shadow-lg backdrop-blur-md bg-opacity-90">
          {loading ? (
            <p>Carregando diagnóstico...</p>
          ) : companyId ? (
            <AddCollaboratorForm companyId={companyId} />
          ) : (
            <p className="text-red-500">Erro: Não foi possível identificar sua empresa. Por favor, tente novamente.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCollaboratorPage;