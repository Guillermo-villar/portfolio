import React, { useState } from 'react';
import '../styles/hero.css';
import { getAssetPath } from '../config';

const Hero: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="hero">
      <img 
        src={getAssetPath('icon.png')} 
        alt="Profile" 
        className="hero-image" 
        onError={(e) => {
          if (!imageError) {
            // Try an alternative path format on error
            e.currentTarget.src = `${process.env.PUBLIC_URL}/icon.png`;
            setImageError(true);
            console.log('Attempting alternative image path format');
          }
        }}
      />
      <h1>Guillermo Villar Sánchez</h1>
      <p>Passionate developer.</p>
      <p>Discover my projects, read my blog, and learn more about me.</p>
    </div>
  );
};

export default Hero;
