import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import ExperienceList from '../components/ExperienceList';
import Skills from '../components/Skills';
import '../styles/home.css';

const Home: React.FC = () => {
  const interests = [
    {
      title: "Machine Learning",
      description: "Passionate about neural networks, deep learning, and AI applications that solve real-world problems.",
      icon: "📊"
    },
    {
      title: "Cybersecurity",
      description: "Exploring encryption methods, secure coding practices, and network security principles.",
      icon: "🔒"
    },
    {
      title: "Outdoors",
      description: "Mountaineering teaches perseverance and strategic thinking—skills that translate perfectly to overcoming challenges in both code and life.",
      icon: "⛰️"
    },
    {
      title: "Research",
      description: "Always curious about new technologies and methodologies in computer science and software engineering.",
      icon: "🔍"
    }
  ];

  return (
    <div className="home">
      <Header />
      <div className="home-content">
        <div className="left-column extended">
          <div className="rounded-container hero-container">
            <Hero />
          </div>
          
          <div className="rounded-container interests-container">
            <h2>Interests</h2>
            <div className="interests-grid">
              {interests.map((interest, index) => (
                <div key={index} className="interest-card">
                  <div className="interest-icon">{interest.icon}</div>
                  <h3>{interest.title}</h3>
                  <p>{interest.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-container quote-container">
            <h2>Philosophy</h2>
            <blockquote>
              "The art of programming is the skill of controlling complexity. The great program is subdued—made simple in its complexity."
            </blockquote>
            <p className="quote-author">— Marijn Haverbeke</p>
          </div>
        </div>
        
        <div className="right-column">
          <div className="dual-container">
            <div className="rounded-container half-width">
              <ExperienceList />
            </div>
            <div className="rounded-container half-width">
              <Skills />
            </div>
          </div>
          <div className="rounded-container">
            <Projects limit={4}/>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;