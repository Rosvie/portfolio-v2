"use client";

import { useEffect, useRef, useState } from "react";

/**
 * HorizontalGallery
 * ------------------
 * Renders the .exp-card items inside .work-gallery-holder as a continuously
 * auto-scrolling, infinitely looping carousel (like a marquee).
 *
 * - Auto-play: the track scrolls sideways on its own at a constant speed,
 *   forever, via requestAnimationFrame.
 * - Desktop: hovering pauses the idle auto-scroll; the mouse wheel adds a
 *   smooth velocity impulse that glides and decelerates on its own, rather
 *   than jumping the track directly (no stutter from overlapping transitions).
 * - Mobile (below `md`): drag/swipe follows your finger 1:1 and carries
 *   momentum on release, or use the prev/next arrow buttons pinned to the
 *   bottom-center of .work-gallery-holder for an eased one-card glide.
 * - All motion (idle drift, wheel/swipe momentum, arrow glides) is driven by
 *   a single requestAnimationFrame loop writing directly to the DOM via
 *   translate3d, so nothing ever fights over the transform in the same frame.
 *
 * Loop technique: the gallery items are rendered 3x back-to-back
 * (prev set | current set | next set). We only ever let translateX drift
 * within the middle set's range, and silently "wrap" it by one set width
 * whenever it goes past that range. Because all three sets show identical
 * cards, the wrap is visually seamless -- no jump/flash is perceptible, so
 * the auto-scroll reads as one continuous, endless loop.
 */
