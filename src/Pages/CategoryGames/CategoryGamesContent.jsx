import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./CategoryGamesContent.scss";
import {
  FaSearch,
  FaSlidersH,
  FaStar,
  FaUserAlt,
  FaHeart,
  FaRegHeart,
  FaBolt,
  FaChevronRight,
  FaFire,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { GiRevolver, GiBasketballBasket } from "react-icons/gi";
import { IoExtensionPuzzleOutline, IoGameControllerOutline } from "react-icons/io5";
import { LiaCarSideSolid } from "react-icons/lia";
import { FaRegChessKing } from "react-icons/fa6";
import { AiOutlineCompass } from "react-icons/ai";
import { GAMES_CATALOG } from "../../data/gamesCatalog.js";

const categoryMeta = {
  action: {
    title: "ACTION GAMES",
    icon: <GiRevolver />,
    desc: "Fast-paced, thrill-packed action mini games. Test your reflexes and dominate the arena!",
  },
  puzzle: {
    title: "PUZZLE GAMES",
    icon: <IoExtensionPuzzleOutline />,
    desc: "Brain-teasing puzzle games to test your strategy, logic, and problem-solving skills.",
  },
  racing: {
    title: "RACING GAMES",
    icon: <LiaCarSideSolid />,
    desc: "High-octane car rush and speed racing games. Burn rubber and cross the finish line first!",
  },
  sports: {
    title: "SPORTS GAMES",
    icon: <GiBasketballBasket />,
    desc: "Air hockey, billiards, and show off your athletic gaming prowess.",
  },
  arcade: {
    title: "ARCADE GAMES",
    icon: <IoGameControllerOutline />,
    desc: "Classic arcade nostalgia revamped with modern cyber neon visuals and instant play.",
  },
  strategy: {
    title: "STRATEGY GAMES",
    icon: <FaRegChessKing />,
    desc: "Outsmart your opponents with strategic planning, tactics, and master moves.",
  },
  adventure: {
    title: "ADVENTURE GAMES",
    icon: <AiOutlineCompass />,
    desc: "Embark on epic quests and explore thrilling gaming worlds instantly.",
  },
};

const allCategories = [
  { slug: "action", name: "ACTION" },
  { slug: "puzzle", name: "PUZZLE" },
  { slug: "racing", name: "RACING" },
  { slug: "sports", name: "SPORTS" },
  { slug: "arcade", name: "ARCADE" },
  { slug: "strategy", name: "STRATEGY" },
  { slug: "adventure", name: "ADVENTURE" },
];

const CategoryGamesContent = ({ onGameClick, onSubscribeClick, onFooterPolicyClick }) => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const currentSlug = (categorySlug || "action").toLowerCase();
  const currentCat = categoryMeta[currentSlug] || categoryMeta["action"];

  const [favorites, setFavorites] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = useMemo(() => {
    return GAMES_CATALOG.filter((g) => {
      const matchCategory = g.category.toLowerCase() === currentSlug;
      const matchSearch =
        !searchQuery.trim() ||
        g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [currentSlug, searchQuery]);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="cat-games-page-container">
      {/* HERO BANNER */}
      <div className="cat-hero-banner">
        <div className="hero-bg-overlay">
          <img src="/games-bg.png" alt="Category Background" />
        </div>

        <div className="hero-content-wrapper">
          <div className="hero-text-side">
            <div className="cat-badge-header">
              <span className="cat-icon-badge">{currentCat.icon}</span>
              <span className="cat-badge-text">CATEGORY</span>
            </div>
            <h1 className="games-title">{currentCat.title}</h1>
            <p className="games-subtitle">{currentCat.desc}</p>
          </div>

          <div className="attempts-card">
            <span className="attempts-label">Subscription</span>
            <div className="attempts-count">
              <FaBolt className="lightning-icon" />
              <span className="current">SUBSCRIBE</span>
            </div>
            <button className="buy-attempts-btn" onClick={onSubscribeClick}>
              <span>SUBSCRIBE</span>
              <FaChevronRight className="arrow" />
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORY SWITCHER PILLS & SEARCH */}
      <div className="search-filter-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder={`Search in ${currentCat.title}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSlidersH className="filter-icon" />
        </div>

        <div className="category-pills">
          {allCategories.map((c) => (
            <button
              key={c.slug}
              className={`pill ${currentSlug === c.slug ? "active" : ""}`}
              onClick={() => navigate(`/category/${c.slug}`)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* GAMES GRID */}
      <div className="games-sections">
        <section className="game-row-section">
          <div className="section-header">
            <div className="header-title">
              <FaFire className="fire-icon" />
              <h3>ALL {currentCat.title}</h3>
            </div>
            <span className="count-tag">{filteredGames.length} GAMES AVAILABLE</span>
          </div>

          <div className="games-grid">
            {filteredGames.map((game) => (
              <div
                className="games-card"
                key={game.id}
                onClick={() => onGameClick && onGameClick(game.title)}
              >
                <div className="card-thumb">
                  <img
                    src={game.image}
                    alt={game.title}
                    style={{ objectPosition: game.imagePosition || "center" }}
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
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="cat-footer-container">
        <div className="footer-top-row">
          <div className="brand-col">
            <img src="/logo2.png" alt="GhGameZone" className="footer-logo-img" />
            <p className="brand-tagline">
              Mini games. Maximum fun.
              <br />
              Play 25 games instantly.
            </p>
          </div>

          <div className="links-col">
            <h4>QUICK LINKS</h4>
            <Link to="/">Home</Link>
            <Link to="/games">Games</Link>
            <Link to="/about">About Us</Link>
            <Link to="/how-to-play">How to Play</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/leaderboard">Leaderboard</Link>
          </div>

          <div className="support-col">
            <h4>SUPPORT & LEGAL</h4>
            <button className="footer-link-btn" onClick={() => onFooterPolicyClick && onFooterPolicyClick("Help Center")}>Help Center</button>
            <button className="footer-link-btn" onClick={() => onFooterPolicyClick && onFooterPolicyClick("Terms & Conditions")}>Terms & Conditions</button>
            <button className="footer-link-btn" onClick={() => onFooterPolicyClick && onFooterPolicyClick("Privacy Policy")}>Privacy Policy</button>
            <button className="footer-link-btn" onClick={() => onFooterPolicyClick && onFooterPolicyClick("Refund Policy")}>Subscription Policy</button>
            <Link to="/how-to-play">FAQ</Link>
          </div>

          <div className="social-payments-col">
            <div className="social-group">
              <h4>FOLLOW US</h4>
              <div className="icons-row">
                <a href="https://web.facebook.com/MTNGhana/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
                <a href="https://www.instagram.com/mtnghana/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                <a href="https://x.com/MTNGhana/" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom-copy">
          <p>© 2026 GHGAMEZONE. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CategoryGamesContent;
