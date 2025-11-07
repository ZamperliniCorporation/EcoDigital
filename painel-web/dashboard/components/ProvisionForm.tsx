"use client";

import { useState } from 'react';
import { useForm, FieldName } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// 1. Atualizamos o schema com os novos campos e validações
const provisionSchema = z.object({
  companyName: z.string().min(2, { message: "O nome da empresa é obrigatório." }),
  employeeCount: z.coerce.number().min(1, { message: "Deve ter no mínimo 1 colaborador." }),
  adminName: z.string().min(3, { message: "O nome do administrador é obrigatório." }),
  adminEmail: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  provisionalPassword: z.string().min(8, { message: "A senha provisória deve ter no mínimo 8 caracteres." }),
});

type ProvisionFormValues = z.infer<typeof provisionSchema>;

// Campos de cada etapa para validação parcial
const stepsFields: FieldName<ProvisionFormValues>[][] = [
  ['companyName', 'employeeCount'],
  ['adminName', 'adminEmail', 'provisionalPassword']
];

const ProvisionForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    trigger // Usaremos para validar cada etapa
  } = useForm<ProvisionFormValues>({
    resolver: zodResolver(provisionSchema) as any,
  });

  const handleNextStep = async () => {
    const fields = stepsFields[currentStep];
    const output = await trigger(fields, { shouldFocus: true });

    if (!output) return; // Se a validação falhar, não avança

    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async (data: ProvisionFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // A chamada para a API permanece a mesma, mas agora enviará mais dados
      const response = await fetch('/api/admin/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ocorreu uma falha ao criar a conta.');
      }

      setSuccess(`Conta para "${data.companyName}" provisionada com sucesso!`);
      reset();
      setCurrentStep(0); // Volta para a primeira etapa
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="w-full flex flex-col gap-4">
      {/* Indicador de Progresso */}
      <div className="w-full">
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-ecodigital-green-dark">Etapa {currentStep + 1} de 2</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-ecodigital-green h-2.5 rounded-full" style={{ width: `${(currentStep + 1) * 50}%`, transition: 'width 0.3s ease-in-out' }}></div>
        </div>
      </div>

      {success && <p className="text-green-600 text-sm text-center font-semibold bg-green-100 p-3 rounded-lg">{success}</p>}
      {error && <p className="text-red-500 text-sm text-center font-semibold bg-red-100 p-3 rounded-lg">{error}</p>}
      
      {/* Etapa 1: Informações da Empresa */}
      {currentStep === 0 && (
        <div className="animate-fade-in space-y-4">
          <div className="flex flex-col gap-1 text-left">
            <label htmlFor="companyName" className="text-ecodigital-green-dark font-semibold">Nome da Empresa</label>
            <input 
              id="companyName" 
              {...register("companyName")} 
              className="border border-ecodigital-green rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ecodigital-green"
              placeholder="Digite o nome da empresa"
            />
            {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <label htmlFor="employeeCount" className="text-ecodigital-green-dark font-semibold">Quantidade de Colaboradores</label>
            <input 
              id="employeeCount" 
              type="number" 
              {...register("employeeCount")} 
              className="border border-ecodigital-green rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ecodigital-green"
              placeholder="Número de colaboradores"
              min="1"
            />
            {errors.employeeCount && <p className="text-red-500 text-sm mt-1">{errors.employeeCount.message}</p>}
          </div>
        </div>
      )}

      {/* Etapa 2: Informações do Administrador */}
      {currentStep === 1 && (
        <div className="animate-fade-in space-y-4">
          <div className="flex flex-col gap-1 text-left">
            <label htmlFor="adminName" className="text-ecodigital-green-dark font-semibold">Nome do Admin</label>
            <input 
              id="adminName" 
              {...register("adminName")} 
              className="border border-ecodigital-green rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ecodigital-green"
              placeholder="Nome completo do administrador"
            />
            {errors.adminName && <p className="text-red-500 text-sm mt-1">{errors.adminName.message}</p>}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <label htmlFor="adminEmail" className="text-ecodigital-green-dark font-semibold">Email do Admin</label>
            <input 
              id="adminEmail" 
              type="email" 
              {...register("adminEmail")} 
              className="border border-ecodigital-green rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ecodigital-green"
              placeholder="admin@empresa.com"
            />
            {errors.adminEmail && <p className="text-red-500 text-sm mt-1">{errors.adminEmail.message}</p>}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <label htmlFor="provisionalPassword" className="text-ecodigital-green-dark font-semibold">Senha Provisória</label>
            <input 
              id="provisionalPassword" 
              type="password" 
              {...register("provisionalPassword")} 
              className="border border-ecodigital-green rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ecodigital-green"
              placeholder="Mínimo 8 caracteres"
            />
            {errors.provisionalPassword && <p className="text-red-500 text-sm mt-1">{errors.provisionalPassword.message}</p>}
          </div>
        </div>
      )}
      
      {/* Botões de Navegação */}
      <div className="mt-4 flex justify-between">
        {currentStep > 0 && (
          <button type="button" onClick={handlePrevStep} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
            Voltar
          </button>
        )}
        {currentStep < 1 && (
          <button type="button" onClick={handleNextStep} className="ml-auto bg-ecodigital-green text-white font-bold py-2 px-4 rounded-lg hover:bg-ecodigital-green-dark transition">
            Próximo
          </button>
        )}
        {currentStep === 1 && (
          <button type="submit" disabled={isLoading} className="ml-auto bg-ecodigital-green text-white font-bold py-2 px-4 rounded-lg hover:bg-ecodigital-green-dark transition disabled:bg-ecodigital-gray">
            {isLoading ? 'Provisionando...' : 'Provisionar Conta'}
          </button>
        )}
      </div>
    </form>
  );
};

export default ProvisionForm;
// Estilos genéricos para os inputs (adicione ao seu CSS global ou use classes do Tailwind)
// input {
//   border: 1px solid #00b894;
//   border-radius: 8px;
//   padding: 8px 16px;
//   outline: none;
// }
// input:focus {
//   ring: 2px;
//   ring-color: #00b894;
// }