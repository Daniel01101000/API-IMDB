import { useState, useEffect } from "react";
import "./Cards.css";

export default function Cards({ movies, trailers }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("favoritesData");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const index = prev.findIndex((m) => m.id === movie.id);
      let newFavorites;

      if (index !== -1) {
        newFavorites = prev.filter((m) => m.id !== movie.id);
      } else {
        newFavorites = [...prev, movie];
      }

      localStorage.setItem("favoritesData", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  if (!Array.isArray(movies) || movies.length === 0) {
    return <p>No hay películas para mostrar.</p>;
  }

  return (
    <div className="movies-grid">
      {movies.map((movie) => {
        const isFavorite = favorites.some((m) => m.id === movie.id);

        return (
          <div key={movie.id} className="movie-card">
            <div
              className={`movie-ribbon ${isFavorite ? "active" : ""}`}
              onClick={() => toggleFavorite(movie)}
              style={{ cursor: "pointer" }}
            >
              {isFavorite ? (
                <i className="bi bi-star-fill"></i>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 13h-5v5c0 .55-.45 1-1 1s-1-.45-1-1v-5H6c-.55 0-1-.45-1-1s.45-1 1-1h5V6c0-.55.45-1 1-1s1 .45 1 1v5h5c.55 0 1 .45 1 1s-.45 1-1 1z"></path>
                </svg>
              )}
            </div>

            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
              />
            ) : (
              <div className="no-image">
                <i className="bi bi-file-image"></i>
              </div>
            )}

            <div className="movie-info">
              <h3 className="movie-title">{movie.title}</h3>
              <span className="movie-rating">
                ⭐ {(movie.vote_average || movie.rating || 0).toFixed(1)}
              </span>
            </div>

            {trailers &&
              trailers[movie.id] &&
              trailers[movie.id].slice(0, 1).map((video) => (
                <div key={video.id} className="trailer-button">
                  <a
                    href={
                      video.id === "youtube-search"
                        ? video.key
                        : `https://www.youtube.com/watch?v=${video.key}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="bi bi-caret-right-fill"></i> Trailer
                  </a>
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
}