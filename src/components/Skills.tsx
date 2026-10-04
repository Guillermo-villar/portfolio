import React from 'react';
import '../styles/skills.css';

const skillGroups: Array<{ title: string; skills: string[] }> = [
  {
    title: 'AI / ML',
    skills: ['RAG', 'Agents', 'LLM evaluation', 'RLHF', 'Retrieval pipelines', 'Prompt testing', 'Model failure analysis'],
  },
  {
    title: 'Engineering',
    skills: ['Python', 'TypeScript', 'Java', 'REST APIs', 'PostgreSQL', 'Selenium', 'Playwright', 'Git'],
  },
];

const dotClass = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const Skills: React.FC = () => {
  return (
    <section className="skills-section">
      <h2>Skills</h2>
      <div className="skills-container">
        {skillGroups.map((group) => (
          <div key={group.title} className="skills-category">
            <h3>{group.title}</h3>
            <div className="skills-list">
              {group.skills.map((skill) => (
                <div key={skill} className="skill-bullet">
                  <div className={`circle ${dotClass(skill)}`}></div>
                  <span className="skill-name">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
