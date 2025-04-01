import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/blogs.css';
import { getAssetPath } from '../config';

interface BlogPostProps {
  id: number;
  title: string;
  image: string;
  content: string;
  date: string;
}

const BlogPostTemplate: React.FC<BlogPostProps> = ({ id, title, image, content, date }) => {
  return (
    <div className="blog-post-page">
      <Header />
      <div className="blog-post-container">
        <h1 className="blog-post-title">{title}</h1>
        <p className="blog-post-date">{date}</p>
        <div className="blog-post-image-container">
          <img src={getAssetPath(image)} alt={title} className="blog-post-image" />
        </div>
        <div className="blog-post-content">
          <p>{content}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPostTemplate;