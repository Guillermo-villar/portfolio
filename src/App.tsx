import React from 'react';
import './App.css';
import './styles/tech-colors.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/ProjectsPage';
import AIDemo from './pages/AIProject'; 
import Crypto from './pages/CryptoProject';
import SolSombra from './pages/SolSombraProject';
import Blogs from './pages/Blogs';
import BlogPost from './components/BlogPostTemplate';
import About from './pages/About';
import PageViewTracker from './components/PageViewTracker';
import ScrollToTop from './components/ScrollToTop';

function App() {
  // Use basename with HashRouter to ensure all routes work correctly
  return (
    <Router>
      <PageViewTracker />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/ai-demo" element={<AIDemo />} />
        <Route path="/projects/crypto" element={<Crypto />} />
        <Route path="/projects/solsombra" element={<SolSombra />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
