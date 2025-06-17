import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Leaf, 
  Phone,
  ArrowRight,
  Wheat,
  GraduationCap,
  Award,
  TrendingUp,
  Users2
} from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';
import { 
  staggerContainer,
  staggerFadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn
} from '../../utils/animationVariants';

// Import local images
import featuredImage1 from '../../assets/images/home-page/featured-section/harvesting-featured-section-1.webp';
import featuredImage2 from '../../assets/images/home-page/featured-section/harvesting-featured-section-2.webp';
import grilIsPickingTomato from '../../assets/images/home-page/featured-section/7213177.jpg';
import markusSpiske from '../../assets/images/home-page/featured-section/markus-spiske-EK8QN9O0wRk-unsplash.webp';

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.3 });

  const features = [
    {
      icon: Wheat,
      title: 'Growing Organic Fruits',
      subtitle: 'and Vegetables',
      description: 'Premium organic produce sourced directly from certified sustainable farms',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      icon: GraduationCap,
      title: 'Agribusiness Training',
      subtitle: 'and Workshops',
      description: 'Comprehensive education and training programs for sustainable farming',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100'
    }
  ];

  const achievements = [
    'Pioneering Excellence in the Agriculture Market',
    'Revolutionizing Agriculture for a Sustainable Future', 
    'Driving Growth and Innovation in Agriculture'
  ];

  return (
    <AnimatedSection 
      className="py-16 sm:py-20 lg:py-32 bg-gray-50"
      variants={staggerContainer}
      stagger={true}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 xl:gap-24 items-center">
          
          {/* Left Side - Images */}
          <motion.div 
            className="relative order-2 lg:order-1 mb-16 lg:mb-0 pl-4 sm:pl-8"
            variants={fadeInLeft}
          >
            {/* Main Farmer Image */}
            <motion.div 
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              variants={scaleIn}
              whileHover={{ scale: 1.02 }}
            >
              <img 
                src={grilIsPickingTomato}
                alt="Experienced farmer in organic field"
                className="w-full h-[350px] sm:h-[400px] lg:h-[500px] xl:h-[550px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </motion.div>

            {/* Bottom Secondary Image */}
            <motion.div 
              className="absolute bottom-4 left-0 w-36 sm:w-48 h-24 sm:h-32 rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 20, x: -10 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <img 
                src={markusSpiske}
                alt="Modern agricultural machinery"
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* 100% Organic Badge */}
            <motion.div 
              className="absolute bottom-8 left-4 w-14 sm:w-16 h-14 sm:h-16 bg-green-600 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg z-10"
              initial={{ opacity: 0, scale: 0, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
            >
              <Leaf className="w-3 sm:w-4 h-3 sm:h-4 mb-0.5" />
              <div className="text-xs font-bold leading-tight text-center">
                <div>100%</div>
                <div className="text-xs">Organic</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div 
            className="order-1 lg:order-2 space-y-4 sm:space-y-5 lg:space-y-6 text-left"
            variants={fadeInRight}
          >
            {/* Section Heading */}
            <motion.div variants={staggerFadeInUp} className="space-y-2 text-left">
              <motion.div 
                className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-3"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
              >
                <Award className="w-3 h-3" />
                <span>30 Years Of Agriculture Experience</span>
              </motion.div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight overflow-hidden text-left">
                {/* First Line - Harvesting Innovation */}
                <motion.span 
                  className="block"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.4, duration: 0.1 }}
                >
                  {"Harvesting Innovation".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      className="inline-block"
                      initial={{ 
                        opacity: 0, 
                        y: 50,
                        rotateX: -90
                      }}
                      animate={isInView ? { 
                        opacity: 1, 
                        y: 0,
                        rotateX: 0
                      } : {
                        opacity: 0, 
                        y: 50,
                        rotateX: -90
                      }}
                      transition={{
                        delay: isInView ? 0.5 + index * 0.05 : 0,
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        type: "spring",
                        stiffness: 100
                      }}
                      style={{
                        transformOrigin: "50% 50%"
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </motion.span>
                
                {/* Second Line - For Better Tomorrow! */}
                <motion.span 
                  className="block"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 1.4, duration: 0.1 }}
                >
                  {"For Better ".split("").map((char, index) => (
                    <motion.span
                      key={index}
                      className="inline-block"
                      initial={{ 
                        opacity: 0, 
                        y: 50,
                        rotateX: -90
                      }}
                      animate={isInView ? { 
                        opacity: 1, 
                        y: 0,
                        rotateX: 0
                      } : {
                        opacity: 0, 
                        y: 50,
                        rotateX: -90
                      }}
                      transition={{
                        delay: isInView ? 1.5 + index * 0.05 : 0,
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        type: "spring",
                        stiffness: 100
                      }}
                      style={{
                        transformOrigin: "50% 50%"
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                  
                  {/* Tomorrow with special styling */}
                  <span className="relative inline-block">
                    {"Tomorrow".split("").map((char, index) => (
                      <motion.span
                        key={index}
                        className="inline-block"
                        initial={{ 
                          opacity: 0, 
                          y: 50,
                          rotateX: -90,
                          scale: 0.8
                        }}
                        animate={isInView ? { 
                          opacity: 1, 
                          y: 0,
                          rotateX: 0,
                          scale: 1
                        } : {
                          opacity: 0, 
                          y: 50,
                          rotateX: -90,
                          scale: 0.8
                        }}
                        transition={{
                          delay: isInView ? 2.0 + index * 0.08 : 0,
                          duration: 0.8,
                          ease: [0.25, 0.46, 0.45, 0.94],
                          type: "spring",
                          stiffness: 120
                        }}
                        whileHover={{
                          y: -2,
                          transition: { duration: 0.2 }
                        }}
                        style={{
                          transformOrigin: "50% 50%"
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                    
                    {/* Exclamation mark */}
                    <motion.span 
                      className="text-orange-500 inline-block"
                      initial={{ 
                        opacity: 0, 
                        scale: 0,
                        rotate: -180
                      }}
                      animate={isInView ? { 
                        opacity: 1, 
                        scale: 1,
                        rotate: 0
                      } : {
                        opacity: 0, 
                        scale: 0,
                        rotate: -180
                      }}
                      transition={{
                        delay: isInView ? 2.8 : 0,
                        duration: 0.8,
                        type: "spring",
                        stiffness: 200
                      }}
                      whileHover={{
                        scale: 1.2,
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.4 }
                      }}
                    >
                      !
                    </motion.span>
                    
                    {/* Stylish wavy underline */}
                    <motion.div
                      className="absolute -bottom-1 left-0 w-full h-2"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                      transition={{ delay: isInView ? 3.2 : 0, duration: 1.2 }}
                    >
                      <svg
                        viewBox="0 0 100 8"
                        className="w-full h-full"
                        preserveAspectRatio="none"
                      >
                        <motion.path
                          d="M0,4 Q25,0 50,4 T100,4"
                          stroke="#FCD34D"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                          transition={{ delay: isInView ? 3.2 : 0, duration: 1.5, ease: "easeInOut" }}
                        />
                        <motion.path
                          d="M0,6 Q25,2 50,6 T100,6"
                          stroke="#F59E0B"
                          strokeWidth="2"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                          transition={{ delay: isInView ? 3.5 : 0, duration: 1.2, ease: "easeInOut" }}
                        />
                      </svg>
                    </motion.div>
                  </span>
                </motion.span>
              </h2>
            </motion.div>

            {/* Description */}
            <motion.p 
              className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl text-left"
              variants={staggerFadeInUp}
            >
              Agriculture is the backbone of our society, providing food, materials, and economic stability. As the world population grows, the need for sustainable farming practices has never been more critical.
            </motion.p>

            {/* Feature Items */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              variants={staggerContainer}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 group text-left"
                  variants={staggerFadeInUp}
                  whileHover={{ x: 5 }}
                >
                  <div className={`w-8 h-8 ${feature.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <feature.icon className={`w-4 h-4 ${feature.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="font-semibold text-gray-900 text-sm text-left">
                      {feature.title}
                    </h3>
                    <p className="text-xs font-medium text-gray-700 text-left">
                      {feature.subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Achievement Points */}
            <motion.div 
              className="space-y-2 text-left"
              variants={staggerContainer}
            >
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 group text-left"
                  variants={staggerFadeInUp}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full group-hover:scale-150 transition-transform duration-300 flex-shrink-0" />
                  <span className="text-gray-700 font-medium text-sm text-left">{achievement}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Section */}
            <motion.div 
              className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 text-left"
              variants={staggerFadeInUp}
            >
              {/* More About Us Button */}
              <motion.button 
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center justify-start sm:justify-center gap-2 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>More About Us</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Phone Contact */}
              <div className="flex items-center gap-2 w-full sm:w-auto text-left">
                <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-sm font-bold text-gray-900 text-left">(704) 555-0127</div>
                  <div className="text-xs text-gray-600 text-left">Call For Booking</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default FeaturesSection; 