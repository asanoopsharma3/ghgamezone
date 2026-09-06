import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./LeaderboardContent.scss";
import {
  FaTrophy,
  FaBolt,
  FaCrown,
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { APP_CONFIG } from "../../config/app.config.js";
import { fetchSubscribedPlayers } from "../../services/leaderboardService.js";

const PACKAGE_FILTERS = ["DAILY", "WEEKLY", "MONTHLY"];

const LeaderboardContent = ({ onSubscribeClick, onPolicyClick }) => {
  const [timeframe, setTimeframe] = useState(
    String(APP_CONFIG.leaderboardPackage || "daily").toUpperCase()
  );
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchSubscribedPlayers(timeframe.toLowerCase())
      .then((data) => {
        if (!active) return;
        setPlayers(data.players || []);
      })
      .catch(() => {
        if (active) setPlayers([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [timeframe]);

  return (
    <div className="leaderboard-page-container">
      <section className="lb-hero">
        <div className="hero-bg-overlay">
          <img src="/games-bg.png" alt="Leaderboard background" />
        </div>

        <div className="hero-content">
          <div className="text-col">
            <span className="hero-tag">
              <FaTrophy /> SUBSCRIBED PLAYERS
            </span>
            <h1 className="hero-title">
              SUBSCRIBE <br />
              <span className="purple">LEADERBOARD</span>
            </h1>
            <p className="hero-subtitle">
              Current GHGameZone subscribers by package. Numbers are masked. Daily, weekly, and monthly lists follow the live offer config.
            </p>
          </div>

          <div className="graphic-col">
            <div className="crown-podium">
              <FaCrown className="crown-icon" />
              <div className="neon-glow-ring"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="lb-filter-section">
        <div className="filter-pills">
          {PACKAGE_FILTERS.map((tf) => (
            <button
              key={tf}
              className={`pill ${timeframe === tf ? "active" : ""}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </section>

      <section className="lb-main-rankings">
        {loading ? (
          <div className="empty-rankings-box">
            <p className="empty-desc">Loading subscribed players...</p>
          </div>
        ) : players.length === 0 ? (
          <div className="empty-rankings-box">
            <div className="empty-trophy-glow">
              <FaTrophy className="trophy-icon" />
            </div>
            <h3 className="empty-title">NO SUBSCRIBED PLAYERS</h3>
            <p className="empty-desc">
              No active <strong>{timeframe}</strong> subscribers yet.
              <br />
              Subscribe to appear on this list with a masked mobile number.
            </p>
            <div className="empty-actions">
              <button className="get-turns-btn" onClick={onSubscribeClick}>
                <FaBolt /> SUBSCRIBE NOW
              </button>
            </div>
          </div>
        ) : (
          <div className="rankings-table-wrap">
            <div className="rankings-list">
              {players.map((p) => (
                <div className="rank-row-card" key={`${p.msisdn}-${p.rank}`}>
                  <span className="rank-num">#{p.rank}</span>
                  <div className="player-profile">
                    <div className="name-info">
                      <span className="name">{p.msisdn}</span>
                      <span className="win-rate">{p.packageName}</span>
                    </div>
                  </div>
                  <div className="score-badge">
                    <span>ACTIVE</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="lb-perks-section">
        <div className="section-title-wrap">
          <h3>HOW THIS LIST WORKS</h3>
          <span className="title-dash"></span>
        </div>

        <div className="perks-grid">
          <div className="perk-card">
            <div className="perk-badge">1</div>
            <h4>Subscribe</h4>
            <p>Pick daily, weekly, or monthly. Your offer code and package are stored after activation.</p>
          </div>

          <div className="perk-card">
            <div className="perk-badge">2</div>
            <h4>Masked number</h4>
            <p>Only a masked MSISDN is shown. Player names are never displayed.</p>
          </div>

          <div className="perk-card">
            <div className="perk-badge">3</div>
            <h4>Package filters</h4>
            <p>Switch daily, weekly, or monthly using the same subscriber table and offer config.</p>
          </div>
        </div>
      </section>

      <section className="lb-cta-section">
        <div className="cta-box">
          <div className="cta-text">
            <h2>JOIN THE SUBSCRIBED PLAYERS</h2>
            <p>Subscribe now and your masked number will appear on the live list.</p>
            <button className="subscribe-btn" onClick={onSubscribeClick}>
              <FaBolt /> SUBSCRIBE NOW
            </button>
          </div>
          <div className="cta-graphic">
            <div className="trophy-circle">
              <FaTrophy className="trophy-icon" />
            </div>
          </div>
        </div>
      </section>

      <footer className="lb-footer-container">
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
          </div>

          <div className="support-col">
            <h4>SUPPORT & LEGAL</h4>
            <button className="footer-link-btn" onClick={() => onPolicyClick && onPolicyClick("Help Center")}>Help Center</button>
            <button className="footer-link-btn" onClick={() => onPolicyClick && onPolicyClick("Terms & Conditions")}>Terms & Conditions</button>
            <button className="footer-link-btn" onClick={() => onPolicyClick && onPolicyClick("Privacy Policy")}>Privacy Policy</button>
            <button className="footer-link-btn" onClick={() => onPolicyClick && onPolicyClick("Refund Policy")}>Subscription Policy</button>
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

export default LeaderboardContent;
