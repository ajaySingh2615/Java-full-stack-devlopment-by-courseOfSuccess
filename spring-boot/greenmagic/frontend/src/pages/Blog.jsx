import React from 'react';
import './Blog.css';

const Blog = () => {
  return (
    <div className="blog">
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-20 lg:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
              Our <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Discover tips and insights for living a healthier, more sustainable lifestyle.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-xl text-gray-600">
              We're working on bringing you amazing content about organic living, 
              sustainability, and wellness. Stay tuned!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog; 