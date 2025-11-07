"use client";

import { 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  Circle,
  Crown,
  Shield,
  Zap
} from 'lucide-react';

type PatentIconProps = {
  library: string;
  name: string;
  size?: number;
  color?: string;
  className?: string;
};

export default function PatentIcon({ 
  library, 
  name, 
  size = 16, 
  color = "#059669", 
  className = "" 
}: PatentIconProps) {
  const getIcon = () => {
    // Mapeamento baseado nas bibliotecas comuns
    if (library === 'lucide' || library === 'lucide-react') {
      switch (name) {
        case 'trophy':
          return <Trophy size={size} color={color} className={className} />;
        case 'medal':
          return <Medal size={size} color={color} className={className} />;
        case 'award':
          return <Award size={size} color={color} className={className} />;
        case 'star':
          return <Star size={size} color={color} className={className} />;
        case 'crown':
          return <Crown size={size} color={color} className={className} />;
        case 'shield':
          return <Shield size={size} color={color} className={className} />;
        case 'zap':
          return <Zap size={size} color={color} className={className} />;
        default:
          return <Circle size={size} color={color} className={className} />;
      }
    }
    
    // Fallback para outras bibliotecas
    return <Circle size={size} color={color} className={className} />;
  };

  return getIcon();
}








