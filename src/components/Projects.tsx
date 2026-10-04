import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/projects.css';
import { getAssetPath } from '../config';

// Adding showDemo prop with a default value of true and isHomePage to control positioning
const Projects: React.FC<{ limit?: number, showDemo?: boolean, isHomePage?: boolean }> = ({ 
  limit, 
  showDemo = true, 
  isHomePage = false 
}) => {
  const projects = [
    { id: 1, title: 'Sol Sombra', description: 'Walking routes across Madrid chosen by how much sun each stretch of pavement gets', image: 'solsombra.webp', link: '/projects/solsombra', techStack: 'Next.js, PostGIS', isDemo : false},
    { id: 2, title: 'AI Digit Detector', description: 'Demo on Machine Learning using Python & Tensorflow', image: 'AI.webp', link: '/projects/ai-demo', techStack: 'Python, Tensorflow', isDemo : true},
    { id: 3, title: 'Crypto Safe Fileshare', description: 'Cryptographically robust Filesharing system, with custom Certificate system', image: 'outp.webp', link: '/projects/crypto', techStack: 'Python, Cryptography' , isDemo : false},
    { id: 4, title: 'NGO Crypto Funding', description: 'A Web3 solution to NGO´s lack of accountability', image: 'G3.png', link: 'https://www.linkedin.com/feed/update/urn:li:activity:7310295376819806208/', techStack: 'Web3, Blockchain', isDemo : false},
    { id: 5, title: 'Web Portfolio', description: 'This very Website!!', image: 'web.webp', link: '/blog/2', techStack: 'Web, React, Javascript', isDemo : false},
    { id: 6, title: 'Bachelor Thesis', description: 'Unbalanced dataset machine learning', image: 'TFG.jpeg', link: '/bach-thesis' ,techStack: 'Machine-Learning, Statistics' , isDemo : false},
    { id: 7, title: 'Coming soon...', description: 'Stay updated for new projects!! Click the link for something random', image: 'comin.webp', link: 'https://en.wikipedia.org/wiki/Special:Random' , techStack: '???, !!!', isDemo : false},
  ];
  
  // Limitamos el número de proyectos si 'limit' está definido
  const projectsToShow = limit ? projects.slice(0, limit) : projects;

  // Only react-router routes may use <Link>; anything else (external URLs or
  // static paths like /bach-thesis) needs a plain anchor or HashRouter rewrites
  // it to a broken hash route.
  const isAppRoute = (link: string) => {
    return /^\/(projects|blog)\//.test(link);
  };

  return (
    <section className="projects-section">
      <h2>Projects</h2>
      <div className="projects-container">
        {projectsToShow.map((project) => (    
          <div key={project.id} className={`project-card ${project.isDemo ? 'demo' : ''}`}>
            <img
              src={getAssetPath(project.image)}
              alt={project.title}
              className="project-image"
              onError={(e) => {
                console.error(`Failed to load image: ${project.image}`);
                e.currentTarget.src = getAssetPath('comin.webp'); // Fallback image
              }}
            />
            {project.isDemo && showDemo && (
              isAppRoute(project.link) ? (
                <Link to={project.link} className="demo-badge">Live demo</Link>
              ) : (
                <a href={project.link} className="demo-badge" target="_blank" rel="noopener noreferrer">Live demo</a>
              )
            )}
            <div className={`project-info ${isHomePage ? 'home-page-info' : ''}`}>
              <h3 className={isHomePage ? 'left-aligned-title' : ''}>{project.title}</h3>
              <div className="tech-stack">
                {project.techStack.split(', ').map((tech, index) => (
                  <div key={index} className="tech-bullet">
                   <div className={`circle ${tech.toLowerCase()}`}></div>
                   <span className="tech-name">{tech}</span>
                </div>
                ))}
              </div>
            </div>
            <div className="project-overlay">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {isAppRoute(project.link) ? (
                <Link to={project.link} className="project-link">
                  Visit Project
                </Link>
              ) : (
                <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
                  Visit Project
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
