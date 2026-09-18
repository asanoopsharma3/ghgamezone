import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaBolt,
  FaUser,
  FaSignOutAlt,
  FaGamepad,
} from "react-icons/fa";
import "./Navbar.scss";
import { NavLink, useNavigate } from "react-router-dom";
import BrandLogo from "../BrandLogo/BrandLogo";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = ({ onSubscribeClick, onBuyTokensClick, onSignInClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, user, loginAsDemoUser, logoutUser } = useAuth();
  const openSubscribe = onSubscribeClick || onBuyTokensClick || onSignInClick;

  const handleDemoClick = () => {
    loginAsDemoUser();
    setMenuOpen(false);
  };

  const handleLogoutClick = () => {
    logoutUser();
    setMenuOpen(false);
    navigate("/");
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

          {isLoggedIn ? (
            <>
              <li className="mobile-only-item">
                <NavLink
                  to="/profile"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={() => setMenuOpen(false)}
                >
                  MY PROFILE ({user?.username || "Demo Gamer"})
                </NavLink>
              </li>
              <li className="mobile-only-item">
                <button className="nav-logout-mobile" onClick={handleLogoutClick}>
                  LOG OUT
                </button>
              </li>
            </>
          ) : (
            <li className="mobile-only-item">
              <button className="nav-demo-mobile" onClick={handleDemoClick}>
                🎮 DEMO USER LOGIN
              </button>
            </li>
          )}
        </ul>

        <div className="rightSide">
          <div className="searchBox">
            <input type="text" placeholder="Search games..." />
            <FaSearch />
          </div>

          {isLoggedIn ? (
            <div className="auth-user-section">
              <NavLink to="/profile" className="user-profile-btn" title="View Profile">
                <FaUser className="user-icon" />
                <span className="username">{user?.username || "Demo Gamer"}</span>
                <span className="user-vip-tag">VIP</span>
              </NavLink>
              <button
                className="logout-mini-btn"
                onClick={handleLogoutClick}
                title="Log Out"
                aria-label="Logout"
              >
                <FaSignOutAlt />
              </button>
            </div>
          ) : (
            <div className="auth-guest-section">
              <button
                type="button"
                className="demoNavBtn"
                onClick={handleDemoClick}
                title="1-Click Demo Login"
              >
                <FaGamepad />
                <span>DEMO USER</span>
              </button>

              <button className="loginBtn" onClick={openSubscribe}>
                <FaBolt />
                <span>SUBSCRIBE</span>
              </button>
            </div>
          )}

          <div className="mobileHeaderIcons">
            {isLoggedIn ? (
              <NavLink to="/profile" className="icon-btn profile-icon-btn" title="My Profile">
                <FaUser />
              </NavLink>
            ) : (
              <>
                <button
                  type="button"
                  className="icon-btn demo-icon-btn"
                  onClick={handleDemoClick}
                  title="Demo User Login"
                  style={{ background: "transparent", border: "none", cursor: "pointer" }}
                >
                  <FaGamepad style={{ color: "#38bdf8" }} />
                </button>
                <div className="icon-btn" onClick={openSubscribe} title="Subscribe">
                  <FaBolt />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
