import React, { useEffect, useState } from 'react';
import { fetchMovieDetails } from '../api/tmdb';
import { List } from 'lucide-react';
import MovieGrid from './MovieGrid';

const WatchlistContent = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadWatchlist = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return;

            try {
                // Fetch user's watchlist from the database
                const response = await fetch(`http://localhost:5100/api/users/${user.id}/watchlist`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch watchlist');
                }

                const data = await response.json();
                
                // Fetch detailed movie information for each watchlist movie ID
                const moviesData = await Promise.all(
                    data.watchlist.map(async (movieId) => {
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
                setWatchlist(validMovies);
            } catch (error) {
                console.error('Error loading watchlist:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadWatchlist();
    }, []);

    const handleRemoveFromWatchlist = async (movieId) => {
        const user = JSON.parse(localStorage.getItem('user'));
        
        try {
            const response = await fetch('https://moviebuster-1r3g.onrender.com/api/users/watchlist', {
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
                setWatchlist(watchlist.filter(movie => movie.id !== movieId));
            }
        } catch (error) {
            console.error('Error removing from watchlist:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f3d100] dark:border-moviebuster-red mx-auto"></div>
                <p className="mt-4">Loading your watchlist...</p>
            </div>
        );
    }

    if (watchlist.length === 0) {
        return (
            <div className="py-12 text-center">
                <List className="mx-auto h-16 w-16 text-[#f3d100]/40 dark:text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
                <p className="text-muted-foreground">Movies you want to watch later will appear here</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-6">My Watchlist</h2>
            <MovieGrid 
                items={watchlist} 
                onRemove={handleRemoveFromWatchlist}
                showRemoveButton={true}
            />
        </div>
    );
};

export default WatchlistContent;