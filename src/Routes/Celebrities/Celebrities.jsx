import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Celebrities.css";

import { getPopularCelebrities } from "../../services/tmdb";

export default function Celebrities_Route() {
  const [celebrities, setCelebrities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCelebrities = async () => {
      try {
        let allCelebrities = [];

        // Traer primeras 5 páginas
        await Promise.all(
          Array.from({ length: 5 }, (_, i) => i + 1).map(async (page) => {
            const data = await getPopularCelebrities(page);
            allCelebrities = [...allCelebrities, ...data.results];
          })
        );

        setCelebrities(allCelebrities);
      } catch (error) {
        console.error("Error fetching celebrities:", error);
      }
    };

    fetchCelebrities();
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
        {celebrities.map((celebrity) => (
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
              <div className="no-photo">Sin foto</div>
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