"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Importe o LoginForm usando dynamic() (SSR desativado)
const LoginForm = dynamic(() => import("./LoginForm"), { ssr: false });

// Importa as folhas caindo dinamicamente (SSR desativado)
const FallingLeaves = dynamic(() => import('./FallingLeaves'), { ssr: false });

const LoginLoadingScreen = dynamic(() => import("./LoginLoadingScreen"), { ssr: false });

const Typing = ({
  text,
  speed = 34,
  className = "",
  cursor = true,
  onDone,
  loop = true,
  delayBetween = 1150,
}: {
  text: string;
  speed?: number;
  className?: string;
  cursor?: boolean;
  onDone?: () => void;
  loop?: boolean;
  delayBetween?: number;
}) => {
  const [display, setDisplay] = useState("");
  const [curr, setCurr] = useState(0);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setDisplay("");
    setCurr(0);
    setDone(false);
  }, [text]);

  useEffect(() => {
    if (curr > text.length) {
      setDone(true);
      if (onDone) onDone();

      if (loop) {
        intervalRef.current = setTimeout(() => {
          setDisplay("");
          setCurr(0);
          setDone(false);
        }, delayBetween);
      }
      return;
    }
    if (curr <= text.length) {
      intervalRef.current = setTimeout(() => {
        setDisplay(text.slice(0, curr));
        setCurr(curr + 1);
      }, speed);
    }
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curr, text, speed, loop, delayBetween, onDone]);

  return (
    <span className={className}>
      {display}
      {!done && cursor && <span className="animate-pulse blink-cursor ml-0.5">|</span>}
    </span>
  );
};

