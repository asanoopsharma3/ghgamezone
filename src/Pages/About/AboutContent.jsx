import React from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import "./AboutContent.scss";
import {
  FaGamepad,
  FaBolt,
  FaShieldAlt,
  FaTrophy,
  FaUsers,
  FaLightbulb,
  FaGem,
  FaStar,
  FaChevronRight,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const offersData = [
  {
    icon: <FaGamepad />,
    title: "PREMIUM MINI GAMES",
    desc: "Handpicked collection of high-quality mini games for non-stop fun.",
  },
  {
    icon: <FaBolt />,
    title: "FAIR & COMPETITIVE",
    desc: "Skill-based gameplay where everyone has a fair chance to win.",
  },
  {
    icon: <FaShieldAlt />,
    title: "SAFE & SECURE",
    desc: "Your data, privacy and transactions are always protected with us.",
  },
  {
    icon: <FaTrophy />,
    title: "REWARDS & RANKS",
    desc: "Win exciting rewards, climb the leaderboard and show your rank.",
  },
];

const valuesData = [
  {
    icon: <FaUsers />,
    title: "COMMUNITY FIRST",
    desc: "We build a positive and inclusive community of gamers who support and inspire each other.",
  },
  {
    icon: <FaLightbulb />,
    title: "INNOVATION",
    desc: "We constantly explore new ideas and technology to bring fresh and exciting gaming experiences.",
  },
  {
    icon: <FaGem />,
    title: "EXCELLENCE",
    desc: "We are committed to delivering the best in game quality, experience and customer support.",
  },
];

const statsData = [
  {
    icon: <FaUsers />,
    count: "50K+",
    label: "PLAYERS",
  },
  {
    icon: <FaGamepad />,
    count: "100+",
    label: "GAMES",
  },
  {
    icon: <FaTrophy />,
    count: "1M+",
    label: "MATCHES PLAYED",
  },
  {
    icon: <FaStar />,
    count: "4.8",
    label: "AVERAGE RATING",
  },
];

const AboutContent = ({ onPolicyClick }) => {
  return (
    <div className="about-page-container">
      {/* 1. HERO SECTION */}
      <section className="about-hero">
        <div className="hero-bg-overlay">
          <img src="/games-bg.png" alt="Cyberpunk Background" />
        </div>

        <div className="hero-content">
          <div className="text-col">
            <span className="section-tag">ABOUT US</span>
            <h1 className="hero-title">
              LEVELING UP <br />
              EVERY <span className="highlight">GAMING</span> MOMENT
            </h1>
            <p className="hero-description">
              THE Gameio is your ultimate destination for quizzes, challenges, and competitive games.
              We combine fun, fair competition, and rich rewards to deliver short,
              exciting gaming experiences anytime, anywhere across Ghana.
            </p>
            <a href="#story" className="story-btn">
              <span>OUR STORY</span>
              <FaChevronRight className="arrow-icon" />
            </a>
          </div>

          <div className="graphic-col">
            <div className="controller-podium">
              <img
                src="/games-bg.png"
                alt="Controller Podium"
                className="podium-img"
              />
              <div className="neon-glow-ring"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR STORY SECTION */}
      <section className="our-story-section" id="story">
        <div className="section-header">
          <h3>OUR STORY</h3>
          <span className="title-dash"></span>
        </div>

        <div className="story-card-grid">
          <div className="story-portal-box">
            <div className="hex-frame">
              <div className="hex-inner">
                <span className="hex-logo">G</span>
                <div className="gamer-silhouette"></div>
              </div>
            </div>
          </div>

          <div className="story-text-box">
            <h2 className="story-heading">Born to Play. Built to Inspire.</h2>
            <p className="story-p">
              THE Gameio was created with a simple mission – to make
              high-quality interactive quizzes and challenges accessible, engaging, and rewarding for every player.
            </p>
            <p className="story-p">
              We believe that every moment of play brings joy, challenges you and
              connects you with an exciting leaderboard community of players across Ghana.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE OFFER SECTION */}
      <section className="what-we-offer-section">
        <div className="section-header">
          <h3>WHAT WE OFFER</h3>
          <span className="title-dash"></span>
        </div>

        <div className="offers-grid">
          {offersData.map((item, idx) => (
            <div className="offer-card" key={idx}>
              <div className="icon-circle">{item.icon}</div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. OUR VALUES SECTION */}
      <section className="our-values-section">
        <div className="section-header">
          <h3>OUR CORE VALUES</h3>
          <span className="title-dash"></span>
        </div>

        <div className="values-grid">
          {valuesData.map((val, idx) => (
            <div className="value-card" key={idx}>
              <div className="val-icon-box">{val.icon}</div>
              <h4>{val.title}</h4>
              <p>{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY THE Gameio? STATS SECTION */}
      <section className="why-ghanawins-stats-section">
        <div className="section-header">
          <h3>WHY THE Gameio?</h3>
          <span className="title-dash"></span>
        </div>

        <div className="stats-card-box">
          <div className="stats-grid">
            {statsData.map((stat, idx) => (
              <div className="stat-item" key={idx}>
                <div className="icon-badge">{stat.icon}</div>
                <div className="stat-info">
                  <h3 className="stat-count">{stat.count}</h3>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="about-cta-section">
        <div className="cta-box">
          <div className="cta-text">
            <h2>
              READY TO START <br />
              YOUR <span className="highlight">GAMING</span> JOURNEY?
            </h2>
            <p>
              Join thousands of players across Ghana and experience real-time quizzes & leaderboards!
            </p>
            <Link to="/games" className="explore-btn">
              <span>EXPLORE GAMES</span>
              <FaChevronRight className="arrow" />
            </Link>
          </div>

          <div className="cta-portal-graphic">
            <div className="portal-ring">
              <FaGamepad className="portal-gamepad" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. ABOUT FOOTER */}
      <footer className="about-footer-container">
        <div className="footer-top-row">
          <div className="brand-col">
            <BrandLogo size={34} />
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
            <Link to="/how-to-play">How to Play</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="support-col">
            <h4>SUPPORT & LEGAL</h4>
            <button className="footer-link-btn" onClick={() => onPolicyClick && onPolicyClick("Help Center")}>
              Help Center
            </button>
            <button className="footer-link-btn" onClick={() => onPolicyClick && onPolicyClick("Terms & Conditions")}>
              Terms & Conditions
            </button>
            <button className="footer-link-btn" onClick={() => onPolicyClick && onPolicyClick("Privacy Policy")}>
              Privacy Policy
            </button>
            <button className="footer-link-btn" onClick={() => onPolicyClick && onPolicyClick("Refund Policy")}>
              Subscription Policy
            </button>
          </div>

          <div className="social-payments-col">
            <div className="social-group">
              <h4>FOLLOW US</h4>
              <div className="icons-row">
                <a href="https://web.facebook.com/MTNGhana/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FaFacebook />
                </a>
                <a href="https://www.instagram.com/mtnghana/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://x.com/MTNGhana/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom-copy">
          <p>© 2026 THE Gameio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutContent;
