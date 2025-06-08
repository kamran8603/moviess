import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, Play } from 'lucide-react';
import { searchMovies, getImageUrl } from '../api/tmdb';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearchResults = () => {} }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dropdownResults, setDropdownResults] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const handleToggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      handleClearSearch();
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setError(null);
    setDropdownResults([]);
    onSearchResults([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      handleToggleSearch();
    }
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      handleClearSearch();
      setIsExpanded(false);
    }
  };
  
  useEffect(() => {
    let isSubscribed = true; // For cleanup

    const debounceTimeout = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        setError(null);
        try {
          const results = await searchMovies(query.trim());
          if (isSubscribed) {
            if (results?.results?.length > 0) {
              const topResults = results.results.slice(0, 5);
              setDropdownResults(topResults);
              onSearchResults(results.results);
            } else {
              setDropdownResults([]);
              onSearchResults([]);
              setError('No results found');
            }
          }
        } catch (err) {
          if (isSubscribed) {
            console.error('Search error:', err);
            setError('Something went wrong. Please try again.');
            setDropdownResults([]);
            onSearchResults([]);
          }
        } finally {
          if (isSubscribed) {
            setIsLoading(false);
          }
        }
      } else if (query.trim().length === 0) {
        handleClearSearch();
      }
    }, 500);

    return () => {
      isSubscribed = false;
      clearTimeout(debounceTimeout);
    };
  }, [query, onSearchResults]);

  const handleMovieClick = (movie) => {
    const movieSlug = movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/${movieSlug}`, { state: { movieId: movie.id } });
    handleClearSearch();
    setIsExpanded(false);
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && !inputRef.current.contains(event.target) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
        handleClearSearch();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className="relative flex items-center">
      <div
        className={`flex items-center overflow-hidden transition-all duration-300 ${
          isExpanded ? 'w-64 border-b border-white/20' : 'w-10'
        }`}
      >
        <button 
          className="flex-shrink-0 p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={handleToggleSearch}
          title={isExpanded ? 'Close search' : 'Search'}
        >
          {isExpanded ? (
            <X className="h-5 w-5" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </button>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search movies or TV shows..."
          className={`bg-transparent border-none focus:outline-none text-sm w-full ${
            isExpanded ? 'ml-2 opacity-100' : 'ml-0 opacity-0'
          } transition-opacity placeholder-white/50`}
        />
        
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin text-white/50 mr-2" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {isExpanded && dropdownResults.length > 0 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 py-2 bg-moviebuster-darkblue/95 backdrop-blur-md rounded-lg shadow-lg border border-white/10 z-50"
        >
          {dropdownResults.map((movie) => (
            <button
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              className="w-full px-3 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors"
            >
              {/* Mini Poster */}
              <div className="w-10 h-14 flex-shrink-0 rounded overflow-hidden">
                <img 
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Movie Info */}
              <div className="flex-grow text-left">
                <h3 className="text-sm font-medium text-white/90 truncate">
                  {movie.title}
                </h3>
                <p className="text-xs text-white/60">
                  {movie.release_date?.split('-')[0] || 'N/A'}
                </p>
              </div>
              
              {/* Play Button */}
              <div className="flex-shrink-0">
                <Play className="w-4 h-4 text-white/60" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-moviebuster-darkblue/95 backdrop-blur-md rounded-lg shadow-lg border border-white/10 z-50 text-center">
          <p className="text-sm text-white/80">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
