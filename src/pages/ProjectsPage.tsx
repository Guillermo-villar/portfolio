import React from 'react';
import Header from '../components/Header';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import { useDocumentTitle } from '../utils';
import '../styles/home.css';
import '../styles/projects.css';

const ProjectsPage: React.FC = () => {
  useDocumentTitle('Projects');

  return (
    <div className="home">
      <Header />
      <main className="projects-page">
        <header className="page-intro">
          <h1>Projects</h1>
          <p>Things I've built: products, research and hackathon work.</p>
        </header>
        <Projects />
      </main>
      <Footer />
    </div>
  );
};

export default ProjectsPage;
