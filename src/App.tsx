import React from 'react';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/ProjectsPage';
import AIProject from './pages/AIProject';
import DigitDemo from './pages/DigitDemo';
import Crypto from './pages/CryptoProject';
import SolSombra from './pages/SolSombraProject';
import Blogs from './pages/Blogs';
import BlogPostPage from './pages/BlogPostPage';
import About from './pages/About';
import NotFound from './pages/NotFound';
import PageViewTracker from './components/PageViewTracker';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <PageViewTracker />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/ai-demo" element={<AIProject />} />
        <Route path="/projects/ai-demo/live" element={<DigitDemo />} />
        <Route path="/projects/crypto" element={<Crypto />} />
        <Route path="/projects/solsombra" element={<SolSombra />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/about" element={<About />} />
        {/* Anything else used to mount an empty page with no way back. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
