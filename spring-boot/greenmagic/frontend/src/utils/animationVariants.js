/**
 * Professional Animation Variants for Framer Motion
 * Consistent, reusable animation definitions
 */

// =============================================================================
// FADE ANIMATIONS
// =============================================================================

export const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth easing
    },
  },
};

export const fadeInDown = {
  hidden: {
    opacity: 0,
    y: -60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeInLeft = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const fadeInRight = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// =============================================================================
// SCALE ANIMATIONS
// =============================================================================

export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.175, 0.885, 0.32, 1.275], // Back easing
    },
  },
};

export const scaleInRotate = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotate: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.7,
      ease: [0.175, 0.885, 0.32, 1.275],
    },
  },
};

// =============================================================================
// HOVER ANIMATIONS
// =============================================================================

export const hoverScale = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.95,
  },
};

export const hoverLift = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const hoverGlow = {
  rest: {
    boxShadow: "0 0 0 0 rgba(34, 197, 94, 0)",
    transition: {
      duration: 0.3,
    },
  },
  hover: {
    boxShadow: "0 0 20px 5px rgba(34, 197, 94, 0.3)",
    transition: {
      duration: 0.3,
    },
  },
};

// =============================================================================
// STAGGER ANIMATIONS
// =============================================================================

export const staggerContainer = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

export const staggerFadeInUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// =============================================================================
// HERO ANIMATIONS
// =============================================================================

export const heroTextVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.2,
    },
  },
};

export const heroImageVariants = {
  hidden: {
    opacity: 0,
    scale: 1.1,
    rotate: -2,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.5,
    },
  },
};

export const heroButtonVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.8,
    },
  },
};

// =============================================================================
// FLOATING ANIMATIONS
// =============================================================================

export const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [-1, 1, -1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// =============================================================================
// PAGE TRANSITIONS
// =============================================================================

export const pageTransition = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// =============================================================================
// COUNTER ANIMATIONS
// =============================================================================

export const counterVariants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.175, 0.885, 0.32, 1.275],
    },
  },
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate stagger delay for array items
 * @param {number} index - Item index
 * @param {number} baseDelay - Base delay in seconds
 * @param {number} staggerDelay - Stagger delay in seconds
 * @returns {number} Total delay
 */
export const getStaggerDelay = (index, baseDelay = 0, staggerDelay = 0.1) => {
  return baseDelay + (index * staggerDelay);
};

/**
 * Create custom stagger variants
 * @param {number} staggerDelay - Delay between items
 * @param {number} duration - Animation duration
 * @returns {object} Stagger variants
 */
export const createStaggerVariants = (staggerDelay = 0.1, duration = 0.6) => ({
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.2,
    },
  },
  item: {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  },
});

/**
 * Responsive animation variants based on screen size
 * @param {boolean} isMobile - Is mobile device
 * @returns {object} Responsive variants
 */
export const getResponsiveVariants = (isMobile) => ({
  hidden: {
    opacity: 0,
    y: isMobile ? 30 : 60,
    scale: isMobile ? 0.95 : 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: isMobile ? 0.4 : 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}); 