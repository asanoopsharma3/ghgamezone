import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import "./ProfileContent.scss";
import {
  FaBolt,
  FaTrophy,
  FaGamepad,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt,
  FaCheckCircle,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaUserAlt,
  FaClock,
  FaInfinity,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaLock
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";

const matchHistory = [
  { game: "WOBLOX", result: "VICTORY", points: "+450 PTS", date: "Today, 02:15 PM", attemptsCost: "Unlimited Pass" },
  { game: "CRAZY CAR", result: "VICTORY", points: "+320 PTS", date: "Yesterday", attemptsCost: "Unlimited Pass" },
  { game: "GOOF RUNNER", result: "DEFEAT", points: "+110 PTS", date: "05 Aug 2024", attemptsCost: "Unlimited Pass" },
  { game: "AIR HOCKEY", result: "VICTORY", points: "+280 PTS", date: "04 Aug 2024", attemptsCost: "Unlimited Pass" },
];

const formatTwoDigits = (num) => String(Math.max(0, num)).padStart(2, "0");

const ProfileContent = ({ onSubscribeClick, onLogout, onAuthClick, onPolicyClick }) => {
  const { user, isLoggedIn, subscription, isSubscribed, tokens } = useAuth();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    isActive: false,
  });

  // Real-time ticking subscription timer
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const activeSub = subscription || user?.subscription;
      if (!activeSub || !activeSub.expiresAt) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isActive: false });
        return;
      }

      const expiryTime = new Date(activeSub.expiresAt).getTime();
      const now = Date.now();
      const diffMs = expiryTime - now;

      if (diffMs <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isActive: false });
        return;
      }

      const totalSeconds = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        totalSeconds,
        isActive: true,
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [subscription, user]);

  const displayUsername = user?.username || "GUEST PLAYER";
  const activeSub = subscription || user?.subscription;
  const isSubActive = timeLeft.isActive && activeSub?.active;

  // Format expiry date
  const formattedExpiry = activeSub?.expiresAt
    ? new Date(activeSub.expiresAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="profile-page-container">
      {/* 1. PROFILE HEADER CARD */}
      <section className="profile-header-card">
        <div className="avatar-side">
          <div className="avatar-wrapper">
            <img 
              src={user?.avatar?.includes("avatar1.png") ? "/avatars/avatar.png" : (user?.avatar || "/avatars/avatar.png")} 
              alt={displayUsername} 
              className="profile-avatar" 
              onError={(e) => { e.currentTarget.src = "/avatars/avatar.png"; }}
            />
            <span className="online-indicator"></span>
          </div>

          <div className="user-meta">
            <div className="name-row">
              <h2>{displayUsername}</h2>
              <span className={`level-tag ${isSubActive ? "vip" : ""}`}>
                {isSubActive ? "VIP UNLIMITED" : "MEMBER"}
              </span>
            </div>

            <div className="status-badge-row">
              <span className="status-pill verified">
                <FaCheckCircle className="check-icon" /> MTN VERIFIED
              </span>
              <span className="status-pill member">
                {user?.phoneNumber || "GAMER ID #2026"}
              </span>
            </div>
          </div>
        </div>

        <div className="stats-badges-side">
          <div className={`badge-item ${isSubActive ? "sub-active-badge" : ""}`}>
            <FaBolt className="icon token" />
            <div className="detail">
              <span className="val">{isSubActive ? "UNLIMITED" : "EXPIRED"}</span>
              <span className="lbl">{isSubActive ? "Active Pass" : "Subscription"}</span>
            </div>
          </div>

          <div className="badge-item">
            <FaTrophy className="icon trophy" />
            <div className="detail">
              <span className="val">#14</span>
              <span className="lbl">Global Rank</span>
            </div>
          </div>

          <div className="badge-item">
            <FaGamepad className="icon game" />
            <div className="detail">
              <span className="val">25</span>
              <span className="lbl">Games Available</span>
            </div>
          </div>
        </div>

        <div className="action-side">
          {isLoggedIn ? (
            <>
              <button className="buy-turns-btn" onClick={onSubscribeClick}>
                <FaBolt /> {isSubActive ? "RENEW / EXTEND PASS" : "SUBSCRIBE NOW"}
              </button>
              <button className="logout-btn" onClick={onLogout}>
                <FaSignOutAlt /> Sign Out
              </button>
            </>
          ) : (
            <button className="buy-turns-btn" onClick={onAuthClick}>
              <FaUserAlt /> SIGN IN WITH OTP
            </button>
          )}
        </div>
      </section>

      {/* 2. LIVE SUBSCRIPTION VALIDITY TIMER BANNER */}
      <section className="subscription-timer-section">
        <div className={`subscription-status-card ${isSubActive ? "active-plan" : "inactive-plan"}`}>
          <div className="timer-card-header">
            <div className="header-title-box">
              <div className="pulse-dot-container">
                <span className={`pulse-dot ${isSubActive ? "active" : "inactive"}`}></span>
              </div>
              <div className="title-text-group">
                <h3>SUBSCRIPTION VALIDITY</h3>
                <span className="sub-tagline">
                  {isSubActive 
                    ? `${activeSub?.planName || "THEGameio Pass"} • Unlimited Play Access`
                    : "No active unlimited subscription"}
                </span>
              </div>
            </div>

            <div className="plan-badge-box">
              {isSubActive ? (
                <span className="badge active">
                  <FaInfinity /> ACTIVE UNLIMITED
                </span>
              ) : (
                <span className="badge expired">
                  <FaExclamationTriangle /> EXPIRED / INACTIVE
                </span>
              )}
            </div>
          </div>

          {/* COUNTDOWN DIGITS DISPLAY */}
          {isSubActive ? (
            <div className="countdown-display-wrapper">
              <div className="countdown-timer-grid">
                {timeLeft.days > 0 && (
                  <>
                    <div className="time-digit-block">
                      <span className="digit-value">{formatTwoDigits(timeLeft.days)}</span>
                      <span className="digit-label">DAYS</span>
                    </div>
                    <span className="time-colon">:</span>
                  </>
                )}

                <div className="time-digit-block">
                  <span className="digit-value">{formatTwoDigits(timeLeft.hours)}</span>
                  <span className="digit-label">HOURS</span>
                </div>

                <span className="time-colon">:</span>

                <div className="time-digit-block">
                  <span className="digit-value">{formatTwoDigits(timeLeft.minutes)}</span>
                  <span className="digit-label">MINUTES</span>
                </div>

                <span className="time-colon">:</span>

                <div className="time-digit-block highlight">
                  <span className="digit-value">{formatTwoDigits(timeLeft.seconds)}</span>
                  <span className="digit-label">SECONDS</span>
                </div>
              </div>

              <div className="expiry-footer-info">
                <div className="info-item">
                  <FaClock className="info-icon" />
                  <span>Valid until: <strong>{formattedExpiry}</strong></span>
                </div>
                <div className="info-item">
                  <FaBolt className="info-icon gold" />
                  <span>Cost: <strong>{activeSub?.price || 1} {activeSub?.currency || "GHS"} ({activeSub?.durationLabel || "1 Day"})</strong></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="inactive-countdown-prompt">
              <div className="prompt-left">
                <p className="prompt-text">
                  Subscribe for <strong>1 GHS</strong> to unlock <strong>1 whole day of unlimited play</strong>, or <strong>5 GHS</strong> for a full week!
                </p>
                <div className="plans-quick-pills">
                  <span className="plan-pill">Daily: 1 GHS (24h Unlimited)</span>
                  <span className="plan-pill popular">Weekly: 5 GHS (7 Days)</span>
                  <span className="plan-pill">Monthly: 18 GHS (30 Days)</span>
                </div>
              </div>
              <button 
                className="activate-sub-btn" 
                onClick={isLoggedIn ? onSubscribeClick : onAuthClick}
              >
                <FaBolt /> Subscribe to Activate
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. MATCH HISTORY & ACCOUNT SETTINGS */}
      <section className="profile-details-grid">
        {/* MATCH HISTORY */}
        <div className="history-card">
          <div className="section-header">
            <h3><FaHistory /> RECENT ATTEMPTS & MATCHES</h3>
            <span className="title-dash"></span>
          </div>

          <div className="history-list">
            {matchHistory.map((m, i) => (
              <div className="history-row" key={i}>
                <div className="game-info">
                  <span className="game-name">{m.game}</span>
                  <span className="match-date">{m.date} • {m.attemptsCost}</span>
                </div>
                <div className="result-info">
                  <span className={`result-tag ${m.result.toLowerCase()}`}>
                    {m.result}
                  </span>
                  <span className="pts">{m.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBSCRIPTION & ACCOUNT DETAILS */}
        <div className="account-card">
          <div className="section-header">
            <h3><FaCog /> SUBSCRIPTION & ACCOUNT</h3>
            <span className="title-dash"></span>
          </div>

          <div className="sub-box">
            <div className="sub-top">
              <span className="plan-title">{activeSub?.planName || "THEGameio PASS"}</span>
              <span className={`status ${isSubActive ? "active" : "expired"}`}>
                <FaCheckCircle /> {isSubActive ? "LIVE SYNCED" : "UNSUBSCRIBED"}
              </span>
            </div>
            <p className="sub-desc">
              {isSubActive
                ? `Unlimited turns active. Play all 25 arcade and quiz games without restriction.`
                : "Subscribe now to access all 25 arcade, quiz, and sports challenges."}
            </p>
            <div className="progress-bar-bg">
              <div 
                className="progress-fill" 
                style={{ width: isSubActive ? "100%" : "0%" }}
              ></div>
            </div>
            <span className="expiry">
              {isSubActive ? `Expires: ${formattedExpiry}` : "No active subscription period"}
            </span>
          </div>

          <div className="security-box">
            <div className="sec-header">
              <FaShieldAlt className="shield-icon" />
              <h4>Account Security & Identity</h4>
            </div>
            <p>{user?.phoneNumber ? `Mobile: ${user.phoneNumber}` : "MTN Verified Mobile Gaming Account"}</p>
            <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
              Backend Security: 256-Bit Cryptographic OTP & Session Verification Active
            </p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="profile-footer-container">
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
          <p>© 2026 THEGameio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProfileContent;