// Banner motivacional COM efeito typing repetitivo e pausa entre ciclos
const MotivationalBanner = () => {
  const text = "Plante boas escolhas digitais hoje e colha um amanhã mais verde.";
  return (
    <div className="mt-8 flex justify-center w-full drop-shadow-xl">
      <div
        className="flex gap-2 items-center shadow-[0_4px_20px_-4px_#00b89429] border border-[#bfead6] rounded-2xl px-5 py-1.5 sm:py-2 font-medium text-white text-xs sm:text-sm backdrop-blur-[3.5px]"
        style={{
          background: "linear-gradient(99deg, #18b46d 0%, #188153 100%)"
        }}
      >
        <svg width="18" height="18" fill="none">
            <circle cx="9" cy="9" r="9" fill="#BFEAD6" />
            <path d="M6 11.2V7.5a1.2 1.2 0 0 1 2.4-1V7A2 2 0 0 1 15 7V11" stroke="#00B894" strokeWidth="1" />
            <circle cx="9" cy="12" r="1" fill="#00B894" />
        </svg>
        <Typing
          text={text}
          speed={23}
          className="whitespace-pre"
          loop={false}
          delayBetween={1500}
        />
      </div>
      <style jsx>{`
        .blink-cursor {
          display: inline-block;
          width: 1ch;
          color: #fff;
          font-weight: 600;
          opacity: 0.85;
          animation: blinkTypeCursor 1s steps(1) infinite;
          filter: drop-shadow(0 0 2px #30cd8f);
        }
        @keyframes blinkTypeCursor {
          0%, 48% { opacity: 1; }
          52%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

const WelcomeArea = () => {
  const titleText = "Bem-vindo(a) ao ";
  const ecoText = "EcoDigital";
  const subtitle =
    "Transforme atitudes digitais em impacto positivo.\nEntre para sua coleção sustentável!";
  return (
    <div className="flex flex-col items-center text-center w-full max-w-2xl px-6 animate-fade-up drop-shadow-lg">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3 text-[#00B894] drop-shadow-eco tracking-tight">
        <span className="whitespace-pre">{titleText}</span>
        <span className="text-ecodigital-green-dark">{ecoText}</span>
      </h1>
      <p className="text-base sm:text-lg lg:text-lg text-ecodigital-gray-dark font-medium opacity-95 max-w-lg tracking-wide min-h-[50px]">
        <span className="opacity-90 whitespace-pre-line">{subtitle}</span>
      </p>
    </div>
  );
};

const RotatingLogo = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full relative z-30 select-none mb-4 mt-4 sm:mt-8 drop-shadow-2xl">
      <div className="relative flex items-center justify-center w-[150px] h-[150px] sm:w-[180px] sm:h-[180px]">
        <span
          className="absolute inset-2 rounded-full border-2 border-[#00b894] border-t-transparent animate-spin-custom-clockwise"
        ></span>
        <span
          className="absolute inset-6 rounded-full border-2 border-[#00b89466] border-b-transparent animate-spin-custom-counter"
        ></span>
        <img
          src="/images/ecodigital-logo.png"
          alt="EcoDigital Logo"
          width={110}
          height={110}
          className="rounded-full border-4 border-white bg-white shadow-xl z-10"
          draggable={false}
          style={{ objectFit: "cover", pointerEvents: "none" }}
        />
      </div>
    </div>
  );
};

// StaticLogo agora exibe a foto de usuario de login (substitui logo anterior)
const StaticLogo = () => (
  <div className="w-full flex justify-center items-center mb-4 mt-2 z-30">
    <img
      src="/images/login-de-usuario.png"
      alt="Login de Usuário"
      width={48}
      height={48}
      className="block"
      draggable={false}
      style={{
        objectFit: "contain",
        pointerEvents: "none",
        width: 48,
        height: 48,
      }}
    />
  </div>
);

const FormPanel = ({ onLoginStart, onLoginSuccess, onLoginError }: {
  onLoginStart: () => void;
  onLoginSuccess: () => void;
  onLoginError: (error: string) => void;
}) => (
  <div className="w-full max-w-md bg-white/95 rounded-3xl shadow-2xl flex flex-col items-center px-8 py-8 border border-[#e3fbe9] relative mt-10 mb-10 animate-scale-fade">
    <StaticLogo />
    <div className="w-full flex flex-col gap-5 mt-2">
      <LoginForm 
        onLoginStart={onLoginStart}
        onLoginSuccess={onLoginSuccess}
        onLoginError={onLoginError}
      />
    </div>
    <div className="mt-8 w-full text-center text-xs text-ecodigital-gray/70 select-none">
      &copy; {new Date().getFullYear()} <span className="font-bold text-[#00b894]">EcoDigital</span> — Digital sustentável 🌿
    </div>
  </div>
);

// Componente de marcas d'água com a logo da EcoDigital, espalhadas e com opacidade baixa
const WatermarkBackground = () => {
  // Array proposital de posições e tamanhos levemente variados
  const watermarks = [
    { left: "12%", top: "9%", size: 108, rotate: -15, opacity: 0.13 },
    { left: "70%", top: "16%", size: 68, rotate: 8, opacity: 0.09 },
    { left: "22%", top: "56%", size: 74, rotate: -33, opacity: 0.11 },
    { left: "66%", top: "65%", size: 120, rotate: 12, opacity: 0.09 },
    { left: "40%", top: "80%", size: 78, rotate: 0, opacity: 0.08 },
    { left: "8%", top: "84%", size: 62, rotate: 18, opacity: 0.07 },
    { left: "80%", top: "87%", size: 86, rotate: -20, opacity: 0.1 },
    { left: "48%", top: "30%", size: 68, rotate: 22, opacity: 0.12 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 w-full h-full select-none z-0">
      {watermarks.map(({ left, top, size, rotate, opacity }, idx) => (
        <img
          key={idx}
          src="/images/ecodigital-logo.png"
          alt="Marca d'água EcoDigital"
          style={{
            position: "absolute",
            left,
            top,
            width: size,
            height: size,
            opacity,
            filter: "blur(0.4px)",
            transform: `rotate(${rotate}deg)`,
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 0,
          }}
          draggable={false}
        />
      ))}
    </div>
  );
};

const LoginScreen = () => {
  const router = useRouter();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loadingScreenKey, setLoadingScreenKey] = useState(0);

  const loginMessages = [
    "Verificando credenciais...",
    "Validando permissões...",
    "Preparando seu painel...",
    "Login bem-sucedido!",
  ];

  const handleLoginStart = () => {
    setLoginError(null);
    setIsLoginLoading(true);
    setLoadingScreenKey(prev => prev + 1);
  };

  const handleLoginSuccess = () => {
    // O loading screen já está ativo, o redirecionamento ocorrerá no onAnimationFinish
  };

  const handleLoginError = (error: string) => {
    setLoginError(error);
  };

  const handleLoadingAnimationFinish = () => {
    if (loginError) {
      // Se houve erro, apenas esconde a tela de loading
      setIsLoginLoading(false);
      setLoginError(null);
    } else {
      // Se foi sucesso, não faz nada. O redirecionamento é iniciado pelo LoginForm
      // e a tela de loading permanecerá visível até o dashboard carregar.
    }
  };

  // As folhas caem somente na coluna em branco (coluna esquerda, 7/12 = ~58%)
  return (
    <>
      {isLoginLoading && (
        <div className="fixed z-[200] inset-0 flex items-center justify-center bg-white pointer-events-auto">
          <LoginLoadingScreen
            key={loadingScreenKey}
            messages={
              loginError
                ? [...loginMessages.slice(0, 2), loginError]
                : loginMessages
            }
            onAnimationFinish={handleLoadingAnimationFinish}
          />
        </div>
      )}
      <div
        className={`flex flex-col lg:flex-row min-h-screen relative overflow-hidden selection:bg-[#C6FDE0] ${isLoginLoading ? 'animate-fade-out' : 'animate-fade-in'}`}
        style={{ background: "#fff" }}
      >
        {/* Marcas d'água da logo da EcoDigital no fundo branco */}
        <WatermarkBackground />
        {/* Folhas caindo apenas na coluna branca */}
        <div
          className="pointer-events-none absolute top-0 left-0 h-full z-50"
          style={{ width: "100%" }}
        >
          <div className="relative h-full w-full lg:absolute lg:top-0 lg:left-0 lg:h-full lg:w-[58.333333%]">
            <div
              className="absolute inset-0"
              style={{ background: "rgba(0,180,100,0.07)", pointerEvents: "none" }}
            />
            <FallingLeaves />
          </div>
        </div>
        {/* Coluna Esquerda centralizada */}
        <div className="relative w-full lg:w-7/12 flex items-center justify-center min-h-screen bg-white z-20">
          <div className="w-full flex flex-col items-center justify-center min-h-[550px] px-4 sm:px-8 md:px-12 pt-8 sm:pt-14 drop-shadow-2xl">
            <RotatingLogo />
            <WelcomeArea />
            <MotivationalBanner />
          </div>
        </div>
        {/* Coluna Direita (logo estatica em cima do formulário) - fundo verde degradê */}
        <div
          className="w-full lg:w-5/12 min-h-screen flex flex-col justify-center items-center relative z-30 overflow-y-auto"
          style={{ background: "linear-gradient(135deg, #047857 0%, #10B981 60%, #6EE7B7 100%)" }}
        >
          <FormPanel onLoginStart={handleLoginStart} onLoginSuccess={handleLoginSuccess} onLoginError={handleLoginError} />
        </div>
        <style jsx global>{`
          @keyframes spinClockwise { to { transform: rotate(360deg); } }
          @keyframes spinCounter { to { transform: rotate(-360deg); } }
          .animate-spin-custom-clockwise { animation: spinClockwise 2.2s linear infinite; }
          .animate-spin-custom-counter { animation: spinCounter 3.6s linear infinite; }
        `}</style>
      </div>
    </>
  );
};

export default LoginScreen;