import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchAllMovies } from '../api/tmdb';
import MovieGrid from '../components/MovieGrid';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const loadMovies = async () => {
            setIsLoading(true);
            try {
                const data = await fetchAllMovies(currentPage);
                // Sort movies by popularity if needed (they should already be sorted from the API)
                const sortedMovies = data?.results?.sort((a, b) => b.popularity - a.popularity) || [];
                setMovies(sortedMovies);
                setTotalPages(data?.total_pages || 0);
            } catch (error) {
                console.error('Error loading movies:', error);
                setMovies([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadMovies();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto pt-24 pb-12 px-4">
                <h1 className="text-3xl font-bold mb-8">Movies</h1>
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <p>Loading movies...</p>
                    </div>
                ) : (
                    <>
                        <MovieGrid items={movies} />
                        <div className="mt-8 flex justify-center items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            
                            <div className="flex gap-2">
                                {generatePageNumbers(currentPage, totalPages).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                                            ${currentPage === page 
                                                ? 'bg-moviebuster-yellow text-moviebuster-darkblue' 
                                                : 'hover:bg-white/10'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded-full hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

// Helper function to generate page numbers
const generatePageNumbers = (current, total) => {
    const pages = [];
    const maxPages = 5; // Show maximum 5 page numbers

    if (total <= maxPages) {
        // If total pages is less than max, show all pages
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        // Always show first page
        pages.push(1);

        // Calculate start and end of page numbers
        let start = Math.max(2, current - 1);
        let end = Math.min(start + 2, total - 1);

        // Adjust start if end is too close to total
        if (end === total - 1) {
            start = end - 2;
        }

        // Add ellipsis if needed
        if (start > 2) {
            pages.push('...');
        }

        // Add middle pages
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        // Add ellipsis if needed
        if (end < total - 1) {
            pages.push('...');
        }

        // Always show last page
        pages.push(total);
    }

    return pages;
};

export default Movies;
