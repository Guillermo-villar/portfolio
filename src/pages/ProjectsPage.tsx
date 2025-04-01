import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import ExperienceList from '../components/ExperienceList';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Header />
      <Projects />
      <Footer />
    </div>
  );
};

export default Home;