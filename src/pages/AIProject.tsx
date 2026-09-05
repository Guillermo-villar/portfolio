import React from 'react';
import ProjectsTemplate from '../components/ProjectsTemplate';
import Footer from '../components/Footer';

const AIProject: React.FC = () => {
  const projectData = {
    title: 'AI Digit Detector',
    image: 'AI.webp',
    description:
      "This machine learning project uses Python and TensorFlow to recognize handwritten digits. The network is a three-layer dense model trained on the MNIST dataset, reaching 97.3% accuracy on the 10,000-image test set. The implementation covers the full pipeline: preprocessing, binarizing the input, training, and a Tkinter interface for drawing digits and testing them. The complete source code, documentation and training methodology are on GitHub. The trained weights also run in your browser: the live demo loads them as 108 KB of quantized int8 and evaluates the network in plain TypeScript, so the digit you draw never leaves your device.",
    githubLink: 'https://github.com/Guillermo-villar/AI-project',
    // Internal route rather than an external site, so the template renders it
    // as a router link instead of a new tab.
    liveLink: '/projects/ai-demo/live',
    liveLabel: 'Try the live demo',
    type: 'Personal',
    isDemo: true,
    projStack: 'Python, TensorFlow, NumPy, Matplotlib'
  };

  return (
    <div className="home">
      <ProjectsTemplate {...projectData} />
      <Footer />
    </div>
  );
};

export default AIProject;
