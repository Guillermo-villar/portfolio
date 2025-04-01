import React from 'react';
import '../styles/experience.css';

interface ExperienceProps {
  logo: string;
  company: string;
  startDate: string;
  description: string[];
}

const Experience: React.FC<ExperienceProps> = ({ logo, company, startDate, description }) => {
  return (
    <div className="experience-card">
      <img src={logo} alt={`${company} logo`} className="experience-logo" />
      <div className="experience-details">
        <h3>{company}</h3>
        <p>{startDate}</p>
        <ul>
          {description.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ExperienceList: React.FC = () => {
  const experiences = [
    {
      logo: '/OpenAI.png',  // Changed to AI.png which exists in your public folder
      company: 'AI Freelance Annotator',
      startDate: 'September 2024 - Present',
      description: [
        'Worked for multiple companies on OpenAI and Google models',
        'Applied code expertise to improve accuracy on over 90% of models worked with',
      ],
    },
    {
      logo: '/sfsu.jpg',
      company: 'Computer Egineering Assistant',
      startDate: 'January 2024 - June 2024',
      description: [
        'Design coursework and projects for students',
        'Managed project timelines and deliverables',
        'Conducted code reviews and provided feedback',
      ],
    },
  ];

  return (
    <section className="experience-section">
      <h2>Experience</h2>
      <div className="experience-container">
        {experiences.map((exp, index) => (
          <Experience
            key={index}
            logo={exp.logo}
            company={exp.company}
            startDate={exp.startDate}
            description={exp.description}
          />
        ))}
      </div>
    </section>
  );
};

export default ExperienceList;
