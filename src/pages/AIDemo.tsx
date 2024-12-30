import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Projects from '../components/Projects';

const IAdemo: React.FC = () => {
  return (
    <div className="home">
      <Header />
      <Projects />
    </div>
  );
};

export default IAdemo;