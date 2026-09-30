import React from 'react';
import ProjectsTemplate from '../components/ProjectsTemplate';

const CryptoProject: React.FC = () => (
  <ProjectsTemplate
    title="Secure File Sharing System"
    tagline="End-to-end encrypted file sharing with custom certificates"
    image="Crypto.webp"
    paragraphs={[
      "This cryptography project implements a secure file sharing system with end-to-end encryption. Using modern cryptographic algorithms, the application ensures that files can only be accessed by authorized recipients.",
      "Features include AES-256 encryption, digital signatures for authenticity verification, and a custom certificate system for secure authentication. The project demonstrates practical applications of cryptographic principles while maintaining user privacy.",
      "All implementation details, security considerations and usage instructions are in the GitHub repository, where you can clone it and run it locally.",
    ]}
    githubLink="https://github.com/Guillermo-villar/Crypto-safe-Fileshare-App"
    type="Personal"
    stack={['Python', 'Cryptography', 'PyCA', 'SQLite']}
  />
);

export default CryptoProject;
