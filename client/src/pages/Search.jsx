import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { searchMovies } from '../api/tmdb';
import MovieGrid from '../components/MovieGrid';

const Search = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('q') || '';

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const performSearch = async () => {
            if (!query) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const data = await searchMovies(query);
                // Check for results array in the response
                if (data?.results) {
                    setResults(data.results);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error('Error searching:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        performSearch();
    }, [query]);

    return (
        <div className="min-h-screen bg-background">
            <Navbar onSearchResults={() => {}} /> {/* Add empty handler to prevent errors */}
            
            <main className="container mx-auto pt-24 pb-12 px-4">
                <h1 className="text-3xl font-bold mb-2">Search Results</h1>
                {query && (
                    <p className="text-muted-foreground mb-8">
                        Showing results for "{query}"
                    </p>
                )}

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <p>Searching...</p>
                    </div>
                ) : results.length > 0 ? (
                    <MovieGrid items={results} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-64">
                        <p className="text-xl mb-4">No results found</p>
                        {query && (
                            <p className="text-muted-foreground">
                                Try different keywords
                            </p>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Search;
