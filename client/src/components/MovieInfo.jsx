import React, { useState } from 'react';
import { Play, Plus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../api/tmdb';

const MovieInfo = ({ movie, recommendedMovies = [], topRatedMovies = [] }) => {
  const navigate = useNavigate();

  const handleMovieClick = (selectedMovie) => {
    const movieSlug = selectedMovie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/${movieSlug}`, { state: { movieId: selectedMovie.id } });
  };

  return (
    <div className="space-y-8">
      {/* Recommended Movies Grid */}
      <div className="bg-moviebuster-darkblue/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6">Recommended Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recommendedMovies.slice(0, 20).map((movie) => (
            <MovieGridItem 
              key={movie.id}
              movie={movie}
              onClick={() => handleMovieClick(movie)}
            />
          ))}
        </div>
      </div>

      {/* Top Rated Movies List */}
      <div className="bg-moviebuster-darkblue/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Top Rated</h2>
        <div className="space-y-3">
          {topRatedMovies.slice(0, 5).map((movie) => (
            <MovieListItem 
              key={movie.id}
              movie={movie}
              onClick={() => handleMovieClick(movie)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MovieGridItem = ({ movie, onClick }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const [isFavorite, setIsFavorite] = useState(() => {
    if (!isAuthenticated) return false;
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.favorites?.includes(movie.id) || false;
  });
  const [isInWatchlist, setIsInWatchlist] = useState(() => {
    if (!isAuthenticated) return false;
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.watchlist?.includes(movie.id) || false;
  });

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/not-logged-in');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await fetch('http://localhost:5100/api/users/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id,
          movieId: movie.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const handleAddToList = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/not-logged-in');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await fetch('http://localhost:5100/api/users/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id,
          movieId: movie.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsInWatchlist(!isInWatchlist);
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    }
  };

  const title = movie.title || movie.name || 'Unknown Title';
  const overview = movie.overview || 'No description available';

  return (
    <div 
      className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <img 
        src={getImageUrl(movie.poster_path)}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-white font-semibold text-base mb-2 truncate">{title}</h3>
          {isHovered && (
            <p className="text-white/80 text-sm mb-3 line-clamp-3 overflow-hidden">
              {overview}
            </p>
          )}
          <div className="flex items-center space-x-3 mb-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="p-2 bg-[#f3d100] dark:bg-moviebuster-red rounded-full hover:bg-[#000e3d] hover:text-[#f3d100] dark:hover:text-white transition"
            >
              <Play className="w-4 h-4 text-[#000e3d] hover:text-[#f3d100] dark:text-white dark:hover:text-white" />
            </button>
            <button 
              onClick={handleAddToList}
              className={`p-2 rounded-full transition ${
                isAuthenticated && isInWatchlist 
                  ? 'bg-[#f3d100] dark:bg-moviebuster-red text-[#000e3d] dark:text-white' 
                  : 'bg-black/40 hover:bg-[#f3d100]/60 dark:hover:bg-moviebuster-red/60'
              }`}
            >
              <Plus className={`w-4 h-4 ${
                isAuthenticated && isInWatchlist 
                  ? 'text-[#000e3d] dark:text-white' 
                  : 'text-white hover:text-[#000e3d] dark:hover:text-white'
              }`} />
            </button>
            <button 
              onClick={handleFavorite}
              className={`p-2 rounded-full transition ${
                isAuthenticated && isFavorite 
                  ? 'bg-[#f3d100] dark:bg-moviebuster-red text-[#000e3d] dark:text-white' 
                  : 'bg-black/40 hover:bg-[#f3d100]/60 dark:hover:bg-moviebuster-red/60'
              }`}
            >
              <Heart className={`w-4 h-4 ${
                isAuthenticated && isFavorite 
                  ? 'fill-[#000e3d] dark:fill-white text-[#000e3d] dark:text-white' 
                  : 'text-white hover:text-[#000e3d] dark:hover:text-white'
              }`} />
            </button>
          </div>
          {movie.vote_average && (
            <div className="text-sm text-white/90">
              <span className="text-[#f3d100] dark:text-moviebuster-yellow font-bold">
                {movie.vote_average.toFixed(1)}
              </span>/10
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MovieListItem = ({ movie, onClick }) => (
  <div 
    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
    onClick={onClick}
  >
    <div className="w-12 h-16 flex-shrink-0 rounded overflow-hidden">
      <img 
        src={getImageUrl(movie.poster_path)}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="flex-grow min-w-0">
      <h3 className="font-medium text-white/90 truncate">{movie.title}</h3>
      <div className="flex items-center gap-2 text-sm text-white/60">
        <span>{movie.release_date?.split('-')[0]}</span>
        <span>•</span>
        <span>{movie.vote_average?.toFixed(1)} Rating</span>
      </div>
    </div>
    <button 
      className="p-2 bg-[#f3d100]/80 dark:bg-moviebuster-red/80 rounded-full hover:bg-white/90 hover:text-[#000e3d] dark:hover:text-white transition-colors flex-shrink-0"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <Play className="w-4 h-4 text-[#000e3d] dark:text-white" />
    </button>
  </div>
);

export default MovieInfo;