import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/projects.css';
import { getAssetPath } from '../config';
import { isAppRoute, isExternalLink, techClass } from '../utils';

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
  { title: 'AI Digit Detector', description: 'A neural network that reads your handwriting. Draw a digit and try it live in the browser.', image: 'card-ai.webp', link: '/projects/ai-demo', techStack: ['Python', 'TensorFlow'], badge: 'Live demo' },
  { title: 'Crypto Safe Fileshare', description: 'Cryptographically robust file-sharing system with a custom certificate system.', image: 'card-crypto.webp', link: '/projects/crypto', techStack: ['Python', 'Cryptography'] },
  { title: 'NGO Crypto Funding', description: "A Web3 answer to NGOs' lack of accountability.", image: 'card-ngo.webp', link: 'https://www.linkedin.com/feed/update/urn:li:activity:7310295376819806208/', techStack: ['Web3', 'Blockchain'] },
  { title: 'Web Portfolio', description: 'This very website, built from scratch.', image: 'card-web.webp', link: '/blog/2', techStack: ['React', 'TypeScript'] },
  { title: 'Bachelor Thesis', description: 'Machine learning on imbalanced datasets.', image: 'card-thesis.webp', link: '/bach-thesis', techStack: ['Machine Learning', 'Statistics'] },
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
  ) : isAppRoute(link) ? (
    <Link to={link} className="project-card" aria-label={title}>
      {content}
    </Link>
  ) : (
    <a href={link} className="project-card" aria-label={title}>
      {content}
    </a>
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
