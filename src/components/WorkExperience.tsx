"use client";

import { useEffect, useRef, useState } from "react";

function HorizontalGallery({ gallery, company }: { gallery: Array<{ src: string; href: string }>; company: string }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isHoveringRef = useRef(false);
  const translateXRef = useRef(0);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (!viewportRef.current || !trackRef.current) return;

      const viewport = viewportRef.current;
      const track = trackRef.current;
      const maxTranslate = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const nextTranslate = Math.max(-maxTranslate, Math.min(0, translateXRef.current));

      translateXRef.current = nextTranslate;
      setTranslateX(nextTranslate);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [gallery.length, company]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!viewportRef.current || !trackRef.current || !isHoveringRef.current) return;

    const viewport = viewportRef.current;
    const track = trackRef.current;
    const maxTranslate = Math.max(0, track.scrollWidth - viewport.clientWidth);

    if (maxTranslate <= 0) return;

    const delta = event.deltaY || event.deltaX;
    const nextTranslate = Math.max(-maxTranslate, Math.min(0, translateXRef.current - delta * 0.6));

    const atStart = translateXRef.current >= -1;
    const atEnd = translateXRef.current <= -maxTranslate + 1;

    if ((delta > 0 && atEnd) || (delta < 0 && atStart)) {
      return;
    }

    event.preventDefault();
    translateXRef.current = nextTranslate;
    setTranslateX(nextTranslate);
  };

  return (
    <div
      ref={viewportRef}
      onMouseEnter={() => {
        isHoveringRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveringRef.current = false;
      }}
      onWheel={handleWheel}
      className="work-gallery-holder max-w-full overflow-hidden rounded-md"
      style={{ overscrollBehavior: "contain" }}
    >
      <div
        ref={trackRef}
        className="flex w-max gap-4 will-change-transform"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {gallery.map((item, index) => (
          <a
            key={`${company}-${index}`}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="exp-card group block h-[220px] w-[400px] shrink-0 overflow-hidden rounded-md border border-gray-700 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:h-[200px]"
          >
            <img
              src={item.src}
              alt={`${company} showcase ${index + 1}`}
              className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

const experiences = [
  {
    id: "fdci-work",
    company: "Forty Degrees Celsius Inc.",
    position: "Frontend Developer",
    duration: "January 2025 - Present",
    link: "https://nativecamp.net/",
    description: [
      "Developed and maintained responsive, user-friendly web applications using PHP/CakePHP and modern frontend technologies.",
      "Translated Figma designs into reusable frontend components, managed multilingual content and localization (i18n), and ensured compatibility across desktop, tablet, and mobile devices.",
      "Collaborated with UI/UX designers, backend developers, and stakeholders using Git and Jira to deliver high-quality digital solutions.",
    ],
    gallery: [
      { src: "/images/work-experience/work2-img1.png", href: "https://nativecamp.net/" },
      { src: "/images/work-experience/work2-img2.png", href: "https://nativecamp.net/" },
      { src: "/images/work-experience/work2-img3.png", href: "https://nativecamp.net/" },
      { src: "/images/work-experience/work2-img4.png", href: "https://nativecamp.net/" },
      { src: "/images/work-experience/work2-img5.png", href: "https://nativecamp.net/" },
      { src: "/images/work-experience/work2-img6.png", href: "https://nativecamp.net/" },
    ],
  },
  {
    id: "proweaver-work",
    company: "Proweaver Inc.",
    position: "Wordpress Frontend Developer II",
    duration: "October 2022 - August 2024",
    link: "https://www.mountvalleymontessori.com/",
    description: [
      "Trained in converting Xara website designs into functional, responsive websites using HTML, PHP, CSS, and WordPress, gaining hands-on experience in web development.",
      "Developed functional, quality-tested websites and deployed them using Git and FileZilla, ensuring compliance with project requirements and deadlines.",
      "Collaborated with co-developers and maintained a productive work environment.",
    ],
    gallery: [
      { src: "/images/work-experience/work1-img1.png", href: "https://w11265.proweaversite11.com/" },
      { src: "/images/work-experience/work1-img2.png", href: "https://www.elschammainternational.org/" },
      { src: "/images/work-experience/work1-img3.png", href: "https://www.myparamounthealthcare.com/" },
      { src: "/images/work-experience/work1-img4.png", href: "https://www.bexarhospice.com/" },
      { src: "/images/work-experience/work1-img5.png", href: "https://www.mountvalleymontessori.com/" },
      { src: "/images/work-experience/work1-img6.png", href: "http://www.zionpentecostalfaithcenter.org/" },
    ],
  },
];

export default function WorkExperience() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleGallery = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section id="work-experience" className="scroll-mt-24 w-full max-w-6xl">
      <h2
        className="mb-8 text-3xl font-bold sm:text-4xl md:text-5xl font-medium"
        style={{ fontFamily: "var(--font-space-mono)" }}
      >
        Work Experience
      </h2>

      <div className="work-exp-holder space-y-6">
        {experiences.map((exp) => {
          const isOpen = openId === exp.id;

          return (
            <div
              key={exp.id}
              className="overflow-hidden rounded-lg border border-gray-700 bg-gray-900/30"
            >
              <div className="w-full bg-gray-900/30 p-6 transition sm:p-8">
                <h3
                  className="mb-2 text-2xl font-bold text-white sm:text-3xl"
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                >
                  {exp.company}
                </h3>
                <p
                  className="mb-4 text-base text-gray-300 italic sm:text-lg"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {exp.position}
                </p>
                <span className="mb-6 inline-block rounded-full bg-white px-4 py-2 text-sm font-medium text-black">
                  {exp.duration}
                </span>

                <ul
                  className="space-y-3 text-gray-300"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  {exp.description.map((point, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="min-w-fit text-white">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => toggleGallery(exp.id)}
                  className="mt-6 rounded-full border border-gray-500 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-black"
                  aria-expanded={isOpen}
                >
                  {isOpen ? "Hide gallery" : "Take a look"}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? "mt-6 max-h-[1200px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {isOpen ? <HorizontalGallery gallery={exp.gallery} company={exp.company} /> : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
