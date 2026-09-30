import React from 'react';
import ProjectsTemplate from '../components/ProjectsTemplate';

const AIProject: React.FC = () => (
  <ProjectsTemplate
    title="AI Digit Detector"
    tagline="Handwritten digit recognition, running live in your browser"
    image="AI-anim.webp"
    paragraphs={[
      "A neural network that recognises handwritten digits, built in Python with TensorFlow and trained on the MNIST dataset. It is a compact 784 → 128 → 64 → 10 dense network that reaches 97.3% accuracy on the 10,000-image MNIST test set.",
      "The project covers the full pipeline: preprocessing and binarising the input, training, and a Tkinter interface for drawing digits and testing them. The source code, documentation and training methodology are on GitHub.",
      "The trained weights also run right here in the browser. The live demo loads them as 108 KB of quantised int8 and evaluates the network in plain TypeScript, reproducing MNIST's own normalisation so your drawing looks like the data the model learned from. Nothing you draw leaves your device.",
    ]}
    githubLink="https://github.com/Guillermo-villar/AI-project"
    liveLink="/projects/ai-demo/live"
    liveLabel="Try the live demo"
    type="Personal"
    stack={['Python', 'TensorFlow', 'NumPy', 'Matplotlib']}
  />
);

export default AIProject;
