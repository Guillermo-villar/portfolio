import React , { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaBars, FaTimes} from 'react-icons/fa'; // Iconos de React Icons
import '../styles/header.css';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
   <header className="header">
      <h1>Guillermo Villar Sánchez</h1>
      <nav className="nav">
        <ul>
          <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
              Home
            </NavLink></li>
          <li><NavLink to="/projects" className={({ isActive }) => isActive ? "active" : ""}>
              Projects
            </NavLink></li>
          <li><NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>
              Blog
            </NavLink></li>
          <li><NavLink to="/home" className={({ isActive }) => isActive ? "active" : ""}>
              About
            </NavLink></li>
        </ul>
      </nav>
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
      {/*<button className="menu-toggle" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>*/}
    </header>
      );
    };

export default Header;
