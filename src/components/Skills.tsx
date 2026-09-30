import React from 'react';
import '../styles/skills.css';
import { techClass } from '../utils';

interface Skill {
  name: string;
  level: number; // 1-5 scale, used for ordering
  note?: string;
}

const skillGroups: { title: string; skills: Skill[] }[] = [
  {
    title: 'Programming',
    skills: [
      { name: 'Python', level: 5 },
      { name: 'TypeScript', level: 4 },
      { name: 'Java', level: 3 },
      { name: 'SQL', level: 4 },
      { name: 'C', level: 4 },
    ],
  },
  {
    title: 'Frameworks & Tools',
    skills: [
      { name: 'PyTorch', level: 4 },
      { name: 'LangChain', level: 4 },
      { name: 'TensorFlow', level: 3 },
      { name: 'scikit-learn', level: 3 },
      { name: 'React', level: 3 },
      { name: 'Next.js', level: 3 },
      { name: 'PostgreSQL', level: 4 },
      { name: 'Selenium', level: 3 },
      { name: 'Docker', level: 3 },
      { name: 'Git', level: 4 },
    ],
  },
  {
    title: 'Languages',
    skills: [
      { name: 'Spanish', level: 5, note: 'Native' },
      { name: 'English', level: 5, note: 'C2' },
      { name: 'French', level: 2, note: 'Basic' },
    ],
  },
];

const Skills: React.FC = () => (
  <div className="skills-grid">
    {skillGroups.map(({ title, skills }) => (
      <div key={title} className="skills-category">
        <h3>{title}</h3>
        <ul className="skills-list">
          {[...skills].sort((a, b) => b.level - a.level).map((skill) => (
            <li key={skill.name} className="skill-bullet">
              <span className={`circle ${techClass(skill.name)}`}></span>
              {skill.name}
              {skill.note && <span className="skill-note">{skill.note}</span>}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export default Skills;
