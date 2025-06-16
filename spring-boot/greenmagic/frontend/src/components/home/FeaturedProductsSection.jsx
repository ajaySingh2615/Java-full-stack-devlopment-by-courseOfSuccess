import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import AnimatedSection from '../animations/AnimatedSection';
import { 
  staggerContainer,
  staggerFadeInUp,
  hoverLift,
  scaleIn
} from '../../utils/animationVariants';

const FeaturedProductsSection = () => {
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
      discount: 25
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
      discount: 15
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
      discount: 33
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
      discount: 18
    },
  ];

  return (
    <AnimatedSection 
      className="section bg-white py-16 lg:py-24"
      variants={staggerContainer}
      stagger={true}
    >
      <div className="container">
        {/* Section Header */}
        <motion.div 
          className="flex justify-between items-center mb-16"
          variants={staggerFadeInUp}
        >
          <motion.div variants={staggerFadeInUp}>
            <motion.h2 
              className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4"
              whileHover={{ scale: 1.02 }}
            >
              Featured{' '}
              <motion.span 
                className="text-primary-600 relative"
                animate={{ 
                  textShadow: [
                    '0 0 0px rgba(34, 197, 94, 0)',
                    '0 0 20px rgba(34, 197, 94, 0.3)',
                    '0 0 0px rgba(34, 197, 94, 0)'
                  ]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatDelay: 2 
                }}
              >
                Products
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              variants={staggerFadeInUp}
            >
              Our most popular organic products loved by customers
            </motion.p>
          </motion.div>
          
          <motion.div
            variants={staggerFadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/shop" 
              className="btn-outline hidden md:inline-flex items-center"
            >
              View All Products
              <motion.svg 
                className="w-4 h-4 ml-2"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={staggerContainer}
        >
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="group"
              variants={staggerFadeInUp}
              whileHover="hover"
              initial="rest"
            >
              <motion.div 
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                variants={hoverLift}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <motion.img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                  />
                  
                  {/* Badge */}
                  <motion.div 
                    className={`absolute top-3 left-3 ${product.badgeColor} text-white px-2 py-1 rounded-full text-xs font-medium shadow-md`}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {product.badge}
                  </motion.div>
                  
                  {/* Discount Badge */}
                  <motion.div 
                    className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    -{product.discount}%
                  </motion.div>
                  
                  {/* Action Buttons */}
                  <motion.div 
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.button 
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-primary-50 transition-colors duration-200"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                    </motion.button>
                    
                    <motion.button 
                      className="p-2 bg-white rounded-full shadow-lg hover:bg-primary-50 transition-colors duration-200"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <ShoppingCart className="w-4 h-4 text-gray-600 hover:text-primary-600" />
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
                  <motion.h3 
                    className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300"
                    whileHover={{ x: 2 }}
                  >
                    {product.name}
                  </motion.h3>
                  
                  {/* Rating */}
                  <motion.div 
                    className="flex items-center space-x-2 mb-3"
                    whileHover={{ scale: 1.05 }}
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
                    <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                  </motion.div>
                  
                  {/* Price */}
                  <motion.div 
                    className="flex items-center justify-between"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-2">
                      <motion.span 
                        className="text-lg font-bold text-gray-900"
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
                      className="btn-primary btn-sm"
                      whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(34, 197, 94, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                    >
                      Add to Cart
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

        {/* Mobile CTA */}
        <motion.div 
          className="text-center mt-12 md:hidden"
          variants={staggerFadeInUp}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/shop" 
              className="btn-primary inline-flex items-center"
            >
              View All Products
              <motion.svg 
                className="w-4 h-4 ml-2"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};

export default FeaturedProductsSection; 