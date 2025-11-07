// src/components/AnimatedGradientBackground.tsx (Versão Refinada)
import React from 'react';
import { View } from 'react-native';
import { Svg, Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { MotiView } from 'moti';

type MotiProps = React.ComponentProps<typeof MotiView>;

interface AnimatedBlobProps {
  color: string;
  from: MotiProps['from'];
  animate: MotiProps['animate'];
  transition: MotiProps['transition'];
}

const AnimatedBlob = ({ color, from, animate, transition }: AnimatedBlobProps) => (
  <MotiView
    from={from}
    animate={animate}
    transition={transition}
    style={{ position: 'absolute' }}
  >
    <Svg height="600" width="600">
      <Defs>
        <RadialGradient id="grad" cx="50%" cy="50%" rx="50%" ry="50%">
          {/* MUDANÇA DE DESIGN: Opacidade reduzida para um efeito mais sutil */}
          <Stop offset="0%" stopColor={color} stopOpacity="0.15" /> 
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Ellipse cx="300" cy="300" rx="300" ry="300" fill="url(#grad)" />
    </Svg>
  </MotiView>
);

export const AnimatedGradientBackground = () => {
  return (
    // CORREÇÃO DO BUG: Esticando o container para preencher 100% da tela
    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden' }}>
      <AnimatedBlob
        color="#10B981"
        from={{ translateX: -150, translateY: -150, scale: 1.1 }}
        animate={{ translateX: 0, translateY: -250, scale: 1.4 }}
        transition={{ loop: true, type: 'timing', duration: 20000, delay: 0 }}
      />
      <AnimatedBlob
        color="#10B981"
        // MUDANÇA DE DESIGN: Posição inicial e final ajustada para ser mais sutil
        from={{ translateX: 250, translateY: 300, scale: 1 }}
        animate={{ translateX: 100, translateY: 450, scale: 1.2 }}
        transition={{ loop: true, type: 'timing', duration: 22000, delay: 5000 }}
      />
    </View>
  );
};