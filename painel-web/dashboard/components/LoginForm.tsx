"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect, useRef } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSearchParams, useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onLoginStart: () => void;
  onLoginSuccess: () => void;
  onLoginError: (error: string) => void;
};

const LoginForm = ({ onLoginStart, onLoginSuccess, onLoginError }: LoginFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'access_denied') {
      setError('Acesso negado. Você não tem permissão para acessar esta página.');
    }
  }, [searchParams]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    setError(null);
    onLoginStart();

    try {
      // 1. Autentica o usuário
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        onLoginError("Credenciais inválidas. Por favor, tente novamente.");
        setIsSubmitting(false);
        return;
      }

      if (authData.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError || !profile) {
          await supabase.auth.signOut();
          onLoginError("Não foi possível verificar seu perfil de usuário. Contate o suporte.");
          setIsSubmitting(false);
          return;
        }

        if (profile.role === 'admin') {
          onLoginSuccess();
          router.replace('/dashboard'); // Inicia o redirecionamento aqui
          setIsSubmitting(false);
        } else {
          await supabase.auth.signOut();
          onLoginError("Você não tem permissão de administrador para acessar este painel.");
          setIsSubmitting(false);
        }
      }
    } catch (e) {
      onLoginError("Ocorreu um erro inesperado. Tente novamente.");
      setIsSubmitting(false);
    }
  };

  return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1 text-left">
          <label htmlFor="email" className="text-ecodigital-green-dark font-semibold">Email</label>
          <input id="email" type="email" placeholder="seu@email.com" {...register("email")} className="border border-ecodigital-green rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ecodigital-green" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-1 text-left">
          <label htmlFor="password" className="text-ecodigital-green-dark font-semibold">Senha</label>
          <input id="password" type="password" placeholder="Sua senha" {...register("password")} className="border border-ecodigital-green rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ecodigital-green" />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        {error && <p className="text-red-500 text-sm text-center font-semibold bg-red-100 p-3 rounded-lg">{error}</p>}
        <button type="submit" disabled={isSubmitting} className="w-full bg-ecodigital-green text-white font-bold py-3 rounded-lg hover:bg-ecodigital-green-dark transition disabled:bg-ecodigital-gray">
          {isSubmitting ? "Verificando..." : "Entrar"}
        </button>
      </form>
  );
};

export default LoginForm;
