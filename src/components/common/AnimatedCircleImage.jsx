import { motion } from "framer-motion";
import { useState } from "react";

export default function AnimatedCircleImage({
  src,
  alt = "Profile image",
  size = 40,
  borderWidth = 2,
  colors = ["#22c55e", "#b806d4"],
  rotationDuration = 4,
  className = "",
  imageClassName = "",
  showGlow = false,
  intensity = 0.4,
  hoverEffect = true,
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const glowStyle = showGlow ? {
    filter: `blur(${borderWidth * 3}px)`,
    opacity: intensity * (isHovered ? 0.6 : 0.3),
    background: `radial-gradient(circle at center, ${colors[0]}20, ${colors[1]}20)`
  } : {};

  return (
    <div
      style={{ 
        width: size, 
        height: size,
        animation: isHovered && hoverEffect ? 'pulse 2s ease-in-out infinite' : 'none'
      }}
      className={`relative flex items-center justify-center ${className}`}
      onMouseEnter={() => hoverEffect && setIsHovered(true)}
      onMouseLeave={() => hoverEffect && setIsHovered(false)}
      {...props}
    >
      {showGlow && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={glowStyle}
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
        />
      )}

      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            from 0deg, 
            ${colors[0]}, 
            ${colors[1]}, 
            ${colors[0]}, 
            ${colors[1]}, 
            ${colors[0]}
          )`,
          padding: `${borderWidth}px`,
          boxShadow: showGlow ? `0 0 ${borderWidth * 2}px ${colors[0]}40` : 'none'
        }}
        animate={{ 
          rotate: 360,
          scale: isHovered ? 1.03 : 1
        }}
        transition={{
          repeat: Infinity,
          duration: rotationDuration,
          ease: "linear"
        }}
        aria-hidden="true"
      />

      <div 
        className="absolute inset-0 rounded-full"
        style={{
          padding: `${borderWidth - 1}px`,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 1
        }}
        aria-hidden="true"
      />

      <motion.div 
        className="relative rounded-full overflow-hidden flex items-center justify-center bg-white"
        style={{
          width: `calc(100% - ${borderWidth * 2}px)`,
          height: `calc(100% - ${borderWidth * 2}px)`,
          boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.7), inset 0 -1px 2px rgba(0, 0, 0, 0.1)'
        }}
        animate={{
          scale: isHovered ? 0.98 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${imageClassName}`}
          style={{
            borderRadius: '50%'
          }}
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `data:image/svg+xml,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="#22c55e"/>
                <circle cx="50" cy="50" r="42" fill="white"/>
                <text x="50" y="58" font-family="Arial" font-size="28" fill="#111827" text-anchor="middle" font-weight="bold">${alt.charAt(0)}</text>
              </svg>
            `)}`;
          }}
        />
      </motion.div>
      
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}
