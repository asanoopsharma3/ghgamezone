import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaBolt,
  FaStar,
} from "react-icons/fa";
import "./Navbar.scss";
import { NavLink, useNavigate } from "react-router-dom";
import BrandLogo from "../BrandLogo/BrandLogo";
import { GAMES_CATALOG } from "../../data/gamesCatalog.js";

const Navbar = ({ onSubscribeClick, onBuyTokensClick, onSignInClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const searchBoxRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const navigate = useNavigate();

  const openSubscribe = onSubscribeClick || onBuyTokensClick || onSignInClick;

  // Filter games based on search query (by title, category, description)
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return GAMES_CATALOG.filter((g) => {
      return (
        g.title.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        (g.description && g.description.toLowerCase().includes(q))
      );
    }).slice(0, 7); // Up to 7 instant results
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isInsideDesktop = searchBoxRef.current && searchBoxRef.current.contains(e.target);
      const isInsideMobile = mobileSearchRef.current && mobileSearchRef.current.contains(e.target);
      if (!isInsideDesktop && !isInsideMobile) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setIsDropdownOpen(false);
    setShowMobileSearch(false);
    navigate(`/games?search=${encodeURIComponent(query)}`);
  };

  const handleGameSelect = (game) => {
    setIsDropdownOpen(false);
    setShowMobileSearch(false);
    // Dispatches global game launch so GameModal opens seamlessly
    window.dispatchEvent(new CustomEvent("launch-game", { detail: game }));
  };

  return (
    <nav className="navbar">
      <div className="container">
        <svg className="frame" viewBox="0 0 1400 72" preserveAspectRatio="none">
          <defs>
            <linearGradient id="borderGradient">
              <stop offset="0%" stopColor="#ff4df8" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          <path
            d="
                M20 0
                L0 18
                L0 54
                L20 72
                L1380 72
            "
            fill="none"
            stroke="url(#borderGradient)"
            strokeWidth="2"
          />
        </svg>

        <div className="mobileMenu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className="logo">
          <NavLink to="/" aria-label="THE Gameio home">
            <BrandLogo size={42} />
          </NavLink>
        </div>

        <ul className={menuOpen ? "navLinks active" : "navLinks"}>
          <li className="mobile-nav-logo">
            <NavLink to="/" onClick={() => setMenuOpen(false)} aria-label="THE Gameio home">
              <BrandLogo size={48} />
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setMenuOpen(false)}
            >
              HOME
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/games"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setMenuOpen(false)}
            >
              GAMES
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/about"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setMenuOpen(false)}
            >
              ABOUT US
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/how-to-play"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setMenuOpen(false)}
            >
              HOW TO PLAY
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => setMenuOpen(false)}
            >
              CONTACT
            </NavLink>
          </li>
        </ul>

        <div className="rightSide">
          {/* FUNCTIONAL SEARCH BOX */}
          <div className="searchBox" ref={searchBoxRef}>
            <form onSubmit={handleSearchSubmit} className="searchForm">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setIsDropdownOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsDropdownOpen(false);
                    e.currentTarget.blur();
                  }
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => {
                    setSearchQuery("");
                    setIsDropdownOpen(false);
                  }}
                  title="Clear search"
                >
                  <FaTimes />
                </button>
              )}
              <button type="submit" className="search-submit-btn" title="Search">
                <FaSearch />
              </button>
            </form>

            {/* LIVE SEARCH RESULTS DROPDOWN */}
            {isDropdownOpen && searchQuery.trim() && (
              <div className="search-dropdown-menu">
                <div className="search-dropdown-header">
                  <span>Results for "{searchQuery}"</span>
                  <span className="search-count">{searchResults.length} found</span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="search-results-list">
                    {searchResults.map((game) => (
                      <div
                        key={game.id}
                        className="search-result-item"
                        onClick={() => handleGameSelect(game)}
                      >
                        <img
                          src={game.image}
                          alt={game.title}
                          className="search-result-thumb"
                          onError={(e) => {
                            e.currentTarget.src = "/hero-bg.png";
                          }}
                        />
                        <div className="search-result-info">
                          <span className="search-result-title">{game.title}</span>
                          <div className="search-result-meta">
                            <span className="search-result-cat">{game.category}</span>
                            <span className="search-result-rating">
                              <FaStar className="star-icon" /> {game.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="search-no-results">
                    <p>No games found matching "{searchQuery}".</p>
                  </div>
                )}

                <div className="search-dropdown-footer">
                  <button
                    type="button"
                    className="view-all-btn"
                    onClick={handleSearchSubmit}
                  >
                    View in Games Catalog →
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="loginBtn" onClick={openSubscribe}>
            <FaBolt />
            <span>SUBSCRIBE</span>
          </button>

          <div className="mobileHeaderIcons">
            <div
              className="icon-btn search-toggle-btn"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              title="Search Games"
            >
              {showMobileSearch ? <FaTimes /> : <FaSearch />}
            </div>
            <div className="icon-btn" onClick={openSubscribe} title="Subscribe">
              <FaBolt />
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE EXPANDABLE SEARCH BAR */}
      {showMobileSearch && (
        <div className="mobile-search-bar" ref={mobileSearchRef}>
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <FaSearch className="mobile-search-icon" />
            <input
              type="text"
              placeholder="Search all 50 games..."
              value={searchQuery}
              autoFocus
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
            />
            {searchQuery && (
              <button
                type="button"
                className="mobile-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                <FaTimes />
              </button>
            )}
            <button type="submit" className="mobile-go-btn">
              Go
            </button>
          </form>

          {/* MOBILE LIVE RESULTS */}
          {searchQuery.trim() && (
            <div className="mobile-search-results">
              {searchResults.length > 0 ? (
                searchResults.map((game) => (
                  <div
                    key={game.id}
                    className="mobile-result-item"
                    onClick={() => handleGameSelect(game)}
                  >
                    <img
                      src={game.image}
                      alt={game.title}
                      className="mobile-thumb"
                      onError={(e) => {
                        e.currentTarget.src = "/hero-bg.png";
                      }}
                    />
                    <div className="mobile-info">
                      <span className="mobile-title">{game.title}</span>
                      <span className="mobile-cat">{game.category} • ⭐ {game.rating}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="mobile-no-results">
                  No games found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
