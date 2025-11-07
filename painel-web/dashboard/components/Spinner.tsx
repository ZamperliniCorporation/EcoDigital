
// app/components/Spinner.tsx
import React from 'react';

type SpinnerProps = {
  size?: number;
  className?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ size = 48, className = 'text-ecodigital-green' }) => {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <svg
      className={`animate-spin ${className}`}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Carregando"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V4a10 10 0 00-10 10h2zm0 0a8 8 0 008 8v-2a6 6 0 01-6-6H4z"
      ></path>
    </svg>
  );
};

export default Spinner;