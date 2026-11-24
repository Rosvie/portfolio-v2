"use client";

import { useEffect, useState } from "react";

const words = [
  "Frontend Developer",
  "Wordpress Frontend Developer",
  "AI Prompt Engineer",
  "Video Editor",
  "AI Content Creator",
];

/** Cycles through professional roles with a typewriter effect. */
export default function TypingEffect() {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [sparkles, setSparkles] = useState(false);
  const word = words[index] ?? words[0];

  useEffect(() => {
    const finishedTyping = !deleting && text === word;
    const delay = deleting ? 45 : finishedTyping ? 1200 : 90;

    const timeout = window.setTimeout(() => {
      if (finishedTyping) {
        setDeleting(true);
      } else if (deleting && text.length === 0) {
        setDeleting(false);
        setIndex((current) => (current + 1) % words.length);
      } else {
        const nextText = deleting ? text.slice(0, -1) : word.slice(0, text.length + 1);
        setText(nextText);
        if (nextText === word) setSparkles(true);
      }
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [deleting, text, word]);

  useEffect(() => {
    if (!sparkles) return;

    const timeout = window.setTimeout(() => setSparkles(false), 700);
    return () => window.clearTimeout(timeout);
  }, [sparkles]);

  return (
    <span className="typing-effect" aria-label="Frontend and WordPress developer">
      <span aria-hidden="true">{text}</span>
      <span className="typing-cursor" aria-hidden="true">▌</span>
      {sparkles && (
        <span className="typing-sparkles" aria-hidden="true">
          <span>✦</span><span>✦</span><span>✧</span>
          <span>✦</span><span>✧</span><span>✦</span>
        </span>
      )}
    </span>
  );
}
