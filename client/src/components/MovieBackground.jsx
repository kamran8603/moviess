import React, { useEffect, useState } from 'react';

const MovieBackground = () => {
  const [backgroundUrl, setBackgroundUrl] = useState('');

  useEffect(() => {
    // Array of popular movie poster paths (you can expand this)
    const moviePosters = [
      '/vBZ0qvaRxqEhZwl6LWmruJqWE8Z.jpg',
      '/kQC9Q70fdJ0rR9SqVsNtJGecx7L.jpg',
      '/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg',
      '/7yyFEsuaLGTPul5UkHc5BhXnQ0k.jpg',
      '/zPEDfWece7gg1I0916KXYhZLEt9.jpg'
    ];

    // Select random poster
    const randomPoster = moviePosters[Math.floor(Math.random() * moviePosters.length)];
    setBackgroundUrl(`https://image.tmdb.org/t/p/original${randomPoster}`);
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />
    </div>
  );
};

export default MovieBackground;