import React, { useState } from "react";
import "./TrendingGames.scss";
import { FaUserAlt, FaAngleDoubleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getTrendingGames } from "../../data/gamesCatalog.js";

const TrendingGames = ({ onGameClick }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const trendingGames = getTrendingGames();

  const handleCardClick = (title) => {
    if (onGameClick) {
      onGameClick(title);
    }
  };

  return (
    <section className="trending-games">
      <div className="section-header">
        <div className="section-title">
          <h3>TRENDING GAMES</h3>
          <span className="title-dash"></span>
        </div>

        <button className="view-all" onClick={() => navigate("/games")}>
          <span>VIEW ALL</span>
          <FaAngleDoubleRight className="icon" />
        </button>
      </div>

      <div className="games-carousel-container">
        <div className="games-grid">
          {trendingGames.map((game, index) => (
            <div
              className="game-card"
              key={game.id || index}
              onClick={() => handleCardClick(game.title)}
            >
              <div className="card-image-wrapper">
                <img
                  src={game.image}
                  alt={game.title}
                  style={{ objectPosition: game.imagePosition || "center" }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/hero-bg.png";
                  }}
                />
                <div className="image-overlay"></div>
              </div>

              <div className="game-info">
                <h4 className="game-card-title">{game.title}</h4>
                <div className="info-bottom-row">
                  <span className={`badge ${game.category.toLowerCase()}`}>
                    {game.category}
                  </span>

                  <div className="players">
                    <FaUserAlt className="user-icon" />
                    <span>{game.players}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="carousel-dots">
          {trendingGames.slice(0, 6).map((_, idx) => (
            <span
              key={idx}
              className={`dot ${idx === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(idx)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingGames;