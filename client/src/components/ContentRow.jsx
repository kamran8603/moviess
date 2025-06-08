import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ContentRow = ({ title, movies }) => {
  const rowRef = useRef(null);
  
  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2
        : scrollLeft + clientWidth / 2;
      
      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="py-6">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 px-4 lg:px-6">{title}</h2>
      
      {/* Scrollable Row */}
      <div className="group relative">
        <div 
          ref={rowRef}
          className="categories-row flex space-x-4 px-4 lg:px-6 pb-4"
        >
          {movies && movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        
        {/* Scroll Buttons */}
        <button 
          className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
        <button 
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/30 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ContentRow;
