import Image from "next/image";
import BackgroundPattern from "@/components/BackgroundPattern"; // Ajuste o caminho se necessário
import ProvisionForm from "@/components/ProvisionForm"; // Ajuste o caminho se necessário

const ProvisionAccountPage = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen animate-fade-in">

      {/* Coluna da Esquerda (60%) - Mensagem para a equipe de Vendas */}
      <div 
        className="relative w-full lg:w-3/5 flex items-center justify-center p-8 sm:p-16 min-h-screen overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 0% 50%, rgba(0, 184, 148, 0.18), transparent 60%)',
          backgroundColor: '#F3FDF9'
        }}
      >
        <BackgroundPattern />

        <div className="w-full max-w-2xl text-left z-10 animate-fade-in-up">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-ecodigital-green-dark mb-4 drop-shadow-sm">
            Empoderando novos parceiros, <br className="hidden sm:block" /> um cliente de cada vez.
          </h1>
          <p className="text-lg lg:text-xl text-ecodigital-gray-dark max-w-xl font-medium">
            Use esta ferramenta para criar a conta de administrador para nossos novos clientes e iniciar sua jornada na sustentabilidade digital.
          </p>
        </div>
      </div>

      {/* Coluna da Direita (40%) - Formulário de Provisionamento */}
      <div className="w-full lg:w-2/5 p-8 sm:p-12 flex flex-col justify-center items-center bg-ecodigital-gradient">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl flex flex-col items-center p-8">
          <Image src="/images/EcoDigital-Logo.png" alt="EcoDigital Logo" width={180} height={60} className="mb-4" />
          <ProvisionForm />
        </div>
      </div>
    </div>
  );
};

export default ProvisionAccountPage;