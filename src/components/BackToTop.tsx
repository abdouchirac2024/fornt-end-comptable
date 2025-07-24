import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = document.documentElement.scrollTop;
      const maxHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrolled / maxHeight) * 100;
      
      setScrollProgress(progress);
      setIsVisible(scrolled > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  // Couleur change selon le progress
  const getColor = () => {
    if (scrollProgress < 25) return '#3b82f6'; // Blue
    if (scrollProgress < 50) return '#10b981'; // Green
    if (scrollProgress < 75) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 group"
      style={{ 
        background: `conic-gradient(${getColor()} ${scrollProgress * 3.6}deg, rgba(255,255,255,0.2) 0deg)`,
        padding: '4px',
        borderRadius: '50%'
      }}
    >
      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-elegant hover:shadow-glow transition-all duration-300 group-hover:scale-110">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center animate-pulse-glow"
          style={{ 
            background: `linear-gradient(135deg, ${getColor()}, ${getColor()}dd)`,
            boxShadow: `0 0 20px ${getColor()}40`
          }}
        >
          <ChevronUp className="h-6 w-6 text-white" />
        </div>
      </div>
    </button>
  );
};

export default BackToTop;