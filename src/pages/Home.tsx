import React from 'react';
import { Link } from 'react-router-dom';
import { FaBrain, FaShieldAlt, FaMountain, FaSearch } from 'react-icons/fa';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Projects, { projectCount } from '../components/Projects';
import Footer from '../components/Footer';
import ExperienceList from '../components/ExperienceList';
import Skills from '../components/Skills';
import '../styles/home.css';
import { useDocumentTitle } from '../utils';

const interests = [
  {
    title: 'Applied AI',
    description: 'Agentic AI engineering, deep learning, and AI applications that solve real-world problems.',
    icon: <FaBrain />,
  },
  {
    title: 'Cybersecurity',
    description: 'Exploring encryption methods, secure coding practices, and network security principles.',
    icon: <FaShieldAlt />,
  },
  {
    title: 'Outdoors',
    description: 'Mountaineering teaches perseverance and strategic thinking—skills that translate perfectly to overcoming challenges in both code and life.',
    icon: <FaMountain />,
  },
  {
    title: 'Research',
    description: 'Always curious about new technologies and methodologies in computer science and software engineering.',
    icon: <FaSearch />,
  },
];

const Section: React.FC<{ id: string; title: string; action?: React.ReactNode; children: React.ReactNode }> = ({ id, title, action, children }) => (
  <section id={id} className="home-section">
    <div className="section-header">
      <h2>{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

const Home: React.FC = () => {
  useDocumentTitle();

  return (
    <div className="home">
      <Header />
      <main className="home-main">
        <Hero />

        <Section
          id="projects"
          title="Featured projects"
          action={<Link to="/projects" className="section-link">All {projectCount} projects →</Link>}
        >
          <Projects limit={3} />
        </Section>

        <Section id="experience" title="Experience">
          <ExperienceList />
        </Section>

        <Section id="skills" title="Skills">
          <Skills />
        </Section>

        <Section id="interests" title="Beyond work">
          <div className="interests-grid">
            {interests.map((interest) => (
              <div key={interest.title} className="interest-card">
                <div className="interest-icon" aria-hidden="true">{interest.icon}</div>
                <h3>{interest.title}</h3>
                <p>{interest.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <section className="contact-cta">
          <h2>Let's talk</h2>
          <p>Open to conversations about AI, data and automation projects.</p>
          <a href="mailto:guillermovillarsanchez@gmail.com" className="hero-button primary">guillermovillarsanchez@gmail.com</a>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
