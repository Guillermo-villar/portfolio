import React from 'react';
import Header from '../components/Header';
import ProjectsTemplate from '../components/ProjectsTemplate';
import Footer from '../components/Footer';

const AIProject: React.FC = () => {
  const projectData = {
    title: "AI Digit Detector",
    image: "AI.webp",
    description: "A neural network that recognises handwritten digits, built in Python with TensorFlow and trained on the MNIST dataset. It is a compact 784 → 128 → 64 → 10 dense network that reaches 97.3% accuracy on the 10,000-image MNIST test set. The project covers the full pipeline: preprocessing and binarising the input, training, and a Tkinter interface for drawing digits and testing them. The trained weights also run right here in the browser: the live demo evaluates the network in plain TypeScript, and nothing you draw leaves your device.",
    githubLink: "https://github.com/Guillermo-villar/AI-project",
    liveLink: "/projects/ai-demo/live",
    liveLabel: "Try the live demo",
    type: "Personal",
    isDemo: true,
    projStack: "Python, TensorFlow, NumPy, Matplotlib"
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