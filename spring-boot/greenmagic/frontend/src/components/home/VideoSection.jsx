import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import videoBackground from '../../assets/videos/video-bg.mp4';

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  
  // Use a higher threshold to start animation earlier
  const isInView = useInView(sectionRef, { 
    once: false, 
    amount: 0.2, 
    rootMargin: "-5% 0px -5% 0px" 
  });

  // Scroll animation values
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  // Animation values - fixed smooth transitions
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.98, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  
  // Smoother clipPath animation - fixed easing
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6],
    [
      "inset(80% 0% 0% 0%)", 
      "inset(30% 0% 0% 0%)", 
      "inset(0% 0% 0% 0%)"
    ]
  );

  // Handle play/pause when section becomes fully visible
  useEffect(() => {
    if (isInView && videoRef.current) {
      // Small timeout to allow animation to complete
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play();
          setIsPlaying(true);
        }
      }, 700);
      
      return () => clearTimeout(timer);
    } else if (!isInView && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isInView]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      id="video-section"
      ref={containerRef} 
      className="relative w-full py-20 lg:py-32 overflow-hidden min-h-[80vh]"
    >
      {/* Top reveal highlight */}
      <motion.div
        className="absolute top-0 left-0 w-full h-1 bg-yellow-400 z-10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isInView ? 1 : 0 }}
        transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
      />
      
      {/* Video Background - Covers entire section */}
      <motion.div 
        ref={sectionRef}
        className="absolute inset-0 w-full h-full"
        style={{ 
          clipPath,
          scale,
          opacity
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isInView ? 1 : 0
        }}
        transition={{ 
          duration: 0.8,
          ease: "easeOut"
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover absolute inset-0"
          src={videoBackground}
          muted
          loop
          playsInline
          onClick={togglePlayPause}
        />

        {/* Video overlay gradient for better text contrast */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 0.7 : 0 }}
          transition={{ duration: 1.2 }}
        />
      </motion.div>
      
      {/* Content - Positioned over the video */}
      <div className="container mx-auto relative z-10 flex flex-col justify-center h-full min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-8"
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-4"
          >
            <span>Sustainable Farming</span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            <span className="block">See How We Grow</span>
            <span className="block relative">
              <span className="relative inline-block">
                Organic Products
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-yellow-400"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isInView ? 1 : 0 }}
                  transition={{ delay: 0.5, duration: 1 }}
                />
              </span>
            </span>
          </motion.h2>
        </motion.div>

        {/* Play/Pause button overlay */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: isPlaying ? 0 : 0.5 }}
          onClick={togglePlayPause}
        >
          {!isPlaying && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 rounded-full bg-white bg-opacity-80 flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </motion.div>

        {/* Video Controls - Position absolute instead of fixed to stay within section */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 z-30 flex items-center bg-black bg-opacity-60 p-3 justify-between"
          initial={{ y: 100 }}
          animate={{ y: isInView ? 0 : 100 }}
          transition={{ 
            delay: 0.5,
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        >
          <div className="flex items-center space-x-4">
            <button 
              onClick={togglePlayPause}
              className="text-white hover:text-green-400 transition-colors"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>

            <div className="text-white text-sm font-medium">Tap video to play/pause</div>
          </div>
          
          <button className="text-white hover:text-green-400 transition-colors mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoSection; 