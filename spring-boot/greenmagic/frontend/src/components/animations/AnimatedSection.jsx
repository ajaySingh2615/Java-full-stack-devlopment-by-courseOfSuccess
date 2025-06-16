import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation, useReducedMotion } from '../../hooks/useScrollAnimation';
import { fadeInUp, staggerContainer } from '../../utils/animationVariants';

/**
 * AnimatedSection - Reusable component for scroll-triggered animations
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Content to animate
 * @param {object} props.variants - Animation variants (optional)
 * @param {string} props.className - CSS classes
 * @param {object} props.options - Intersection Observer options
 * @param {boolean} props.stagger - Enable stagger animation for children
 * @param {number} props.delay - Animation delay
 * @param {string} props.as - HTML element type (default: 'section')
 */
const AnimatedSection = ({
  children,
  variants = fadeInUp,
  className = '',
  options = {},
  stagger = false,
  delay = 0,
  as = 'section',
  ...props
}) => {
  const [ref, isVisible] = useScrollAnimation({
    threshold: 0.1,
    triggerOnce: true,
    ...options,
  });
  
  const prefersReducedMotion = useReducedMotion();
  const MotionComponent = motion[as];
  
  // Use appropriate variants based on stagger prop
  const animationVariants = stagger ? staggerContainer : variants;
  
  // Add delay to variants if specified
  const delayedVariants = delay > 0 ? {
    ...animationVariants,
    visible: {
      ...animationVariants.visible,
      transition: {
        ...animationVariants.visible.transition,
        delay: delay,
      },
    },
  } : animationVariants;

  return (
    <MotionComponent
      ref={ref}
      initial={prefersReducedMotion ? 'visible' : 'hidden'}
      animate={isVisible ? 'visible' : 'hidden'}
      variants={delayedVariants}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export default AnimatedSection; 