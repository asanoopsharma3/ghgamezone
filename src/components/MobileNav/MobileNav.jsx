import React from "react";
import { NavLink } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { IoGameControllerOutline } from "react-icons/io5";
import { GoTrophy } from "react-icons/go";
import { FaBolt } from "react-icons/fa";
import "./MobileNav.scss";

const MobileNav = () => {
  return (
    <nav className="mobile-bottom-nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `nav-item ${isActive ? "active" : ""}`
        }
      >
        <GoHome className="nav-icon" />
        <span>HOME</span>
      </NavLink>

      <NavLink
        to="/games"
        className={({ isActive }) =>
          `nav-item ${isActive ? "active" : ""}`
        }
      >
        <IoGameControllerOutline className="nav-icon" />
        <span>GAMES</span>
      </NavLink>

      <div className="nav-item center-hex-wrapper">
        <div className="hex-button">
          <svg viewBox="0 0 100 100" className="hex-svg">
            <polygon
              points="50,3 93,25 93,75 50,97 7,75 7,25"
              fill="url(#hexGradient)"
              stroke="#a855f7"
              strokeWidth="3"
            />
            <defs>
              <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d946ef" />
                <stop offset="50%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#4c1d95" />
              </linearGradient>
            </defs>
          </svg>
          <div className="hex-content">
            <span className="logo-letter">G</span>
          </div>
        </div>
      </div>

      <NavLink
        to="/leaderboard"
        className={({ isActive }) =>
          `nav-item ${isActive ? "active" : ""}`
        }
      >
        <GoTrophy className="nav-icon" />
        <span>LEADERBOARD</span>
      </NavLink>

      <NavLink
        to="/subscribe"
        className={({ isActive }) =>
          `nav-item ${isActive ? "active" : ""}`
        }
      >
        <FaBolt className="nav-icon" />
        <span>SUBSCRIBE</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
