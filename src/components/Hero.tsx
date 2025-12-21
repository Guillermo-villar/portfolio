import React, { useState } from 'react';
import '../styles/hero.css';
import { getAssetPath } from '../config';

const Hero: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="hero">
      <img 
        src={getAssetPath('icon.webp')} 
        alt="Profile" 
        className="hero-image"
        onError={(e) => {
          if (!imageError) {
            console.log('Failed to load profile image: icon.webp');
            e.currentTarget.src = `${process.env.PUBLIC_URL}/icon.webp`;
            setImageError(true);
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
