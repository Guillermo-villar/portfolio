import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/blogs.css';
import { getAssetPath } from '../config';

interface BlogPost {
  id: number;
  title: string;
  image: string;
  content: string;
  date: string;
  path: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "My Journey as a Cibervolunteer",
    image: "ciberv.png",
    content: "As a volunteer with Fundación Cibervoluntarios, I've had the opportunity to help bridge the digital divide by empowering individuals at risk of social and digital exclusion. The foundation's mission is to promote the use and knowledge of new technologies as a means to address social gaps, foster social innovation, and encourage citizen empowerment. Through workshops and training sessions, I've assisted in teaching essential digital skills, such as safe internet navigation and cyberbullying prevention, tailoring content to meet the specific needs of diverse groups.", 
    date: "March 15, 2024",
    path: "/blog/1"
  },
  {
    id: 2,
    title: "Portfolio Website: From Concept to Launch",
    image: "web.png",
    content: "Building my portfolio website has been an exciting journey of design decisions, technical challenges, and creative problem-solving. In this blog post, I share the entire process from initial sketches to final deployment. I discuss the technologies I chose (React, TypeScript, and custom CSS), the responsive design considerations that guided the UI development, and how I optimized the site for both performance and accessibility. Whether you're a fellow developer or just curious about web development, this post provides insights into creating a modern, responsive portfolio site.",
    date: "April 1, 2025",
    path: "/blog/2"
  },
  {
    id: 3,
    title: "Exploring Modern Web Development Frameworks",
    image: "AI.png",
    content: "With the rapidly evolving landscape of web development, choosing the right framework is more important than ever. In this comprehensive comparison, I explore the strengths and weaknesses of today's most popular frameworks including React, Vue, Angular, and Svelte. I analyze factors such as performance metrics, developer experience, community support, and enterprise adoption. Based on real-world projects and benchmarks, this guide aims to help developers make informed decisions about which technology stack best suits their specific project requirements and team expertise.",
    date: "February 1, 2025",
    path: "/blog/3"
  }
];

const BlogPage: React.FC = () => {
  return (
    <div className="blog-page">
      <Header />
      <div className="blog-container">
        {blogPosts.map((post) => (
          <Link to={post.path} className="blog-card-link" key={post.id}>
            <div className="blog-card">
              <div className="blog-content">
                <p className="blog-date">{post.date}</p>
                <h2>{post.title}</h2>
                <p>{post.content.substring(0, 150)}...</p>
              </div>
              <img src={getAssetPath(post.image)} alt={post.title} className="blog-image" />
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;