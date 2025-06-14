import React, { useState } from 'react';
import { Search, Filter, Grid, List, Star, Heart, ShoppingCart } from 'lucide-react';
import './Shop.css';

const Shop = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Products', count: 45 },
    { id: 'skincare', name: 'Skincare', count: 12 },
    { id: 'nutrition', name: 'Nutrition', count: 18 },
    { id: 'tea-coffee', name: 'Tea & Coffee', count: 8 },
    { id: 'honey', name: 'Honey & Sweeteners', count: 7 },
  ];

  const products = [
    {
      id: 1,
      name: 'Organic Green Tea',
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop',
      badge: 'Best Seller',
      category: 'tea-coffee'
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
      category: 'honey'
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
      category: 'skincare'
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
      category: 'nutrition'
    },
    {
      id: 5,
      name: 'Aloe Vera Gel',
      price: 199,
      originalPrice: 249,
      rating: 4.5,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=300&fit=crop',
      badge: 'Popular',
      category: 'skincare'
    },
    {
      id: 6,
      name: 'Turmeric Powder',
      price: 149,
      originalPrice: 199,
      rating: 4.8,
      reviews: 178,
      image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=300&h=300&fit=crop',
      badge: 'Pure',
      category: 'nutrition'
    },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="shop">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-16 lg:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Organic <span className="gradient-text">Products</span> Store
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our premium collection of organic, eco-friendly products 
              carefully sourced for your health and wellbeing.
            </p>
          </div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Search */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="input pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                          selectedCategory === category.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-50 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{category.name}</span>
                          <span className={`text-sm ${
                            selectedCategory === category.id ? 'text-primary-100' : 'text-gray-500'
                          }`}>
                            {category.count}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Min"
                        className="input text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="input text-sm"
                      />
                    </div>
                    <button className="btn-primary w-full btn-sm">Apply Filter</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {filteredProducts.length} Products
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <select className="input w-auto">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Customer Rating</option>
                  <option>Newest First</option>
                </select>
              </div>

              {/* Products */}
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className={`card-hover group ${
                    viewMode === 'list' ? 'flex space-x-6' : ''
                  }`}>
                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                      <img 
                        src={product.image}
                        alt={product.name}
                        className={`object-cover ${
                          viewMode === 'list' 
                            ? 'w-full h-32 rounded-lg' 
                            : 'w-full h-48 rounded-t-xl'
                        }`}
                      />
                      <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {product.badge}
                      </div>
                      <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                      </button>
                    </div>
                    
                    <div className={`${viewMode === 'list' ? 'flex-1 py-2' : 'card-body'}`}>
                      <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        </div>
                        <button className="btn-primary btn-sm flex items-center space-x-2">
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">1</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">2</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">3</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop; 