import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchMovies, getMovieVideos } from "../../services/tmdb";
import "./SearchBar.css";

export default function SearchBar({ setMovies, setTrailers }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🔥 Este effect es el ÚNICO que hace la búsqueda
  useEffect(() => {
    const urlQuery = searchParams.get("q");

    if (!urlQuery) {
      setMovies([]);
      setTrailers({});
      return;
    }

    const fetchData = async () => {
      try {
        const data = await searchMovies(urlQuery);
        setMovies(data.results);

        const trailersObj = {};

        await Promise.all(
          data.results.map(async (movie) => {
            const videos = await getMovieVideos(movie.id);
            trailersObj[movie.id] = videos.results || [];
          })
        );

        setTrailers(trailersObj);
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    fetchData();

  }, [searchParams, setMovies, setTrailers]);

  // 🔥 Esto SOLO cambia la URL
  const handleSearch = () => {
    if (!query.trim()) return;

    navigate(`/API-IMDB/?q=${encodeURIComponent(query)}`);
    setQuery(""); // opcional si quieres limpiar input
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
    </div>
  );
}