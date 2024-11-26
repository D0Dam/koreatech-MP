import { useEffect, useState } from 'react';

const useMediaQuery = (query: { minWidth?: number; maxWidth?: number }) => {
  const mediaQuery = Object.entries(query)
    .map(([key, value]) => {
      const cssKey = key.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
      return `(${cssKey}: ${value}px)`;
    })
    .join(' and ');

  const [matches, setMatches] = useState(() => window.matchMedia(mediaQuery).matches);

  useEffect(() => {
    const matchMedia = window.matchMedia(mediaQuery);

    function handleChange() {
      setMatches(window.matchMedia(mediaQuery).matches);
    }
    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia?.removeEventListener('change', handleChange);
    };
  }, [mediaQuery]);

  return matches;
};

export default useMediaQuery;
