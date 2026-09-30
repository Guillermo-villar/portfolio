import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/projects.css';
import { getAssetPath } from '../config';
import { isExternalLink, techClass } from '../utils';

interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
  techStack: string[];
  badge?: string;
}

const projects: Project[] = [
  { title: 'Sol Sombra', description: 'Walking routes across Madrid chosen by how much sun each stretch of pavement gets.', image: 'solsombra-og.jpg', link: '/projects/solsombra', techStack: ['TypeScript', 'Next.js', 'PostGIS'], badge: 'Live' },
  { title: 'AI Digit Detector', description: 'Handwritten digit recognition with a convolutional neural network trained on MNIST.', image: 'AI.webp', link: '/projects/ai-demo', techStack: ['Python', 'TensorFlow'] },
  { title: 'Crypto Safe Fileshare', description: 'Cryptographically robust file-sharing system with a custom certificate system.', image: 'outp.webp', link: '/projects/crypto', techStack: ['Python', 'Cryptography'] },
  { title: 'NGO Crypto Funding', description: "A Web3 answer to NGOs' lack of accountability.", image: 'G3.png', link: 'https://www.linkedin.com/feed/update/urn:li:activity:7310295376819806208/', techStack: ['Web3', 'Blockchain'] },
  { title: 'Web Portfolio', description: 'This very website, built from scratch.', image: 'web.webp', link: '/blog/2', techStack: ['React', 'TypeScript'] },
  { title: 'Bachelor Thesis', description: 'Machine learning on imbalanced datasets.', image: 'TFG.jpeg', link: 'https://github.com/Guillermo-villar/TFG', techStack: ['Machine Learning', 'Statistics'] },
];

const ProjectCard: React.FC<Project> = ({ title, description, image, link, techStack, badge }) => {
  const content = (
    <>
      <div className="project-media">
        <img src={getAssetPath(image)} alt="" className="project-image" loading="lazy" />
      </div>
      <div className="project-info">
        <h3>
          {title}
          {isExternalLink(link) && <span className="project-external" aria-hidden="true"> ↗</span>}
          {badge && <span className="project-badge">{badge}</span>}
        </h3>
        <p>{description}</p>
        <div className="tech-stack">
          {techStack.map((tech) => (
            <span key={tech} className="tech-bullet">
              <span className={`circle ${techClass(tech)}`}></span>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </>
  );

  return isExternalLink(link) ? (
    <a href={link} className="project-card" target="_blank" rel="noopener noreferrer" aria-label={title}>
      {content}
    </a>
  ) : (
    <Link to={link} className="project-card" aria-label={title}>
      {content}
    </Link>
  );
};

export const projectCount = projects.length;

const Projects: React.FC<{ limit?: number }> = ({ limit }) => (
  <div className="projects-container">
    {(limit ? projects.slice(0, limit) : projects).map((project) => (
      <ProjectCard key={project.title} {...project} />
    ))}
  </div>
);

export default Projects;
