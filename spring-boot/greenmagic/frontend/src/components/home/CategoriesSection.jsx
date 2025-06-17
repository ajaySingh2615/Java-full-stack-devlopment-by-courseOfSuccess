import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Award } from 'lucide-react';
import { FaArrowRight } from 'react-icons/fa';
import AnimatedSection from '../animations/AnimatedSection';
import { 
  staggerContainer,
  staggerFadeInUp,
  hoverScale,
  scaleIn
} from '../../utils/animationVariants';

// Import local images
import ecohouseFarming from '../../assets/images/home-page/Farming-Projects/sustainable-farming.jpg';
import agroxForestry from '../../assets/images/home-page/Farming-Projects/organic-farming.jpg';
import farmSustainability from '../../assets/images/home-page/Farming-Projects/eco-farming.jpg';
import organicFarming from '../../assets/images/home-page/Farming-Projects/gabriel-jimenez-jin4W1HqgL4-unsplash.webp';
import greenFarming from '../../assets/images/home-page/Farming-Projects/markus-spiske-4yK8iDaWnm8-unsplash.webp';
import smartAgriculture from '../../assets/images/home-page/Farming-Projects/andrew-benjack-_4ugH7TiGjA-unsplash.webp';
import precisionFarming from '../../assets/images/home-page/Farming-Projects/markus-spiske-EK8QN9O0wRk-unsplash.webp';
import biodynamicFarming from '../../assets/images/home-page/Farming-Projects/fernanda-martinez-AZYWS6p7cX0-unsplash.webp';
import verticalFarming from '../../assets/images/home-page/Farming-Projects/being-organic-in-eu-t_vZtiUraqI-unsplash.webp';
import hydroponicFarming from '../../assets/images/home-page/Farming-Projects/mor-shani-wFlOM6Dxuc8-unsplash.webp';

const CategoriesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const farmingProjects = [
    {
      id: 1,
      title: 'Ecohouse Farming',
      category: 'Farming',
      image: ecohouseFarming,
      description: 'Reliable Solutions for Agricultural Farming. Agriculture is the backbone of our economy.',
    },
    {
      id: 2,
      title: 'Agrox Forestry',
      category: 'Agriculture',
      image: agroxForestry,
      description: 'Reliable Solutions for Agricultural Farming. Agriculture is the backbone of our economy.',
    },
    {
      id: 3,
      title: 'Farm Sustainability',
      category: 'Farming',
      image: farmSustainability,
      description: 'Reliable Solutions for Agricultural Farming. Agriculture is the backbone of our economy.',
    },
    {
      id: 4,
      title: 'Organic Farming',
      category: 'Fertilizers',
      image: organicFarming,
      description: 'Reliable Solutions for Agricultural Farming. Agriculture is the backbone of our economy.',
    },
    {
      id: 5,
      title: 'Green Farming',
      category: 'Farming',
      image: greenFarming,
      description: 'Reliable Solutions for Agricultural Farming. Agriculture is the backbone of our economy.',
    },
    {
      id: 6,
      title: 'Smart Agriculture',
      category: 'Technology',
      image: smartAgriculture,
      description: 'Reliable Solutions for Agricultural Farming. Agriculture is the backbone of our economy.',
    },
    {
      id: 7,
      title: 'Precision Farming',
      category: 'Technology',
      image: precisionFarming,
      description: 'Advanced agricultural practices using GPS and sensor technology for optimal crop management.',
    },
    {
      id: 8,
      title: 'Biodynamic Farming',
      category: 'Organic',
      image: biodynamicFarming,
      description: 'Holistic farming approach that treats the farm as a living ecosystem with natural rhythms.',
    },
    {
      id: 9,
      title: 'Vertical Farming',
      category: 'Innovation',
      image: verticalFarming,
      description: 'Modern indoor farming techniques maximizing space efficiency and resource conservation.',
    },
    {
      id: 10,
      title: 'Hydroponic Systems',
      category: 'Technology',
      image: hydroponicFarming,
      description: 'Soilless cultivation methods providing optimal nutrition and growth conditions for crops.',
    }
  ];

  // Auto-slide functionality - DISABLED
  // useEffect(() => {
  //   if (!isAutoPlaying) return;
    
  //   const interval = setInterval(() => {
  //     setCurrentIndex((prevIndex) => 
  //       prevIndex === farmingProjects.length - 1 ? 0 : prevIndex + 1
  //     );
  //   }, 4000); // Change slide every 4 seconds

  //   return () => clearInterval(interval);
  // }, [isAutoPlaying, farmingProjects.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === farmingProjects.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? farmingProjects.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <AnimatedSection 
      className="pt-16 pb-8 lg:pt-24 lg:pb-12 bg-white relative overflow-hidden"
      variants={staggerContainer}
      stagger={true}
    >
      <div className="w-full px-0">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div 
            className="mb-8 md:mb-0 text-left"
            variants={staggerFadeInUp}
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Award className="w-3 h-3" />
              <span>Farming Projects!</span>
            </motion.div>
            
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed text-left mb-4"
              variants={staggerFadeInUp}
            >
              <span className="block mb-1">Sustainable Farming For</span>
              <span className="block relative">
                Better{' '}
                <span className="relative inline-block">
                  Harvests!
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                  />
                </span>
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed text-left"
              variants={staggerFadeInUp}
            >
              Agriculture is the backbone of our society, providing food,
              raw materials, and economic stability.
            </motion.p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="self-start md:self-center"
          >
            <Link 
              to="/projects" 
              className="inline-flex items-center px-5 py-2 bg-yellow-500 text-white text-sm font-medium rounded hover:bg-yellow-600 transition-colors duration-300"
            >
              View All Projects
              <motion.svg 
                className="w-4 h-4 ml-1"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </motion.svg>
            </Link>
          </motion.div>
        </div>
        
        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Clean Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-8 sm:left-10 lg:left-12 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-yellow-400 hover:bg-green-600 rounded-full shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-300 group"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800 group-hover:text-white transition-colors duration-300" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-yellow-400 hover:bg-green-600 rounded-full shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-300 group"
          >
            <ChevronRight className="w-5 h-5 text-gray-800 group-hover:text-white transition-colors duration-300" />
          </button>

          {/* Main Carousel */}
          <div className="overflow-hidden mx-0 pl-4 sm:pl-6 lg:pl-8">
            <motion.div 
              className="flex transition-transform duration-700 ease-in-out gap-6"
              style={{ 
                transform: `translateX(-${currentIndex * (363 + 24)}px)`,
              }}
            >
              {farmingProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="flex-shrink-0"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer" style={{ width: '363px', height: '480px' }}>
                    {/* Project Image */}
                    <div className="relative h-full w-full overflow-hidden rounded-2xl">
                      <img 
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Dark Gradient Overlay - Covers bottom part */}
                      <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl" />
                      
                      {/* Content Overlay - Bottom */}
                      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 z-10 text-left">
                        {/* Category Badge - Above heading, moves up on hover */}
                        <div className="mb-2 transform transition-all duration-500 ease-out group-hover:-translate-y-4 text-left">
                          <span className="bg-yellow-500 text-white px-3 py-1 text-xs font-medium rounded inline-block">
                            {project.category}
                          </span>
                        </div>
                        
                        {/* Title - Bottom Position */}
                        <h3 className="text-2xl font-bold text-white mb-0 transform transition-all duration-500 ease-out group-hover:-translate-y-4 text-left">
                          {project.title}
                        </h3>
                        
                        {/* Description - Hidden by Default, Shown on Hover */}
                        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-500 ease-out group-hover:max-h-[80px] group-hover:opacity-100 text-left">
                          <div className="relative mt-3 pt-3">
                            <div className="absolute top-0 left-0 w-0 h-0.5 border-t-2 border-dotted border-yellow-400 group-hover:w-full transition-all duration-1500 ease-out"></div>
                            <p className="text-white/90 text-sm leading-relaxed text-left">
                              {project.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          

        </div>

        {/* Navigation Dots are now at the bottom */}
      </div>
    </AnimatedSection>
  );
};

export default CategoriesSection; 