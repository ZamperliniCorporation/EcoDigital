import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Tipo para um único passo vindo do backend
export interface MissionStep {
  step_text: string;
}

interface MissionChecklistProps {
  steps: MissionStep[]; // Recebe um array de passos
}

// O "contrato" do nosso item: ele PRECISA de uma 'label' do tipo string
function ChecklistItem({ label }: { label: string }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <TouchableOpacity onPress={() => setIsChecked(!isChecked)} className="flex-row items-center mb-4">
      <Ionicons 
        name={isChecked ? 'checkbox' : 'square-outline'} 
        size={28} 
        color={isChecked ? '#10B981' : '#CBD5E1'} 
      />
      <Text className={`text-base ml-3 ${isChecked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export function MissionChecklist({ steps }: MissionChecklistProps) {
  if (!steps || steps.length === 0) {
    return (
      <View className="w-full px-4 mt-8">
        <Text className="text-gray-500 italic">Esta missão é direta e não possui passos detalhados.</Text>
      </View>
    );
  }

  return (
    <View className="w-full px-4 mt-8">
      {steps.map((step, index) => (
        // A linha corrigida: passamos a prop 'label' com o texto do passo
        <ChecklistItem key={index} label={step.step_text} />
      ))}
    </View>
  );
}