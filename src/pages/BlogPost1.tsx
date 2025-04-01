import React from 'react';
import BlogPostTemplate from '../components/BlogPostTemplate';

const BlogPost1: React.FC = () => {
  const blogData = {
    id: 1,
    title: "Volunteer in Fundación Cibervoluntarios",
    image: "/ciberv.png",
    content: "As a volunteer with Fundación Cibervoluntarios, I've had the opportunity to help bridge the digital divide by empowering individuals at risk of social and digital exclusion. The foundation's mission is to promote the use and knowledge of new technologies as a means to address social gaps, foster social innovation, and encourage citizen empowerment. ​\nThrough workshops and training sessions, I've assisted in teaching essential digital skills, such as safe internet navigation and cyberbullying prevention, tailoring content to meet the specific needs of diverse groups. This experience has reshaped my perspective on technology, highlighting its potential as a tool for inclusion and active societal participation. I've come to understand that access to and proficiency in technology are crucial for ensuring equal opportunities and strengthening social cohesion within our community.",
    date: "2021-09-01"
  };

  return (
    <BlogPostTemplate {...blogData} />
  );
};

export default BlogPost1;