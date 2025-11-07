"use client";

import ProfileForm from "@/components/ProfileForm";
import FallingLeaves from "@/components/FallingLeaves";

const PerfilPage = () => {
  return (
    <div className="animate-fade-in relative min-h-screen flex flex-col items-center justify-start py-8">
      {/* Chuva de folhas para profundidade */}
      <FallingLeaves />

      <div className="relative z-10 w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800">Seu Perfil</h1>
        <p className="text-gray-500 mt-1 mb-8">
          Gerencie suas informações pessoais e configurações de segurança.
        </p>

        <div className="max-w-2xl w-full bg-white p-4 rounded-xl shadow-lg backdrop-blur-md bg-opacity-90">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;