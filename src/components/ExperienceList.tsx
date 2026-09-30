import React from 'react';
import '../styles/experience.css';
import { getAssetPath } from '../config';

interface Bullet {
  label?: string;
  text: string;
}

interface Entry {
  role: string;
  org: string;
  dates: string;
  current?: boolean;
  // Either an image in /public or a text badge when no logo is available
  logo?: string;
  badge?: { text: string; color: string };
  bullets: Bullet[];
}

const work: Entry[] = [
  {
    role: 'Graduate Tech Program',
    org: 'AXA',
    dates: 'Sep 2025 – Present',
    current: true,
    badge: { text: 'AXA', color: '#00008F' },
    bullets: [
      { text: 'Rotational program across technical and business teams, turning business requirements into AI, data, automation and software-quality initiatives.' },
      { label: 'AI Automation (Testing)', text: 'Built Java + Selenium browser automation and AI-driven exploratory testing workflows.' },
      { label: 'AI Solution Exploration (Innovation)', text: 'Implemented an end-to-end HR agent and explored emerging AI technologies for the innovation strategy.' },
    ],
  },
  {
    role: 'Freelance Software Engineer',
    org: 'OutlierAI',
    dates: 'Sep 2024 – Nov 2025',
    badge: { text: 'Outlier', color: '#1a1a1a' },
    bullets: [
      { text: 'Designed and maintained Python data pipelines connecting subject-matter experts with LLM providers including OpenAI and Google.' },
      { text: 'Onboarded multiple RLHF projects, improving accuracy in 90%+ of the models worked on through structured evaluation.' },
      { text: 'Validated LLM use cases where deterministic Python tools beat the model, balancing automation with human review.' },
    ],
  },
];

const education: Entry[] = [
  {
    role: 'BSc Computer Science Engineering',
    org: 'Universidad Carlos III de Madrid',
    dates: '2021 – 2025',
    badge: { text: 'UC3M', color: '#000e78' },
    bullets: [
      { text: "Bachelor's thesis on leveraging AI in research, graded with maximum honors." },
    ],
  },
  {
    role: 'Exchange Year',
    org: 'San Francisco State University',
    dates: 'Aug 2023 – Jun 2024',
    logo: 'sfsu.jpg',
    bullets: [
      { text: 'Master-level courses taught by professionals from OpenAI, Intel, IBM and VMware; started an AI explainability research project.' },
    ],
  },
];

const TimelineItem: React.FC<Entry> = ({ role, org, dates, current, logo, badge, bullets }) => (
  <li className={`timeline-item ${current ? 'current' : ''}`}>
    {logo ? (
      <img src={getAssetPath(logo)} alt={`${org} logo`} className="timeline-logo" />
    ) : (
      <div className="timeline-logo timeline-badge" style={{ backgroundColor: badge?.color }} aria-hidden="true">
        {badge?.text}
      </div>
    )}
    <div className="timeline-body">
      <p className="timeline-dates">
        {dates}
        {current && <span className="timeline-current">Now</span>}
      </p>
      <h4>{role}</h4>
      <p className="timeline-org">{org}</p>
      <ul>
        {bullets.map((b, i) => (
          <li key={i}>
            {b.label && <strong>{b.label}: </strong>}
            {b.text}
          </li>
        ))}
      </ul>
    </div>
  </li>
);

const ExperienceList: React.FC = () => (
  <div className="experience-grid">
    <div>
      <h3 className="timeline-label">Work</h3>
      <ol className="timeline">
        {work.map((e) => <TimelineItem key={e.role} {...e} />)}
      </ol>
    </div>
    <div>
      <h3 className="timeline-label">Education</h3>
      <ol className="timeline">
        {education.map((e) => <TimelineItem key={e.role} {...e} />)}
      </ol>
    </div>
  </div>
);

export default ExperienceList;
