import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import * as z from 'zod';

const provisionSchema = z.object({
    companyName: z.string().min(2),
    employeeCount: z.number().min(1),
    adminName: z.string().min(3),
    adminEmail: z.string().email(),
    provisionalPassword: z.string().min(8),
});

export async function POST(request: Request) {
    // Usamos o cliente da rota para verificar a permissão do usuário de Vendas logado
    const supabaseUserClient = createRouteHandlerClient({ cookies });
    
    // Usamos o cliente Admin com a chave de serviço para realizar ações privilegiadas
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let newAuthUserId: string | null = null;
    let newCompanyId: string | null = null;

    try {
        // 1. VERIFICA SE O USUÁRIO LOGADO É DA EQUIPE DE VENDAS
        const { data: { user } } = await supabaseUserClient.auth.getUser();
        if (!user) throw new Error('Falha na autenticação.');

        const { data: profile } = await supabaseUserClient.from('profiles').select('role').eq('id', user.id).single();
        if (profile?.role !== 'sales') throw new Error('Apenas a equipe de Vendas pode executar esta ação.');

        // 2. VALIDA OS DADOS DO FORMULÁRIO
        const body = await request.json();
        const validation = provisionSchema.safeParse(body);
        if (!validation.success) throw new Error('Dados do formulário inválidos.');

        const { companyName, employeeCount, adminName, adminEmail, provisionalPassword } = validation.data;

        // ETAPA A: CRIAR A EMPRESA
        const { data: newCompany, error: companyError } = await supabaseAdmin.from('companies').insert({
            name: companyName,
            employee_count: employeeCount
        }).select().single();
        if (companyError) throw new Error(`Falha ao criar a empresa: ${companyError.message}`);
        newCompanyId = newCompany.id;

        // ETAPA B: CRIAR O NOVO USUÁRIO NO SISTEMA DE AUTENTICAÇÃO
        const { data: newUser, error: userError } = await supabaseAdmin.auth.admin.createUser({
            email: adminEmail,
            password: provisionalPassword,
            email_confirm: true,
            user_metadata: { name: adminName }
        });
        if (userError) throw new Error(`Falha ao criar o usuário no Auth: ${userError.message}`);
        if (!newUser.user) throw new Error('O objeto do novo usuário não foi retornado.');
        newAuthUserId = newUser.user.id;
        
        // ETAPA C: INSERIR O PERFIL COMPLETO, EM VEZ DE ATUALIZAR
        const { error: profileError } = await supabaseAdmin.from('profiles').insert({
            id: newAuthUserId,
            full_name: adminName,
            role: 'admin',
            company_id: newCompanyId
        });

        if (profileError) throw new Error(`Falha ao criar o perfil do usuário: ${profileError.message}`);

        return NextResponse.json({ message: 'Conta provisionada com sucesso!' }, { status: 201 });

    } catch (error: any) {
        // Lógica de Rollback: Se qualquer etapa falhar, desfazemos as anteriores.
        console.error("ERRO NO PROVISIONAMENTO, INICIANDO ROLLBACK:", error.message);
        if (newAuthUserId) {
            await supabaseAdmin.auth.admin.deleteUser(newAuthUserId);
        }
        if (newCompanyId) {
            await supabaseAdmin.from('companies').delete().eq('id', newCompanyId);
        }
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}