import React from 'react';
import { Entypo, FontAwesome6, MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { IconLibrary } from '../constants/ranks';

interface PatentIconProps {
  library: IconLibrary;
  name: string;
  size: number;
  color: string;
}

export function PatentIcon({ library, name, size, color }: PatentIconProps) {
  switch (library) {
    case 'Entypo':
      return <Entypo name={name as any} size={size} color={color} />;
    case 'FontAwesome6':
      return <FontAwesome6 name={name as any} size={size} color={color} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
    case 'MaterialIcons':
      return <MaterialIcons name={name as any} size={size} color={color} />;
    case 'FontAwesome':
      return <FontAwesome name={name as any} size={size} color={color} />;
    default:
      return null;
  }
}