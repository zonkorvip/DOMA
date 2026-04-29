import { ReactNode } from 'react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "backdrop-blur-2xl bg-white/5 rounded-[32px] border border-white/10 shadow-2xl overflow-hidden",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
