import React from 'react';
import { motion } from 'framer-motion';
import ScrollProgressBar from '../components/animations/ScrollProgressBar';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CategoriesSection from '../components/home/CategoriesSection';
import ScrollingStripe from '../components/home/ScrollingStripe';
import FeaturedProductsSection from '../components/home/FeaturedProductsSection';
import CallToActionSection from '../components/home/CallToActionSection';
import { pageTransition } from '../utils/animationVariants';

const Home = () => {
  return (
    <motion.div 
      className="home"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      {/* Scroll Progress Indicator */}
      <ScrollProgressBar />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* Categories Section */}
      <CategoriesSection />
      
      {/* Scrolling Stripe */}
      <ScrollingStripe />
      
      {/* Featured Products Section */}
      <FeaturedProductsSection />
      
      {/* Call to Action Section */}
      <CallToActionSection />
    </motion.div>
  );
};

export default Home; 