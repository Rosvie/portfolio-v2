"use client";

import { useEffect } from "react";

export default function ThemeToggle() {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("portfolio-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      document.documentElement.dataset.theme = savedTheme;
    }
  }, []);

  function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem("portfolio-theme", nextTheme);
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label="Toggle light and dark mode"
      onClick={toggleTheme}
      title="Toggle light and dark mode"
    >
      <span className="theme-toggle-switch" aria-hidden="true">
        <span className="theme-toggle-stars"><span>✦</span><span>·</span><span>✦</span></span>
        <span className="theme-toggle-knob">
          <span className="theme-toggle-sun">☀</span>
          <span className="theme-toggle-moon">☾</span>
        </span>
      </span>
    </button>
  );
}
