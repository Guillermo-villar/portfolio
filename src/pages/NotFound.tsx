import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/about.css';
import { useDocumentTitle } from '../useDocumentTitle';

const NotFound: React.FC = () => {
  useDocumentTitle('Page not found');
  return (
    <div className="about-page">
      <Header />
      <div className="about-container">
        <div className="about-content">
          <h1>Page not found</h1>
          <p>The page you are looking for does not exist.</p>
          <Link to="/" className="project-link">Back to home</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
