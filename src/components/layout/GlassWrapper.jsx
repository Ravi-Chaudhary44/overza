import React from 'react';

const GlassWrapper = ({ 
  children, 
  className = '', 
  variant = 'default',
  hoverEffect = true,
  glow = false,              
  rounded = '2xl',
  padding = 'p-8'
}) => {
  const getGlassClass = () => {
    switch(variant) {
      case 'dark':
        return 'glass-effect-dark';
      case 'card':
        return 'glass-card';
      case 'navbar':
        return 'glass-navbar';
      case 'cricket':
        return 'cricket-glass';
      case 'light':
        return 'glass-effect-light';
      default:
        return 'glass-effect';
    }
  };

  const hoverClass = hoverEffect ? 'glass-hover' : '';
 
  const glowClass = glow ? 'hover:shadow-[0_0_15px_rgba(255,111,97,0.5)]' : '';
  const roundedClass = `rounded-${rounded}`;

  return (
    <div className={`
      ${getGlassClass()} 
      ${hoverClass} 
      ${glowClass}
      ${roundedClass} 
      ${padding} 
      ${className} 
      transition-all duration-300
    `}>
      {children}
    </div>
  );
};

export default GlassWrapper;
