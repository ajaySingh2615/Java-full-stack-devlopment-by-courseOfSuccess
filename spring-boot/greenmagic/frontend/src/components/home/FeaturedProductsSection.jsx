import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, ArrowRight, Leaf, Award, Zap } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';
import { 
  staggerContainer,
  staggerFadeInUp,
  hoverLift,
  scaleIn
} from '../../utils/animationVariants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faSeedling } from '@fortawesome/free-solid-svg-icons';

const FeaturedProductsSection = () => {
  const [activeTab, setActiveTab] = useState('bestsellers');

  const productCategories = [
    { id: 'bestsellers', name: 'Best Sellers', icon: <Award className="w-4 h-4 mr-2" /> },
    { id: 'organic', name: 'Organic', icon: <FontAwesomeIcon icon={faSeedling} className="w-4 h-4 mr-2" /> },
    { id: 'new', name: 'New Arrivals', icon: <Zap className="w-4 h-4 mr-2" /> },
    { id: 'offers', name: 'Special Offers', icon: <Star className="w-4 h-4 mr-2" fill="currentColor" /> },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Organic Green Tea',
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop',
      badge: 'Best Seller',
      badgeColor: 'bg-green-500',
      discount: 25,
      category: ['bestsellers', 'organic'],
      description: 'Premium quality green tea leaves harvested from sustainable farms.'
    },
    {
      id: 2,
      name: 'Natural Honey',
      price: 549,
      originalPrice: 649,
      rating: 4.9,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop',
      badge: 'Organic',
      badgeColor: 'bg-primary-500',
      discount: 15,
      category: ['bestsellers', 'organic'],
      description: 'Pure wildflower honey collected from pristine forest regions.'
    },
    {
      id: 3,
      name: 'Herbal Face Mask',
      price: 199,
      originalPrice: 299,
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      badge: 'New',
      badgeColor: 'bg-blue-500',
      discount: 33,
      category: ['new', 'organic'],
      description: 'Revitalizing facial mask made with natural herbs and clay.'
    },
    {
      id: 4,
      name: 'Organic Quinoa',
      price: 450,
      originalPrice: 550,
      rating: 4.6,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop',
      badge: 'Superfood',
      badgeColor: 'bg-orange-500',
      discount: 18,
      category: ['organic', 'offers'],
      description: 'Premium South American quinoa grown using sustainable practices.'
    },
    {
      id: 5,
      name: 'Fresh Avocados',
      price: 220,
      originalPrice: 280,
      rating: 4.5,
      reviews: 58,
      image: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=300&h=300&fit=crop',
      badge: 'Fresh',
      badgeColor: 'bg-green-500',
      discount: 21,
      category: ['new', 'organic'],
      description: 'Hand-picked avocados from certified organic groves.'
    },
    {
      id: 6,
      name: 'Lavender Essential Oil',
      price: 399,
      originalPrice: 499,
      rating: 4.8,
      reviews: 92,
      image: 'https://images.unsplash.com/photo-1545341425-ebc436891acc?w=300&h=300&fit=crop',
      badge: 'Pure',
      badgeColor: 'bg-purple-500',
      discount: 20,
      category: ['bestsellers', 'offers'],
      description: 'Steam-distilled lavender essential oil from organic farms.'
    },
    {
      id: 7,
      name: 'Aloe Vera Gel',
      price: 189,
      originalPrice: 249,
      rating: 4.7,
      reviews: 104,
      image: 'https://images.unsplash.com/photo-1588435318856-48a63a214425?w=300&h=300&fit=crop',
      badge: 'Soothing',
      badgeColor: 'bg-blue-500',
      discount: 24,
      category: ['new', 'offers'],
      description: '99% pure aloe vera gel for skin care and wellness.'
    },
    {
      id: 8,
      name: 'Organic Chia Seeds',
      price: 320,
      originalPrice: 399,
      rating: 4.9,
      reviews: 76,
      image: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=300&h=300&fit=crop',
      badge: 'Superfood',
      badgeColor: 'bg-orange-500',
      discount: 20,
      category: ['bestsellers', 'organic'],
      description: 'Nutrient-rich chia seeds from organic farming practices.'
    },
  ];

  const filteredProducts = featuredProducts.filter(product => 
    product.category.includes(activeTab)
  );

  return (
    <AnimatedSection 
      className="section bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-8 pb-16 lg:pt-12 lg:pb-24 relative overflow-hidden"
      variants={staggerContainer}
      stagger={true}
    >
      {/* Background Decorations */}
      <motion.div 
        className="absolute top-40 left-0 w-64 h-64 rounded-full bg-green-100 opacity-30 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
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
            <span>Organic Products!</span>
          </motion.div>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed text-center mb-4"
            variants={staggerFadeInUp}
          >
            <span className="block mb-1">Sustainable Products For</span>
            <span className="block relative">
              Healthier{' '}
              <span className="relative inline-block">
                Living!
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
            className="text-sm md:text-base text-gray-500 max-w-xl mx-auto"
            variants={staggerFadeInUp}
          >
            Our organic products support sustainable farming practices, providing healthier options
            while protecting the environment for future generations.
          </motion.p>

          {/* Category Tabs */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mt-10 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {productCategories.map((category) => (
              <motion.button
                key={category.id}
                className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border ${
                  activeTab === category.id
                    ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-200'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:bg-green-50'
                }`}
                onClick={() => setActiveTab(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon}
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
          layout
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="group"
              variants={staggerFadeInUp}
              whileHover="hover"
              initial="rest"
              layout
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: index * 0.1
              }}
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div 
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 relative"
                variants={hoverLift}
              >
                {/* Top colored stripe */}
                <div className={`h-1.5 w-full ${product.badgeColor}`}></div>

                {/* Image Container */}
                <div className="relative overflow-hidden pt-4 px-4">
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-100">
                    <motion.img 
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                      whileHover={{ scale: 1.15, rotate: -2 }}
                      layoutId={`image-${product.id}`}
                    />
                    
                    {/* Color overlay on hover */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-tr from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                  
                  {/* Badge */}
                  <motion.div 
                    className={`absolute top-8 left-8 ${product.badgeColor} text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg`}
                    initial={{ opacity: 0, scale: 0, rotate: -20 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {product.badge}
                  </motion.div>
                  
                  {/* Discount Badge */}
                  <motion.div 
                    className="absolute top-8 right-8 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
                    initial={{ opacity: 0, scale: 0, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                    whileHover={{ scale: 1.1 }}
                  >
                    Save {product.discount}%
                  </motion.div>
                  
                  {/* Action Buttons */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.button 
                      className="p-3 bg-white rounded-full shadow-lg hover:bg-primary-50 transition-colors duration-200"
                      whileHover={{ scale: 1.1, y: -2, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                    </motion.button>
                    
                    <motion.button 
                      className="p-3 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-colors duration-200"
                      whileHover={{ scale: 1.1, y: -2, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)" }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <ShoppingCart className="w-5 h-5 text-white" />
                    </motion.button>
                  </motion.div>
                </div>
                
                {/* Product Info */}
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.4 }}
                >
                  {/* Rating */}
                  <motion.div 
                    className="flex items-center space-x-2 mb-3"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 + index * 0.05 }}
                        >
                          <Star 
                            className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        </motion.div>
                      ))}
                      <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({product.reviews})</span>
                  </motion.div>
                
                  <motion.h3 
                    className="font-semibold text-xl text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300 line-clamp-1"
                    whileHover={{ x: 2 }}
                  >
                    {product.name}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 text-sm mb-4 line-clamp-2 h-10"
                  >
                    {product.description}
                  </motion.p>
                  
                  {/* Price */}
                  <motion.div 
                    className="flex items-center justify-between pt-4 border-t border-gray-100"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-2">
                      <motion.span 
                        className="text-xl font-bold text-gray-900"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ₹{product.price}
                      </motion.span>
                      <motion.span 
                        className="text-sm text-gray-500 line-through"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        ₹{product.originalPrice}
                      </motion.span>
                    </div>
                    
                    <motion.button 
                      className="w-10 h-10 rounded-full bg-green-100 hover:bg-green-600 group-hover:bg-green-600 text-green-600 hover:text-white group-hover:text-white flex items-center justify-center transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </motion.div>
                </motion.div>

                {/* Hover Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
                  }}
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="text-center mt-28 lg:mt-32 relative z-20"
          variants={staggerFadeInUp}
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              to="/shop" 
              className="group relative overflow-hidden inline-flex items-center px-8 py-3.5 bg-yellow-500 hover:bg-yellow-600 text-white text-md font-medium rounded-lg shadow-lg shadow-yellow-200/30 transition-all duration-300"
            >
              <span className="relative z-10">Explore All Products</span>
              
              <motion.div
                className="absolute right-4 flex items-center ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              >
                <motion.svg 
                  className="w-6 h-6 ml-1"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ opacity: 0.8 }}
                  animate={{ 
                    opacity: [0.8, 1, 0.8],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </motion.div>

              {/* Animated shine effect */}
              <motion.div 
                className="absolute top-0 -left-[100%] w-[120%] h-full bg-white/20 skew-x-[-20deg] z-0"
                animate={{
                  left: ['0%', '180%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
              />
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Background Pattern */}
        <div className="absolute left-0 top-1/4 -translate-y-1/2 w-24 h-48 bg-green-50 rounded-r-full opacity-50" />
      </div>
    </AnimatedSection>
  );
};

export default FeaturedProductsSection; 