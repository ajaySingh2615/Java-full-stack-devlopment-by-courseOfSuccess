import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation, useReducedMotion } from '../../hooks/useScrollAnimation';
import { counterVariants } from '../../utils/animationVariants';

/**
 * AnimatedCounter - Counts up to target value with smooth animation
 * @param {object} props - Component props
 * @param {number} props.target - Target number to count to
 * @param {number} props.duration - Animation duration in seconds
 * @param {string} props.suffix - Text to append after number (e.g., '+', '%')
 * @param {string} props.className - CSS classes
 * @param {function} props.formatter - Custom number formatter
 */
const AnimatedCounter = ({
  target,
  duration = 2,
  suffix = '',
  className = '',
  formatter = (num) => Math.floor(num).toLocaleString(),
}) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [ref, isVisible] = useScrollAnimation({
    threshold: 0.5,
    triggerOnce: true,
  });
  
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (isVisible && !hasStarted) {
      setHasStarted(true);
      
      if (prefersReducedMotion) {
        setCount(target);
        return;
      }

      const startTime = Date.now();
      const endTime = startTime + (duration * 1000);

      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (endTime - startTime), 1);
        
        // Ease out cubic function for smooth deceleration
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentCount = easeOutCubic * target;
        
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(target);
        }
      };

      requestAnimationFrame(updateCount);
    }
  }, [isVisible, hasStarted, target, duration, prefersReducedMotion]);

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? 'visible' : 'hidden'}
      animate={isVisible ? 'visible' : 'hidden'}
      variants={counterVariants}
      className={className}
    >
      <span className="tabular-nums font-bold">
        {formatter(count)}{suffix}
      </span>
    </motion.div>
  );
};

export default AnimatedCounter; 