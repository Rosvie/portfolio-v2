import WorkSampleCarousel from "@/components/WorkSampleCarousel";

type WorkSample = {
  src: string;
  href: string;
};

type Experience = {
  company: string;
  position: string;
  duration: string;
  gallery: readonly WorkSample[];
  description: readonly string[];
};

const experiences: readonly Experience[] = [
  {
    company: "Forty Degrees Celsius Inc.",
    position: "Frontend Developer",
    duration: "January 2025 - Present",
    gallery: [
      { src: "/images/work-experience/work2-img1.png", href: "https://nativecamp.net/study_abroad/countries/philippines" },
      { src: "/images/work-experience/work2-img2.png", href: "https://ja.nativecamp.net/" },
      { src: "/images/work-experience/work2-img3.png", href: "https://nativecamp.net/ncai" },
      { src: "/images/work-experience/work2-img4.png", href: "https://nativecamp.net/study_abroad/countries/philippines-baguio" },
      { src: "/images/work-experience/work2-img5.png", href: "https://nativecamp.net/campaign/invite_friends" },
      { src: "/images/work-experience/work2-img6.png", href: "https://nativecamp.net/" },
    ],
    description: [
      "Developed and maintained responsive web applications using PHP/CakePHP and modern frontend technologies.",
      "Translated Figma designs into reusable components, managed multilingual content, and ensured compatibility across desktop, tablet, and mobile.",
      "Collaborated with designers and developers using Git and Jira to deliver high-quality digital solutions.",
    ],
  },
  {
    company: "Proweaver Inc.",
    position: "WordPress Frontend Developer II",
    duration: "October 2022 - August 2024",
    gallery: [
      { src: "/images/work-experience/work1-img1.png", href: "https://w11265.proweaversite11.com/" },
      { src: "/images/work-experience/work1-img2.png", href: "https://www.elschammainternational.org/" },
      { src: "/images/work-experience/work1-img3.png", href: "https://www.myparamounthealthcare.com/" },
      { src: "/images/work-experience/work1-img4.png", href: "https://www.bexarhospice.com/" },
      { src: "/images/work-experience/work1-img5.png", href: "https://www.mountvalleymontessori.com/" },
      { src: "/images/work-experience/work1-img6.png", href: "http://www.zionpentecostalfaithcenter.org/" },
    ],
    description: [
      "Converted Xara website designs into responsive websites using HTML, PHP, CSS, and WordPress.",
      "Developed and tested websites, then deployed them using Git and FileZilla to meet project requirements and deadlines.",
      "Collaborated with co-developers and maintained a productive work environment.",
    ],
  },
];

function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <article className="experience-card">
      <p className="experience-date">{experience.duration}</p>
      <h3 className="experience-company">{experience.company}</h3>
      <p className="experience-position">{experience.position}</p>
      <ul className="experience-details">
        {experience.description.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <WorkSampleCarousel company={experience.company} samples={experience.gallery} />
    </article>
  );
}

export default function WorkExperience() {
  return (
    <section className="experience-section" id="work-experience">
      <h2 className="section-title">Work Experience</h2>
      <div className="experience-list">
        {experiences.map((experience) => (
          <ExperienceCard key={experience.company} experience={experience} />
        ))}
      </div>
    </section>
  );
}
