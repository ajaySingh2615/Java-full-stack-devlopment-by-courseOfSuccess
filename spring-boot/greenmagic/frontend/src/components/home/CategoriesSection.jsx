import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedSection from '../animations/AnimatedSection';
import { 
  staggerContainer,
  staggerFadeInUp,
  hoverScale,
  scaleIn
} from '../../utils/animationVariants';

const CategoriesSection = () => {
  const categories = [
    {
      name: 'Skincare',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
      count: '25+ products',
      color: 'from-pink-500 to-rose-500',
      hoverColor: 'group-hover:from-pink-600 group-hover:to-rose-600'
    },
    {
      name: 'Nutrition',
      image: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=200&h=200&fit=crop',
      count: '40+ products',
      color: 'from-green-500 to-emerald-500',
      hoverColor: 'group-hover:from-green-600 group-hover:to-emerald-600'
    },
    {
      name: 'Tea & Coffee',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop',
      count: '18+ products',
      color: 'from-amber-500 to-orange-500',
      hoverColor: 'group-hover:from-amber-600 group-hover:to-orange-600'
    },
    {
      name: 'Honey & Sweeteners',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop',
      count: '12+ products',
      color: 'from-yellow-500 to-amber-500',
      hoverColor: 'group-hover:from-yellow-600 group-hover:to-amber-600'
    },
  ];

  return (
    <AnimatedSection 
      className="section bg-gray-50 py-16 lg:py-24"
      variants={staggerContainer}
      stagger={true}
    >
      <div className="container">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          variants={staggerFadeInUp}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4"
            variants={staggerFadeInUp}
          >
            Shop by{' '}
            <motion.span 
              className="text-primary-600 relative"
              whileHover={{ scale: 1.05 }}
            >
              Category
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600"
            variants={staggerFadeInUp}
          >
            Explore our carefully curated categories of organic products
          </motion.p>
        </motion.div>
        
        {/* Categories Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              variants={staggerFadeInUp}
              whileHover="hover"
              initial="rest"
            >
              <Link to="/shop" className="group block">
                <motion.div 
                  className="relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 group-hover:shadow-xl"
                  variants={hoverScale}
                >
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden">
                    <motion.img 
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      whileHover={{ scale: 1.1 }}
                    />
                    
                    {/* Gradient Overlay */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.2 }}
                    />
                    
                    {/* Category Badge */}
                    <motion.div 
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-800"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {category.count}
                    </motion.div>
                  </div>
                  
                  {/* Content */}
                  <motion.div 
                    className="p-6 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <motion.h3 
                      className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300"
                      whileHover={{ y: -2 }}
                    >
                      {category.name}
                    </motion.h3>
                    
                    <motion.div 
                      className="flex items-center justify-center"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-gray-600 group-hover:text-primary-600 transition-colors duration-300">
                        Explore Collection
                      </span>
                      <motion.svg 
                        className="w-4 h-4 ml-2 text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </motion.div>
                  </motion.div>

                  {/* Ripple Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    initial={{ scale: 0, opacity: 0.3 }}
                    whileHover={{ 
                      scale: 1,
                      opacity: 0,
                      transition: { duration: 0.6 }
                    }}
                    style={{
                      background: `radial-gradient(circle, ${category.color.includes('pink') ? '#ec4899' : 
                                                          category.color.includes('green') ? '#10b981' :
                                                          category.color.includes('amber') ? '#f59e0b' : '#eab308'}40 0%, transparent 70%)`
                    }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12"
          variants={staggerFadeInUp}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/shop" 
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              View All Categories
              <motion.svg 
                className="w-5 h-5 ml-2"
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
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default CategoriesSection; 