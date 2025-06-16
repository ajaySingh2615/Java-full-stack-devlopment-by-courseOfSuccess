import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling } from '@fortawesome/free-solid-svg-icons';

const ScrollingStripe = () => {
  const stripeItems = [
    'Eco-Friendly Packaging',
    'Precision Agriculture', 
    'Greenhouse Farming',
    'Sustainable Farming',
    'Organic Certification',
    'Smart Irrigation',
    'Crop Monitoring',
    'Soil Health',
    'Carbon Neutral',
    'Water Conservation'
  ];

  // Font Awesome Seedling Icon
  const WheatIcon = () => (
    <FontAwesomeIcon icon={faSeedling} className="text-yellow-400 text-xl" />
  );

  // Create duplicated items for seamless scrolling
  const duplicatedItems = [...stripeItems, ...stripeItems];

  return (
    <div className="relative bg-green-600 py-3 overflow-hidden -mt-4 mb-16">
      {/* Animated scrolling container */}
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{
          x: [0, -100 * stripeItems.length]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
        style={{
          width: `${200 * stripeItems.length}%`
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div key={index} className="flex items-center mx-8">
            <span className="text-white font-semibold text-lg mr-6">
              {item}
            </span>
            <WheatIcon />
          </div>
        ))}
      </motion.div>

      {/* Gradient overlays for smooth edges */}
      <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-green-600 to-transparent pointer-events-none z-10"></div>
      <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-green-600 to-transparent pointer-events-none z-10"></div>
    </div>
  );
};

export default ScrollingStripe; 