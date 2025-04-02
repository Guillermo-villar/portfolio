import React from 'react';
import BlogPostTemplate from '../components/BlogPostTemplate';

const BlogPost1: React.FC = () => {
  const blogData = {
    id: 1,
    title: "My Journey as a Cibervolunteer",
    image: "ciberv.png",
    content: `As a volunteer with Fundación Cibervoluntarios, I've helped bridge the digital divide by empowering individuals at risk of social and digital exclusion. The foundation promotes the use of new technologies to address social gaps and foster citizen empowerment.

Through workshops and training sessions, I've taught essential digital skills like safe internet navigation and cyberbullying prevention. This experience has reshaped my perspective on technology as a tool for inclusion.

Working with seniors previously intimidated by smartphones or helping young students understand online safety has been incredibly rewarding. One memorable project involved creating simplified guides for elderly participants to connect with family through video calls.

The digital divide isn't just about access to devices—it's about having the knowledge to use them effectively. As our world becomes increasingly digital, initiatives like Cibervoluntarios ensure no one is left behind.

If you're interested in volunteering, consider exploring opportunities with digital inclusion organizations. Your skills could make a significant difference in someone's life.`,
    date: "March 15, 2024"
  };

  return (
    <BlogPostTemplate {...blogData} />
  );
};

export default BlogPost1;