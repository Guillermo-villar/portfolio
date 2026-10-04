import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/blogs.css';
import { getAssetPath } from '../config';
import { useDocumentTitle } from '../useDocumentTitle';

interface BlogPostProps {
  id: number;
  title: string;
  image: string;
  content: string;
  date: string;
}

const BlogPostTemplate: React.FC<BlogPostProps> = ({ id, title, image, content, date }) => {
  useDocumentTitle(title);
  // Inline markdown: [text](url) links and **bold**
  const inline = (line: string) =>
    line
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Function to convert markdown-style content to JSX
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    const blocks: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      if (line.startsWith('- ')) {
        const start = i;
        const items: string[] = [];
        while (i < lines.length && lines[i].startsWith('- ')) {
          items.push(lines[i].substring(2));
          i++;
        }
        blocks.push(
          <ul key={start} className="plain-list">
            {items.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        );
        continue;
      }

      if (/^\d+\.\s/.test(line)) {
        const start = i;
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s/, ''));
          i++;
        }
        blocks.push(
          <ol key={start} className="plain-list">
            {items.map((item, idx) => <li key={idx}>{item}</li>)}
          </ol>
        );
        continue;
      }

      if (line.startsWith('## ')) {
        blocks.push(<h2 key={i}>{line.substring(3)}</h2>);
      } else if (line.trim() === '') {
        blocks.push(<br key={i} />);
      } else {
        const html = inline(line);
        blocks.push(
          html === line ? <p key={i}>{line}</p> : <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
        );
      }
      i++;
    }

    return blocks;
  };

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
          {renderContent(content)}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPostTemplate;