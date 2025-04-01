import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import ProjectsTemplate from '../components/ProjectsTemplate';
import Footer from '../components/Footer';
const AIProject: React.FC = () => {

  const projectData = {
    title: "AI Digit Detector",
    image: "/AI.png",
    description: "Este proyecto utiliza Machine Learning para detectar dígitos escritos a mano usando Python y TensorFlow.",
    githubLink: "https://github.com/Guillermo-villar/AI-project",
    type: "Personal",
    isDemo: true,
    projStack: "Python, TensorFlow"
  };
  return (
    <div className="home">
      <Header /> 
      <ProjectsTemplate {...projectData} />
      <Footer />
    </div>
  );
};

export default AIProject;