import React from 'react';
import Header from '../components/Header';
import '../styles/projecttemplate.css';

interface ProjectData {
  title: string;
  image: string;
  description: string; 
  githubLink: string;
  type: string;   
  isDemo: boolean;
  projStack: string;
}

const ProjectTemplate: React.FC<ProjectData> = ({ title, image, description, githubLink, type, projStack }) => {
  return (
    <div className="project-page">
      <Header />
      <div className="project-content">
        <h1>{title}</h1>
        <div className="image-container">
          <img src={image} alt={title} className="project-image" />
        </div>
        <p className="project-description">{description}</p>
        <div className="project-details">
          <a href={githubLink} target="_blank" rel="noopener noreferrer" className="project-link">
            Ver en GitHub
          </a>
          <p className="project-type">Tipo: {type}</p>
        </div>
        <div className="proj-stack-card">
          <h3>Tech Stack</h3>
          <div className="proj-stack">
            {projStack.split(', ').map((tech, index) => (
              <div key={index} className="proj-bullet">
                <div className={`circle ${tech.toLowerCase()}`}></div>
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTemplate;