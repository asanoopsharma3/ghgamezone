import React, { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaBolt,
} from "react-icons/fa";
import "./Navbar.scss";
import { NavLink } from "react-router-dom";
import BrandLogo from "../BrandLogo/BrandLogo";

const Navbar = ({ onSubscribeClick, onBuyTokensClick, onSignInClick }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const openSubscribe = onSubscribeClick || onBuyTokensClick || onSignInClick;

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
          <div className="searchBox">
            <input type="text" placeholder="Search games..." />
            <FaSearch />
          </div>

          <button className="loginBtn" onClick={openSubscribe}>
            <FaBolt />
            <span>SUBSCRIBE</span>
          </button>

          <div className="mobileHeaderIcons">
            <div className="icon-btn" onClick={openSubscribe} title="Subscribe">
              <FaBolt />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
