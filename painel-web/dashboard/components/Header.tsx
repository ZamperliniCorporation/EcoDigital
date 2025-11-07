"use client";

import Image from "next/image";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { User, Profile } from '@/types';
import React, { useState, useRef, useEffect } from "react";
import Link from 'next/link';
import Avatar from "./Avatar"; 

type HeaderProps = {
  user: User;
  profile: Profile;
  onLogoClick: () => void;
};

const Header: React.FC<HeaderProps> = ({ user, profile, onLogoClick }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [modalOpen, setModalOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setModalOpen(false);
    await supabase.auth.signOut();
    router.refresh();
  };

  // Fecha o modal ao clicar fora
  useEffect(() => {
    if (!modalOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalOpen]);
  
  const handleSettings = () => {
    setModalOpen(false);
    router.push("/dashboard/configuracoes"); // Exemplo de rota
  };

  return (
    <>
      <header className="relative bg-white/90 backdrop-blur-md shadow-lg px-6 md:px-12 py-0.5 flex justify-between items-center border-b-2 border-ecodigital-green/80 min-h-[72px]">
        <button
          onMouseEnter={onLogoClick}
          className="cursor-pointer flex-shrink-0 focus:outline-none transition-transform hover:scale-105"
          aria-label="Ir para o início"
        >
          <Image
            src="/images/EcoDigital-Logo.png"
            alt="EcoDigital Logo"
            width={320}
            height={88}
            priority
            className="h-24 w-auto object-contain select-none"
          />
        </button>
        <div className="flex items-center gap-3 md:gap-6">
          <span className="text-right hidden md:block">
            <p className="font-semibold text-gray-800 text-base leading-tight">{profile?.full_name || 'Administrador'}</p>
            <p className="text-xs text-gray-500 leading-tight">{user.email}</p>
          </span>
          <div ref={avatarRef}>
            <Avatar
              profile={profile}
              onClick={() => setModalOpen((open) => !open)}
            />
          </div>
        </div>
      </header>

      {/* Modal de perfil */}
      {modalOpen && (
        <div className="fixed top-6 right-4 md:right-12 z-50 animate-fade-in">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-ecodigital-green/10 w-72 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex flex-col gap-0.5">
              <p className="font-semibold text-gray-800 truncate text-base">{profile?.full_name || 'Administrador'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <Link
              href="/dashboard/perfil"
              onClick={() => setModalOpen(false)}
              className="w-full block text-left px-6 py-3 text-gray-700 hover:bg-ecodigital-green/10 font-medium transition-colors border-b border-gray-100 focus:outline-none"
            >
              Perfil
            </Link>
            <button
              onClick={handleSettings}
              className="w-full text-left px-6 py-3 text-gray-700 hover:bg-ecodigital-green/10 font-medium transition-colors border-b border-gray-100 focus:outline-none"
            >
              Configurações
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-6 py-4 text-red-600 hover:bg-red-50 font-medium transition-colors focus:outline-none"
            >
              Sair
            </button>
          </div>
        </div>
      )}

    </>
  );
};

export default Header;