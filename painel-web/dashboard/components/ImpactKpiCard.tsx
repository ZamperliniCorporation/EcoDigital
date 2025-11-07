// app/dashboard/components/ImpactKpiCard.tsx
import React from 'react';

interface ImpactKpiCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode; // Permite passar um ícone SVG
}

export default function ImpactKpiCard({ title, value, icon }: ImpactKpiCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className="bg-green-100 p-3 rounded-full mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}