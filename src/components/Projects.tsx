import React from 'react';
import '../styles/projects.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const Projects: React.FC<{ limit?: number }> = ({ limit }) => {
  const projects = [
    { id: 1, title: 'AI Digit Detector', description: 'Demo on Machine Learning using Pyton & Tensorflow', image: '/AI.png', link: '/projects/ai-demo ', techStack: 'Python, Tensorflow', isDemo : true},
    { id: 2, title: 'Project 2', description: 'Project description', image: '/images/project2.jpg', link: 'https://example.com/project2', techStack: 'Python, Tensorflow' , isDemo : false},
    { id: 3, title: 'Project 3', description: 'Project description', image: '/images/project3.jpg', link: 'https://example.com/project3', techStack: 'Python, Tensorflow', isDemo : false},
    { id: 4, title: 'Project 4', description: 'Project description', image: '/images/project4.jpg', link: 'https://example.com/project4' , techStack: 'Python, Tensorflow', isDemo : false},
    { id: 5, title: 'Project 3', description: 'Project description', image: '/images/project3.jpg', link: 'https://example.com/project3' ,techStack: 'Python, Tensorflow' , isDemo : false},
    { id: 6, title: 'Project 4', description: 'Project description', image: '/images/project4.jpg', link: 'https://example.com/project4' , techStack: 'Python, Tensorflow', isDemo : false},
  ];
  // Limitamos el número de proyectos si 'limit' está definido
  const projectsToShow = limit ? projects.slice(0, limit) : projects;
  return (
    <section className="projects-section">
      <h2>Projects</h2>
      <div className="projects-container">
        {projectsToShow.map((project) => (    
          <div key={project.id} className={`project-card ${project.isDemo ? 'demo' : ''}`}>
            <img src={project.image} alt={project.title} className="project-image" />
            <div className="project-info">
            {project.isDemo && (<div className="project-demo demo"><a href={project.link} className="project-demo demo">Try the demo!!</a></div>)}
              <h3>{project.title}</h3>
              <div className="tech-stack">
                {project.techStack.split(', ').map((tech, index) => (
                  <div key={index} className="tech-bullet">
                   <div className={`circle ${tech.toLowerCase()}`}></div> {/* El círculo con el color */}
                  {tech} {/* El texto de la tecnología */}
                </div>
                
                ))}
              </div>
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
