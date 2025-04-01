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
      logo: '/path/to/logo1.png',
      company: 'Company One',
      startDate: 'January 2020 - Present',
      description: [
        'Developed new features for the company website',
        'Collaborated with the design team to improve UI/UX',
        'Implemented responsive design',
      ],
    },
    {
      logo: '/path/to/logo2.png',
      company: 'Company Two',
      startDate: 'June 2018 - December 2019',
      description: [
        'Led a team of 5 developers',
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
