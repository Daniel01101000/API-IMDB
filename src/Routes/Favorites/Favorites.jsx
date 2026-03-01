import { useEffect, useState } from "react";
import "../../components/Cards/Cards.css"; // Reutiliza el CSS de las cards

export default function Favorites_Route() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("favoritesData");
    if (saved) {
      setFavoriteMovies(JSON.parse(saved));
    }
  }, []);

  return (
    <div>
      {favoriteMovies.length === 0 ? (
        <p>Your favorite movies will appear here.</p>
      ) : (
        <div className="movies-grid">
          {favoriteMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
              ) : (
                <div className="no-image">
                  <i className="bi bi-file-image" style={{ fontSize: "3rem" }}></i>
                </div>
              )}

              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <span className="movie-rating">
                  ⭐ {movie.vote_average.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
