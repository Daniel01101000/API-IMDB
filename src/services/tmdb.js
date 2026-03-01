const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

/* ===========================
   Helper genérico profesional
=========================== */

const fetchFromTMDB = async (endpoint, params = "") => {
  const url = `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=es-ES${params}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`TMDB Error: ${res.status}`);
  }

  return res.json();
};

/* ===========================
   MOVIES
=========================== */

export const getPopularMovies = async (page = 1) => {
  return fetchFromTMDB("/movie/popular", `&page=${page}`);
};

export const getTopRatedMovies = async (page = 1) => {
  return fetchFromTMDB("/movie/top_rated", `&page=${page}`);
};

export const getMovieVideos = async (movieId) => {
  return fetchFromTMDB(`/movie/${movieId}/videos`);
};

/* ===========================
   CELEBRITIES
=========================== */

export const getPopularCelebrities = async (page = 1) => {
  return fetchFromTMDB("/person/popular", `&page=${page}`);
};

export const getCelebrityDetails = async (id) => {
  return fetchFromTMDB(`/person/${id}`);
};

export const getCelebrityMovies = async (id) => {
  return fetchFromTMDB(`/person/${id}/movie_credits`);
};

/* ===========================
   SEARCH
=========================== */

export const searchMovies = async (query, page = 1) => {
  return fetchFromTMDB(
    "/search/movie",
    `&query=${encodeURIComponent(query)}&page=${page}`
  );
};