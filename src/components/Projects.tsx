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
    { id: 1, title: 'AI Digit Detector', description: 'Demo on Machine Learning using Pyton & Tensorflow', image: 'AI.png', link: '/projects/ai-demo', techStack: 'Python, Tensorflow', isDemo : true},
    { id: 2, title: 'Crypto Safe Fileshare', description: 'Cryptographically robust Filesharing system, with custom Certificate system', image: 'outp.webp', link: '/projects/crypto', techStack: 'Python, Cryptography' , isDemo : false},
    { id: 3, title: 'NGO Crypto funding', description: 'A Web3 solution to NGO´s lack of accountability', image: 'G3.png', link: 'https://www.linkedin.com/feed/update/urn:li:activity:7310295376819806208/', techStack: 'Web3, Blockchain', isDemo : false},
    { id: 4, title: 'Web Portfolio', description: 'This very Website!!', image: 'web.png', link: '/blog/2', techStack: 'Web, React, Javascript', isDemo : false},
    { id: 5, title: 'Bachelor Thesis', description: 'Unbalanced dataset machine learning', image: 'TFG.jpeg', link: 'https://www.sciencedirect.com/topics/computer-science/imbalance-ratio' ,techStack: 'Machine-Learning, Statistics' , isDemo : false},
    { id: 6, title: 'Coming soon...', description: 'Stay updated for new projects!! Click the link for something random', image: 'comin.png', link: 'https://en.wikipedia.org/wiki/Special:Random' , techStack: '???, !!!', isDemo : false},
  ];
  
  // Limitamos el número de proyectos si 'limit' está definido
  const projectsToShow = limit ? projects.slice(0, limit) : projects;

  // Helper function to determine if a link is external
  const isExternalLink = (link: string) => {
    return link.startsWith('http://') || link.startsWith('https://');
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
                e.currentTarget.src = getAssetPath('comin.png'); // Fallback image
              }}
            />
            <div className={`project-info ${isHomePage ? 'home-page-info' : ''}`}>
            {project.isDemo && showDemo && (
              <div className="project-demo demo">
                {isExternalLink(project.link) ? (
                  <a href={project.link} className="project-demo demo">Try the demo!!</a>
                ) : (
                  <Link to={project.link} className="project-demo demo">Try the demo!!</Link>
                )}
              </div>
            )}
              <h3 className={isHomePage ? 'left-aligned-title' : ''}>{project.title}</h3>
              <div className="tech-stack">
                {project.techStack.split(', ').map((tech, index) => (
                  <div key={index} className="tech-bullet">
                   <div className={`circle ${tech.toLowerCase()}`}></div>
                  {tech}
                </div>
                ))}
              </div>
            </div>
            <div className="project-overlay">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {isExternalLink(project.link) ? (
                <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
                  Visit Project
                </a>
              ) : (
                <Link to={project.link} className="project-link">
                  Visit Project
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
