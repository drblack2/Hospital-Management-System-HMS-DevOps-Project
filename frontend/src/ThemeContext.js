import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    colors: isDarkMode ? {
      bg: '#0a0a0a',
      bgSecondary: '#161616',
      text: '#ffffff',
      textSecondary: '#b3b3b3',
      border: '#262626',
      primary: '#ff8c42',
      primaryHover: '#ff7626',
      success: '#10b981',
      danger: '#ff6b6b',
      warning: '#fbbf24',
      card: '#121212',
      navbar: '#0f0f0f',
      shadow: 'rgba(0, 0, 0, 0.7)',
      accent1: '#ffb366',
      accent2: '#ff6b35',
      accent3: '#ff8c42'
    } : {
      bg: '#1a1a1a',
      bgSecondary: '#252525',
      text: '#ffffff',
      textSecondary: '#d4d4d4',
      border: '#333333',
      primary: '#ff8c42',
      primaryHover: '#ff7626',
      success: '#10b981',
      danger: '#ff6b6b',
      warning: '#fbbf24',
      card: '#1f1f1f',
      navbar: '#000000',
      shadow: 'rgba(0, 0, 0, 0.6)',
      accent1: '#ffb366',
      accent2: '#ff6b35',
      accent3: '#ff8c42'
    }
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
