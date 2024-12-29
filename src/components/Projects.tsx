import React from 'react';
import '../styles/projects.css';

const Projects = () => {
  const projects = [
    { id: 1, title: 'Project 1', description: 'Project description', image: '/images/project1.jpg', link: 'https://example.com/project1' },
    { id: 2, title: 'Project 2', description: 'Project description', image: '/images/project2.jpg', link: 'https://example.com/project2' },
    { id: 3, title: 'Project 3', description: 'Project description', image: '/images/project3.jpg', link: 'https://example.com/project3' },
    { id: 4, title: 'Project 4', description: 'Project description', image: '/images/project4.jpg', link: 'https://example.com/project4' },
  ];

  return (
    <section className="projects-section">
      <h2>Projects</h2>
      <div className="projects-container">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <img src={project.image} alt={project.title} className="project-image" />
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
