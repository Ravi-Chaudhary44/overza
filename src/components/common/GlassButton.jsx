import React from 'react';
import { Link } from 'react-router-dom';

const GlassButton = ({ 
  children, 
  onClick, 
  to, 
  type = 'button', 
  variant = 'primary',
  size = 'lg',
  className = '',
  icon: Icon = null,
  iconPosition = 'left',
  fullWidth = false,
  glow = false,                     
  glowColor = 'rgba(255,111,97,0.5)' 
}) => {
  const baseClasses = 'rounded-xl font-semibold flex items-center justify-center transition-all duration-300 transform hover:scale-105';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white shadow-lg border border-cyan-500/30',
    secondary: 'glass-card text-white border border-cyan-500/30 hover:border-cyan-500/60 hover:bg-white/10',
    outline: 'bg-transparent border-2 border-white/20 text-white hover:border-white/40 hover:bg-white/5',
    dark: 'glass-effect-dark text-white border border-slate-500/30 hover:border-slate-400/60',
  };

  // ✨ glow effect – uses CSS custom property for dynamic color
  const glowClass = glow ? 'hover:shadow-[0_0_15px_var(--glow-color)]' : '';
  const glowStyle = glow ? { '--glow-color': glowColor } : {};

  const widthClass = fullWidth ? 'w-full' : '';
  const iconMarginClass = iconPosition === 'left' ? 'mr-2' : 'ml-2';
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${glowClass} ${widthClass} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} style={glowStyle}>
        {Icon && iconPosition === 'left' && <Icon className={iconMarginClass} />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className={iconMarginClass} />}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} style={glowStyle}>
      {Icon && iconPosition === 'left' && <Icon className={iconMarginClass} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className={iconMarginClass} />}
    </button>
  );
};

export default GlassButton;
