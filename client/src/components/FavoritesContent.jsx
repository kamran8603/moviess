import React, { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../api/tmdb';
import { Heart } from 'lucide-react';
import MovieGrid from './MovieGrid';

const FavoritesContent = () => {
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return;

            try {
                // Fetch user's favorites from the database
                const response = await fetch(`http://localhost:5100/api/users/${user.id}/favorites`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch favorites');
                }

                const data = await response.json();
                
                // Fetch detailed movie information for each favorite movie ID
                const moviesData = await Promise.all(
                    data.favorites.map(async (movieId) => {
                        try {
                            return await fetchMovieDetails(movieId);
                        } catch (error) {
                            console.error(`Error fetching movie ${movieId}:`, error);
                            return null;
                        }
                    })
                );

                // Filter out any null values from failed fetches
                const validMovies = moviesData.filter(movie => movie !== null);
                setFavorites(validMovies);
            } catch (error) {
                console.error('Error loading favorites:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadFavorites();
    }, []);

    const handleRemoveFromFavorites = async (movieId) => {
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
                    movieId: movieId
                })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data.user));
                setFavorites(favorites.filter(movie => movie.id !== movieId));
            }
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f3d100] dark:border-moviebuster-red mx-auto"></div>
                <p className="mt-4">Loading your favorite movies...</p>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="py-12 text-center">
                <Heart className="mx-auto h-16 w-16 text-[#f3d100]/40 dark:text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground">Movies you mark as favorites will appear here</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">My Favorites</h2>
            <MovieGrid 
                items={favorites} 
                onRemove={handleRemoveFromFavorites}
                showRemoveButton={true}
            />
        </div>
    );
};

export default FavoritesContent;