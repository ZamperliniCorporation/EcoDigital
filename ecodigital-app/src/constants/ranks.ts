// Define os nomes das bibliotecas que vamos usar
export type IconLibrary = 'Entypo' | 'FontAwesome6' | 'MaterialCommunityIcons' | 'MaterialIcons' | 'FontAwesome';

export const PATENTS = [
  { 
    name: 'Lenda EcoDigital', 
    minXp: 1000, 
    iconLibrary: 'Entypo',
    iconName: 'trophy',
  },
  { 
    name: 'Arquiteto Sustentável', 
    minXp: 600, 
    iconLibrary: 'MaterialIcons',
    iconName: 'precision-manufacturing',
  },
  { 
    name: 'Mestre da Limpeza', 
    minXp: 300, 
    iconLibrary: 'FontAwesome6',
    iconName: 'broom',
  },
  { 
    name: 'Guardião Verde', 
    minXp: 100, 
    iconLibrary: 'MaterialCommunityIcons',
    iconName: 'shield-crown',
  },
  { 
    name: 'Iniciante Digital', 
    minXp: 0, 
    iconLibrary: 'FontAwesome',
    iconName: 'pagelines',
  },
] as const;

export type Patent = typeof PATENTS[number];

export function getPatentForXp(xp: number): Patent {
  return PATENTS.find(p => xp >= p.minXp) || PATENTS[PATENTS.length - 1];
}