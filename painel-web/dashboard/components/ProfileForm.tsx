"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@/types';
import Image from "next/image";
import { useRouter } from "next/navigation";

// Esquema de validação para os dados do perfil
const profileSchema = z.object({
  full_name: z.string().min(3, { message: "O nome completo é obrigatório." }),
  description: z.string().max(200, { message: "A descrição deve ter no máximo 200 caracteres." }).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  // Busca os dados do usuário e do perfil ao carregar
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, description')
          .eq('id', user.id)
          .single();
        if (profile) {
          reset({ 
            full_name: profile.full_name || '', 
            description: profile.description || '' 
          });
          setAvatarUrl(profile.avatar_url || null);
        }
      }
      setIsLoading(false);
    };
    fetchUserData();
  }, [supabase, reset]);

  // Função para salvar as alterações de texto
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    setIsSubmitting(true);
    setFeedbackMessage(null);

    const { error } = await supabase
      .from('profiles')
      .update({ 
        full_name: data.full_name, 
        description: data.description || null,
      })
      .eq('id', user.id);

    if (error) {
      setFeedbackMessage("Erro ao atualizar o perfil. Tente novamente.");
    } else {
      setFeedbackMessage("Perfil atualizado com sucesso!");
      router.refresh();
    }
    setIsSubmitting(false);
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
      if (!user || !event.target.files || event.target.files.length === 0) {
        throw new Error('Selecione uma imagem para fazer upload.');
      }
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('A imagem deve ter no máximo 2MB.');
      }
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setFeedbackMessage("Foto de perfil atualizada com sucesso!");
      router.refresh();
    } catch (error: any) {
      setAvatarError(error?.message || "Erro ao fazer upload do avatar.");
    } finally {
      setUploading(false);
    }
  };

  // Gera as iniciais do usuário
  const initials = (user?.email?.split('@')[0] || "AD").slice(0, 2).toUpperCase();

  if (isLoading) {
    return (
      <div className="relative max-w-xl mx-auto min-h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50 rounded-3xl">
          <svg className="animate-spin h-12 w-12 text-ecodigital-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-gradient-to-br from-ecodigital-green/10 via-white to-ecodigital-green/5 p-8 rounded-3xl shadow-2xl max-w-xl mx-auto space-y-8 border border-ecodigital-green/10" style={{ backdropFilter: "blur(2px)" }}>
      {user && (
        <div className="w-full flex justify-center">
          <div className="flex flex-col items-center gap-2 border-b border-ecodigital-green/10 pb-8 mb-8 w-full max-w-xs">
            <div className="relative group flex flex-col items-center w-full">
              <button type="button" onClick={handleAvatarClick} disabled={uploading} className="focus:outline-none" aria-label="Trocar foto de perfil">
                <div className="w-32 h-32 rounded-full shadow-xl border-4 border-ecodigital-green bg-gray-200 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:ring-4 group-hover:ring-ecodigital-green/30 group-hover:scale-105 relative">
                  {avatarUrl ? (<Image src={avatarUrl} alt="Avatar" width={128} height={128} className="w-full h-full object-cover" />) : (<span className="text-5xl font-extrabold text-ecodigital-green select-none">{initials}</span>)}
                  <div className="absolute inset-0 bg-ecodigital-green/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity duration-300">
                    <svg className="w-8 h-8 text-white mb-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2a2.828 2.828 0 11-4-4 2.828 2.828 0 014 4z" /></svg>
                    <span className="text-white font-semibold text-sm">Trocar foto</span>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full">
                      <svg className="animate-spin h-8 w-8 text-ecodigital-green" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    </div>
                  )}
                </div>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} disabled={uploading} className="hidden" />
              <p className="text-xs text-gray-400 mt-2 text-center">Clique na foto para alterar (PNG, JPG, GIF até 2MB)</p>
              {avatarError && <p className="text-xs text-red-500 mt-1 text-center">{avatarError}</p>}
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-gray-500 font-semibold text-sm mb-1">Email</label>
        <input id="email" type="email" value={user?.email || ''} disabled className="border border-ecodigital-green/30 rounded-xl px-4 py-3 bg-gray-100 cursor-not-allowed text-gray-500 font-medium shadow-inner" />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="full_name" className="text-ecodigital-green-dark font-semibold text-sm mb-1">Nome Completo</label>
        <input id="full_name" type="text" className={`border-2 rounded-xl px-4 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-ecodigital-green/60 ${errors.full_name ? "border-red-400 focus:ring-red-200" : "border-ecodigital-green/30"}`} placeholder="Digite seu nome completo" autoComplete="off" {...register("full_name")} />
        {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-ecodigital-green-dark font-semibold text-sm mb-1">Descrição <span className="text-gray-400 font-normal">(opcional)</span></label>
        <textarea id="description" className={`border-2 rounded-xl px-4 py-3 font-medium transition focus:outline-none focus:ring-2 focus:ring-ecodigital-green/60 resize-none min-h-[64px] ${errors.description ? "border-red-400 focus:ring-red-200" : "border-ecodigital-green/30"}`} placeholder="Conte um pouco sobre você (até 200 caracteres)" maxLength={200} {...register("description")} />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>
      {feedbackMessage && (<div className="flex justify-center"><span className={`text-sm px-4 py-2 rounded-lg font-medium ${feedbackMessage.includes("sucesso") ? "bg-ecodigital-green/10 text-ecodigital-green-dark" : "bg-red-100 text-red-600"}`}>{feedbackMessage}</span></div>)}
      <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-ecodigital-green via-ecodigital-green-dark to-ecodigital-green/80 text-white font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] hover:shadow-2xl transition-all duration-200 disabled:bg-ecodigital-gray disabled:cursor-not-allowed text-lg tracking-wide">
        {isSubmitting ? (<span className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Salvando...</span>) : ("Salvar Alterações")}
      </button>
    </form>
  );
};

export default ProfileForm;