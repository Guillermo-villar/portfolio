import React from 'react';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaGithub, FaPlay } from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/projecttemplate.css';
import { getAssetPath } from '../config';
import { isExternalLink, techClass, useDocumentTitle } from '../utils';

interface ProjectData {
  title: string;
  tagline: string;
  image: string;
  paragraphs: string[];
  // Both links are optional: a project can be closed-source, have no public
  // deployment to visit, or neither.
  githubLink?: string;
  liveLink?: string;
  liveLabel?: string;
  type: string;
  stack: string[];
}

const ProjectTemplate: React.FC<ProjectData> = ({ title, tagline, image, paragraphs, githubLink, liveLink, liveLabel, type, stack }) => {
  useDocumentTitle(title);

  const actions = (liveLink || githubLink) && (
    <div className="project-actions">
      {liveLink && (isExternalLink(liveLink) ? (
        <a href={liveLink} target="_blank" rel="noopener noreferrer" className="project-action">
          <FaExternalLinkAlt aria-hidden="true" /> {liveLabel || 'Visit the site'}
        </a>
      ) : (
        <Link to={liveLink} className="project-action">
          <FaPlay aria-hidden="true" /> {liveLabel || 'Open'}
        </Link>
      ))}
      {githubLink && (
        <a href={githubLink} target="_blank" rel="noopener noreferrer" className="project-action secondary">
          <FaGithub aria-hidden="true" /> View on GitHub
        </a>
      )}
    </div>
  );

  return (
    <div className="project-page">
      <Header />
      <main className="project-wrapper">
        <article className="project-content">
          <Link to="/projects" className="back-link">← All projects</Link>
          <h1>{title}</h1>
          <p className="project-tagline">{tagline}</p>
          {actions && <div className="project-actions-inline">{actions}</div>}
          <img src={getAssetPath(image)} alt={`${title} screenshot`} className="project-hero-image" />
          {paragraphs.map((p, i) => (
            <p key={i} className="project-description">{p}</p>
          ))}
        </article>

        <aside className="project-sidebar">
          {actions && <div className="project-actions-sidebar">{actions}</div>}
          <h3>Tech stack</h3>
          <ul className="project-stack">
            {stack.map((tech) => (
              <li key={tech}>
                <span className={`circle ${techClass(tech)}`}></span>
                {tech}
              </li>
            ))}
          </ul>
          <h3>Type</h3>
          <p className="project-type">{type}</p>
        </aside>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectTemplate;
