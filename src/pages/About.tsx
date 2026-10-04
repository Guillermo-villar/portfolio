import React from 'react';
import Header from '../components/Header';
import '../styles/about.css';

const About: React.FC = () => {
  return (
    <div className="about-page">
      <Header />
      <div className="about-container">
        <div className="about-content">
          <h1>About Me</h1>
          <div className="coming-soon-container">
            <div className="coming-soon-icon">
              <i className="fas fa-tools"></i>
            </div>
            <h2>Coming Soon</h2>
            <p>I'm currently working on this page to share more about my background, interests, and journey.</p>
            <p>Check back soon to learn more about who I am and what drives my passion for technology and innovation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;