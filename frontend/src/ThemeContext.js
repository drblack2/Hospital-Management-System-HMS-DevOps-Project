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
      bg: '#1a1a1a',
      bgSecondary: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#404040',
      primary: '#0066cc',
      primaryHover: '#0052a3',
      success: '#27ae60',
      danger: '#e74c3c',
      warning: '#f39c12',
      card: '#252525',
      navbar: '#1a1a1a',
      shadow: 'rgba(0, 0, 0, 0.5)'
    } : {
      bg: '#ffffff',
      bgSecondary: '#f5f5f5',
      text: '#333333',
      textSecondary: '#666666',
      border: '#e0e0e0',
      primary: '#0066cc',
      primaryHover: '#0052a3',
      success: '#27ae60',
      danger: '#e74c3c',
      warning: '#f39c12',
      card: '#ffffff',
      navbar: '#2c3e50',
      shadow: 'rgba(0, 0, 0, 0.1)'
    }
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
