import "./Header.css";
import logo from "../../assets/IMDB_Logo.png";
import Menu from "../Menu/Menu.jsx";
import SearchBar from "../SearchBar/SearchBar.jsx";

export default function Header({ setMovies, setTrailers, fetchTrailers }) {
  return (
    <header className="header-container">
  <Menu />
  <img src={logo} alt="IMDb Logo" className="header-logo" />
  <h1 className="header-title">IMDb Clone</h1>
  <div className="search-wrapper">
    <SearchBar
      setMovies={setMovies}
      setTrailers={setTrailers}
      fetchTrailers={fetchTrailers}
    />
  </div>
</header>
  );
}