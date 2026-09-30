import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import '../styles/hero.css';
import { getAssetPath } from '../config';

const Hero: React.FC = () => (
  <section className="hero">
    <div className="hero-text">
      <p className="hero-eyebrow">
        <span className="hero-dot" aria-hidden="true"></span>
        Graduate Tech Program @ AXA
      </p>
      <h1>
        Hi, I'm Guillermo.
        <span>I build AI, data and automation that actually ships.</span>
      </h1>
      <p className="hero-lead">
        Computer Science Engineer (UC3M) working across applied AI, data pipelines, automation and software
        quality. I like taking ambiguous problems and turning them into working products.
      </p>
      <Link to="/projects/ai-demo/live" className="hero-callout">
        <span className="hero-callout-tag">New</span> Draw a digit and watch my neural network read it <span aria-hidden="true">→</span>
      </Link>
      <div className="hero-actions">
        <Link to="/projects" className="hero-button primary">See my work</Link>
        <a href={getAssetPath('CV.pdf')} target="_blank" rel="noopener noreferrer" className="hero-button">Download CV</a>
        <div className="hero-social">
          <a href="https://github.com/Guillermo-villar" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/guillermo-villar-sanchez/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="mailto:guillermovillarsanchez@gmail.com" aria-label="Email"><FaEnvelope /></a>
        </div>
      </div>
    </div>
    <div className="hero-photo">
      <img src={getAssetPath('icon.webp')} alt="Guillermo Villar Sánchez" width={320} height={320} />
    </div>
  </section>
);

export default Hero;
