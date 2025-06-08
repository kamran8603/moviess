import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../api/tmdb';

const UserBanner = () => {
    const [bannerImage, setBannerImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const username = userData.username || 'User';

    const fetchRandomBanner = async () => {
        try {
            setIsLoading(true);
            // Get a random movie from the trending list
            const response = await fetch('https://api.themoviedb.org/3/trending/movie/week?api_key=3e52e2f5350ae6996c3c73b2e51a0d99');
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                // Get a random movie from the results
                const randomIndex = Math.floor(Math.random() * data.results.length);
                const movie = data.results[randomIndex];
                
                // Use backdrop image as banner
                if (movie.backdrop_path) {
                    const newBannerImage = getImageUrl(movie.backdrop_path, 'original');
                    setBannerImage(newBannerImage);
                }
            }
        } catch (error) {
            console.error("Error fetching banner image:", error);
            // Use fallback image if fetch fails
            setBannerImage('https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomBanner();
    }, []);

    return (
        <div className="relative w-full h-64 md:h-80">
            {/* Banner Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
                style={{ backgroundImage: `url(${bannerImage || 'https://image.tmdb.org/t/p/original/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg'})` }}
            >
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Profile Image */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full 
                    bg-[#f3d100] dark:bg-moviebuster-red 
                    flex items-center justify-center 
                    border-4 border-background dark:border-white"
                >
                    <span className="text-4xl md:text-5xl font-bold text-[#000e3d] dark:text-white">
                        {username.charAt(0).toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Change Banner Button */}
            <button
                onClick={() => fetchRandomBanner()}
                disabled={isLoading}
                className={`absolute bottom-4 right-4 px-3 py-1 rounded-md text-sm font-medium 
                    ${isLoading 
                        ? 'bg-background/50 cursor-not-allowed' 
                        : 'bg-background/80 hover:bg-background transition-colors'
                    }`}
            >
                {isLoading ? 'Loading...' : 'Change Banner'}
            </button>
        </div>
    );
};

export default UserBanner;