import { useState, useEffect } from "react";

const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode !== null) {
      return JSON.parse(savedDarkMode);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const applyDarkMode = (isDark: boolean) => {
      localStorage.setItem("darkMode", JSON.stringify(isDark));
      document.body.classList.toggle("dark", isDark);
    };

    applyDarkMode(darkMode);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
      applyDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);

  return { darkMode, toggleDarkMode };
};
export default useDarkMode;
