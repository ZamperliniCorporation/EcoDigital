// app/dashboard/layout.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import type { User, Profile } from '@/types'; // Garanta que seu tipo 'Profile' inclua a propriedade 'role'
import { ReactNode } from 'react';

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerComponentClient({ cookies });

  // 1. Busca a sessão do usuário no servidor
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Se não houver usuário, redireciona para o login (isto já estava correto)
  if (!user) {
    redirect('/login'); // Ajuste para sua página de login
  }

  // 3. Busca o perfil do usuário, INCLUINDO o seu 'role'
  const { data: profile } = await supabase
    .from('profiles')
    .select(`*, role`) // Buscamos a coluna 'role'
    .eq('id', user.id)
    .single();

  // 4. VERIFICAÇÃO DE AUTORIZAÇÃO CRÍTICA
  // Se o perfil não for encontrado OU o papel não for 'admin', bloqueia o acesso.
  if (!profile || profile.role !== 'admin') {
    // Redireciona para uma página de acesso negado ou de volta para o login.
    // É uma boa prática criar uma página específica para isso.
    redirect('/login?error=access_denied'); 
  }

  return (
    <div className="h-screen w-full flex flex-col bg-ecodigital-gray-light">
        <Header 
        user={user as User} 
        profile={profile as Profile}
      />

      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-y-auto pl-20">
          <main className="flex-1 p-6 md:p-8">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
