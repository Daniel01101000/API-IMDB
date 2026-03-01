import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CelebrityDetail.css";
import Cards from "../../Cards/Cards.jsx";

import {
  getCelebrityDetails,
  getCelebrityMovies,
  getMovieVideos,
} from "../../../services/tmdb";

export default function CelebrityDetail() {
  const { id } = useParams();
  const [celebrity, setCelebrity] = useState(null);
  const [movies, setMovies] = useState([]);
  const [trailers, setTrailers] = useState({});
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchCelebrityData = async () => {
      try {
        // 1️⃣ Detalles de la celebridad
        const data = await getCelebrityDetails(id);
        setCelebrity(data);

        // 2️⃣ Películas
        const moviesData = await getCelebrityMovies(id);
        setMovies(moviesData.cast || []);

        // 3️⃣ Trailers (solo primeras 10 para no saturar)
        const trailersObj = {};

        await Promise.all(
          (moviesData.cast || []).slice(0, 10).map(async (movie) => {
            const videos = await getMovieVideos(movie.id);
            const youtubeTrailers = videos.results?.filter(
              (v) => v.site === "YouTube" && v.type === "Trailer"
            );
            if (youtubeTrailers?.length > 0) {
              trailersObj[movie.id] = youtubeTrailers;
            }
          })
        );

        setTrailers(trailersObj);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCelebrityData();
  }, [id]);

  if (!celebrity) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  // Calcular años
  let years = "";
  if (celebrity.birthday) {
    const birthYear = celebrity.birthday.split("-")[0];
    if (celebrity.deathday) {
      const deathYear = celebrity.deathday.split("-")[0];
      years = `${birthYear}–${deathYear}`;
    } else {
      years = `${birthYear}–${currentYear}`;
    }
  }

  return (
    <div className="celebrity-detail">
      <h1 className="celebrity-title">
        {celebrity.name}
        {years && <span className="celebrity-years"> ({years})</span>}
      </h1>

      <div className="celebrity-header">
        {celebrity.profile_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${celebrity.profile_path}`}
            alt={celebrity.name}
            className="celebrity-main-photo"
          />
        ) : (
          <div className="celebrity-no-photo">Without photo</div>
        )}

        <div className="celebrity-info">
          <p>
            <span className="info-label">Known for:</span>{" "}
            {celebrity.known_for_department}
          </p>

          <p>
            <span className="info-label">Popularity:</span>{" "}
            {celebrity.popularity?.toFixed(1)}
          </p>

          <p>
            <span className="info-label">Place of birth:</span>{" "}
            {celebrity.place_of_birth || "No disponible"}
          </p>

          <p>
            <span className="info-label">Birthdate:</span>{" "}
            {celebrity.birthday || "No disponible"}
          </p>

          {celebrity.deathday && (
            <p>
              <span className="info-label">Death:</span>{" "}
              {celebrity.deathday}
            </p>
          )}
        </div>
      </div>

      <h2 className="h2-known">Known for:</h2>

      <Cards movies={movies} trailers={trailers} />
    </div>
  );
}