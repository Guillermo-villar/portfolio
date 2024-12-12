import React from 'react';
import '../styles/projects.css';

const Projects: React.FC = () => {
  const projects = [
    { title: 'Project 1', description: 'Project description' },
    { title: 'Project 2', description: 'Project description' },
    { title: 'Project 3', description: 'Project description' },
    { title: 'Project 4', description: 'Project description' },
  ];

  return (
    <section id="projects" className="projects">
      <h2>Projects</h2>
      <div className="project-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
