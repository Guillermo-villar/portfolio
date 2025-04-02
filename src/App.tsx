import React from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/ProjectsPage';
import AIDemo from './pages/AIProject'; 
import Crypto from './pages/CryptoProject'; 
import Blogs from './pages/Blogs';
import BlogPost1 from './pages/BlogPost1';
import BlogPost2 from './pages/BlogPost2';
import BlogPost3 from './pages/BlogPost3';
import About from './pages/About';

function App() {
  // Use basename with HashRouter to ensure all routes work correctly
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/ai-demo" element={<AIDemo />} />
        <Route path="/projects/crypto" element={<Crypto />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/1" element={<BlogPost1 />} />
        <Route path="/blog/2" element={<BlogPost2 />} />
        <Route path="/blog/3" element={<BlogPost3 />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;