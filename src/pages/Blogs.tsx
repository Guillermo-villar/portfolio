import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/blogs.css';

interface BlogPost {
  id: number;
  title: string;
  image: string;
  content: string;
  date: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Primer Blog",
    image: "/ciberv.png",
    content: "Contenido del primer blog...", 
    date: "2021-09-01"
  },
  {
    id: 2,
    title: "Segundo Blog",
    image: "/path/to/image2.jpg",
    content: "Contenido del segundo blog...",
    date: "2021-09-02"
  }
];

const BlogPage: React.FC = () => {
  return (
    <div className="blog-page">
      <Header />
      <div className="blog-container">
        {blogPosts.map((post) => (
          <div key={post.id} className="blog-card">
            <div className="blog-content">
              <p className="blog-date">{post.date}</p>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </div>
            <img src={post.image} alt={post.title} className="blog-image" />
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default BlogPage;