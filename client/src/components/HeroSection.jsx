import React, { useState, useEffect } from 'react';
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { getImageUrl } from '../api/tmdb';
import { useNavigate } from 'react-router-dom';

const HeroSection = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliding, setSliding] = useState(false);
  const featuredMovie = movies[currentIndex];
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setSliding('right');
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [movies.length]);

  const goToSlide = (index) => {
    setSliding(index > currentIndex ? 'right' : 'left');
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    if (movies.length <= 1) return;
    if (!sliding) {
      setSliding('left');
      setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    }
  };

  const goToNext = () => {
    if (movies.length <= 1) return;
    if (!sliding) {
      setSliding('right');
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sliding]);

  // Reset sliding state after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setSliding(false);
    }, 500); // Match this with CSS transition duration
    return () => clearTimeout(timer);
  }, [currentIndex]);

  // Default values in case no movie is provided
  const title = featuredMovie?.title || featuredMovie?.name || 'Welcome to MovieBuster';
  const overview = featuredMovie?.overview || 'Start exploring the best movies and TV shows';
  const backdropPath = featuredMovie?.backdrop_path;
  const releaseYear = featuredMovie?.release_date?.substring(0, 4) || 
                      featuredMovie?.first_air_date?.substring(0, 4) || '';

  const handlePlayClick = () => {
    const movieSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/${movieSlug}`, { state: { movieId: featuredMovie.id } });
  };

  const handleInfoClick = () => {
    const movieSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/${movieSlug}`, { state: { movieId: featuredMovie.id } });
  };

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Hero Background with transition */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out ${
          sliding === 'right' ? 'translate-x-[-100%]' : 
          sliding === 'left' ? 'translate-x-[100%]' : 
          'translate-x-0'
        }`}
        style={{
          backgroundImage: `url(${backdropPath ? getImageUrl(backdropPath, 'original') : 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5'})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-moviebuster-darkblue/90 via-moviebuster-darkblue/70 to-transparent" />
      </div>

      {/* Previous Slide Background (for transition) */}
      {sliding && (
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out ${
            sliding === 'right' ? 'translate-x-0' : 'translate-x-0'
          }`}
          style={{
            backgroundImage: `url(${
              getImageUrl(
                movies[(currentIndex - 1 + movies.length) % movies.length]?.backdrop_path || '',
                'original'
              )
            })`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-moviebuster-darkblue/90 via-moviebuster-darkblue/70 to-transparent" />
        </div>
      )}

      {/* Updated Navigation Arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={sliding}
            className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full 
              hover:bg-black/70 transition-all transform hover:scale-110
              ${sliding ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            disabled={sliding}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full 
              hover:bg-black/70 transition-all transform hover:scale-110
              ${sliding ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Content with fade animation */}
      <div className={`relative h-full container mx-auto px-4 flex flex-col justify-center transition-opacity duration-300 ${sliding ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
          <div className="flex items-center text-sm space-x-4 mb-4">
            {featuredMovie?.vote_average && (
              <span className="bg-[#f3d100] dark:bg-moviebuster-red text-[#000e3d] dark:text-white px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#000e3d] dark:fill-white" />
                {featuredMovie.vote_average.toFixed(1)}
              </span>
            )}
            {releaseYear && <span>{releaseYear}</span>}
            <span>{featuredMovie?.media_type?.toUpperCase() || 'FEATURED'}</span>
          </div>
          <p className="text-lg mb-6 max-w-lg text-foreground/90">
            {overview}
          </p>
          
          <div className="flex space-x-4">
            <button 
              onClick={handlePlayClick}
              className="px-6 py-3 bg-[#f3d100] dark:bg-moviebuster-red text-[#000e3d] dark:text-white rounded-md flex items-center hover:bg-[#f3d100]/90 dark:hover:bg-white/90 hover:text-[#000e3d] dark:hover:text-moviebuster-red transition font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Play
            </button>
            <button 
              onClick={handleInfoClick}
              className="px-6 py-3 bg-[#000e3d]/50 dark:bg-[#c1bfba]/50 text-white rounded-md flex items-center hover:bg-[#000e3d]/70 dark:hover:bg-grey/70 transition"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-moviebuster-yellow w-8' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
