import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ScrollProgressBar - Professional scroll progress indicator
 * @param {object} props - Component props
 * @param {string} props.className - CSS classes
 * @param {string} props.color - Progress bar color
 * @param {number} props.height - Progress bar height in pixels
 * @param {string} props.position - Position (top, bottom)
 */
const ScrollProgressBar = ({
  className = '',
  color = '#22c55e',
  height = 3,
  position = 'top',
}) => {
  const { scrollYProgress } = useScroll();
  
  // Transform scroll progress to percentage
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  const progressBarStyles = {
    position: 'fixed',
    [position]: 0,
    left: 0,
    right: 0,
    height: `${height}px`,
    backgroundColor: color,
    transformOrigin: '0%',
    zIndex: 50,
  };

  return (
    <motion.div
      className={`scroll-progress-bar ${className}`}
      style={{
        ...progressBarStyles,
        scaleX,
      }}
    />
  );
};

/**
 * CircularScrollProgress - Circular scroll progress indicator
 * @param {object} props - Component props
 * @param {number} props.size - Circle size in pixels
 * @param {number} props.strokeWidth - Stroke width
 * @param {string} props.color - Progress color
 * @param {string} props.backgroundColor - Background color
 * @param {string} props.className - CSS classes
 */
export const CircularScrollProgress = ({
  size = 60,
  strokeWidth = 4,
  color = '#22c55e',
  backgroundColor = '#e5e7eb',
  className = '',
}) => {
  const { scrollYProgress } = useScroll();
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const strokeDasharray = useTransform(
    scrollYProgress,
    [0, 1],
    [0, circumference]
  );

  return (
    <div className={`fixed bottom-8 right-8 z-50 ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: useTransform(
              strokeDasharray,
              (value) => circumference - value
            ),
          }}
        />
      </svg>
      
      {/* Percentage text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]),
        }}
      >
        <motion.span>
          {useTransform(scrollYProgress, (value) => Math.round(value * 100))}%
        </motion.span>
      </motion.div>
    </div>
  );
};

export default ScrollProgressBar; 