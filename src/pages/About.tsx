import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAssetPath } from '../config';
import '../styles/about.css';

/**
 * Everything here is drawn from what the rest of the site already says: the
 * experience list, the projects, the blog posts and the CV. Nothing is invented
 * — where a fact was not already published somewhere on the site, the page
 * stays quiet rather than filling the gap.
 */
const About: React.FC = () => (
  <div className="about-page">
    <Header />
    <main className="about-container">
      <section className="about-intro">
        <img
          src={getAssetPath('icon.webp')}
          alt="Guillermo Villar Sánchez"
          className="about-portrait"
          width={140}
          height={148}
          loading="lazy"
          decoding="async"
        />
        <div>
          <h1>About me</h1>
          <p className="about-lead">
            I'm Guillermo Villar Sánchez, a computer engineer based in Madrid. I work where machine
            learning meets everything else — the data cleaning nobody photographs, the security
            assumptions nobody writes down, and the interface somebody eventually has to use.
          </p>
          <p>
            Most of what I build starts as a question I can't answer by reading. Can a network learn
            a digit from a few strokes? How much shade does a Madrid street actually get in August?
            What does a file-sharing system have to prove before you trust it? The projects on this
            site are the answers I got.
          </p>
        </div>
      </section>

      <section className="about-section">
        <h2>What I work on</h2>
        <div className="about-cards">
          <article className="about-card">
            <h3>Machine learning</h3>
            <p>
              My bachelor's thesis dealt with learning from imbalanced datasets — the case where the
              thing you care about is the rare one and accuracy quietly stops meaning anything.
              Since September 2024 I've worked as a freelance AI annotator on OpenAI and Google
              models, mostly bringing code expertise to evaluation work.
            </p>
          </article>
          <article className="about-card">
            <h3>Security and cryptography</h3>
            <p>
              I built a file-sharing system with end-to-end encryption, digital signatures and a
              custom certificate authority, because implementing the primitives is the only way to
              find out which parts of the protocol you had actually understood.
            </p>
          </article>
          <article className="about-card">
            <h3>Building things that ship</h3>
            <p>
              Sol Sombra routes pedestrians through Madrid by sun exposure and runs on a single
              small VPS. This portfolio is React and TypeScript, open source, and hosts a neural
              network that runs in your browser. I like the constraint of making something real
              work on modest hardware.
            </p>
          </article>
          <article className="about-card">
            <h3>Teaching and volunteering</h3>
            <p>
              I spent early 2024 as a computer engineering assistant, designing coursework and
              reviewing student code. I also volunteer with Fundación Cibervoluntarios, running
              workshops on safe browsing and cyberbullying prevention for people the internet has
              largely left behind.
            </p>
          </article>
        </div>
      </section>

      <section className="about-section">
        <h2>Away from the keyboard</h2>
        <p>
          I go up mountains. Mountaineering is the only hobby I've found that rewards exactly the
          same things engineering does — planning for the conditions you'll actually meet, turning
          back when the plan stops working, and a stubbornness about the last stretch. I'm also a
          reliable sink for research papers well outside anything I'm being paid to think about.
        </p>
      </section>

      <section className="about-section">
        <h2>Get in touch</h2>
        <p>
          The fastest way to reach me is email. My CV has the full history, and the code for most of
          what's on this site is public.
        </p>
        <div className="about-links">
          <a href="mailto:guillermovillarsanchez@gmail.com" className="about-link primary">
            Email me
          </a>
          <a
            href="https://www.linkedin.com/in/guillermo-villar-sanchez/"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/Guillermo-villar"
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            GitHub
          </a>
          <a
            href={getAssetPath('CV.pdf')}
            target="_blank"
            rel="noopener noreferrer"
            className="about-link"
          >
            CV
          </a>
          <Link to="/projects" className="about-link">
            Projects
          </Link>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default About;
