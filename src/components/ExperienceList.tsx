import React, { useState } from 'react';
import '../styles/experience.css';
import { getAssetPath } from '../config';

interface ExperienceProps {
  logo: string;
  role: string;
  company: string;
  location?: string;
  from: string;
  to: string;
  summary?: string;
  bullets: string[];
}

// "**Label:** text" renders the label in bold
const renderBullet = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith('**') ? <strong key={index}>{part.slice(2, -2)}</strong> : part
  );

const Experience: React.FC<ExperienceProps> = ({ logo, role, company, location, from, to, summary, bullets }) => {
  const [imgError, setImgError] = useState(false);
  const current = to === 'Present';

  return (
    <div className="experience-entry">
      <span className={`experience-dot ${current ? 'current' : ''}`} aria-hidden="true"></span>
      <div className="experience-card">
        <div className="experience-header">
          <img
            src={getAssetPath(logo)}
            alt={`${company} logo`}
            className="experience-logo"
            onError={(e) => {
              if (!imgError) {
                // Try fallback direct path
                e.currentTarget.src = `${process.env.PUBLIC_URL}/${logo}`;
                setImgError(true);
              }
            }}
          />
          <div className="experience-title">
            <h3>{role}</h3>
            <p className="experience-company">{location ? `${company} · ${location}` : company}</p>
          </div>
          <p className="experience-date">
            {from} – <span className={current ? 'present' : undefined}>{to}</span>
          </p>
        </div>
        {summary && <p className="experience-summary">{summary}</p>}
        <ul>
          {bullets.map((item, index) => (
            <li key={index}>{renderBullet(item)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ExperienceList: React.FC = () => {
  const experiences: ExperienceProps[] = [
    {
      logo: 'axa.png',
      role: 'Tech Graduate Program',
      company: 'AXA',
      location: 'Madrid',
      from: 'Sep 2025',
      to: 'Present',
      summary: 'Full-time rotational programme across technical and business teams at a global insurer.',
      bullets: [
        '**Testing:** implemented self-healing testing paradigms using DOM-based automation and AI to fix broken test flows.',
        '**Innovation:** built an HR AI agent now in production, and Project WarRoom, which uses AI and document management to automate the business side of software workflows across the company.',
      ],
    },
    {
      logo: 'outlier.png',
      role: 'Freelance Software Engineer',
      company: 'Outlier AI',
      from: 'Sep 2024',
      to: 'Nov 2025',
      bullets: [
        'Worked with domain experts and LLM provider teams to translate subject-matter expertise into Python data-pipeline requirements.',
        'Evaluated LLM-generated code and contributed to RLHF projects through structured review, testing and iteration.',
      ],
    },
  ];

  return (
    <section className="experience-section">
      <h2>Experience</h2>
      <div className="experience-container">
        {experiences.map((exp) => (
          <Experience key={`${exp.company}-${exp.from}`} {...exp} />
        ))}
      </div>
    </section>
  );
};

export default ExperienceList;
