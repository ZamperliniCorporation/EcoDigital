'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Image from "next/image";

const collaboratorSchema = z.object({
  full_name: z.string().min(3, 'O nome é obrigatório.'),
  email: z.string().email('Formato de e-mail inválido.'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
  role: z.enum(['admin', 'employee']),
  avatar_url: z.string().url().optional(),
});

type CollaboratorFormValues = z.infer<typeof collaboratorSchema>;

export default function AddCollaboratorForm({ companyId }: { companyId: string }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [globalLoading, setGlobalLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, watch } = useForm<CollaboratorFormValues>({
    resolver: zodResolver(collaboratorSchema),
    defaultValues: {
      role: 'employee',
    },
  });

  // Gera as iniciais do colaborador a partir do nome ou email
  const initials = (watchName: string, watchEmail: string) => {
    if (watchName && watchName.trim().length > 0) {
      return watchName.trim().split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
    }
    if (watchEmail && watchEmail.length > 0) {
      return watchEmail.split('@')[0].slice(0, 2).toUpperCase();
    }
    return "AD";
  };

  // Função de clique no avatar para acionar o input de arquivo
  const handleAvatarClick = () => {
    if (!uploading && fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // Função para lidar com o upload do avatar
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarError(null);
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Selecione uma imagem para fazer upload.');
      }
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('A imagem deve ter no máximo 2MB.');
      }
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      setValue('avatar_url', publicUrl, { shouldValidate: true });
    } catch (error: any) {
      setAvatarError(error?.message || "Erro ao fazer upload do avatar.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: CollaboratorFormValues) => {
    setErrorMsg('');
    setSuccessMsg('');
    setGlobalLoading(true);

    const { error } = await supabase.functions.invoke('add-collaborator', {
      body: JSON.stringify({
        collaborator: data, // Aninha os dados do formulário
        company_id: companyId,
      }),
    });

    if (error) {
      // Tenta extrair a mensagem de erro específica do corpo da resposta da função.
      if (error.context && typeof error.context.json === 'function') {
        const errorBody = await error.context.json();
        setErrorMsg(`Erro: ${errorBody.error || error.message}`);
      } else {
        setErrorMsg(`Erro: ${error.message}`);
      }
      setGlobalLoading(false);
    } else {
      setSuccessMsg('Colaborador adicionado com sucesso! Redirecionando...');
      // Redireciona para a lista de colaboradores para ver o novo membro adicionado.
      setTimeout(() => router.push('/dashboard/colaboradores/remover'), 2000);
    }
  };

  // Para mostrar as iniciais dinamicamente
  const watchFullName = watch('full_name');
  const watchEmail = watch('email');

  return (
    <div className="relative">
      {/* Overlay de loading global */}
      {(isSubmitting || globalLoading) && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/80 rounded-3xl backdrop-blur-[2px] transition-all">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <svg className="animate-spin h-14 w-14 text-ecodigital-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
                <circle className="opacity-25" cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="6"></circle>
                <path className="opacity-75" fill="currentColor" d="M8 24a16 16 0 0132 0h-8a8 8 0 00-16 0H8z"></path>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-ecodigital-green/80 animate-pulse">
                ...
              </span>
            </div>
            <span className="text-ecodigital-green-dark text-lg font-semibold animate-pulse">
              Adicionando colaborador...
            </span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gradient-to-br from-ecodigital-green/10 via-white to-ecodigital-green/5 p-8 rounded-3xl shadow-2xl max-w-xl mx-auto space-y-8 border border-ecodigital-green/10"
        style={{ backdropFilter: "blur(2px)" }}
      >
        <div className="w-full flex flex-col items-center gap-2 border-b border-ecodigital-green/10 pb-8 mb-8">
          {/* AvatarUploader igual ao ProfileForm */}
          <div className="flex flex-col items-center w-full max-w-xs">
            <div className="relative group flex flex-col items-center w-full">
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploading}
                className="focus:outline-none"
                aria-label="Adicionar foto do colaborador"
              >
                <div className="w-32 h-32 rounded-full shadow-xl border-4 border-ecodigital-green bg-white flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:ring-4 group-hover:ring-ecodigital-green/30 group-hover:scale-105 relative">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt="Avatar" width={128} height={128} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-5xl font-extrabold text-ecodigital-green select-none">
                      {initials(watchFullName, watchEmail)}
                    </span>
                  )}
                  <div className="absolute inset-0 bg-ecodigital-green/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                    <svg className="w-8 h-8 text-white mb-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" /></svg>
                    <span className="text-white font-semibold text-sm">Adicionar foto</span>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full z-20">
                      <svg className="animate-spin h-8 w-8 text-ecodigital-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    </div>
                  )}
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={uploading}
                className="hidden"
              />
              <p className="text-xs text-gray-400 mt-2 text-center">
                Clique na foto para adicionar (PNG, JPG, GIF até 2MB)
              </p>
              {avatarError && <p className="text-xs text-red-500 mt-1 text-center">{avatarError}</p>}
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="flex justify-center">
            <span className="text-sm px-4 py-2 rounded-lg font-medium bg-ecodigital-green/10 text-ecodigital-green-dark">
              {successMsg}
            </span>
          </div>
        )}
        {errorMsg && (
          <div className="flex justify-center">
            <span className="text-sm px-4 py-2 rounded-lg font-medium bg-red-100 text-red-600">
              {errorMsg}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="full_name" className="text-ecodigital-green-dark font-semibold text-sm mb-1">
            Nome Completo
          </label>
          <input
            id="full_name"
            type="text"
            className={`border-2 rounded-xl px-4 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-ecodigital-green/60 ${
              errors.full_name ? "border-red-400 focus:ring-red-200" : "border-ecodigital-green/30"
            }`}
            placeholder="Digite o nome completo"
            autoComplete="off"
            {...register('full_name')}
            disabled={isSubmitting || globalLoading}
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-ecodigital-green-dark font-semibold text-sm mb-1">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className={`border-2 rounded-xl px-4 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-ecodigital-green/60 ${
              errors.email ? "border-red-400 focus:ring-red-200" : "border-ecodigital-green/30"
            }`}
            placeholder="email@exemplo.com"
            autoComplete="off"
            {...register('email')}
            disabled={isSubmitting || globalLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-ecodigital-green-dark font-semibold text-sm mb-1">
            Senha Provisória
          </label>
          <input
            id="password"
            type="password"
            className={`border-2 rounded-xl px-4 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-ecodigital-green/60 ${
              errors.password ? "border-red-400 focus:ring-red-200" : "border-ecodigital-green/30"
            }`}
            placeholder="Senha temporária para o colaborador"
            autoComplete="off"
            {...register('password')}
            disabled={isSubmitting || globalLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="text-ecodigital-green-dark font-semibold text-sm mb-1">
            Papel (Role)
          </label>
          <select
            id="role"
            {...register('role')}
            className="border-2 rounded-xl px-4 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-ecodigital-green/60 border-ecodigital-green/30"
            disabled={isSubmitting || globalLoading}
          >
            <option value="employee">Colaborador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting || globalLoading}
            className="w-full bg-gradient-to-r from-ecodigital-green via-ecodigital-green-dark to-ecodigital-green/80 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] hover:shadow-2xl transition-all duration-200 disabled:bg-ecodigital-gray disabled:cursor-not-allowed text-lg tracking-wide"
          >
            {isSubmitting || globalLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Adicionando...
              </span>
            ) : (
              "Adicionar Colaborador"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}