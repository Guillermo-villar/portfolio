import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import ExperienceList from '../components/ExperienceList';

const Home: React.FC = () => {
  return (
    <div className="home">
      <Header />
      <Hero />
      <Projects limit={4}/>
      <ExperienceList />
      <Footer />
    </div>
  );
};

export default Home;