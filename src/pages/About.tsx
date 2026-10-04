import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAssetPath } from '../config';
import '../styles/about.css';
import { useDocumentTitle } from '../useDocumentTitle';

const About: React.FC = () => {
  useDocumentTitle('About');
  return (
    <div className="about-page">
      <Header />
      <div className="about-container">
        <div className="about-content">
          <h1>About Me</h1>
          <div className="about-details">
            <p>
              Computer Science Engineer (UC3M), currently in AXA's Graduate Tech program in Madrid, a full-time
              rotational scheme working on AI and data projects across technical departments.
            </p>
            <p>
              My academic journey includes an exchange year at San Francisco State University, taking master's-level
              courses co-taught by professionals from OpenAI, IBM and other Bay Area companies. My Bachelor's thesis
              received the maximum grade and was nominated for honours distinction.
            </p>
            <p>
              I seek to develop high-impact solutions at the intersection of technology, business and product. In my
              free time I explore AI and agentic coding tools, taking ideas into working products and testing them
              through hackathons and independent builds.
            </p>

            <h2>Education</h2>
            <ul>
              <li>
                <strong>BSc in Computer Science Engineering, Universidad Carlos III de Madrid</strong> (2021 – 2025).
                Graduated in the top 10% of the cohort. Bachelor's thesis on applying AI to research, awarded the
                maximum grade and nominated for honours distinction.
              </li>
              <li>
                <strong>Exchange Year, San Francisco State University</strong> (Aug 2023 – Jun 2024). Passed a
                qualifying exam to take master's-level courses as an undergraduate, co-taught by Bay Area
                professionals from IBM and OpenAI. Began the AI project that turned into my bachelor's thesis.
              </li>
            </ul>

            <h2>Recognition &amp; Languages</h2>
            <ul>
              <li>Multiple hackathon winner: HackSpain (2026), Qubic &amp; Vottun Madrid Hackathon (2025), and II Circular Innovation Hackathon (Mallorca).</li>
              <li><strong>Languages:</strong> Spanish (native), English C2 (Cambridge; IELTS 8/9).</li>
            </ul>

            <div className="about-links">
              <a href={getAssetPath('CV.pdf')} target="_blank" rel="noopener noreferrer" className="project-link">
                Download CV
              </a>
              <a href="mailto:guillermovillarsanchez@gmail.com" className="project-link">
                Get in touch
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