// Auto-scroll speed for the continuous idle loop, in pixels per second.
const AUTO_SCROLL_PX_PER_SEC = 40;
// How strongly a wheel tick / swipe-release nudges the scroll speed.
const WHEEL_IMPULSE_FACTOR = 3.2;
// How much momentum carries over from a swipe release.
const SWIPE_MOMENTUM_FACTOR = 1;
// Top speed (px/sec) any single impulse can add, so a hard flick can't fling the track wildly.
const MAX_IMPULSE_VELOCITY = 1600;
// How quickly wheel/swipe momentum bleeds off (lower = slows down faster).
const VELOCITY_DECAY_PER_SEC = 0.0007;
// Duration (ms) of the eased glide used by the prev/next arrow buttons.
const ARROW_TWEEN_MS = 420;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function HorizontalGallery({ gallery, company }: { gallery: Array<{ src: string; href: string }>; company: string }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isHoveringRef = useRef(false);
  const translateXRef = useRef(0);

  // Width (px) of one full pass through `gallery` (all cards + gaps in one set).
  const singleSetWidthRef = useRef(0);
  // Distance (px) moved per arrow click / logical "step": one card + gap.
  const stepWidthRef = useRef(0);

  // Extra px/sec on top of the base auto-scroll speed, added by wheel ticks
  // and swipe-release momentum, then bled off smoothly every frame.
  const velocityRef = useRef(0);
  // Active eased glide (used by the arrow buttons), or null when idle.
  const tweenRef = useRef<{ start: number; end: number; startTime: number } | null>(null);

  // --- Swipe (touch) tracking for mobile ---
  const touchStartXRef = useRef(0);
  const touchStartTranslateRef = useRef(0);
  const isSwipingRef = useRef(false);
  const hasDraggedRef = useRef(false); // true once a swipe moves past a small threshold
  const lastTouchXRef = useRef(0);
  const lastTouchTimeRef = useRef(0);
  const touchVelocityRef = useRef(0); // px/ms, for momentum on release

  // Gallery rendered 3x so there's always a "prev" and "next" set to scroll into,
  // which is what makes the auto-scroll feel like one continuous, endless loop.
  const loopedGallery = [...gallery, ...gallery, ...gallery];

  // Keep translateX inside the middle set's bounds, wrapping by one set
  // width (seamless, since all sets are identical) whenever it drifts out.
  const wrapTranslate = (value: number) => {
    const singleSetWidth = singleSetWidthRef.current;
    if (!singleSetWidth) return value;

    let next = value;
    while (next <= -2 * singleSetWidth) next += singleSetWidth;
    while (next > 0) next -= singleSetWidth;
    return next;
  };

  // Writes the transform straight to the DOM (no React re-render per frame).
  // translate3d (instead of translateX) puts the track on its own GPU layer,
  // which keeps the continuous scroll smooth instead of janky/stuttery.
  const applyTransform = (value: number) => {
    translateXRef.current = value;
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translate3d(${value}px, 0, 0)`;
  };

  // Measure card/gap sizing and center the track on the middle set.
  useEffect(() => {
    const measureAndCenter = () => {
      if (!viewportRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const singleSetWidth = track.scrollWidth / 3;
      singleSetWidthRef.current = singleSetWidth;

      const firstCard = track.firstElementChild as HTMLElement | null;
      const gapPx = 16; // matches Tailwind's `gap-4`
      stepWidthRef.current = firstCard ? firstCard.getBoundingClientRect().width + gapPx : singleSetWidth;

      applyTransform(-singleSetWidth);
    };

    measureAndCenter();
    window.addEventListener("resize", measureAndCenter);

    return () => {
      window.removeEventListener("resize", measureAndCenter);
    };
  }, [gallery.length, company]);

  // Single continuous animation loop driving *all* motion (idle auto-scroll,
  // wheel/swipe inertia, and arrow-button glides), so nothing ever fights
  // over the transform in the same frame -- that's what keeps it smooth.
  useEffect(() => {
    let rafId: number;
    let lastTime: number | null = null;

    const tick = (time: number) => {
      if (!singleSetWidthRef.current) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      // An arrow-button glide in progress takes priority over everything else.
      if (tweenRef.current) {
        const { start, end, startTime } = tweenRef.current;
        const t = Math.min(1, (time - startTime) / ARROW_TWEEN_MS);
        applyTransform(wrapTranslate(start + (end - start) * easeOutCubic(t)));
        if (t >= 1) tweenRef.current = null;
      } else if (lastTime !== null) {
        // Clamp dt so returning to a backgrounded tab can't cause a big jump.
        const dtSeconds = Math.min((time - lastTime) / 1000, 0.05);

        // Idle auto-scroll pauses while the user is actively hovering/touching;
        // wheel/swipe momentum (velocityRef) keeps contributing regardless,
        // so input still feels immediate even mid-hover.
        const idleSpeed = isHoveringRef.current || isSwipingRef.current ? 0 : AUTO_SCROLL_PX_PER_SEC;
        const totalSpeed = idleSpeed + velocityRef.current;

        applyTransform(wrapTranslate(translateXRef.current - totalSpeed * dtSeconds));

        // Bleed off wheel/swipe momentum smoothly so it decelerates instead of stopping abruptly.
        velocityRef.current *= Math.pow(VELOCITY_DECAY_PER_SEC, dtSeconds);
      }

      lastTime = time;
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Desktop: mouse wheel adds a smooth velocity impulse while hovered
  // (instead of jumping the track directly), so repeated wheel ticks blend
  // into one continuous glide rather than stuttering.
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!isHoveringRef.current || !singleSetWidthRef.current) return;

    const delta = event.deltaY || event.deltaX;
    event.preventDefault();

    tweenRef.current = null;
    const impulse = delta * WHEEL_IMPULSE_FACTOR;
    velocityRef.current = Math.max(-MAX_IMPULSE_VELOCITY, Math.min(MAX_IMPULSE_VELOCITY, velocityRef.current + impulse));
  };

  // Mobile: swipe to scroll the track 1:1 with the finger.
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!singleSetWidthRef.current) return;
    tweenRef.current = null;
    velocityRef.current = 0;
    isSwipingRef.current = true;
    hasDraggedRef.current = false;
    const x = event.touches[0].clientX;
    touchStartXRef.current = x;
    touchStartTranslateRef.current = translateXRef.current;
    lastTouchXRef.current = x;
    lastTouchTimeRef.current = performance.now();
    touchVelocityRef.current = 0;
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!isSwipingRef.current) return;

    const now = performance.now();
    const currentX = event.touches[0].clientX;
    const deltaX = currentX - touchStartXRef.current;
    if (Math.abs(deltaX) > 8) hasDraggedRef.current = true; // treat as a swipe, not a tap

    event.preventDefault();
    applyTransform(wrapTranslate(touchStartTranslateRef.current + deltaX));

    const dt = now - lastTouchTimeRef.current;
    if (dt > 0) touchVelocityRef.current = (currentX - lastTouchXRef.current) / dt; // px/ms
    lastTouchXRef.current = currentX;
    lastTouchTimeRef.current = now;
  };

  const handleTouchEnd = () => {
    isSwipingRef.current = false;
    // Carry the finger's release speed into the auto-scroll velocity so the
    // track keeps coasting briefly instead of stopping dead.
    const releaseSpeed = -touchVelocityRef.current * 1000 * SWIPE_MOMENTUM_FACTOR; // px/ms -> px/sec, sign-matched
    velocityRef.current = Math.max(-MAX_IMPULSE_VELOCITY, Math.min(MAX_IMPULSE_VELOCITY, releaseSpeed));
    touchVelocityRef.current = 0;
  };

  // Prevent a swipe from also triggering the card's link navigation.
  const handleCardClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasDraggedRef.current) {
      event.preventDefault();
    }
  };

  // Shared "glide one card over" step, used by both arrow buttons.
  const stepGallery = (direction: 1 | -1) => {
    if (!stepWidthRef.current) return;
    velocityRef.current = 0;
    tweenRef.current = {
      start: translateXRef.current,
      end: translateXRef.current - direction * stepWidthRef.current,
      startTime: performance.now(),
    };
  };

  return (
    <div className="work-gallery-carousel relative">
      <div
        ref={viewportRef}
        onMouseEnter={() => {
          isHoveringRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveringRef.current = false;
        }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="work-gallery-holder max-w-full overflow-hidden rounded-md"
        style={{ overscrollBehavior: "contain" }}
      >
        <div
          ref={trackRef}
          className="work-gallery-track flex w-max gap-4 will-change-transform"
          style={{ transform: "translate3d(0, 0, 0)" }}
        >
          {loopedGallery.map((item, index) => (
            <a
              key={`${company}-${index}`}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCardClick}
              className="exp-card group block h-[220px] w-[400px] shrink-0 overflow-hidden rounded-md border border-gray-700 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:h-[200px]"
            >
              <img
                src={item.src}
                alt={`${company} showcase ${(index % gallery.length) + 1}`}
                className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Prev/next arrows: mobile-only, pinned to the bottom-center of the viewport */}
      <div className="work-gallery-arrows pointer-events-none absolute inset-x-0 bottom-0 flex justify-center gap-3 md:hidden">
        <button
          type="button"
          aria-label={`Previous ${company} image`}
          onClick={() => stepGallery(-1)}
          className="work-gallery-arrow-btn work-gallery-arrow-prev pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-gray-600 bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={`Next ${company} image`}
          onClick={() => stepGallery(1)}
          className="work-gallery-arrow-btn work-gallery-arrow-next pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-gray-600 bg-black/60 text-white backdrop-blur-sm transition hover:bg-black/80"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
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
