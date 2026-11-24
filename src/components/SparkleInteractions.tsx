"use client";

import { useEffect, useRef } from "react";

const colors = [
  "var(--palette-mint)",
  "var(--palette-yellow)",
  "var(--palette-blue)",
  "var(--palette-pink)",
];

/** Adds a light cursor trail and click bursts to marked actions. */
export default function SparkleInteractions() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastTrail = 0;
    let colorIndex = 0;

    const addSparkle = (x: number, y: number, burstIndex?: number) => {
      const layer = layerRef.current;
      if (!layer) return;

      const sparkle = document.createElement("span");
      const isBurst = burstIndex !== undefined;
      sparkle.className = isBurst ? "interaction-sparkle interaction-sparkle-burst" : "interaction-sparkle interaction-sparkle-trail";
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.setProperty("--sparkle-color", colors[colorIndex++ % colors.length]);

      if (isBurst) {
        const angle = (burstIndex / 14) * Math.PI * 2;
        const distance = 24 + (burstIndex % 3) * 9;
        sparkle.style.setProperty("--sparkle-x", `${Math.cos(angle) * distance}px`);
        sparkle.style.setProperty("--sparkle-y", `${Math.sin(angle) * distance}px`);
        sparkle.style.animationDelay = `${burstIndex * 12}ms`;
      } else {
        sparkle.style.setProperty("--sparkle-x", `${(Math.random() - 0.5) * 14}px`);
        sparkle.style.setProperty("--sparkle-y", `${12 + Math.random() * 12}px`);
      }

      layer.append(sparkle);
      window.setTimeout(() => sparkle.remove(), isBurst ? 1000 : 650);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || performance.now() - lastTrail < 65) return;
      lastTrail = performance.now();
      addSparkle(event.clientX, event.clientY);
    };

    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest("[data-sparkle-burst]")) return;
      for (let index = 0; index < 14; index++) {
        addSparkle(event.clientX, event.clientY, index);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return <div className="sparkle-interaction-layer" ref={layerRef} aria-hidden="true" />;
}
