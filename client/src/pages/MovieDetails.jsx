import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MovieHero from '../components/MovieHero';
import MovieInfo from '../components/MovieInfo';
import MovieMeta from '../components/MovieMeta';
import ShareButtons from '../components/ShareButtons';
import NotFound from './NotFound';
import { 
  getImageUrl, 
  fetchMovieDetails, 
  fetchRecommendedMovies, 
  fetchTopRatedMovies 
} from '../api/tmdb';

const MovieDetails = () => {
  const { movieSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const movieId = location.state?.movieId;
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [isFavorite, setIsFavorite] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.favorites?.includes(movieId) || false;
  });

  const [isInWatchlist, setIsInWatchlist] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.watchlist?.includes(movieId) || false;
  });

  useEffect(() => {
    const loadMovieData = async () => {
      if (!movieId) {
        setLoading(false);
        setError(true);
        return;
      }

      try {
        const [movieData, recommended, topRated] = await Promise.all([
          fetchMovieDetails(movieId),
          fetchRecommendedMovies(movieId),
          fetchTopRatedMovies()
        ]);
        
        if (!movieData) {
          setError(true);
          return;
        }

        setMovie(movieData);
        setRecommendedMovies(recommended.results || []);
        setTopRatedMovies(topRated.results || []);
      } catch (error) {
        console.error('Error loading movie data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadMovieData();
  }, [movieId]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const handleFavorite = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
      navigate('/not-logged-in');
      return;
    }

    try {
      const response = await fetch('https://moviebuster-1r3g.onrender.com/api/users/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id,
          movieId: Number(movieId)
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsFavorite(!isFavorite);
      } else {
        throw new Error('Failed to update favorites');
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
      alert('Failed to update favorites');
    }
  };

  const handleWatchlist = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
      navigate('/not-logged-in');
      return;
    }

    try {
      const response = await fetch('https://moviebuster-1r3g.onrender.com/api/users/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user.id,
          movieId: Number(movieId)
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(data.user));
        setIsInWatchlist(!isInWatchlist);
      } else {
        throw new Error('Failed to update watchlist');
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
      alert('Failed to update watchlist');
    }
  };

  if (error) return <NotFound />;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-moviebuster-dark">
      <div className="text-moviebuster-yellow text-xl">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar onSearchResults={handleSearchResults} />
      
      <main className="flex-grow mt-16">
        <MovieHero movie={movie} />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={handleFavorite}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all transform hover:scale-105
                ${isFavorite 
                  ? 'bg-[#f3d100] dark:bg-moviebuster-red text-[#000e3d] dark:text-white shadow-lg hover:shadow-xl' 
                  : 'bg-white/10 hover:bg-[#f3d100] dark:hover:bg-moviebuster-red text-white hover:text-[#000e3d] dark:hover:text-white hover:shadow-lg'
                }`}
            >
              <Heart className={`h-5 w-5 transition-transform hover:scale-110 ${isFavorite ? 'fill-[#000e3d] dark:fill-white' : ''}`} />
              {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
            </button>

            <button
              onClick={handleWatchlist}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all transform hover:scale-105
                ${isInWatchlist 
                  ? 'bg-[#f3d100] dark:bg-moviebuster-red text-[#000e3d] dark:text-white shadow-lg hover:shadow-xl' 
                  : 'bg-white/10 hover:bg-[#f3d100] dark:hover:bg-moviebuster-red text-white hover:text-[#000e3d] dark:hover:text-white hover:shadow-lg'
                }`}
            >
              <Plus className="h-5 w-5 transition-transform hover:scale-110" />
              {isInWatchlist ? 'Added to Watchlist' : 'Add to Watchlist'}
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Movie Info */}
            <div className="flex-grow">
              <MovieInfo 
                movie={movie} 
                recommendedMovies={recommendedMovies}
                topRatedMovies={topRatedMovies}
              />
              <ShareButtons />
            </div>
            
            {/* Right Column - Meta Info */}
            <div className="w-full md:w-[300px]">
              <MovieMeta movie={movie} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetails;