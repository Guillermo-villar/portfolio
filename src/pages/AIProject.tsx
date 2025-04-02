import React from 'react';
import Header from '../components/Header';
import ProjectsTemplate from '../components/ProjectsTemplate';
import Footer from '../components/Footer';

const AIProject: React.FC = () => {
  const projectData = {
    title: "AI Digit Detector",
    image: "AI.png",
    description: "This machine learning project uses Python and TensorFlow to accurately recognize handwritten digits. The system is trained on the MNIST dataset and achieves over 97% accuracy using a convolutional neural network architecture. The implementation includes data preprocessing, model training, and a simple interface for testing new handwritten inputs. The complete source code, documentation, and training methodology can be found on GitHub. A web-based interactive demo is coming soon, featuring real-time digit recognition with engaging animations that visualize the neural network's decision-making process.",
    githubLink: "https://github.com/Guillermo-villar/AI-project",
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