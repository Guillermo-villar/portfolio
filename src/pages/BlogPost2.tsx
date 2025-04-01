import React from 'react';
import BlogPostTemplate from '../components/BlogPostTemplate';

const BlogPost2: React.FC = () => {
  const blogData = {
    id: 2,
    title: "Segundo Blog",
    image: "web.png",
    content: "Contenido del segundo blog... Este es el contenido completo del segundo blog que puede incluir varios párrafos y detalles importantes sobre el tema. Aquí puedes escribir un artículo completo con toda la información relevante para tus lectores.",
    date: "2021-09-02"
  };

  return (
    <BlogPostTemplate {...blogData} />
  );
};

export default BlogPost2;