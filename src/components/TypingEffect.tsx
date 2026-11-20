"use client";

import { useEffect, useState } from "react";

const words = [
  "Frontend Developer",
  "Wordpress Frontend Developer",
  "AI Prompt Engineer",
  "Video Editor",
  "AI Content Creator",
];

interface Spark {
  id: number;
  left: number;
  top: number;
  angle: number;
  distance: number;
}

export default function TypingEffect() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);

  const createSparks = () => {
    const newSparks = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      left: 0,
      top: 0,
      angle: (i / 8) * Math.PI * 2,
      distance: 0,
    }));
    setSparks(newSparks);

    // Remove sparks after animation
    setTimeout(() => setSparks([]), 600);
  };

  useEffect(() => {
    const currentWord = words[index];

    let typingSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));
 
        // finished typing
        if (text === currentWord) {
          createSparks();
          typingSpeed = 1000; // delay before deleting
          setTimeout(() => setIsDeleting(true), typingSpeed);
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));

        // finished deleting
        if (text === "") {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index]);

  return (
    <div className="relative inline-block">
      <h1>
        {text}
        <span className="cursor">|</span>
      </h1>

      {/* Spark particles */}
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="absolute pointer-events-none"
          style={{
            left: `${text.length * 0.5}ch`,
            top: "0.25em",
            animation: `spark-fly 0.6s ease-out forwards`,
            "--spark-angle": `${spark.angle}rad`,
            "--spark-distance": "40px",
          } as React.CSSProperties & Record<string, string>}
        >
          <div
            className="w-1 h-1 bg-white rounded-full shadow-lg"
            style={{
              boxShadow: "0 0 6px #ffffff, 0 0 12px rgba(255,255,255,0.6)",
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes spark-fly {
          0% {
            opacity: 1;
            transform: translate(0, 0);
          }
          100% {
            opacity: 0;
            transform: translate(
              calc(cos(var(--spark-angle)) * var(--spark-distance)),
              calc(sin(var(--spark-angle)) * var(--spark-distance))
            );
          }
        }
      `}</style>
    </div>
  );
}