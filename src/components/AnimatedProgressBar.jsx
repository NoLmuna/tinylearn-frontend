import { motion } from 'framer-motion';

export default function AnimatedProgressBar({ 
  progress, 
  color = 'blue',
  showLabel = true,
  height = 'h-4',
  className = ''
}) {
  const ProgressBar = motion.div;

  return (
    <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${height} ${className}`}>
      <ProgressBar
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          delay: 0.2
        }}
        className={`h-full bg-${color}-500 rounded-full relative`}
      >
        {showLabel && (
          <span className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
            {progress}%
          </span>
        )}
      </ProgressBar>
    </div>
  );
}
