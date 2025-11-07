// app/components/PageLoader.tsx
import React from 'react';
import Spinner from './Spinner';

type PageLoaderProps = {
  message?: string;
  containerClassName?: string;
  overlayClassName?: string;
};

const PageLoader: React.FC<PageLoaderProps> = ({
  message,
  containerClassName = 'absolute inset-0 z-30',
  overlayClassName = 'flex flex-col items-center justify-center h-full w-full bg-white/80 backdrop-blur-[2px] rounded-3xl'
}) => {
  return (
    <div className={containerClassName}>
      <div className={overlayClassName}>
        <Spinner size={48} />
        {message && (
          <span className="text-ecodigital-green-dark text-lg font-semibold mt-4 animate-pulse">
            {message}
          </span>
        )}
      </div>
    </div>
  );
};

export default PageLoader;