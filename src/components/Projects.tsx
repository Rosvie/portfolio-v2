"use client";

const projects = [
  {
    id: "fortune-cookie",
    title: "Fortune Cookie",
    tagline: "Tap the cookie to crack it open!",
    // image: "https://rosvie.github.io/fortune-cookie/",
    sourceLink: "https://github.com/Rosvie/fortune-cookie",
    demoLink: "https://rosvie.github.io/fortune-cookie/",
    skills: ["HTML", "CSS", "Javascript", "Typescript", "Vite"],
  },
  {
    id: "mount-valley",
    title: "Dummy Title",
    tagline: "A warm, welcoming site for a Montessori school.",
    // image: "/images/proj-img2.png",
    sourceLink: "https://github.com/Rosvie/fortune-cookie",
    demoLink: "https://rosvie.github.io/fortune-cookie/",
    skills: ["HTML", "CSS", "PHP", "MySQL", "JavaScript"],
  },
  {
    id: "zion-pentecostal",
    title: "Dummy Title",
    tagline: "A community hub for a local ministry.",
    // image: "/images/proj-img3.png",
    sourceLink: "https://github.com/Rosvie/fortune-cookie",
    demoLink: "https://rosvie.github.io/fortune-cookie/",
    skills: ["HTML", "CSS", "PHP", "MySQL", "JavaScript"],
  },
  {
    id: "dummy-project",
    title: "Fortune Cookie",
    tagline: "Tap the cookie to crack it open!",
    // image: "/images/projects/img-fortune-cookie.png",
    sourceLink: "https://github.com/Rosvie/fortune-cookie",
    demoLink: "https://rosvie.github.io/fortune-cookie/",
    skills: ["React", "TypeScript", "CSS Animations"],
  },
];

function Sparkle({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
       style={style}
      aria-hidden="true"
    >
      <path d="M12 0c0 6.627 5.373 12 12 12-6.627 0-12 5.373-12 12 0-6.627-5.373-12-12-12C6.627 12 12 6.627 12 0z" />
    </svg>
  );
}


export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 w-full max-w-6xl">
      <p
        className="mb-8 text-3xl font-bold sm:text-4xl md:text-5xl"
        style={{ fontFamily: "var(--font-instrument-serif)" }}
      >
        Projects
      </p>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-card dark-gradient relative flex min-h-[560px] flex-col overflow-hidden rounded-3xl border border-gray-800 transition hover:border-gray-600"
          >
            {/* Thumbnail: image, no padding */}
            <div className="project-thumbnail relative">
              <div
                className="pointer-events-none absolute inset-0 opacity-60 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
                }}
              />
              {/* <img
                src={project.image}
                alt={`${project.title} preview`}
                className="relative h-56 w-full object-cover sm:h-64"
              /> */}
            
              <iframe
                src={project.demoLink}
                title={`${project.title} preview`}
                className="relative h-56 w-full border-0 sm:h-64"
                loading="lazy"
              />
            </div>

            {/* Details: title, tagline, buttons, skills */}
            <div className="project-details relative z-10 flex flex-1 flex-col p-8 sm:p-10">
              {/* Decorative sparkles */}
              <Sparkle className="sparkle-twinkle absolute left-8 top-4 h-3 w-3 text-gray-500" />
              <Sparkle className="sparkle-twinkle absolute right-16 top-8 h-6 w-6 text-yellow-400" style={{ animationDelay: "0.4s" }} />
              <Sparkle className="sparkle-twinkle absolute right-8 top-16 h-3 w-3 text-gray-400" style={{ animationDelay: "0.9s" }} />
              <Sparkle className="sparkle-twinkle absolute left-10 bottom-32 h-3 w-3 text-gray-500" style={{ animationDelay: "1.3s" }} />
              <Sparkle className="sparkle-twinkle absolute right-14 bottom-40 h-3 w-3 text-gray-400" style={{ animationDelay: "0.6s" }} />

              <h3
                className="relative z-10 mb-2 text-center text-2xl font-semibold text-white sm:text-3xl"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                {project.title}
              </h3>
              <p className="relative z-10 text-center text-sm text-gray-400">
                {project.tagline}
              </p>

              <div className="relative z-10 flex flex-wrap justify-center gap-2 my-6">
                {project.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-gray-700 bg-gray-900/60 px-3 py-1 text-xs text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
                {project.sourceLink && (
                  <a
                    href={project.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-gray-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Source Code
                  </a>
                )}
                {project.demoLink && (
                  <a
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
                  >
                    Live Demo
                  </a>
                )}
              </div>

              
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
