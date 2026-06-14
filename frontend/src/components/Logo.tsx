import React from 'react';

export const Logo = ({ variant = 'dark', className = 'h-10' }) => {
  // Variant can be 'dark' (gold on green/black) or 'light' (gold on off-white)
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Premium Monogram Icon */}
      <svg
        className="w-9 h-9"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Elegant Octagon/Diamond */}
        <path
          d="M50 5L95 27.5V72.5L50 95L5 72.5V27.5L50 5Z"
          stroke="url(#goldGrad)"
          strokeWidth="3.5"
          fill="rgba(15, 46, 22, 0.2)"
        />
        {/* Inner Diamond */}
        <path
          d="M50 15L85 32.5V67.5L50 85L15 67.5V32.5L50 15Z"
          stroke="url(#goldGrad)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        {/* Typographic Monogram 'R' */}
        <text
          x="50"
          y="62"
          textAnchor="middle"
          fill="url(#goldGrad)"
          fontFamily="'Playfair Display', serif"
          fontWeight="700"
          fontSize="38"
          letterSpacing="-0.5"
        >
          R
        </text>
        {/* Small gold crown dots above R */}
        <circle cx="50" cy="27" r="2.5" fill="url(#goldGrad)" />
        <circle cx="42" cy="29" r="2" fill="url(#goldGrad)" />
        <circle cx="58" cy="29" r="2" fill="url(#goldGrad)" />

        {/* Linear Gold Gradient Definition */}
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="100" y2="100">
            <stop offset="0%" stopColor="#F3E7C4" />
            <stop offset="50%" stopColor="#C8A96B" />
            <stop offset="100%" stopColor="#A37F3D" />
          </linearGradient>
        </defs>
      </svg>

      {/* Brand Words */}
      <div className="flex flex-col">
        <span 
          className="font-outfit text-[17px] font-bold tracking-[0.22em] uppercase leading-none"
          style={{
            background: 'linear-gradient(135deg, #F3E7C4 0%, #C8A96B 50%, #A37F3D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Rustik
        </span>
        <span 
          className={`font-sans text-[9px] font-medium tracking-[0.4em] uppercase mt-1 leading-none ${
            variant === 'dark' ? 'text-stone-400' : 'text-stone-600'
          }`}
        >
          Salon
        </span>
      </div>
    </div>
  );
};

export default Logo;
