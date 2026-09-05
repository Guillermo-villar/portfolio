import React from 'react';
import { useParams } from 'react-router-dom';
import BlogPostTemplate from '../components/BlogPostTemplate';
import NotFound from './NotFound';
import { getPost } from '../data/blogPosts';

/**
 * One page for every post. Replaces the three near-identical BlogPost1/2/3
 * components, each of which carried its own copy of the post metadata.
 */
const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = id && /^\d+$/.test(id) ? getPost(Number(id)) : undefined;

  // /blog/99 used to render an entirely blank page.
  if (!post) return <NotFound />;

  return <BlogPostTemplate {...post} />;
};

export default BlogPostPage;
