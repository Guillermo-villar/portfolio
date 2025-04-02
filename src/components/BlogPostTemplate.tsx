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
  // Function to convert markdown-style content to JSX
  const renderContent = (text: string) => {
    // Split the content by new lines
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // Handle headings (## Heading)
      if (line.startsWith('## ')) {
        return <h2 key={index}>{line.substring(3)}</h2>;
      }
      
      // Handle bullet points
      if (line.startsWith('- ')) {
        return <li key={index}>{line.substring(2)}</li>;
      }
      
      // Handle numbered lists
      if (/^\d+\.\s/.test(line)) {
        const content = line.replace(/^\d+\.\s/, '');
        return <li key={index}>{content}</li>;
      }
      
      // Handle markdown links [text](url)
      let processedLine = line;
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      if (linkRegex.test(line)) {
        const linkMatches = Array.from(line.matchAll(linkRegex));
        if (linkMatches.length > 0) {
          processedLine = line.replace(linkRegex, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
          return <p key={index} dangerouslySetInnerHTML={{ __html: processedLine }} />;
        }
      }
      
      // Handle bold text (**text**)
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // If the line is empty, return a break
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // For list items, wrap in appropriate container
      if (index > 0 && lines[index - 1].startsWith('- ') && !line.startsWith('- ')) {
        return null; // Skip, as we'll handle lists together
      }
      
      // Group bullet points into ul elements
      if (line.startsWith('- ')) {
        let listItems = [line];
        let i = index + 1;
        while (i < lines.length && lines[i].startsWith('- ')) {
          listItems.push(lines[i]);
          i++;
        }
        
        if (index === 0 || !lines[index - 1].startsWith('- ')) {
          return (
            <ul key={index} className="blog-list">
              {listItems.map((item, idx) => <li key={`${index}-${idx}`}>{item.substring(2)}</li>)}
            </ul>
          );
        }
        return null;
      }
      
      // Group numbered lists
      if (/^\d+\.\s/.test(line)) {
        let listItems = [line];
        let i = index + 1;
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          listItems.push(lines[i]);
          i++;
        }
        
        if (index === 0 || !/^\d+\.\s/.test(lines[index - 1])) {
          return (
            <ol key={index} className="blog-list">
              {listItems.map((item, idx) => {
                const content = item.replace(/^\d+\.\s/, '');
                return <li key={`${index}-${idx}`}>{content}</li>;
              })}
            </ol>
          );
        }
        return null;
      }
      
      // Parse bold text
      if (processedLine.includes('<strong>')) {
        return <p key={index} dangerouslySetInnerHTML={{ __html: processedLine }} />;
      }
      
      // Default: return as paragraph
      return <p key={index}>{line}</p>;
    });
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