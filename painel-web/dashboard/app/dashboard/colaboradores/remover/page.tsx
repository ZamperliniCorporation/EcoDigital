// Arquivo: app/dashboard/colaboradores/remover/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Database } from '@/types/supabase';

import CollaboratorList from '@/components/CollaboratorList';
// Importação direta do componente (não precisa de dynamic, pois já é "use client" internamente)
import FallingLeaves from '@/components/FallingLeaves';

interface Profile {
  company_id: string | null;
}

export default async function RemoveCollaboratorPage() {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', session.user.id)
    .single<Profile | null>();

  if (!profile || !profile.company_id) {
    // Remove a primeira div, retorna apenas o conteúdo interno
    return (
      <>
        {/* Chuva de folhas */}
        <FallingLeaves />
        <div className="max-w-4xl w-full bg-white p-4 rounded-xl shadow-lg relative z-10">
          <p className="text-red-500">Erro: Não foi possível identificar sua empresa para listar os colaboradores.</p>
        </div>
      </>
    );
  }

  const { data: collaborators } = await supabase
    .from('profiles')
    .select('*')
    .eq('company_id', profile.company_id)
    .neq('id', session.user.id);

  // Remove a primeira div, retorna apenas o conteúdo interno
  return (
    <>
      {/* Chuva de folhas */}
      <FallingLeaves />
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="max-w-4xl w-full bg-white p-4 rounded-xl shadow-lg relative z-10">
        <CollaboratorList 
          initialProfiles={collaborators || []} 
          companyId={profile.company_id} 
        />
      </div>
    </div>
    </>
  );
};
