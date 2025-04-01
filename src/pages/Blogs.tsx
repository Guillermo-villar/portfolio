import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/blogs.css';

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
    title: "Cibervolunteer?",
    image: "/ciberv.png",
    content: "Contenido del primer blog...", 
    date: "2024-09-31",
    path: "/blog/1"
  },
  {
    id: 2,
    title: "Portfolio Website going Live",
    image: "/web.png",
    content: "Contenido del segundo blog...",
    date: "2025-04-01",
    path: "/blog/2"
  },
  {
    id: 2,
    title: "Segundo Blog",
    image: "/path/to/image2.jpg",
    content: "Contenido del segundo blog...",
    date: "2021-09-02",
    path: "/blog/2"
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
              <img src={post.image} alt={post.title} className="blog-image" />
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;