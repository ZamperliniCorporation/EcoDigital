"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import FallingLeaves from './FallingLeaves';

type LoadingScreenProps = {
  onAnimationFinish: () => void;
  messages: string[];
};

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onAnimationFinish, messages }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Tempo de carregamento rápido, igual antes
  const totalLoadingTime = 3200;
  const entranceAnimationDuration = 400;

  useEffect(() => {
    const entranceTimer = setTimeout(() => setHasAnimatedIn(true), 50);
    const progressTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        setProgress(100);
      });
    }, entranceAnimationDuration);

    // Mensagem troca rapidamente, dependendo do número de mensagens, 
    // mas nunca menos que 550ms (para visualização não ficar cortada).
    const messageChangeInterval = Math.max(
      550,
      Math.floor((totalLoadingTime - entranceAnimationDuration) / messages.length)
    );
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= messages.length - 1) {
          clearInterval(messageInterval);
        }
        return Math.min(nextIndex, messages.length - 1);
      });
    }, messageChangeInterval);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      const unmountTimer = setTimeout(() => {
        setIsVisible(false);
        onAnimationFinish();
      }, entranceAnimationDuration);
      return () => clearTimeout(unmountTimer);
    }, totalLoadingTime);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(progressTimer);
      clearTimeout(exitTimer);
      clearInterval(messageInterval);
    };
  }, [onAnimationFinish, messages.length]);

  if (!isVisible) return null;

  const progressAnimationDuration = totalLoadingTime - entranceAnimationDuration;
  const isLastMessage = currentMessageIndex === messages.length - 1;

  // Remove fixed/inset/z-50 para não sobrepor o restante da página, e aplica bg incondicionalmente
  return (
    <div className={`w-full h-screen min-h-screen bg-white flex justify-center items-center transition-opacity duration-300 ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Chuva de folhas */}
      <FallingLeaves />
      <div className="relative z-10 flex flex-col items-center">
        <div className={`transition-opacity duration-200 ${hasAnimatedIn ? 'opacity-100' : 'opacity-0'} ${isExiting ? 'animate-fade-big-out-right' : hasAnimatedIn ? 'animate-fade-big-in-left' : ''}`}>
          <Image src="/images/EcoDigital-Logo.png" alt="EcoDigital Logo" width={150} height={50} priority />
        </div>
        <div className={`w-48 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden transition-opacity duration-200 ${hasAnimatedIn ? 'opacity-100' : 'opacity-0'} ${ isExiting ? 'animate-fade-big-out-right' : hasAnimatedIn ? 'animate-fade-big-in-left' : '' }`}>
          <div
            className="h-full bg-green-500 rounded-full transition-all ease-linear"
            style={{ 
              width: `${progress}%`,
              transitionDuration: `${progressAnimationDuration}ms`,
            }}
          ></div>
        </div>
        <div key={currentMessageIndex} className="text-center mt-4 animate-fade-in-up">
          <p className={`transition-colors duration-200 ${isLastMessage ? 'text-ecodigital-green-dark font-semibold' : 'text-ecodigital-gray'}`}>
            {messages[currentMessageIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;