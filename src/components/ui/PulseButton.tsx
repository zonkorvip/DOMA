import { cn } from '@/src/lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

interface PulseButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export function PulseButton({ 
  children, 
  className, 
  variant = 'primary', 
  ...props 
}: PulseButtonProps) {
  const variants = {
    primary: "from-[#8A2BE2] to-[#00F2FE] hover:shadow-[#8A2BE2]/30",
    secondary: "from-[#FFB302] to-[#FF6321] hover:shadow-[#FFB302]/30",
    danger: "from-[#FF416C] to-[#FF4B2B] hover:shadow-[#FF416C]/30",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative py-3 px-6 bg-gradient-to-r rounded-lg font-bold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...(props as any)}
    >
      <span className="relative z-10">{children as React.ReactNode}</span>
      <motion.div
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-lg bg-white/20 select-none pointer-events-none"
      />
    </motion.button>
  );
}
