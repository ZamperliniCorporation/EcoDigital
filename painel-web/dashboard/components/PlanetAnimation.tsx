"use client";

import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import planetAnimationData from "@/assets/lottie/Globe.json";

const PlanetAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto cursor-pointer flex items-center justify-center min-h-[340px]">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center w-full h-full py-0">
          <div className="w-10 h-10 border-4 border-ecodigital-green border-t-transparent rounded-full animate-spin mb-0.5" />
          <span className="text-ecodigital-green text-base">Carregando animação...</span>
        </div>
      ) : (
        <div className="w-[360px] h-[360px] md:w-[480px] md:h-[480px] flex items-center justify-center">
          <Lottie
            animationData={planetAnimationData}
            loop={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default PlanetAnimation;