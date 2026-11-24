const projects = [
  {
    id: "fortune-cookie",
    title: "Fortune Cookie",
    tagline: "Tap the cookie to crack it open!",
    sourceLink: "https://github.com/Rosvie/fortune-cookie",
    demoLink: "https://rosvie.github.io/fortune-cookie/",
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "Vite"],
    color: "var(--palette-yellow)",
    image: "/images/projects/img-fortune-cookie.png",
  },
  {
    id: "email-template",
    title: "Email Template",
    tagline: "A responsive email template for personal signatures.",
    sourceLink: "https://github.com/Rosvie/email-template-sample/",
    demoLink: "https://rosvie.github.io/email-template-sample/",
    skills: ["HTML", "SCSS", "GitHub"],
    color: "var(--palette-pink)",
  },
  {
    id: "food-decision-wheel",
    title: "What Should I Eat?",
    tagline: "Add your options, spin the wheel, and let it decide.",
    sourceLink: "https://github.com/Rosvie/food-decision-wheel/",
    demoLink: "https://rosvie.github.io/food-decision-wheel/",
    skills: ["HTML", "CSS", "JavaScript"],
    color: "var(--palette-mint)",
  },
  {
    id: "laundry-email-template",
    title: "Bubbly Basket Laundry",
    tagline: "A colorful and responsive email template for a laundry business.",
    sourceLink: "https://github.com/Rosvie/laundry-email-template",
    demoLink: "https://rosvie.github.io/laundry-email-template/",
    skills: ["HTML", "SCSS", "GitHub"],
    color: "var(--palette-blue)",
  },
  {
    id: "northfield-home-health-services",
    title: "Northfield Home Health Services",
    tagline: "A custom WordPress theme for a mock home health care agency.",
    sourceLink: "https://github.com/Rosvie/wp-theme-healthcare",
    demoLink: "https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/Rosvie/wp-theme-healthcare/main/dev/blueprint.json",
    skills: ["HTML", "CSS", "WordPress", "PHP"],
    color: "var(--palette-orange)",
  },
  {
    id: "crave-corner",
    title: "Crave Corner",
    tagline: "A demo WordPress theme for a mock snack and grocery store.",
    sourceLink: "https://github.com/Rosvie/wp-theme-grocery",
    demoLink: "https://playground.wordpress.net/?blueprint-url=https%3A%2F%2Fraw.githubusercontent.com%2FRosvie%2Fwp-theme-grocery%2Fmain%2Fdev%2Fblueprint.json",
    skills: ["HTML", "CSS", "WordPress", "PHP"],
    color: "var(--palette-yellow)",
  },
  {
    id: "ms-craftiful",
    title: "Ms. Craftiful",
    tagline: "A responsive landing page for a custom pin badge shop, built with React and deployed on Vercel.",
    sourceLink: "https://github.com/Rosvie/ms-craftiful",
    demoLink: "https://ms-craftiful.vercel.app/",
    skills: ["HTML", "CSS", "JavaScript", "React", "Vite", "Node.js", "GitHub", "Vercel"],
    color: "var(--palette-pink)",
    featured: true,
  },
];

/** Renders project cards with lightweight previews and direct links. */
export default function Projects() {
  return (
    <section className="projects-section" id="projects">
      <h2 className="section-title">Projects</h2>
      <div className="project-grid">
        {projects.map((project) => (
          <article
            className={`project-card${project.featured ? " project-card-featured" : ""}`}
            key={project.id}
          >
            <div className="project-preview" style={{ backgroundColor: project.color }}>
              <iframe
                src={project.demoLink}
                title={`${project.title} preview`}
                className="project-preview-iframe"
                loading="lazy"
              />
            </div>
            <div className="project-content">
              <div className="project-heading">
                {project.featured && <p className="project-featured-label">Featured · Latest</p>}
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.tagline}</p>
              </div>
              <ul className="project-skills" aria-label={`${project.title} technologies`}>
                {project.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
              <div className="project-links">
                <a href={project.sourceLink} target="_blank" rel="noopener noreferrer">Source Code</a>
                <a href={project.demoLink} target="_blank" rel="noopener noreferrer">Live Demo</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
