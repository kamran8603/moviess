import React, { useState } from 'react';
import { Play, Plus, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../api/tmdb';

const MovieCard = ({ movie }) => {
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
  
  const title = movie.title || movie.name || 'Unknown Title';
  const posterPath = movie.poster_path;
  const overview = movie.overview || 'No description available';

  const handlePlayClick = () => {
    const movieSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/${movieSlug}`, { state: { movieId: movie.id } });
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User data:', user); // Debug log

    if (!user) {
      navigate('/not-logged-in');
      return;
    }

    try {
      console.log('Sending request with:', { 
        userId: user._id,
        movieId: Number(movie.id)
      }); // Debug log

      const response = await fetch('http://localhost:5100/api/users/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id, // Change back to user.id if that's how it's stored
          movieId: Number(movie.id)
        })
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error data:', errorData); // Debug log
        throw new Error(errorData.message || 'Failed to update favorites');
      }

      const updatedUser = await response.json();
      console.log('Updated user:', updatedUser); // Debug log
      localStorage.setItem('user', JSON.stringify(updatedUser.user));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleAddToList = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const user = JSON.parse(localStorage.getItem('user'));
    console.log('User data for watchlist:', user); // Debug log

    if (!user) {
      navigate('/not-logged-in');
      return;
    }

    try {
      // Use user.id consistently across the application
      const response = await fetch('http://localhost:5100/api/users/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id, // Use user.id consistently
          movieId: Number(movie.id)
        })
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error data:', errorData); // Debug log
        throw new Error(errorData.message || 'Failed to update watchlist');
      }

      const updatedUser = await response.json();
      console.log('Updated user:', updatedUser); // Debug log
      localStorage.setItem('user', JSON.stringify(updatedUser.user));
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <div 
      className="movie-card w-[180px] sm:w-[220px] md:w-[260px] h-[270px] sm:h-[330px] md:h-[390px] flex-shrink-0 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <img 
        src={getImageUrl(posterPath)} 
        alt={title} 
        className="w-full h-full object-cover rounded-lg shadow-md"
      />
      
      {/* Overlay with Information */}
      <div className={`absolute inset-0 rounded-lg bg-gradient-to-t from-black/90 via-black/70 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute bottom-0 p-4 w-full">
          <h3 className="text-white font-semibold text-base sm:text-lg mb-2">{title}</h3>
          {isHovered && (
            <p className="text-white/80 text-sm mb-3 line-clamp-3 overflow-hidden">
              {overview}
            </p>
          )}
          <div className="flex items-center space-x-3 mb-2">
            <button 
              onClick={handlePlayClick}
              className="p-2 bg-[#f3d100] dark:bg-moviebuster-red rounded-full hover:bg-white/90 hover:text-[#000e3d] dark:hover:text-moviebuster-red transition"
            >
              <Play className="w-4 h-4 text-[#000e3d] dark:text-white" />
            </button>
            <button 
              onClick={handleAddToList}
              className={`p-2 rounded-full transition ${
                isAuthenticated && isInWatchlist 
                  ? 'bg-[#f3d100] dark:bg-moviebuster-red text-[#000e3d] dark:text-white' 
                  : 'bg-black/40 hover:bg-[#f3d100]/60 dark:hover:bg-moviebuster-red/60'
              }`}
            >
              <Plus className="w-4 h-4 text-white hover:text-[#000e3d] dark:text-white" />
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
                  : 'text-white hover:text-[#000e3d] dark:text-white'
              }`} />
            </button>
          </div>
          {movie.vote_average && (
            <div className="text-sm">
              <span className="text-[#f3d100] dark:text-moviebuster-red font-bold">
                {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-white/90">/10</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
