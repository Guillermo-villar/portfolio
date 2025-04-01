import React from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/ProjectsPage';
import AIDemo from './pages/AIProject'; 
import Crypto from './pages/CryptoProject'; 
import Blogs from './pages/Blogs';
import BlogPost1 from './pages/BlogPost1';
import BlogPost2 from './pages/BlogPost2';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/ai-demo" element={<AIDemo />} />
      <Route path="/projects/crypto" element={<Crypto/>} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blog/1" element={<BlogPost1 />} />
      <Route path="/blog/2" element={<BlogPost2 />} />
      </Routes>
    </Router>
  );
}

export default App;