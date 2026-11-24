"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type WorkSampleCarouselProps = {
  company: string;
  samples: readonly { src: string; href: string }[];
};

export default function WorkSampleCarousel({ company, samples }: WorkSampleCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const move = useCallback((direction: -1 | 1) => {
    const viewport = viewportRef.current;
    const firstSlide = viewport?.querySelector<HTMLElement>(".experience-gallery-link");
    if (!viewport || !firstSlide) return;

    const gap = Number.parseFloat(getComputedStyle(viewport).columnGap) || 0;
    const distance = firstSlide.getBoundingClientRect().width + gap;
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const target = viewport.scrollLeft + distance * direction;
    const left = target > maxScroll ? 0 : target < 0 ? maxScroll : target;

    viewport.scrollTo({ left, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const interval = window.setInterval(() => move(1), 4500);
    return () => window.clearInterval(interval);
  }, [move, paused]);

  return (
    <div
      className="experience-gallery"
      role="region"
      aria-label={`${company} work samples`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="experience-gallery-track" ref={viewportRef}>
        {samples.map((sample, index) => (
          <a
            className="experience-gallery-link"
            href={sample.href}
            key={sample.src}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${company} work sample ${index + 1}`}
          >
            <Image
              className="experience-gallery-image"
              src={sample.src}
              alt={`${company} website sample ${index + 1}`}
              fill
              sizes="(max-width: 500px) 80vw, (max-width: 760px) 45vw, 30vw"
            />
          </a>
        ))}
      </div>
      <div className="experience-gallery-controls">
        <button type="button" onClick={() => move(-1)} aria-label={`Previous ${company} work sample`}>‹</button>
        <button type="button" onClick={() => move(1)} aria-label={`Next ${company} work sample`}>›</button>
      </div>
    </div>
  );
}
