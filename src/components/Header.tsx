import React from 'react';
import { FaGithub, FaLinkedin, FaFileAlt , FaEnvelope} from 'react-icons/fa'; // Iconos de React Icons
import '../styles/header.css';

const Header: React.FC = () => {
  return (
   <header className="header">
  <nav>
    <div className="nav-content">
      <h1>Guillermo Villar Sánchez</h1>
      <ul className="menu">
        <li><a href="#projects">Projects</a></li>
        <li><a href="#blog">Blog</a></li>
        <li><a href="#about">About</a></li>
      </ul>
      <div className="social-links-container">
        <ul className="social-links">
          <li>
            <a href="https://github.com/Guillermo-villar" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/guillermo-villar-sanchez/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </li>
          <li>
            <a href="/CV.pdf" target="_blank" rel="noopener noreferrer" className="cv-link">
              CV
            </a>
          </li>
          <li>
            <a href="mailto:guillermovillarsanchez@gmail.com" target="_blank" rel="noopener noreferrer">
              <FaEnvelope />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</header>
  );
};

export default Header;
