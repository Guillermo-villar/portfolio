import React from 'react';
import Header from '../components/Header';
import ProjectsTemplate from '../components/ProjectsTemplate';
import Footer from '../components/Footer';

const CryptoProject: React.FC = () => {
  const projectData = {
    title: "Secure File Sharing System",
    image: "Crypto.webp",
    description: "This cryptography project implements a secure file sharing system with end-to-end encryption. Using modern cryptographic algorithms, the application ensures that files can only be accessed by authorized recipients. Features include AES-256 encryption, digital signatures for authenticity verification, and a zero-knowledge proof system for secure authentication. The project demonstrates practical applications of cryptographic principles while maintaining user privacy. All implementation details, security considerations, and usage instructions are available in the GitHub repository. An interactive web demo with animated encryption visualization is coming soon, allowing users to experience the encryption process in real-time.",
    githubLink: "https://github.com/Guillermo-villar/AI-project",
    type: "Personal",
    isDemo: true,
    projStack: "Python, Cryptography, PyCA, SQLite"
  };
  return (
    <div className="home">
      <Header /> 
      <ProjectsTemplate {...projectData} />
      <Footer />
    </div>
  );
};

export default CryptoProject;