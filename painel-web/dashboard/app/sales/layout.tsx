import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

// O tipo para as props, garantindo que 'children' seja um nó React.
type SalesLayoutProps = {
  children: ReactNode;
};

export default async function SalesLayout({ children }: SalesLayoutProps) {
  // 1. Cria um cliente Supabase específico para o servidor, usando os cookies da requisição.
  // Esta é a maneira segura de acessar dados do usuário no lado do servidor no App Router.
  const supabase = createServerComponentClient({ cookies });

  // 2. Busca a sessão do usuário a partir do cookie.
  const { data: { session } } = await supabase.auth.getSession();

  // 3. Se não houver sessão, redireciona imediatamente para o login.
  if (!session) {
    redirect('/login');
  }

  // 4. Se houver sessão, busca o perfil para verificar a permissão (role).
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  // 5. Se o perfil não for encontrado ou a 'role' não for 'sales', redireciona.
  // Esta é a camada de autorização que protege a rota.
  if (error || !profile || profile.role !== 'sales') {
    redirect('/login?error=access_denied'); // Redireciona com um erro claro
  }
  
  // 6. Se o usuário estiver autenticado E autorizado, renderiza a página filha.
  return <>{children}</>;
}