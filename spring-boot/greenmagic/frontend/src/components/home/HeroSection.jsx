import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ShoppingBag, 
  Star
} from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';
import AnimatedCounter from '../animations/AnimatedCounter';
import { 
  heroTextVariants, 
  heroImageVariants, 
  heroButtonVariants, 
  floatingVariants,
  staggerContainer,
  staggerFadeInUp
} from '../../utils/animationVariants';

const HeroSection = () => {
  return (
    <AnimatedSection 
      className="hero-section bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 lg:py-32 relative overflow-hidden"
      variants={staggerContainer}
      stagger={true}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='leaf-pattern' x='0' y='0' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='10' cy='10' r='1' fill='rgba(34,197,94,0.1)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23leaf-pattern)'/%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="space-y-8"
            variants={staggerFadeInUp}
          >
            {/* Main Headline */}
            <motion.div variants={staggerFadeInUp}>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight mb-6"
              >
                Pure{' '}
                <motion.span 
                  className="gradient-text bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  Organic
                </motion.span>
                <br />
                Products for a<br />
                <span className="text-primary-600">Healthier You</span>
              </motion.h1>
            </motion.div>

            {/* Description */}
            <motion.p 
              className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg"
              variants={staggerFadeInUp}
            >
              Discover our premium collection of organic, eco-friendly products 
              that nurture your body and protect our planet. Sustainable living 
              starts here.
            </motion.p>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={staggerFadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  to="/shop" 
                  className="btn-primary btn-lg inline-flex items-center justify-center space-x-2 group"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shop Now</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  to="/about"
                  className="btn-outline btn-lg"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>

            {/* Statistics */}
            <motion.div 
              className="grid grid-cols-3 gap-6 pt-8"
              variants={staggerContainer}
            >
              <motion.div 
                className="text-center"
                variants={staggerFadeInUp}
              >
                <AnimatedCounter 
                  target={5000}
                  suffix="+"
                  className="text-2xl font-bold text-primary-600"
                />
                <div className="text-sm text-gray-600">Happy Customers</div>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={staggerFadeInUp}
              >
                <AnimatedCounter 
                  target={100}
                  suffix="%"
                  className="text-2xl font-bold text-primary-600"
                />
                <div className="text-sm text-gray-600">Organic Products</div>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={staggerFadeInUp}
              >
                <AnimatedCounter 
                  target={50}
                  suffix="+"
                  className="text-2xl font-bold text-primary-600"
                />
                <div className="text-sm text-gray-600">Product Varieties</div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Right Content - Hero Image */}
          <motion.div 
            className="relative"
            variants={heroImageVariants}
          >
            <motion.div 
              className="hero-image-container relative"
              variants={floatingVariants}
              animate="animate"
            >
              <motion.img 
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop"
                alt="Organic products collection"
                className="rounded-2xl shadow-2xl w-full"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Floating Badge - Top Right */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-secondary-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
                whileHover={{ scale: 1.1 }}
              >
                🌱 100% Natural
              </motion.div>
              
              {/* Floating Rating - Bottom Left */}
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-full shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold">4.9/5 Rating</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div 
              className="absolute -z-10 -top-10 -right-10 w-20 h-20 bg-primary-200 rounded-full opacity-60"
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360] 
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
            <motion.div 
              className="absolute -z-10 -bottom-10 -left-10 w-16 h-16 bg-secondary-200 rounded-full opacity-60"
              animate={{ 
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0] 
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default HeroSection; 