import React from 'react';
import '../styles/projects.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const Projects: React.FC<{ limit?: number }> = ({ limit }) => {
  const projects = [
    { id: 1, title: 'AI Digit Detector', description: 'Demo on Machine Learning using Pyton & Tensorflow', image: '/AI.png', link: 'https://example.com/project1', techStack: 'Python, Tensorflow' },
    { id: 2, title: 'Project 2', description: 'Project description', image: '/images/project2.jpg', link: 'https://example.com/project2' },
    { id: 3, title: 'Project 3', description: 'Project description', image: '/images/project3.jpg', link: 'https://example.com/project3' },
    { id: 4, title: 'Project 4', description: 'Project description', image: '/images/project4.jpg', link: 'https://example.com/project4' },
    { id: 5, title: 'Project 3', description: 'Project description', image: '/images/project3.jpg', link: 'https://example.com/project3' },
    { id: 6, title: 'Project 4', description: 'Project description', image: '/images/project4.jpg', link: 'https://example.com/project4' },
  ];
  // Limitamos el número de proyectos si 'limit' está definido
  const projectsToShow = limit ? projects.slice(0, limit) : projects;
  return (
    <section className="projects-section">
      <h2>Projects</h2>
      <div className="projects-container">
        {projectsToShow.map((project) => (    
          <div key={project.id} className="project-card">
            <img src={project.image} alt={project.title} className="project-image" />
            {/* Black section at the bottom for title and tech stack */}
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.techStack}</p>
            </div>
            <div className="project-overlay">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                Visit Project
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
