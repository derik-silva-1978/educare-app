
import React from 'react';

export const TitibotAvatar: React.FC<{ size?: number }> = ({ size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="rounded-full bg-white p-[1px]"
    >
      {/* Background circles */}
      <circle cx="50" cy="50" r="48" fill="#9b87f5" />
      <circle cx="50" cy="50" r="44" fill="#ffffff" />
      
      {/* Robot face */}
      <g id="robot-face">
        {/* Robot head */}
        <rect x="25" y="22" width="50" height="45" rx="16" ry="16" fill="#7E69AB" />
        
        {/* Robot ears */}
        <rect x="17" y="38" width="8" height="20" rx="4" ry="4" fill="#9b87f5" />
        <rect x="75" y="38" width="8" height="20" rx="4" ry="4" fill="#9b87f5" />
        
        {/* Robot face plate */}
        <rect x="30" y="30" width="40" height="32" rx="12" ry="12" fill="#ffffff" />
        
        {/* Robot eyes */}
        <circle cx="40" cy="44" r="6" fill="#D6BCFA" />
        <circle cx="60" cy="44" r="6" fill="#D6BCFA" />
        <circle cx="40" cy="44" r="2" fill="#6E59A5" />
        <circle cx="60" cy="44" r="2" fill="#6E59A5" />
        
        {/* Robot mouth */}
        <path d="M42,54 Q50,60 58,54" stroke="#6E59A5" strokeWidth="2" fill="none" />
        
        {/* Robot antenna */}
        <rect x="46" y="14" width="8" height="8" rx="4" ry="4" fill="#9b87f5" />
        <rect x="48" y="6" width="4" height="8" rx="2" ry="2" fill="#9b87f5" />
        <circle cx="50" cy="6" r="3" fill="#D6BCFA" />
      </g>
      
      {/* Animated pulse effect */}
      <circle cx="50" cy="50" r="48" fill="none" stroke="#9b87f5" strokeWidth="2" opacity="0.5" className="pulse-ring" />
    </svg>
  );
};

export default TitibotAvatar;
