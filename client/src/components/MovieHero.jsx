import React from 'react';
import { Play, Star } from 'lucide-react';
import { getImageUrl } from '../api/tmdb';

const MovieHero = ({ movie }) => {
  const getGenres = () => {
    return movie?.genres?.map(genre => genre.name).join(' • ');
  };

  const formatCurrency = (value) => {
    return `$${(value / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="relative h-[70vh] md:h-[90vh]"> {/* Increased height here */}
      {/* Backdrop Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getImageUrl(movie?.backdrop_path, 'original')})`,
        }}
      />

      {/* Frosted Glass Effect Layer */}
      <div className="absolute inset-0 backdrop-blur-xl backdrop-brightness-30 bg-black/10" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-moviebuster-darkblue/90 via-moviebuster-darkblue/70 to-transparent" />

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="flex gap-8">
          {/* Poster - increased height */}
          <div className="hidden md:block w-[240px] h-[360px] rounded-lg overflow-hidden backdrop-blur-md bg-white/10">
            <img 
              src={getImageUrl(movie?.poster_path)} 
              alt={movie?.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Movie Info - adjusted spacing */}
          <div className="flex-grow">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">{movie?.title}</h1>
            <div className="flex items-center gap-4 text-sm mb-6 text-white/90">
              <span>Year: <span>{movie?.release_date?.split('-')[0]}</span></span>
              <span>Duration: <span>{movie?.runtime} min</span></span>
              <span>Rating: 
                <span className="bg-[#f3d100]/80 dark:bg-moviebuster-red/80 backdrop-blur-sm px-2 py-0.5 rounded inline-flex items-center gap-1 ml-1 text-[#000e3d] dark:text-white">
                  <Star className="w-4 h-4 fill-current" />
                  {movie?.vote_average?.toFixed(1)}
                </span>
              </span>
            </div>
            <button className="px-6 py-3 bg-[#f3d100]/80 dark:bg-moviebuster-red/80 backdrop-blur-sm text-[#000e3d] dark:text-white rounded-md flex items-center gap-2 hover:bg-[#000e3d]/90 hover:text-[#f3d100] dark:hover:text-moviebuster-red transition duration-300 mb-8">
              <Play className="w-5 h-5" />
              Watch Now
            </button>
            <div className="flex gap-8">
              <div className="space-y-6 text-white/80 flex-grow"> {/* Increased spacing */}
                <p className="text-base md:text-lg leading-relaxed max-w-3xl">
                  {movie?.overview}
                </p>
                {movie?.tagline && (
                  <p className="text-base italic">"{movie.tagline}"</p>
                )}
                {movie?.production_companies?.[0] && (
                  <p className="text-base">
                    <span className="text-[#f3d100] dark:text-moviebuster-yellow">{movie.production_companies[0].name}</span>
                  </p>
                )}
                {movie?.genres && movie.genres.length > 0 && (
                  <p className="text-base">
                    Genres: <span className="text-[#f3d100] dark:text-moviebuster-yellow">{getGenres()}</span>
                  </p>
                )}
              </div>

              {/* Stats Section - increased height */}
              <div className="hidden lg:grid grid-cols-2 gap-6 w-[300px] backdrop-blur-md bg-white/5 p-6 rounded-lg self-start">
                <StatItem label="Status" value={movie?.status || 'N/A'} />
                <StatItem label="Release Date" value={movie?.release_date || 'N/A'} />
                <StatItem label="Runtime" value={`${movie?.runtime || 0} min`} />
                <StatItem label="Original Language" value={movie?.original_language?.toUpperCase() || 'N/A'} />
                <StatItem label="Budget" value={formatCurrency(movie?.budget || 0)} />
                <StatItem label="Revenue" value={formatCurrency(movie?.revenue || 0)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs text-white/60">{label}</p>
    <p className="text-sm font-medium text-white">{value}</p>
  </div>
);

export default MovieHero;