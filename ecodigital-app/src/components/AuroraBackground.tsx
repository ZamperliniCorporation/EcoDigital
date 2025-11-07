// src/components/AuroraBackground.tsx
import React from 'react';
import { Canvas, Shader, Skia, LinearGradient, vec, Fill, useClock } from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';

const source = Skia.RuntimeEffect.Make(`
  uniform float4 colors[2];
  uniform float2 center;
  uniform float clock;
  
  float2 rotate(float2 p, float a) {
    float s = sin(a);
    float c = cos(a);
    return float2(p.x * c - p.y * s, p.x * s + p.y * c);
  }

  half4 main(float2 p) {
    float2 uv = p;
    uv -= center;
    uv = rotate(uv, clock / 4.0); // Rotação lenta
    uv += center;

    float d = distance(uv, center);
    d = d * (1.0 + 0.5 * sin(clock / 2.0)); // Efeito pulsante

    return mix(colors[0], colors[1], smoothstep(100, 600, d));
  }
`)!;

export const AuroraBackground = () => {
  const { width, height } = useWindowDimensions();
  const center = vec(width / 2, height / 3);
  const clock = useClock();

  const colors = ['#10B9811A', '#10B98105']; // Verde com baixa opacidade

  return (
    <Canvas style={{ position: 'absolute', width, height }}>
      <Fill>
        <Shader source={source} uniforms={{ center, clock, colors }} />
      </Fill>
    </Canvas>
  );
};