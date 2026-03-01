import { useEffect, useState } from "react";
import Cards from "../../components/Cards/Cards";
import { getTopRatedMovies } from "../../services/tmdb";

export default function TopRated_Route() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const data = await getTopRatedMovies(1);
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error al traer top-rated:", error);
      }
    };

    fetchTopRated();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("favoritesData");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  if (!movies.length) {
    return <p>No hay películas para mostrar.</p>;
  }

  return <Cards movies={movies} favorites={favorites} />;
}