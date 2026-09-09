import React, { useState, useMemo } from "react";
import "./GameHero.scss";
import {
  FaSearch,
  FaSlidersH,
  FaStar,
  FaUserAlt,
  FaHeart,
  FaRegHeart,
  FaBolt,
  FaChevronRight,
  FaGamepad,
  FaBoxOpen,
  FaFire,
  FaRocket,
} from "react-icons/fa";
import { GiCrossedSwords } from "react-icons/gi";
import { GAMES_CATALOG } from "../../data/gamesCatalog.js";
import { useAuth } from "../../context/AuthContext.jsx";

const filterCategories = [
  "ALL",
  "ACTION",
  "PUZZLE",
  "RACING",
  "SPORTS",
  "ARCADE",
  "STRATEGY",
  "ADVENTURE",
];

const GameHero = ({ onGameClick, onBuyAttemptsClick }) => {
  const { isSubscribed } = useAuth();
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [favorites, setFavorites] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCardClick = (title) => {
    if (onGameClick) {
      onGameClick(title);
    }
  };

  // Filtered games based on search and category
  const filteredCatalog = useMemo(() => {
    return GAMES_CATALOG.filter((game) => {
      const matchesCategory =
        activeCategory === "ALL" ||
        game.category.toUpperCase() === activeCategory.toUpperCase();
      const matchesSearch =
        !searchQuery.trim() ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Section slices from catalog
  const trendingGames = useMemo(
    () => GAMES_CATALOG.filter((g) => g.isTrending),
    []
  );
  const newReleases = useMemo(
    () => GAMES_CATALOG.filter((g) => g.isNew),
    []
  );
  const actionGames = useMemo(
    () => GAMES_CATALOG.filter((g) => g.category === "ACTION" || g.category === "RACING"),
    []
  );

  const renderGameCard = (game) => (
    <div
      className="games-card"
      key={game.id}
      onClick={() => handleCardClick(game.title)}
    >
      <div className="card-thumb">
        <img
          src={game.image}
          alt={game.title}
          style={{
            objectPosition: game.imagePosition || "center",
          }}
          onError={(e) => {
            e.target.src = "/games/batch-bubble-candy-crazycar-crazymatch-firetruck-frog.jpg";
          }}
        />
        <div className="overlay-gradient"></div>
        <button
          className="fav-btn"
          onClick={(e) => toggleFavorite(e, game.id)}
          aria-label="Favorite game"
        >
          {favorites[game.id] ? (
            <FaHeart className="heart active" />
          ) : (
            <FaRegHeart className="heart" />
          )}
        </button>
      </div>

      <div className="card-details">
        <h4 className="game-title">{game.title}</h4>
        <span className={`cat-tag ${game.category.toLowerCase()}`}>
          {game.category}
        </span>

        <div className="meta-row">
          <div className="meta-item">
            <FaStar className="star-icon" />
            <span>{game.rating || "4.8"}</span>
          </div>
          <div className="meta-item">
            <FaUserAlt className="user-icon" />
            <span>{game.players}</span>
          </div>
        </div>

        <div className="attempts-row">
          <FaBolt className="bolt-icon" />
          <span>1 TURN / PLAY</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="games-page-container">
      {/* GAMES HERO BANNER */}
      <div className="g-hero-banner">
        <div className="hero-bg-overlay">
          <img src="/games-bg.png" alt="Games Background" />
        </div>

        <div className="hero-content-wrapper">
          <div className="hero-text-side">
            <h1 className="games-title">THEGameio</h1>
            <h3 className="games-subtitle">25 Instant Browser Mini Games</h3>
          </div>

          <div className="attempts-card">
            <span className="attempts-label">Subscription Status</span>
            <div className="attempts-count">
              <FaBolt className="lightning-icon" />
              {isSubscribed ? (
                <span className="current" style={{ fontSize: "20px", color: "#34d399" }}>UNLIMITED</span>
              ) : (
                <span className="current" style={{ fontSize: "18px", color: "#94a3b8" }}>SUBSCRIBE</span>
              )}
            </div>
            <button className="buy-attempts-btn" onClick={onBuyAttemptsClick}>
              <span>SUBSCRIBE</span>
              <FaChevronRight className="arrow" />
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="search-filter-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search all 25 games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSlidersH className="filter-icon" />
        </div>

        <div className="category-pills">
          {filterCategories.map((cat) => (
            <button
              key={cat}
              className={`pill ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* If searching or specific category selected -> Show Unified Grid */}
      {(searchQuery.trim() !== "" || activeCategory !== "ALL") ? (
        <div className="games-sections">
          <section className="game-row-section">
            <div className="section-header">
              <div className="header-title">
                <FaGamepad className="fire-icon" />
                <h3>
                  {activeCategory !== "ALL" ? `${activeCategory} GAMES` : "SEARCH RESULTS"} ({filteredCatalog.length})
                </h3>
              </div>
            </div>
            {filteredCatalog.length > 0 ? (
              <div className="games-scroll-grid" style={{ flexWrap: "wrap" }}>
                {filteredCatalog.map(renderGameCard)}
              </div>
            ) : (
              <p style={{ color: "#94a3b8", padding: "20px", textAlign: "center" }}>
                No games found matching "{searchQuery}".
              </p>
            )}
          </section>
        </div>
      ) : (
        /* Standard Categorized Showcase */
        <div className="games-sections">
          {/* TRENDING GAMES SECTION */}
          <section className="game-row-section">
            <div className="section-header">
              <div className="header-title">
                <FaFire className="fire-icon" />
                <h3>TRENDING GAMES</h3>
              </div>
              <button className="view-all-link" onClick={() => setActiveCategory("ALL")}>
                <span>VIEW ALL</span>
                <FaChevronRight />
              </button>
            </div>
            <div className="games-scroll-grid">
              {trendingGames.map(renderGameCard)}
            </div>
          </section>

          {/* NEW RELEASES SECTION */}
          <section className="game-row-section">
            <div className="section-header">
              <div className="header-title">
                <FaRocket className="star-header-icon" />
                <h3>NEW RELEASES</h3>
              </div>
              <button className="view-all-link" onClick={() => setActiveCategory("ALL")}>
                <span>VIEW ALL</span>
                <FaChevronRight />
              </button>
            </div>
            <div className="games-scroll-grid">
              {newReleases.map(renderGameCard)}
            </div>
          </section>

          {/* ACTION & RACING SECTION */}
          <section className="game-row-section">
            <div className="section-header">
              <div className="header-title">
                <GiCrossedSwords className="swords-icon" />
                <h3>ACTION & RACING</h3>
              </div>
              <button className="view-all-link" onClick={() => setActiveCategory("ACTION")}>
                <span>VIEW ALL</span>
                <FaChevronRight />
              </button>
            </div>
            <div className="games-scroll-grid">
              {actionGames.map(renderGameCard)}
            </div>
          </section>

          {/* ALL GAMES GRID */}
          <section className="game-row-section">
            <div className="section-header">
              <div className="header-title">
                <FaGamepad className="fire-icon" />
                <h3>ALL 25 GAMES</h3>
              </div>
            </div>
            <div className="games-scroll-grid" style={{ flexWrap: "wrap" }}>
              {GAMES_CATALOG.map(renderGameCard)}
            </div>
          </section>
        </div>
      )}

      {/* INFO FOOTER CARDS */}
      <div className="attempts-info-cards">
        <div className="info-card" onClick={onBuyAttemptsClick}>
          <div className="icon-box">
            <FaGamepad />
          </div>
          <div className="info-text">
            <h4>HOW SUBSCRIPTION WORKS</h4>
            <p>1 GHS = 1 Whole Day Unlimited Play. 5 GHS = 1 Full Week Unlimited Access.</p>
          </div>
          <FaChevronRight className="arrow-right" />
        </div>

        <div className="info-card" onClick={onBuyAttemptsClick}>
          <div className="icon-box hex-box">
            <FaBoxOpen />
          </div>
          <div className="info-text">
            <h4>NEED UNLIMITED ACCESS?</h4>
            <p>Get THEGameio Daily (1 GHS) or Weekly (5 GHS) with instant DB sync and secure checkout.</p>
          </div>
          <FaChevronRight className="arrow-right" />
        </div>
      </div>
    </div>
  );
};

export default GameHero;
