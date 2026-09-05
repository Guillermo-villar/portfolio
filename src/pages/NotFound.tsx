import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/notfound.css';

/**
 * Catch-all for unknown routes. Without this, any typo in the hash mounted an
 * empty <div id="root"> — no header, no footer, no way back.
 */
const NotFound: React.FC = () => (
  <div className="notfound-page">
    <Header />
    <main className="notfound-container">
      <p className="notfound-code">404</p>
      <h1>This page doesn't exist</h1>
      <p className="notfound-text">
        The link may be out of date, or the address may have a typo in it. Everything below still
        works.
      </p>
      <nav className="notfound-links">
        <Link to="/" className="notfound-link primary">Home</Link>
        <Link to="/projects" className="notfound-link">Projects</Link>
        <Link to="/blogs" className="notfound-link">Blog</Link>
        <Link to="/about" className="notfound-link">About</Link>
      </nav>
    </main>
    <Footer />
  </div>
);

export default NotFound;
