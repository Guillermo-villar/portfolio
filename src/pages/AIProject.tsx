import React from 'react';
import ProjectsTemplate from '../components/ProjectsTemplate';

const AIProject: React.FC = () => (
  <ProjectsTemplate
    title="AI Digit Detector"
    tagline="Handwritten digit recognition with a CNN"
    image="AI.webp"
    paragraphs={[
      "This machine learning project uses Python and TensorFlow to accurately recognize handwritten digits. The system is trained on the MNIST dataset and achieves over 97% accuracy using a convolutional neural network architecture.",
      "The implementation includes data preprocessing, model training, and a simple interface for testing new handwritten inputs. The complete source code, documentation, and training methodology can be found on GitHub.",
      "A web-based interactive demo is coming soon, featuring real-time digit recognition with engaging animations that visualize the neural network's decision-making process.",
    ]}
    githubLink="https://github.com/Guillermo-villar/AI-project"
    type="Personal"
    stack={['Python', 'TensorFlow', 'NumPy', 'Matplotlib']}
  />
);

export default AIProject;
