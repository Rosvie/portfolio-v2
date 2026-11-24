import Image from "next/image";
import Projects from "@/components/Projects";
import WorkExperience from "@/components/WorkExperience";
import Contact from "@/components/Contact";
import TypingEffect from "@/components/TypingEffect";
import SparkleInteractions from "@/components/SparkleInteractions";
import ThemeToggle from "@/components/ThemeToggle";

function HeroTitleWord({ word, accent = false }: { word: string; accent?: boolean }) {
  return (
    <span className={`hero-title-word${accent ? " hero-title-accent" : ""}`} aria-hidden="true">
      {Array.from(word).map((letter, index) => (
        <span className="hero-title-letter" key={`${letter}-${index}`}>{letter}</span>
      ))}
    </span>
  );
}

/** Renders the portfolio landing page and its section navigation. */
export default function Home() {
  return (
    <div className="portfolio-page">
      <SparkleInteractions />
      <nav className="portfolio-nav backdrop-blur-sm" aria-label="Main navigation">
        <a className="portfolio-brand" href="#about" aria-label="Rosvie Pepito home">
          <Image className="portfolio-avatar" src="/favicon.png" alt="" width={48} height={48} priority />
        </a>
        <ul className="portfolio-nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#work-experience">Experiences</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact" data-sparkle-burst>Contact</a></li>
        </ul>
      </nav>
      <div className="theme-toggle-position">
        <ThemeToggle />
      </div>

      <main className="portfolio-main">
        <section className="hero-section" id="about">
          <div className="hero-copy">
            <div className="hero-twinkles" aria-hidden="true">
              <span className="hero-twinkle-one">✦</span>
              <span className="hero-twinkle-two">✦</span>
              <span className="hero-twinkle-three">✦</span>
              <span className="hero-twinkle-four">✦</span>
            </div>
            <p className="hero-availability">
              <span className="hero-availability-dot" aria-hidden="true" />
              Open for Opportunities
            </p>
            <h1 className="hero-title" aria-label="Rosvie R. Pepito">
              <HeroTitleWord word="Rosvie" />{" "}
              <HeroTitleWord word="R." />{" "}
              <HeroTitleWord word="Pepito" />
            </h1>
            <p className="hero-role"><TypingEffect /></p>
            <p className="hero-description">
              I specialize in front-end development, building responsive,
              user-centered web experiences with a focus on performance,
              accessibility, and clean code. I enjoy creating intuitive
              interfaces and continuously learning new technologies to deliver
              high-quality digital solutions.
            </p>
            <div className="hero-actions">
              <a className="hero-primary-link" href="#projects" data-sparkle-burst>View projects</a>
              <a className="hero-secondary-link" href="mailto:pepitorosvie08@gmail.com" data-sparkle-burst>Email me</a>
            </div>
          </div>

        </section>

        <WorkExperience />
        <Projects />
        <Contact />
      </main>

      <footer className="portfolio-footer">
        © 2026 Rosvie R. Pepito · built with curiosity and a little sparkle
      </footer>
    </div>
  );
}
