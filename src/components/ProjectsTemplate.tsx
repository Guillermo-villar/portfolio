import React from 'react';
import Header from '../components/Header';
import '../styles/projecttemplate.css';
import { getAssetPath } from '../config';

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
  // Split the description into two paragraphs
  const paragraphs = description.split('. ');
  const midpoint = Math.ceil(paragraphs.length / 2);
  
  const firstParagraph = paragraphs.slice(0, midpoint).join('. ') + '.';
  const secondParagraph = paragraphs.slice(midpoint).join('. ');

  // Assign skill levels based on tech names (simulating the skills component behavior)
  const getSkillLevel = (tech: string): number => {
    // This could be enhanced with real skill data if available
    const skillLevels: {[key: string]: number} = {
      'Python': 5,
      'Tensorflow': 3,
      'Cryptography': 4,
      'Web': 4,
      'React': 3,
      'Javascript': 4,
      'Web3': 3,
      'Blockchain': 3,
      'Machine-Learning': 5,
      'Statistics': 4
    };
    
    return skillLevels[tech] || 3; // Default level 3 if not specified
  };

  return (
    <div className="project-page">
      <Header />
      
      {/* Main content container */}
      <div className="project-wrapper">
        {/* Tech stack section - similar to skills section */}
        <div className="tech-stack-section">
          <div className="skills-category">
            <h3>Technologies Used</h3>
            <div className="skills-list">
              {projStack.split(', ').map((tech, index) => (
                <div key={index} className="skill-bullet">
                  <div className={`circle ${tech.toLowerCase()}`}></div>
                  <span className="skill-name">{tech}</span>
                  <div className="skill-level">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`level-dot ${i < getSkillLevel(tech) ? 'filled' : ''}`}
                      ></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content container */}
        <div className="project-content">
          <h1>{title}</h1>
          
          <div className="image-container">
            <img src={getAssetPath(image)} alt={title} className="project-image" />
          </div>
          
          <div className="project-description-container">
            <p className="project-description">{firstParagraph}</p>
            <p className="project-description">{secondParagraph}</p>
            
            <div className="project-details">
              <a href={githubLink} target="_blank" rel="noopener noreferrer" className="project-link">
                View on GitHub
              </a>
              <p className="project-type">Type: {type}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTemplate;