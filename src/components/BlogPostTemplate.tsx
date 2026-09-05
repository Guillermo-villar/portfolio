import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/blogs.css';
import { getAssetPath } from '../config';
import { BlogPost, formatDate } from '../data/blogPosts';

/**
 * Renders the inline markdown inside a single line: [text](url) links and
 * **bold**.
 *
 * The previous version tested a /g regex with .test() before calling
 * .matchAll(); .test() leaves lastIndex past the match, so matchAll started
 * after the only link on the line, found nothing, and the post rendered the
 * literal "[text](url)" to the reader. Building React nodes directly also drops
 * the dangerouslySetInnerHTML this used to need.
 */
const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let match = pattern.exec(text);

  while (match !== null) {
    if (match.index > cursor) {
      nodes.push(text.slice(cursor, match.index));
    }
    const [full, linkText, href, bold] = match;
    if (bold !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-b-${match.index}`}>{bold}</strong>);
    } else {
      nodes.push(
        <a
          key={`${keyPrefix}-a-${match.index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkText}
        </a>
      );
    }
    cursor = match.index + full.length;
    match = pattern.exec(text);
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }
  return nodes;
};

const BULLET = /^-\s+/;
const NUMBERED = /^\d+\.\s+/;

/** Turns the post body into blocks, keeping consecutive list items together. */
const renderContent = (text: string): React.ReactNode[] => {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === '') {
      index += 1;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push(<h2 key={index}>{renderInline(line.slice(3), `h${index}`)}</h2>);
      index += 1;
      continue;
    }

    const listMarker = BULLET.test(line) ? BULLET : NUMBERED.test(line) ? NUMBERED : null;
    if (listMarker) {
      const items: string[] = [];
      const start = index;
      while (index < lines.length && listMarker.test(lines[index])) {
        items.push(lines[index].replace(listMarker, ''));
        index += 1;
      }
      const children = items.map((item, i) => (
        <li key={`${start}-${i}`}>{renderInline(item, `l${start}-${i}`)}</li>
      ));
      blocks.push(
        listMarker === BULLET ? (
          <ul key={start} className="blog-list">{children}</ul>
        ) : (
          <ol key={start} className="blog-list">{children}</ol>
        )
      );
      continue;
    }

    blocks.push(<p key={index}>{renderInline(line, `p${index}`)}</p>);
    index += 1;
  }

  return blocks;
};

const BlogPostTemplate: React.FC<BlogPost> = ({ title, image, content, date }) => (
  <div className="blog-post-page">
    <Header />
    <div className="blog-post-container">
      <h1 className="blog-post-title">{title}</h1>
      <p className="blog-post-date">
        <time dateTime={date}>{formatDate(date)}</time>
      </p>
      <div className="blog-post-image-container">
        <img
          src={getAssetPath(image)}
          alt={title}
          className="blog-post-image"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="blog-post-content">{renderContent(content)}</div>
    </div>
    <Footer />
  </div>
);

export default BlogPostTemplate;
