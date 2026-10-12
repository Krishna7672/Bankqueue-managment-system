import React from 'react';

export const SbiLogo = ({ className = "w-10 h-10", variant = "color" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="State Bank of India Logo"
    >
      {/* SBI Keyhole Emblem */}
      {/* Outer Circle */}
      <circle 
        cx="50" 
        cy="50" 
        r="48" 
        fill={variant === "white" ? "#FFFFFF" : "#00B5EF"} 
      />
      
      {/* Inner Central Keyhole Opening */}
      <circle 
        cx="50" 
        cy="40" 
        r="14" 
        fill={variant === "white" ? "#292075" : "#FFFFFF"} 
      />
      
      {/* Vertical Keyhole Slit extending to bottom */}
      <rect 
        x="45" 
        y="40" 
        width="10" 
        height="42" 
        fill={variant === "white" ? "#292075" : "#FFFFFF"} 
      />
    </svg>
  );
};

export default SbiLogo;
