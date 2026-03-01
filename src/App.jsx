import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header/Header.jsx";
import Cards from "./components/Cards/Cards.jsx";
import Celebrities from "./components/Celebrities/Celebrities-Image/Celebrities.jsx";
import CelebrityDetail from "./components/Celebrities/CelebrityDetail/CelebrityDetail.jsx";

import Celebrities_Route from "./Routes/Celebrities/Celebrities.jsx";
import TopRated_Route from "./Routes/Top-Rated/Top-Rated.jsx";
import Favorites_Route from "./Routes/Favorites/Favorites.jsx";

import { getPopularMovies, getMovieVideos } from "./services/tmdb";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [trailers, setTrailers] = useState({});

  /* ===========================
     TRAILERS
  =========================== */

  const fetchTrailers = async (movieId, movieTitle) => {
    try {
      const data = await getMovieVideos(movieId);

      const youtubeTrailers = data.results.filter(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      if (youtubeTrailers[0]) return [youtubeTrailers[0]];

      // fallback a búsqueda en YouTube
      return [
        {
          id: "youtube-search",
          key: `https://www.youtube.com/results?search_query=${encodeURIComponent(
            movieTitle + " trailer"
          )}`,
          site: "YouTube",
          type: "Trailer",
        },
      ];
    } catch (error) {
      console.error(error);

      return [
        {
          id: "youtube-search",
          key: `https://www.youtube.com/results?search_query=${encodeURIComponent(
            movieTitle + " trailer"
          )}`,
          site: "YouTube",
          type: "Trailer",
        },
      ];
    }
  };

  /* ===========================
     FEATURED MOVIES
  =========================== */

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await getPopularMovies(1);
        setFeatured(data.results);

        const trailersObj = {};

        await Promise.all(
          data.results.map(async (movie) => {
            const movieTrailers = await fetchTrailers(
              movie.id,
              movie.title
            );

            if (movieTrailers.length > 0) {
              trailersObj[movie.id] = movieTrailers;
            }
          })
        );

        setTrailers(trailersObj);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFeatured();
  }, []);

  const moviesToShow = movies.length > 0 ? movies : featured;

  return (
    <Router>
      <div className="app-container">
        <Header
          setMovies={setMovies}
          setTrailers={setTrailers}
          fetchTrailers={fetchTrailers}
        />

        <Routes>
          {/* Home */}
          <Route
            path="/API-IMDB/"
            element={
              <>
                <Celebrities />
                <h2 className="section-title">
                  {movies.length > 0
                    ? "Search results"
                    : "Featured today"}
                </h2>
                <Cards movies={moviesToShow} trailers={trailers} />
              </>
            }
          />

          <Route path="/celebrities" element={<Celebrities_Route />} />
          <Route path="/top-rated" element={<TopRated_Route />} />
          <Route path="/favorites" element={<Favorites_Route />} />
          <Route path="/celebrity/:id" element={<CelebrityDetail />} />
        </Routes>
      </div>
    </Router>
  );
}