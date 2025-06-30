import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiX } from 'react-icons/fi';

const ProductImageGallery = ({ 
  images = [], 
  productName = '',
  showThumbnails = true 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // If no images provided, use placeholder
  const displayImages = images.length > 0 ? images : ['/placeholder-product.jpg'];
  const currentImage = displayImages[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const openZoom = () => {
    setIsZoomed(true);
  };

  const closeZoom = () => {
    setIsZoomed(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeZoom();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    }
  };

  return (
    <div className="w-full">
      {/* Main Image Display */}
      <div className="relative aspect-w-16 aspect-h-12 bg-gray-100 rounded-lg overflow-hidden group">
        <img
          src={currentImage}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 cursor-zoom-in"
          onClick={openZoom}
        />
        
        {/* Navigation arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-75"
              aria-label="Previous image"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-75"
              aria-label="Next image"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Zoom button */}
        <button
          onClick={openZoom}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-opacity-75"
          aria-label="Zoom image"
        >
          <FiZoomIn className="h-4 w-4" />
        </button>

        {/* Image counter */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && displayImages.length > 1 && (
        <div className="mt-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex
                    ? 'border-green-500 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeZoom}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-full max-h-full">
            {/* Close button */}
            <button
              onClick={closeZoom}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors z-10"
              aria-label="Close zoom"
            >
              <FiX className="h-6 w-6" />
            </button>

            {/* Navigation in zoom */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors z-10"
                  aria-label="Previous image"
                >
                  <FiChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-colors z-10"
                  aria-label="Next image"
                >
                  <FiChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Zoomed image */}
            <img
              src={currentImage}
              alt={`${productName} - Zoomed view`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image counter in zoom */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded">
                {currentImageIndex + 1} of {displayImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery; 