import React from 'react';
import '../styles/skills.css';

interface SkillProps {
  name: string;
  level: number; // 1-5 scale
  category: string;
}

const Skills: React.FC = () => {
  const skills: SkillProps[] = [
    // Programming Languages
    { name: 'Python', level: 5, category: 'language' },
    { name: 'C', level: 4, category: 'language' },
    { name: 'JScript', level: 4, category: 'language' },
    { name: 'React', level: 3, category: 'language' },
    
    // Frameworks
    { name: 'Git', level: 4, category: 'framework' },
    { name: 'TensorFlow', level: 3, category: 'framework' },
    { name: 'Sckit', level: 3, category: 'framework' },
    { name: 'Langchain', level: 4, category: 'framework' }, 
    { name: 'Pytorch', level: 4, category: 'framework' }, 
  ];

  // Group skills by category
  const groupedSkills: Record<string, SkillProps[]> = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, SkillProps[]>);

  // Map category names to display names
  const categoryNames: Record<string, string> = {
    language: 'Languages',
    framework: 'Frameworks & Libraries'
    // Removed tool category
  };

  return (
    <section className="skills-section">
      <h2>Skills</h2>
      <div className="skills-container">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          // Skip the tool category
          categoryNames[category] ? (
            <div key={category} className="skills-category">
              <h3>{categoryNames[category]}</h3>
              <div className="skills-list">
                {categorySkills.map((skill, index) => (
                  <div key={index} className="skill-bullet">
                    <div className={`circle ${skill.name.toLowerCase()}`}></div>
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-level">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`level-dot ${i < skill.level ? 'filled' : ''}`}
                        ></span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        ))}
      </div>
    </section>
  );
};

export default Skills;