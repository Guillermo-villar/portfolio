import React from 'react';
import ProjectsTemplate from '../components/ProjectsTemplate';
import Footer from '../components/Footer';

const SolSombraProject: React.FC = () => {
  const projectData = {
    title: "Sol Sombra",
    image: "solsombra-banner.webp",
    description: "Sol Sombra plans walking routes across Madrid by how much sun each stretch of pavement actually gets, so you can chase the shade in August or the light in January. It models the position of the sun minute by minute, casts building shadows onto a sidewalk-level routing graph built from the city's open data, and scores every segment by its predicted exposure. You pick a profile (seek the sun, avoid it, or balance both) and the router trades a little extra distance for a lot less time under direct sunlight, drawing the sunlit and shaded stretches side by side on the map. The whole system runs on a single small VPS: a Next.js app with PostgreSQL and PostGIS for the geometry and the solar buckets, GraphHopper as the routing engine, MapLibre for the map and Docker for deployment. It also ships a mobile walk recorder that validates the model on the ground, comparing the predicted exposure against GPS-tagged sun and shade observations taken while walking the street.",
    liveLink: "https://solsombra.madrid",
    liveLabel: "Open solsombra.madrid",
    type: "Personal",
    isDemo: true,
    projStack: "Next.js, TypeScript, PostgreSQL, PostGIS, GraphHopper, MapLibre, Docker"
  };
  return (
    <div className="home">
      <ProjectsTemplate {...projectData} />
      <Footer />
    </div>
  );
};

export default SolSombraProject;
