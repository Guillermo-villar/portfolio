import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';
import '../styles/header.css';
import { getAssetPath } from '../config';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/blogs', label: 'Blog' },
  { to: '/about', label: 'About' },
];

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the menu whenever the route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <header className={`header ${menuOpen ? 'menu-open' : ''}`}>
      <NavLink to="/" className="header-name">
        <span className="name-full">Guillermo Villar Sánchez</span>
        <span className="name-short">Guillermo Villar</span>
      </NavLink>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className="nav-container">
        <nav className="nav">
          <ul>
            {navItems.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="social-links">
          <li>
            <a href="https://github.com/Guillermo-villar" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/guillermo-villar-sanchez/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
          </li>
          <li>
            <a href="mailto:guillermovillarsanchez@gmail.com" aria-label="Email">
              <FaEnvelope />
            </a>
          </li>
          <li>
            <a href={getAssetPath('CV.pdf')} target="_blank" rel="noopener noreferrer" className="cv-link">
              CV
            </a>
          </li>
        </ul>
      </div>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)}></div>}
    </header>
  );
};

export default Header;
