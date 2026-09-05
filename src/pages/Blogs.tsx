import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/blogs.css';
import { getAssetPath } from '../config';
import { postsNewestFirst, formatDate } from '../data/blogPosts';

const BlogPage: React.FC = () => {
  const posts = postsNewestFirst();

  return (
    <div className="blog-page">
      <Header />
      <div className="blog-container">
        {posts.map((post) => (
          <Link to={`/blog/${post.id}`} className="blog-card-link" key={post.id}>
            <div className="blog-card">
              <div className="blog-content">
                <p className="blog-date">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </p>
                <h2>{post.title}</h2>
                <p>{post.excerpt}</p>
              </div>
              <img
                src={getAssetPath(post.image)}
                alt={post.title}
                className="blog-image"
                loading="lazy"
                decoding="async"
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
