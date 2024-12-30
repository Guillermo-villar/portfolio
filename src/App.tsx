import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/ProjectsPage';
import AIDemo from './pages/AIDemo';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/ai-demo" element={<AIDemo />} />
      </Routes>
    </Router>
  );
}

export default App;