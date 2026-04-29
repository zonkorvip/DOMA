import { motion, useAnimation } from 'motion/react';
import { useEffect } from 'react';

export function SlotCounter({ value }: { value: number | string }) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: { duration: 0.3, times: [0, 0.5, 1] }
    });
  }, [value, controls]);

  return (
    <motion.span animate={controls} className="inline-block font-mono">
      {value}
    </motion.span>
  );
}
