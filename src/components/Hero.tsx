import React from 'react';
import '../styles/hero.css';

const Hero: React.FC = () => {
  return (
    <div className="hero">
      <img src="/icon.png" alt="Profile" className="hero-image" />
      <h1>Guillermo Villar Sánchez</h1>
      <p>Passionate developer.</p>
      <p>Discover my projects, read my blog, and learn more about me.</p>
    </div>
  );
};

export default Hero;
