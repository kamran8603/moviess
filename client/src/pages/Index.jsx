import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ContentRow from '../components/ContentRow';
import Footer from '../components/Footer';
import { fetchTrending, fetchTopRated, fetchPopularTVShows } from '../api/tmdb';

const Index = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const trendingRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadMovieData = async () => {
      setIsLoading(true);
      try {
        // Fetch all movie data in parallel
        const [trending, topRated, tvShows] = await Promise.all([
          fetchTrending(),
          fetchTopRated(),
          fetchPopularTVShows(),
        ]);
        
        // Access the results array from each response
        setTrendingMovies(trending.results || []);
        setTopRatedMovies(topRated.results || []);
        setPopularTVShows(tvShows.results || []);
        
        // Set featured movies from trending results
        if (trending?.results?.length > 0) {
          setFeaturedMovies(trending.results.slice(0, 5));
        }
      } catch (error) {
        console.error('Error loading movie data:', error);
        // Set empty arrays on error
        setTrendingMovies([]);
        setTopRatedMovies([]);
        setPopularTVShows([]);
        setFeaturedMovies([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMovieData();
  }, []);
  
  useEffect(() => {
    // Check if we should scroll to trending section after navigation
    if (location.state?.scrollToTrending) {
      scrollToTrending();
      // Clean up the state
      navigate('/', { state: null, replace: true });
    }
  }, [location]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  const scrollToTrending = () => {
    trendingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearchResults={handleSearchResults} onNewClick={scrollToTrending} />
      
      <main className="pt-16"> {/* Add padding-top to create space below navbar */}
        <HeroSection movies={featuredMovies} />  
        <div className="container mx-auto py-6">
          <div ref={trendingRef}>
            <ContentRow title="Trending Now" movies={trendingMovies} />
          </div>
          <ContentRow title="Top Rated" movies={topRatedMovies} />
          <ContentRow title="Popular TV Shows" movies={popularTVShows} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
