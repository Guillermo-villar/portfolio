import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/hero.css';
import '../styles/notfound.css';
import { useDocumentTitle } from '../utils';

const NotFound: React.FC = () => {
  useDocumentTitle('Page not found');

  return (
    <div className="notfound-page">
      <Header />
      <main className="notfound-container">
        <p className="notfound-code">404</p>
        <header className="page-intro">
          <h1>This page doesn't exist</h1>
          <p>The link may be out of date, or the address may have a typo in it. Everything below still works.</p>
        </header>
        <nav className="notfound-links">
          <Link to="/" className="hero-button primary">Home</Link>
          <Link to="/projects" className="hero-button">Projects</Link>
          <Link to="/blogs" className="hero-button">Blog</Link>
          <Link to="/about" className="hero-button">About</Link>
        </nav>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
