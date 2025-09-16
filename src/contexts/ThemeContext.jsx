import React, { useState, useEffect, useRef } from 'react';
import { ThemeContext } from './theme-context';


export const ThemeProvider = ({ children }) => {
  const transitionTimerRef = useRef(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    
    // Remover ambas as classes primeiro
    root.classList.remove('light', 'dark');
    
    // Adicionar a classe do tema atual
    root.classList.add(theme);
    
    // Salvar no localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    
    // Habilita transição global temporária
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    
    root.classList.add('theme-transition');
    
    transitionTimerRef.current = setTimeout(() => {
      root.classList.remove('theme-transition');
      transitionTimerRef.current = null;
    }, 400);

    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
