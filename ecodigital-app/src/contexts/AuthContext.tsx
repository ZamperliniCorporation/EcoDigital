import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../api/supabaseClient';
import { Alert } from 'react-native';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  xp_points: number;
}

interface AuthContextData {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  initializing: boolean;
  signOut: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Função única para buscar o perfil do usuário
  const refreshUserProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      setProfile(null);
    }
  }, [user]);

  useEffect(() => {
    async function getInitialSession() {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setInitializing(false);
    }
    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        // O perfil será buscado pelo useEffect abaixo
      } else {
        setProfile(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Sempre que o usuário mudar, buscar o perfil
  useEffect(() => {
    if (user) {
      refreshUserProfile();
    } else {
      setProfile(null);
    }
  }, [user, refreshUserProfile]);

  async function signIn(email: string, password: string) {
    setInitializing(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert('Erro ao entrar', error.message);
      setInitializing(false);
      return;
    }
    setSession(data.session);
    setUser(data.user ?? null);
    setInitializing(false);
  }

  function signOut() {
    supabase.auth.signOut().then(() => {
      setSession(null);
      setUser(null);
      setProfile(null);
    });
  }

  const value: AuthContextData = {
    session,
    user,
    profile,
    initializing,
    signIn,
    signOut,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}