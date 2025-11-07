"use client";

import Image from 'next/image';
import type { Profile } from '@/types';

type AvatarProps = {
  profile: Profile;
  onClick: () => void;
};

const Avatar: React.FC<AvatarProps> = ({ profile, onClick }) => {
  // Calcula as iniciais do usuário como fallback
  const initials = (profile?.full_name || "AD")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="w-10 h-10 rounded-full cursor-pointer flex items-center justify-center text-white font-bold select-none shadow-md overflow-hidden bg-ecodigital-green"
      onClick={onClick}
      tabIndex={0}
      aria-label="Abrir menu do usuário"
    >
      {profile?.avatar_url ? (
        // Se existir uma URL de avatar, exibe a imagem
        <Image
          src={profile.avatar_url}
          alt={`Foto de perfil de ${profile.full_name}`}
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      ) : (
        // Senão, exibe as iniciais
        initials
      )}
    </div>
  );
};

export default Avatar;