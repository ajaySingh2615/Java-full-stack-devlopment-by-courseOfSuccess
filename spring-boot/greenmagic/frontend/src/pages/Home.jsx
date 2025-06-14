import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Leaf, 
  Star, 
  ShoppingBag,
  Truck,
  Shield,
  Award,
  Heart
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const featuredProducts = [
    {
      id: 1,
      name: 'Organic Green Tea',
      price: 299,
      originalPrice: 399,
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop',
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Natural Honey',
      price: 549,
      originalPrice: 649,
      rating: 4.9,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop',
      badge: 'Organic'
    },
    {
      id: 3,
      name: 'Herbal Face Mask',
      price: 199,
      originalPrice: 299,
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      badge: 'New'
    },
    {
      id: 4,
      name: 'Organic Quinoa',
      price: 450,
      originalPrice: 550,
      rating: 4.6,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop',
      badge: 'Superfood'
    },
  ];

  const categories = [
    {
      name: 'Skincare',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop',
      count: '25+ products'
    },
    {
      name: 'Nutrition',
      image: 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?w=200&h=200&fit=crop',
      count: '40+ products'
    },
    {
      name: 'Tea & Coffee',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop',
      count: '18+ products'
    },
    {
      name: 'Honey & Sweeteners',
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&h=200&fit=crop',
      count: '12+ products'
    },
  ];

  const features = [
    {
      icon: Leaf,
      title: '100% Organic',
      description: 'Certified organic products sourced directly from farmers'
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free delivery on orders above ₹999 across India'
    },
    {
      icon: Shield,
      title: 'Quality Assured',
      description: 'Rigorous quality checks ensure premium products'
    },
    {
      icon: Award,
      title: 'Certified Products',
      description: 'All products are certified by organic standards'
    },
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 lg:py-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 leading-tight mb-6">
                  Pure <span className="gradient-text">Organic</span><br />
                  Products for a<br />
                  <span className="text-primary-600">Healthier You</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                  Discover our premium collection of organic, eco-friendly products 
                  that nurture your body and protect our planet. Sustainable living 
                  starts here.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/shop" 
                  className="btn-primary btn-lg inline-flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  to="/about"
                  className="btn-outline btn-lg"
                >
                  Learn More
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">5000+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">100%</div>
                  <div className="text-sm text-gray-600">Organic Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">50+</div>
                  <div className="text-sm text-gray-600">Product Varieties</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="hero-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=600&fit=crop"
                  alt="Organic products collection"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -top-4 -right-4 bg-secondary-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  🌱 100% Natural
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-full shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose GreenMagic?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're committed to providing you with the highest quality organic products 
              while maintaining sustainable and ethical practices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Explore our carefully curated categories of organic products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link key={index} to="/shop" className="group">
                <div className="card-hover text-center">
                  <div className="aspect-square rounded-lg overflow-hidden mb-4">
                    <img 
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Our most popular organic products loved by customers
              </p>
            </div>
            <Link to="/shop" className="btn-outline">
              View All Products
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card-hover group">
                <div className="relative">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="absolute top-2 left-2 bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {product.badge}
                  </div>
                  <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                  </button>
                </div>
                
                <div className="card-body">
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
                    <button className="btn-primary btn-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Join the Green Revolution Today
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Start your journey towards a healthier lifestyle with our premium organic products. 
              Your body and the planet will thank you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop" className="btn-secondary btn-lg">
                Start Shopping
              </Link>
              <Link to="/about" className="btn-ghost text-white border-white hover:bg-white hover:text-primary-600">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 