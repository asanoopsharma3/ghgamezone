import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaBolt,
  FaShieldAlt,
  FaTrophy,
} from "react-icons/fa";
import { IoGameControllerOutline } from "react-icons/io5";
import BrandLogo from "../BrandLogo/BrandLogo";
import "./Footer.scss";

const mobileFeatures = [
  {
    icon: <FaBolt />,
    title: "INSTANT PLAY",
    desc: "No downloads, play right away",
  },
  {
    icon: <FaShieldAlt />,
    title: "100% FREE",
    desc: "All games are completely free",
  },
  {
    icon: <FaTrophy />,
    title: "COMPETE",
    desc: "Climb the leaderboard and be the best",
  },
];

const Footer = ({ onPolicyClick }) => {
  return (
    <footer className="footer-full-width">
      {/* MOBILE ONLY: WHY PLAY HERE 3 CARDS */}
      <div className="mobile-features-section mobile-only">
        <div className="section-title">
          <h3>WHY PLAY HERE?</h3>
          <span className="title-dash"></span>
        </div>
        <div className="features-grid">
          {mobileFeatures.map((item, index) => (
            <div className="feature-item" key={index}>
              <div className="icon-badge">{item.icon}</div>
              <div className="feature-text">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULL WIDTH BOTTOM BAR */}
      <div className="footer-main-bar">
        <div className="footer-left-brand">
          <BrandLogo size={34} />
          <p className="footer-tagline">
            Mini games. Maximum fun.
            <br />
            Play 25 games instantly.
          </p>
        </div>

        <div className="footer-nav-columns">
          <div className="footer-col">
            <h4>EXPLORE</h4>
            <Link to="/games">All Games</Link>
            <Link to="/games">New Games</Link>
            <Link to="/leaderboard">Leaderboard</Link>
          </div>

          <div className="footer-col">
            <h4>COMPANY</h4>
            <Link to="/about">About Us</Link>
            <button onClick={() => onPolicyClick && onPolicyClick("Privacy Policy")}>Privacy Policy</button>
            <button onClick={() => onPolicyClick && onPolicyClick("Terms & Conditions")}>Terms of Service</button>
          </div>

          <div className="footer-col">
            <h4>SUPPORT</h4>
            <button onClick={() => onPolicyClick && onPolicyClick("Help Center")}>Help Center</button>
            <Link to="/contact">Contact Us</Link>
            <button onClick={() => onPolicyClick && onPolicyClick("Refund Policy")}>Subscription Policy</button>
          </div>
        </div>

        <div className="footer-social-col">
          <h4>FOLLOW US</h4>
          <div className="social-icons">
            <a href="https://web.facebook.com/MTNGhana/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://www.instagram.com/mtnghana/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://x.com/MTNGhana/" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>

        {/* READY TO PLAY CARD (DESKTOP) */}
        <div className="ready-to-play-box desktop-only">
          <div className="ready-text">
            <h4>READY TO PLAY?</h4>
            <p>The games are calling you!</p>
          </div>
          <div className="ready-icon">
            <IoGameControllerOutline />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;