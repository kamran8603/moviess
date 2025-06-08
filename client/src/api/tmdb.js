const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Add fetch configuration
const fetchOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), fetchOptions.timeout);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out');
    } else {
      console.error(`API call failed: ${error.message}`);
    }
    return { results: [] };
  }
};

const fetchTrending = () => 
  apiCall(`/trending/all/day?api_key=${API_KEY}`);

const fetchTopRated = () => 
  apiCall(`/movie/top_rated?api_key=${API_KEY}`);

const fetchPopularTVShows = () => 
  apiCall(`/tv/popular?api_key=${API_KEY}`);

export const searchMovies = async (query) => {
    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data; // Returns { results: [...], page: 1, total_pages: X, total_results: Y }
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
};

const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

const fetchMovieDetails = async (movieId) => {
  try {
    const data = await apiCall(`/movie/${movieId}?api_key=${API_KEY}`);
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

const fetchRecommendedMovies = async (movieId) => {
  try {
    const data = await apiCall(
      `/movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
    );
    return data;
  } catch (error) {
    console.error('Error fetching recommended movies:', error);
    return { results: [] };
  }
};

const fetchTopRatedMovies = async () => {
  try {
    const data = await apiCall(
      `/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
    );
    return data;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return { results: [] };
  }
};

const fetchAllMovies = async (page = 1) => {
  try {
    const data = await apiCall(
      `/discover/movie?api_key=${API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`
    );
    return data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return { results: [], total_pages: 0 };
  }
};

const fetchAllTVShows = async (page = 1) => {
  try {
    const data = await apiCall(
      `/discover/tv?api_key=${API_KEY}&language=en-US&page=${page}&sort_by=popularity.desc`
    );
    return data;
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return { results: [], total_pages: 0 };
  }
};

// Single export statement for all functions
export {
  fetchTrending,
  fetchTopRated,
  fetchPopularTVShows,
  getImageUrl,
  fetchMovieDetails,
  fetchRecommendedMovies,
  fetchTopRatedMovies,
  fetchAllMovies,
  fetchAllTVShows
};
