// Caminho: app/colaboradores/loading.tsx

// Este componente será renderizado instantaneamente pelo Next.js
// enquanto o page.tsx busca os dados (como o ID da empresa).

const SkeletonItem = () => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md animate-pulse">
        <div className="flex items-center">
            {/* Esqueleto do Avatar */}
            <div className="mr-4 w-10 h-10 rounded-full bg-gray-300"></div>
            <div>
                {/* Esqueleto do Nome */}
                <div className="h-4 bg-gray-300 rounded w-40 mb-1"></div>
                {/* Esqueleto do Papel */}
                <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
        </div>
        <div className="flex items-center gap-2">
            {/* Esqueleto do Botão Editar */}
            <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
            {/* Esqueleto do Botão Deletar */}
            <div className="w-7 h-7 bg-gray-300 rounded-full"></div>
        </div>
    </div>
);

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
          <h2 className="text-xl font-bold text-gray-800">Carregando Colaboradores...</h2>
          {/* Esqueleto da barra de pesquisa */}
          <div className="relative w-full md:w-72 h-10 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        
        {/* Renderiza 5 itens de esqueleto */}
        <div className="space-y-4">
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
            <SkeletonItem />
        </div>
      </div>
    </div>
  );
}