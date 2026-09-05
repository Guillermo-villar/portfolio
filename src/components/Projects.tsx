import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/projects.css';
import { getAssetPath } from '../config';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  /** Where "Visit Project" goes. */
  link: string;
  techStack: string;
  /**
   * Where the "Try the demo" badge goes. Only set it on projects that really
   * have something to try — the badge used to point at a page whose own copy
   * said the demo was still coming.
   */
  demoLink?: string;
  demoLabel?: string;
  /**
   * Cards crop their image to fill the tile. The social card is a 1.91:1
   * composition with text in it, so cropping it slices a sentence in half —
   * that one is shown whole instead.
   */
  fit?: 'cover' | 'contain';
  /**
   * Letterbox colour behind a 'contain' image. Set it to the artwork's own
   * background so the bars read as padding rather than as a border.
   */
  fitBackground?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Sol Sombra',
    description:
      'Walking routes across Madrid chosen by how much sun each stretch of pavement gets',
    // The social card solsombra.madrid serves as its own og:image.
    image: 'solsombra-og.jpg',
    link: '/projects/solsombra',
    techStack: 'Next.js, PostGIS',
    demoLink: 'https://solsombra.madrid',
    demoLabel: 'See it live!!',
    fit: 'contain',
    fitBackground: '#f7ecd6'
  },
  {
    id: 2,
    title: 'AI Digit Detector',
    description: 'Demo on Machine Learning using Python & TensorFlow',
    image: 'AI.webp',
    link: '/projects/ai-demo',
    techStack: 'Python, TensorFlow',
    demoLink: '/projects/ai-demo/live',
    demoLabel: 'Try the demo!!'
  },
  {
    id: 3,
    title: 'Crypto Safe Fileshare',
    description:
      'Cryptographically robust Filesharing system, with custom Certificate system',
    image: 'outp.webp',
    link: '/projects/crypto',
    techStack: 'Python, Cryptography'
  },
  {
    id: 4,
    title: 'NGO Crypto funding',
    description: "A Web3 solution to NGOs' lack of accountability",
    image: 'G3.png',
    link: 'https://www.linkedin.com/feed/update/urn:li:activity:7310295376819806208/',
    techStack: 'Web3, Blockchain'
  },
  {
    id: 5,
    title: 'Web Portfolio',
    description: 'This very Website!!',
    image: 'og-image.png',
    link: '/blog/2',
    techStack: 'Web, React, JavaScript',
    fit: 'contain',
    fitBackground: '#1a1a1a'
  },
  {
    id: 6,
    title: 'Bachelor Thesis',
    description: 'Unbalanced dataset machine learning',
    image: 'TFG.jpeg',
    link: 'https://www.sciencedirect.com/topics/computer-science/imbalance-ratio',
    techStack: 'Machine-Learning, Statistics'
  },
  {
    id: 7,
    title: 'Coming soon...',
    description: 'Stay updated for new projects!! Click the link for something random',
    image: 'comin.webp',
    link: 'https://en.wikipedia.org/wiki/Special:Random',
    techStack: '???, !!!'
  }
];

const isExternalLink = (link: string): boolean => /^https?:\/\//.test(link);

/** Renders an internal route as a router link and anything else as an anchor. */
const SmartLink: React.FC<{ to: string; className: string; children: React.ReactNode }> = ({
  to,
  className,
  children
}) =>
  isExternalLink(to) ? (
    <a href={to} className={className} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link to={to} className={className}>
      {children}
    </Link>
  );

const Projects: React.FC<{ limit?: number; showDemo?: boolean; isHomePage?: boolean }> = ({
  limit,
  showDemo = true,
  isHomePage = false
}) => {
  const projectsToShow = limit ? projects.slice(0, limit) : projects;

  return (
    <section className="projects-section">
      <h2>Projects</h2>
      <div className="projects-container">
        {projectsToShow.map((project) => (
          <div
            key={project.id}
            className={`project-card ${project.demoLink ? 'demo' : ''} ${
              project.fit === 'contain' ? 'flat' : ''
            }`}
          >
            <img
              src={getAssetPath(project.image)}
              alt={project.title}
              className={`project-image ${project.fit === 'contain' ? 'contain' : ''}`}
              style={project.fitBackground ? { backgroundColor: project.fitBackground } : undefined}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.src = getAssetPath('comin.webp'); // Fallback image
              }}
            />
            <div className={`project-info ${isHomePage ? 'home-page-info' : ''}`}>
              {project.demoLink && showDemo && (
                <div className="project-demo demo">
                  <SmartLink to={project.demoLink} className="project-demo-link">
                    {project.demoLabel || 'Try the demo!!'}
                  </SmartLink>
                </div>
              )}
              <div className="project-info-row">
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
            </div>
            <div className="project-overlay">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <SmartLink to={project.link} className="project-link">
                Visit Project
              </SmartLink>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
