"use client";

import PatentIcon from './PatentIcon';

type RankIconProps = {
  xp: number;
  size?: number;
  className?: string;
};

export default function RankIcon({ xp, size = 16, className = "" }: RankIconProps) {
  const getPatentData = () => {
    if (xp >= 1000) {
      return {
        library: 'lucide-react',
        name: 'trophy',
        color: '#f59e0b', // yellow-500
        rankName: 'Campeão'
      };
    } else if (xp >= 600) {
      return {
        library: 'lucide-react',
        name: 'medal',
        color: '#d97706', // yellow-600
        rankName: 'Especialista'
      };
    } else if (xp >= 300) {
      return {
        library: 'lucide-react',
        name: 'award',
        color: '#059669', // green-600
        rankName: 'Guardião'
      };
    } else if (xp >= 100) {
      return {
        library: 'lucide-react',
        name: 'star',
        color: '#3b82f6', // blue-500
        rankName: 'Iniciante'
      };
    } else {
      return {
        library: 'lucide-react',
        name: 'circle',
        color: '#6b7280', // gray-500
        rankName: 'Novato'
      };
    }
  };

  const patent = getPatentData();

  return (
    <div className="flex flex-col items-center justify-center">
      <PatentIcon
        library={patent.library}
        name={patent.name}
        size={size}
        color={patent.color}
        className={className}
      />
      <span 
        className="text-xs font-semibold mt-1 leading-tight"
        style={{ color: patent.color }}
      >
        {patent.rankName}
      </span>
    </div>
  );
}
