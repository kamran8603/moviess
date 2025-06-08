import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const isDark = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);
  
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.theme = newMode ? 'dark' : 'light';
  };
  
  return (
    <button 
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-700/50 transition-colors"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Moon className="h-5 w-5 text-white/90 hover:text-white transition-colors" />
      ) : (
        <Sun className="h-5 w-5 text-white/90 hover:text-white transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;
