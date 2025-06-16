import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';
import AnimatedCounter from '../animations/AnimatedCounter';
import { 
  staggerContainer,
  staggerFadeInUp,
  pulseVariants,
  floatingVariants
} from '../../utils/animationVariants';

const CallToActionSection = () => {
  return (
    <AnimatedSection 
      className="section relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-20 lg:py-32 overflow-hidden"
      variants={staggerContainer}
      stagger={true}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3Cpattern id='cta-pattern' x='0' y='0' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='20' cy='20' r='2' fill='white' opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23cta-pattern)'/%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-20 h-20 bg-secondary-400/20 rounded-full"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div 
        className="absolute top-32 right-32 w-12 h-12 bg-accent-400/15 rounded-full"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="text-center lg:text-left"
            variants={staggerFadeInUp}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6"
              variants={staggerFadeInUp}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Join the Green Revolution</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight"
              variants={staggerFadeInUp}
            >
              Start Your{' '}
              <motion.span 
                className="relative"
                animate={{ 
                  textShadow: [
                    '0 0 0px rgba(255, 255, 255, 0)',
                    '0 0 20px rgba(255, 255, 255, 0.5)',
                    '0 0 0px rgba(255, 255, 255, 0)'
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatDelay: 2 
                }}
              >
                Organic
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-secondary-400 to-accent-400 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
              </motion.span>
              <br />
              Journey Today
            </motion.h2>

            {/* Description */}
            <motion.p 
              className="text-xl text-primary-100 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0"
              variants={staggerFadeInUp}
            >
              Transform your lifestyle with our premium organic products. 
              Join thousands of satisfied customers who've made the switch to healthier living.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={staggerFadeInUp}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/shop" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-semibold rounded-full hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl group"
                >
                  <span>Shop Now</span>
                  <motion.div
                    className="ml-2"
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
              >
                <Link 
                  to="/about"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary-700 transition-all duration-300"
                >
                  Learn More
                </Link>
              </motion.div>
            </motion.div>

            {/* Statistics */}
            <motion.div 
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20"
              variants={staggerContainer}
            >
              <motion.div 
                className="text-center"
                variants={staggerFadeInUp}
              >
                <AnimatedCounter 
                  target={10000}
                  suffix="+"
                  className="text-2xl md:text-3xl font-bold text-white"
                />
                <div className="text-primary-200 text-sm">Happy Customers</div>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={staggerFadeInUp}
              >
                <AnimatedCounter 
                  target={500}
                  suffix="+"
                  className="text-2xl md:text-3xl font-bold text-white"
                />
                <div className="text-primary-200 text-sm">Products Sold</div>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={staggerFadeInUp}
              >
                <AnimatedCounter 
                  target={99}
                  suffix="%"
                  className="text-2xl md:text-3xl font-bold text-white"
                />
                <div className="text-primary-200 text-sm">Satisfaction Rate</div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Right Content - Visual Elements */}
          <motion.div 
            className="relative"
            variants={staggerFadeInUp}
          >
            <motion.div 
              className="relative mx-auto max-w-md"
              variants={floatingVariants}
              animate="animate"
            >
              {/* Main Circle */}
              <motion.div 
                className="w-80 h-80 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20 flex items-center justify-center relative"
                variants={pulseVariants}
                animate="animate"
              >
                {/* Inner Content */}
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Heart className="w-16 h-16 text-white mb-4 mx-auto" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">100% Natural</h3>
                  <p className="text-primary-200">Certified Organic</p>
                </motion.div>

                {/* Orbiting Elements */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-secondary-400 rounded-full"></div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-accent-400 rounded-full"></div>
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-primary-300 rounded-full"></div>
                </motion.div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div 
                className="absolute -top-8 -left-8 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                initial={{ opacity: 0, x: -50, y: -50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-white text-sm font-medium">🌱 Eco-Friendly</div>
              </motion.div>

              <motion.div 
                className="absolute -bottom-8 -right-8 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                initial={{ opacity: 0, x: 50, y: 50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-white text-sm font-medium">✨ Premium Quality</div>
              </motion.div>

              <motion.div 
                className="absolute top-16 -right-16 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
                initial={{ opacity: 0, x: 50, y: -30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-white text-sm font-medium">🚚 Free Shipping</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default CallToActionSection; 