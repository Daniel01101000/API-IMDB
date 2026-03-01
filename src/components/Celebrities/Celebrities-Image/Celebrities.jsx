import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Celebrities.css";
import { getPopularCelebrities } from "../../../services/tmdb";

export default function Celebrities() {
  const [celebrities, setCelebrities] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        const data = await getPopularCelebrities(1);
        setCelebrities(data.results || []);
      } catch (error) {
        console.error("Error fetching celebrities:", error);
      }
    };

    fetchCelebrities();
  }, []);

  // 👇 Detecta tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 477) {
        setVisibleCount(2);
      } else {
        setVisibleCount(6);
      }
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const goToCelebrity = (celebrityId) => {
    navigate(`/celebrity/${celebrityId}`);
  };

  return (
    <div className="celebrities-section">
      <h2 className="section-title-celebrities">
        Most popular celebrities
      </h2>

      <div className="celebrities-grid">
        {celebrities.slice(0, visibleCount).map((celebrity) => (
          <div
            key={celebrity.id}
            className="celebrity-card"
            onClick={() => goToCelebrity(celebrity.id)}
          >
            {celebrity.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w200${celebrity.profile_path}`}
                alt={celebrity.name}
                className="celebrity-photo"
              />
            ) : (
              <div className="no-photo">Without photo</div>
            )}

            <h3 className="celebrity-name">
              {celebrity.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}