import React from 'react';
import BlogPostTemplate from '../components/BlogPostTemplate';

const BlogPost2: React.FC = () => {
  const blogData = {
    id: 2,
    title: "My Web Development Journey: From Zero to Portfolio",
    image: "web.png",
    content: `Building this portfolio website represents my journey of learning web development from scratch. What began as a curiosity turned into a full-fledged project with many challenges and learning opportunities along the way.

## Starting from Zero
Having no prior experience in web development, I had to learn HTML, CSS, and JavaScript fundamentals before diving into React. Online courses, documentation, and countless tutorial videos gradually built my understanding of web technologies.

## Learning React & TypeScript
Moving to React was both exciting and daunting. Component-based thinking required a mental shift, and adding TypeScript meant learning type systems simultaneously. Debugging type errors often took hours, but the payoff in code quality was worth it.

## Responsive Design Struggles
Creating a truly responsive design that worked well on all devices proved challenging. The mobile hamburger menu was particularly tricky—getting it to transition smoothly while maintaining accessibility took several iterations.

## Custom Domain Headaches
Setting up a custom domain was unexpectedly complex. From understanding DNS records to configuring HTTPS certificates, the process involved navigating technical documentation and waiting for propagation delays that tested my patience.

## Deployment Challenges
Configuring GitHub Pages to work properly with React Router required research and trial-and-error. Resolving 404 errors on page refreshes and ensuring assets loaded correctly took significant troubleshooting.

## Open Source Project
This portfolio is entirely open source! You can view the code, suggest improvements, or fork it for your own use at [https://github.com/Guillermo-villar/portfolio](https://github.com/Guillermo-villar/portfolio). Contributions and feedback are always welcome.

Looking back, every challenge became a valuable learning opportunity. This project taught me not just coding skills, but patience, problem-solving, and the importance of community resources when tackling new technologies.`,
    date: "April 1, 2024"
  };

  return (
    <BlogPostTemplate {...blogData} />
  );
};

export default BlogPost2;