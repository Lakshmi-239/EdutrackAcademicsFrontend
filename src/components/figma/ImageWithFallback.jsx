// src/components/figma/ImageWithFallback.jsx
import React, { useState } from 'react';

export const ImageWithFallback = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    // Fallback to a generic placeholder if the Unsplash link fails
    setImgSrc('https://via.placeholder.com/400x225?text=Course+Image');
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className} 
      onError={handleError} 
    />
  );
};