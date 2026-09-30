import React from 'react';
import ProjectsTemplate from '../components/ProjectsTemplate';

const CryptoProject: React.FC = () => (
  <ProjectsTemplate
    title="Secure File Sharing System"
    tagline="End-to-end encrypted file sharing with custom certificates"
    image="Crypto.webp"
    paragraphs={[
      "This cryptography project implements a secure file sharing system with end-to-end encryption. Using modern cryptographic algorithms, the application ensures that files can only be accessed by authorized recipients.",
      "Features include AES-256 encryption, digital signatures for authenticity verification, and a zero-knowledge proof system for secure authentication. The project demonstrates practical applications of cryptographic principles while maintaining user privacy.",
      "An interactive web demo with animated encryption visualization is coming soon, allowing users to experience the encryption process in real-time.",
    ]}
    type="Personal"
    stack={['Python', 'Cryptography', 'PyCA', 'SQLite']}
  />
);

export default CryptoProject;
