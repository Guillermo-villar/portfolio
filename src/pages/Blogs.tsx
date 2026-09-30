import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/blogs.css';
import { getAssetPath } from '../config';
import { useDocumentTitle } from '../utils';
import { sortedBlogPosts, formatDate, readingTime, excerpt } from '../data/blogPosts';

const BlogPage: React.FC = () => {
  useDocumentTitle('Blog');

  return (
    <div className="blog-page">
      <Header />
      <div className="blog-container">
        <header className="page-intro">
          <h1>Blog</h1>
          <p>Notes on things I've built, learned and volunteered on.</p>
        </header>
        {sortedBlogPosts.map((post) => (
          <Link to={`/blog/${post.id}`} className="blog-card-link" key={post.id}>
            <div className="blog-card">
              <div className="blog-content">
                <p className="blog-date">
                  {formatDate(post.date)} · {readingTime(post.content)} min read
                </p>
                <h2>{post.title}</h2>
                <p>{excerpt(post.content)}</p>
              </div>
              <img
                src={getAssetPath(post.image)}
                alt=""
                className="blog-image"
                loading="lazy"
                style={{ objectFit: post.imageFit, backgroundColor: post.imageBackground }}
              />
            </div>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;
