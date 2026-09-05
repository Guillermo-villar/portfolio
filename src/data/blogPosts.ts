/**
 * Every blog post, in one place.
 *
 * The listing page and the post pages used to keep their own copies of the
 * title, date and image, and they drifted: the listing dated this post to 2025
 * while the post itself said 2024, and gave it a different title altogether.
 * Both now read from here, so they cannot disagree again.
 */

export interface BlogPost {
  id: number;
  title: string;
  image: string;
  /** Shown on the listing card. Kept separate so the card never has to show raw markdown. */
  excerpt: string;
  /** Machine-readable date, used for ordering and for <time dateTime>. */
  date: string;
  content: string;
}

/** "2024-04-01" -> "April 1, 2024". */
export const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'My Journey as a Cibervolunteer',
    image: 'ciberv.webp',
    date: '2024-03-15',
    excerpt:
      'Volunteering with Fundación Cibervoluntarios taught me that the digital divide is not really about devices — it is about knowing how to use them. Notes from workshops on safe browsing, cyberbullying and video calls with people the internet left behind.',
    content: `As a volunteer with Fundación Cibervoluntarios, I've helped bridge the digital divide by empowering individuals at risk of social and digital exclusion. The foundation promotes the use of new technologies to address social gaps and foster citizen empowerment.

Through workshops and training sessions, I've taught essential digital skills like safe internet navigation and cyberbullying prevention. This experience has reshaped my perspective on technology as a tool for inclusion.

Working with seniors previously intimidated by smartphones or helping young students understand online safety has been incredibly rewarding. One memorable project involved creating simplified guides for elderly participants to connect with family through video calls.

The digital divide isn't just about access to devices—it's about having the knowledge to use them effectively. As our world becomes increasingly digital, initiatives like Cibervoluntarios ensure no one is left behind.

If you're interested in volunteering, consider exploring opportunities with digital inclusion organizations. Your skills could make a significant difference in someone's life.`
  },
  {
    id: 2,
    title: 'My Web Development Journey: From Zero to Portfolio',
    image: 'og-image.png',
    date: '2024-04-01',
    excerpt:
      'Building this site meant learning HTML, CSS, React and TypeScript from scratch, then fighting DNS records, HTTPS certificates and GitHub Pages 404s. The whole thing is open source if you want to fork it.',
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
This portfolio is entirely open source! You can view the code, suggest improvements, or fork it for your own use at [github.com/Guillermo-villar/portfolio](https://github.com/Guillermo-villar/portfolio). Contributions and feedback are always welcome.

Looking back, every challenge became a valuable learning opportunity. This project taught me not just coding skills, but patience, problem-solving, and the importance of community resources when tackling new technologies.`
  },
  {
    id: 3,
    title: 'Exploring Modern Web Development Frameworks',
    image: 'AI.webp',
    date: '2024-02-20',
    excerpt:
      'React, Vue, Angular and Svelte compared on the things that actually decide the choice: ecosystem, learning curve, bundle size and how well each one fits the team you already have.',
    content: `Choosing the right framework is crucial in today's evolving web development landscape. Here's a brief comparison of popular frameworks.

## React: The Flexible Library
- Massive ecosystem with numerous libraries
- Strong community support
- Flexible integration with other technologies
- Excellent for complex interfaces

## Vue: The Progressive Framework
- Gentle learning curve
- Built-in features like two-way binding
- Excellent developer experience
- Strong TypeScript support via Composition API

## Angular: The Complete Platform
- Comprehensive built-in tools
- Strong TypeScript integration
- Dependency injection system
- Well-suited for enterprise applications

## Svelte: The Compiler Approach
- No virtual DOM for better performance
- Less boilerplate code
- Smaller bundle sizes
- Simple reactive state management

## Making the Decision
When choosing a framework, consider your team's expertise, project requirements, long-term maintenance needs, and performance constraints.

The best approach is understanding each framework's strengths and selecting the right tool for each project rather than using a one-size-fits-all approach.`
  }
];

/** Newest first, so the listing is always in chronological order. */
export const postsNewestFirst = (): BlogPost[] =>
  [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (id: number): BlogPost | undefined =>
  blogPosts.find((post) => post.id === id);
