"use client";

import { useState, useMemo } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import LoginScreen from "@/components/LoginScreen";

// A lógica de mensagens e shuffle permanece a mesma
const LOGIN_LOADING_MESSAGES = [
  "Carregando informações...",
  "Validando credênciais...",
  "Preparando seu ambiente...",
  "Otimizando para um futuro mais verde..."
];

function shuffleMessages(messages: string[]): string[] {
  const lastMessage = messages[messages.length - 1];
  const messagesToShuffle = messages.slice(0, messages.length - 1);

  for (let i = messagesToShuffle.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [messagesToShuffle[i], messagesToShuffle[j]] = [messagesToShuffle[j], messagesToShuffle[i]];
  }

  return [...messagesToShuffle, lastMessage];
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  const shuffledMessages = useMemo(() => shuffleMessages(LOGIN_LOADING_MESSAGES), []);

  const handleAnimationFinish = () => {
    setIsLoading(false);
  };

  return (
    <main>
      {isLoading ? (
        <LoadingScreen 
          onAnimationFinish={handleAnimationFinish} 
          messages={shuffledMessages} 
        />
      ) : (
        // ATUALIZADO: Renderiza o componente LoginScreen
        <LoginScreen />
      )}
    </main>
  );
}