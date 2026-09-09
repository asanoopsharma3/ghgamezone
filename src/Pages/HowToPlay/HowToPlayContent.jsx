import React, { useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import "./HowToPlayContent.scss";
import {
  FaBolt,
  FaCheck,
  FaUserAlt,
  FaWallet,
  FaGamepad,
  FaPlay,
  FaCalendarAlt,
  FaPlus,
  FaMinus,
  FaTrophy,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";

const stepsData = [
  {
    num: "01",
    icon: <FaUserAlt />,
    title: "CREATE ACCOUNT",
    desc: "Enter your mobile number and verify instantly with OTP.",
  },
  {
    num: "02",
    icon: <FaWallet />,
    title: "SUBSCRIBE",
    desc: "Choose Daily (1 GHS / 24h), Weekly (5 GHS / 7 Days), or Monthly (18 GHS / 30 Days).",
  },
  {
    num: "03",
    icon: <FaGamepad />,
    title: "CHOOSE A GAME",
    desc: "Browse 25 quizzes, arcade, and sports games to pick your favorite.",
  },
  {
    num: "04",
    icon: <FaPlay />,
    title: "PLAY & WIN",
    desc: "Enjoy unlimited game attempts, earn points, and climb the leaderboard.",
  },
];

const faqData = [
  {
    q: "How does the subscription work?",
    a: "Subscription gives you unlimited play access: THE Gameio Daily for 1 GHS gives 1 whole day (24 hours) unlimited access, Weekly for 5 GHS gives 7 days unlimited play, and Monthly for 18 GHS gives 30 days unlimited play.",
  },
  {
    q: "How many game attempts do I get?",
    a: "You get unlimited attempts while your subscription is active! A live validity timer in your profile shows remaining active time.",
  },
  {
    q: "How do I log in?",
    a: "Simply enter your MTN mobile number to receive a 4-digit SMS OTP code for instant, secure authentication.",
  },
  {
    q: "How are winners selected?",
    a: "Winners are selected based on accumulated leaderboard points, promotional mechanics, or random draws where applicable.",
  },
  {
    q: "How can I contact support?",
    a: "You can dial 100 for MTN hotline, WhatsApp 0554300000, or email customercare.GH@mtn.com anytime.",
  },
];

const HowToPlayContent = ({ onSubscribeClick, onPolicyClick }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="howtoplay-page-container">
      {/* 1. HERO SECTION */}
      <section className="htp-hero">
        <div className="hero-bg-overlay">
          <img src="/games-bg.png" alt="Cyberpunk Background" />
        </div>

        <div className="hero-content">
          <div className="text-col">
            <h1 className="hero-title">
              HOW <br />
              <span className="purple">TO PLAY</span>
            </h1>
            <p className="hero-subtitle">
              Easy steps to subscribe, play challenges, climb the leaderboard, and win big!
            </p>
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

      {/* 2. PROMOTIONAL SUBSCRIPTION CARD */}
      <section className="promo-sub-section">
        <div className="promo-card">
          <div className="ticket-graphic">
            <div className="ticket-pass">
              <FaBolt className="ticket-icon" />
              <div className="gold-coins">🪙🪙</div>
            </div>
          </div>

          <div className="sub-price-info">
            <span className="sub-label">DAILY STARTER PASS</span>
            <div className="price-row">
              <span className="currency">GHS</span>
              <span className="amount">1</span>
            </div>
            <span className="turns-label">THE Gameio DAILY • 24H UNLIMITED</span>
          </div>

          <div className="sub-features-list">
            <div className="feature-line">
              <FaCheck className="check-icon" />
              <span>Instant activation</span>
            </div>
            <div className="feature-line">
              <FaCheck className="check-icon" />
              <span>Play any quiz or challenge</span>
            </div>
            <div className="feature-line">
              <FaCheck className="check-icon" />
              <span>MTN Mobile Money supported</span>
            </div>
            <div className="feature-line">
              <FaCheck className="check-icon" />
              <span>Weekly (5 GHS) & Monthly (18 GHS) available</span>
            </div>
          </div>

          <button className="promo-sub-btn" onClick={onSubscribeClick}>
            <FaBolt /> <span>SUBSCRIBE NOW</span>
          </button>
        </div>
      </section>

      {/* 3. FOUR EASY STEPS SECTION */}
      <section className="steps-section">
        <div className="section-header">
          <h3>4 EASY STEPS</h3>
          <span className="title-dash"></span>
        </div>

        <div className="steps-grid">
          {stepsData.map((s, idx) => (
            <div className="step-card" key={idx}>
              <span className="step-number">{s.num}</span>
              <div className="step-icon-box">{s.icon}</div>
              <h4 className="step-title">{s.title}</h4>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="faq-section">
        <div className="section-header">
          <h3>FREQUENTLY ASKED QUESTIONS</h3>
          <span className="title-dash"></span>
        </div>

        <div className="faq-accordion-list">
          {faqData.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                className={`faq-item-card ${isOpen ? "open" : ""}`}
                key={idx}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-question-row">
                  <h4>{faq.q}</h4>
                  <button className="faq-toggle-btn" aria-label="Toggle answer">
                    {isOpen ? <FaMinus /> : <FaPlus />}
                  </button>
                </div>
                {isOpen && (
                  <div className="faq-answer-row">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="htp-footer-container">
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

export default HowToPlayContent;
