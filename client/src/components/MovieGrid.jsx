import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ items = [], onRemove, showRemoveButton }) => {
    // If items is not an array, convert it to an array or use empty array
    const movieItems = Array.isArray(items) ? items : [];

    if (movieItems.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">No movies found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movieItems.map(item => (
                <MovieCard 
                    key={item.id} 
                    movie={item} 
                    isGridCard={true}
                    onRemove={showRemoveButton ? onRemove : undefined}
                />
            ))}
        </div>
    );
};

export default MovieGrid;
