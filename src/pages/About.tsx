import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/about.css';
import { getAssetPath } from '../config';
import { useDocumentTitle } from '../utils';

const awards = [
  'Winner of the II Circular Innovation Hackathon (Mallorca) and Telefónica\'s Web3 Hackathon, the largest in Spain.',
  'Santander Bank Erasmus+ Scholarship (2023), awarded for outstanding GPA.',
  'Multiple Honors in AI Explainability and Ethics, Interactive and Ubiquitous Systems, Human-Computer Interaction, Computer Networks and Deep Learning.',
  'Only student to obtain a C2 grade in the Cambridge Advanced English test in Comunidad de Madrid\'s extraordinary under-16 public round.',
];

const About: React.FC = () => {
  useDocumentTitle('About');

  return (
    <div className="about-page">
      <Header />
      <main className="about-container">
        <section className="about-content">
          <h1>About Me</h1>
          <p>
            I'm a Computer Science Engineer from Universidad Carlos III de Madrid, currently in AXA's Graduate Tech
            program, with experience across applied AI, data pipelines, automation and software quality.
          </p>
          <p>
            I have built backend APIs, integrated external data sources, and shipped end-to-end projects from
            ambiguous requirements to working products. I enjoy learning unfamiliar domains quickly and keeping up
            with state-of-the-art agentic AI engineering practices, models and techniques, adapting them to
            regulated environments.
          </p>
          <p>
            I spent a year at San Francisco State University, taking master-level courses taught by professionals
            from OpenAI, Intel, IBM and VMware, which is where my AI explainability research started.
          </p>

          <h2>Awards &amp; Recognition</h2>
          <ul>
            {awards.map((a) => <li key={a}>{a}</li>)}
          </ul>

          <h2>Languages &amp; Training</h2>
          <ul>
            <li><strong>Languages:</strong> Spanish (native), English C2 (Cambridge, 8/9 IELTS), French (basic).</li>
            <li><strong>Courses:</strong> Amazon DeepRacer AI &amp; ML (2024), ICAI Videogame Development Course.</li>
          </ul>

          <div className="about-actions">
            <a href={getAssetPath('CV.pdf')} target="_blank" rel="noopener noreferrer" className="about-button">Download CV</a>
            <a href="mailto:guillermovillarsanchez@gmail.com" className="about-button secondary">Get in touch</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
