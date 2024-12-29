import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Projects from '../components/Projects';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Header />
      <Hero />
      <Projects />
    </div>
  );
};

export default Home;