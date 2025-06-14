import React from 'react';
import { Leaf, Users, Award, Heart, Target, Globe } from 'lucide-react';
import './About.css';

const About = () => {
  const values = [
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'We are committed to protecting our planet through sustainable practices and eco-friendly products.'
    },
    {
      icon: Heart,
      title: 'Health First',
      description: 'Your health and wellbeing are our top priority. All our products are carefully selected for their benefits.'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'We maintain the highest standards of quality through rigorous testing and certification processes.'
    },
    {
      icon: Users,
      title: 'Community Focus',
      description: 'We support local farmers and communities, creating a positive impact on society.'
    },
  ];

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
      description: 'Passionate about organic living and sustainable business practices.'
    },
    {
      name: 'Rahul Gupta',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
      description: 'Expert in supply chain management and quality control.'
    },
    {
      name: 'Anita Patel',
      role: 'Product Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
      description: 'Dedicated to sourcing the finest organic products from around the world.'
    },
  ];

  return (
    <div className="about">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-20 lg:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
              Our Journey Towards a 
              <span className="gradient-text"> Greener Future</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Founded in 2020, GreenMagic began as a simple idea: to make organic, 
              eco-friendly products accessible to everyone while supporting sustainable 
              farming practices and protecting our planet for future generations.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  GreenMagic was born from a personal journey of discovering the power of 
                  organic living. Our founder, Priya Sharma, experienced firsthand how 
                  switching to organic products transformed her family's health and wellbeing.
                </p>
                <p>
                  What started as a small initiative to source organic products for friends 
                  and family has grown into a trusted platform serving thousands of customers 
                  across India. We work directly with certified organic farmers, ensuring 
                  fair trade practices and supporting rural communities.
                </p>
                <p>
                  Today, we're proud to offer over 500 carefully curated organic products, 
                  from skincare and nutrition to household essentials, all while maintaining 
                  our commitment to sustainability and quality.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop"
                alt="Organic farming"
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary-600 text-white p-6 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm opacity-90">Organic Products</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card p-8 text-center">
              <Target className="w-16 h-16 text-primary-600 mx-auto mb-6" />
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To make organic, sustainable living accessible and affordable for everyone 
                while supporting farmers and protecting our environment. We believe that 
                small changes in our daily choices can create a significant positive impact 
                on our health and the planet.
              </p>
            </div>
            <div className="card p-8 text-center">
              <Globe className="w-16 h-16 text-primary-600 mx-auto mb-6" />
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To create a world where organic, eco-friendly products are the norm, not 
                the exception. We envision a future where every household has access to 
                products that nourish both people and the planet, fostering a healthier, 
                more sustainable world for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do, from product selection to customer service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="flex items-start space-x-6 p-6 rounded-xl hover:bg-primary-50 transition-colors duration-300">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The passionate people behind GreenMagic's mission
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">5000+</div>
              <div className="text-primary-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-primary-100">Organic Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-primary-100">Partner Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">4.9</div>
              <div className="text-primary-100">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 