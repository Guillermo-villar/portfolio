import React, { useState } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import '../styles/hero.css';

const Hero: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [language, setLanguage] = useState<'EN' | 'ES'>('EN');
  
  // Toggle functions
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleLanguage = () => setLanguage(language === 'EN' ? 'ES' : 'EN');
  
  // Content based on language
  const content = {
    EN: {
      title: "Guillermo Villar Sánchez",
      description: "Passionate developer.",
      subtext: "Discover my projects, read my blog, and learn more about me."
    },
    ES: {
      title: "Guillermo Villar Sánchez",
      description: "Desarrollador apasionado.",
      subtext: "Descubre mis proyectos, lee mi blog y conoce más sobre mí."
    }
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-left">
          <img src="/icon.png" alt="Profile" className="hero-image" />
        </div>
        
        <div className="hero-right">
          <div className="hero-social-links">
            <a href="https://github.com/Guillermo-villar" target="_blank" rel="noopener noreferrer" className="hero-social-link">
              <FaGithub />
            </a>
            <a href="https://www.linkedin.com/in/guillermo-villar-sanchez/" target="_blank" rel="noopener noreferrer" className="hero-social-link">
              <FaLinkedin />
            </a>
            <a href="/CV.pdf" target="_blank" rel="noopener noreferrer" className="hero-cv-link">
              CV
            </a>
          </div>
          
          <div className="hero-toggles">
            <div className="toggle-container">
              <button 
                className={`toggle-button ${language === 'EN' ? 'active' : ''}`}
                onClick={toggleLanguage}
              >
                EN
              </button>
              <button 
                className={`toggle-button ${language === 'ES' ? 'active' : ''}`}
                onClick={toggleLanguage}
              >
                ES
              </button>
            </div>
            
            <div className="toggle-container">
              <button 
                className={`toggle-button ${isDarkMode ? 'active' : ''}`}
                onClick={toggleDarkMode}
              >
                Dark
              </button>
              <button 
                className={`toggle-button ${!isDarkMode ? 'active' : ''}`}
                onClick={toggleDarkMode}
              >
                Light
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-text">
        <h1>{content[language].title}</h1>
        <p>{content[language].description}</p>
        <p>{content[language].subtext}</p>
      </div>
    </section>
  );
};

export default Hero;
