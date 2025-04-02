import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';
import '../styles/header.css';
import { getAssetPath } from '../config';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const navigate = useNavigate();

  // Cerrar el menú cuando se cambia de ruta
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Inicializar el estado de isMobile correctamente al cargar
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Función para manejar la navegación directamente
  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    navigate(path);
  };

  // Renderizado condicional según el tamaño de la pantalla
  return (
    <header className="header">
      {isMobile ? (
        // Versión móvil con menú hamburguesa
        <>
          <div className="header-content">
            <h1>Guillermo Villar Sánchez</h1>
            
            <button 
              className="menu-toggle" 
              onClick={toggleMenu} 
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          <div className={`nav-container ${menuOpen ? 'active' : ''}`}>
            <nav className="nav">
              <ul>
                <li>
                  <button 
                    className="nav-button"
                    onClick={handleNavigation("/")}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    className="nav-button"
                    onClick={handleNavigation("/projects")}
                  >
                    Projects
                  </button>
                </li>
                <li>
                  <button 
                    className="nav-button"
                    onClick={handleNavigation("/blogs")}
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button 
                    className="nav-button"
                    onClick={handleNavigation("/about")}
                  >
                    About
                  </button>
                </li>
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
                  <a href={getAssetPath('CV.pdf')} target="_blank" rel="noopener noreferrer" className="cv-link">
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
          
          {menuOpen && <div className="overlay" onClick={closeMenu}></div>}
        </>
      ) : (
        // Versión desktop original
        <>
          <h1>Guillermo Villar Sánchez</h1>
          <nav className="nav">
            <ul>
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/projects" className={({ isActive }) => isActive ? "active" : ""}>
                  Projects
                </NavLink>
              </li>
              <li>
                <NavLink to="/blogs" className={({ isActive }) => isActive ? "active" : ""}>
                  Blog
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
                  About
                </NavLink>
              </li>
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
                <a href={getAssetPath('CV.pdf')} target="_blank" rel="noopener noreferrer" className="cv-link">
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
        </>
      )}
    </header>
  );
};

export default Header;
