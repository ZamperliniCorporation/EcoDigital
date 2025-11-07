const BackgroundPattern = () => (
    <div className="absolute top-0 left-0 h-full w-4/5 md:w-1/2 pointer-events-none" aria-hidden="true">
      <svg 
        className="absolute inset-0 w-full h-full"
        width="100%"
        height="100%"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="text-ecodigital-green/50 opacity-10">
          <path d="M-400 400 Q-200 800 0 400 T400 400 T800 400 T1200 400" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M-400 450 Q-200 850 0 450 T400 450 T800 450 T1200 450" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M-400 500 Q-200 900 0 500 T400 500 T800 500 T1200 500" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M-400 550 Q-200 950 0 550 T400 550 T800 550 T1200 550" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M-400 600 Q-200 1000 0 600 T400 600 T800 600 T1200 600" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M-400 350 Q-200 750 0 350 T400 350 T800 350 T1200 350" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M-400 300 Q-200 700 0 300 T400 300 T800 300 T1200 300" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M-400 250 Q-200 650 0 250 T400 250 T800 250 T1200 250" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M-400 200 Q-200 600 0 200 T400 200 T800 200 T1200 200" stroke="currentColor" strokeWidth="2" fill="none" />
        </g>
      </svg>
    </div>
  );
  
  export default BackgroundPattern;