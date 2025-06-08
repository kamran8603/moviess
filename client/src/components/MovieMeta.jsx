import React from 'react';

const MovieMeta = ({ movie }) => {
  return (
    <div className="bg-moviebuster-darkblue/20 rounded-lg p-6">
      <MetaSection title="Genres">
        {movie?.genres?.map(genre => (
          <span key={genre.id} className="px-2 py-1 bg-moviebuster-red/10 rounded text-sm mr-2 mb-2 inline-block">
            {genre.name}
          </span>
        ))}
      </MetaSection>

      <MetaSection title="Production Companies">
        {movie?.production_companies?.map(company => (
          <div key={company.id} className="text-sm mb-1">
            {company.name}
          </div>
        ))}
      </MetaSection>
    </div>
  );
};

const MetaSection = ({ title, children }) => (
  <div className="mb-6 last:mb-0">
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    <div className="text-foreground/80">{children}</div>
  </div>
);

export default MovieMeta;