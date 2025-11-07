// app/components/FallingLeaves.tsx

"use client";

import { useState, useEffect } from "react";

// Caminho da folha
const LEAF_IMG = "/images/folha.png";

// Gera folhas com propriedades de animação realistas
const createLeaves = (count: number) => {
  return Array.from({ length: count }).map((_, i) => {
    // Duração da queda
    const fallDuration = 10 + Math.random() * 10; // 10s a 20s
    // Delay para espalhar as folhas no tempo
    const animationDelay = -Math.random() * fallDuration;
    // Posição horizontal inicial
    const left = Math.random() * 100;
    // Oscilação lateral (amplitude)
    const sway = 30 + Math.random() * 40; // px
    // Rotação inicial e direção
    const rotateStart = Math.random() * 360;
    const rotateDir = Math.random() > 0.5 ? 1 : -1;
    // Flip horizontal aleatório
    const flip = Math.random() > 0.5 ? "scaleX(-1)" : "scaleX(1)";
    // Opacidade para profundidade
    const opacity = 0.7 + Math.random() * 0.3;

    // Tamanho menor da folha
    const leafSize = 20 + Math.random() * 12; // 20px a 32px

    // Custom properties para a animação CSS
    const style: React.CSSProperties & { [key: string]: any } = {
      left: `${left}vw`,
      width: `${leafSize}px`,
      height: `${leafSize}px`,
      opacity,
      "--fall-duration": `${fallDuration}s`,
      "--animation-delay": `${animationDelay}s`,
      "--sway": `${sway}px`,
      "--rotate-start": `${rotateStart}deg`,
      "--rotate-dir": rotateDir,
      "--flip": flip,
    };

    return (
      <img
        key={i}
        src={LEAF_IMG}
        alt="Folha caindo"
        className="falling-leaf"
        style={style}
        draggable={false}
      />
    );
  });
};

const FallingLeaves = () => {
  const [leaves, setLeaves] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    setLeaves(createLeaves(25));
  }, []);

  return (
    <>
      <style jsx global>{`
        .falling-leaf {
          position: absolute;
          top: -10vh;
          pointer-events: none;
          will-change: transform;
          z-index: 0;
          animation: leaf-fall var(--fall-duration) linear var(--animation-delay) infinite;
          transform: var(--flip) rotate(var(--rotate-start));
        }
        @keyframes leaf-fall {
          0% {
            transform:
              var(--flip)
              translateY(0)
              translateX(0)
              rotate(var(--rotate-start));
            opacity: 0.8;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform:
              var(--flip)
              translateY(200vh)
              translateX(calc(
                var(--sway) * var(--rotate-dir)
              ))
              rotate(calc(var(--rotate-start) + 360deg * var(--rotate-dir)));
            opacity: 0.7;
          }
        }
      `}</style>
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {leaves}
      </div>
    </>
  );
};

export default FallingLeaves;