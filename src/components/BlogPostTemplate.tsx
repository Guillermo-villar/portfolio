import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import '../styles/blogs.css';
import { getAssetPath } from '../config';
import { useDocumentTitle } from '../utils';
import { blogPosts, formatDate, readingTime } from '../data/blogPosts';

// Inline markdown: **bold** and [text](url), rendered as React nodes (no innerHTML)
const renderInline = (text: string): React.ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer">{link[1]}</a>;
    return part;
  });

type Block = { type: 'h2' | 'p'; text: string } | { type: 'ul' | 'ol'; items: string[] };

const parseBlocks = (content: string): Block[] => {
  const blocks: Block[] = [];
  for (const line of content.split('\n').map((l) => l.trim())) {
    if (!line) continue;
    const listType = line.startsWith('- ') ? 'ul' : /^\d+\.\s/.test(line) ? 'ol' : null;
    if (listType) {
      const item = line.replace(/^(-|\d+\.)\s+/, '');
      const last = blocks[blocks.length - 1];
      if (last && last.type === listType) last.items.push(item);
      else blocks.push({ type: listType, items: [item] });
    } else if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', text: line.slice(3) });
    } else {
      blocks.push({ type: 'p', text: line });
    }
  }
  return blocks;
};

const BlogPostTemplate: React.FC = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => String(p.id) === id);
  useDocumentTitle(post?.title ?? 'Post not found');

  return (
    <div className="blog-post-page">
      <Header />
      <article className="blog-post-container">
        <Link to="/blogs" className="back-link">← All posts</Link>
        {post ? (
          <>
            <h1 className="blog-post-title">{post.title}</h1>
            <p className="blog-post-date">
              {formatDate(post.date)} · {readingTime(post.content)} min read
            </p>
            <div className="blog-post-image-container">
              <img src={getAssetPath(post.image)} alt="" className="blog-post-image" />
            </div>
            <div className="blog-post-content">
              {parseBlocks(post.content).map((block, i) => {
                if ('items' in block) {
                  const List = block.type;
                  return (
                    <List key={i} className="blog-list">
                      {block.items.map((item, j) => <li key={j}>{renderInline(item)}</li>)}
                    </List>
                  );
                }
                return block.type === 'h2'
                  ? <h2 key={i}>{block.text}</h2>
                  : <p key={i}>{renderInline(block.text)}</p>;
              })}
            </div>
          </>
        ) : (
          <h1 className="blog-post-title">This post doesn't exist.</h1>
        )}
      </article>
      <Footer />
    </div>
  );
};

export default BlogPostTemplate;
