import React, { useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "../../components/BrandLogo/BrandLogo";
import "./ContactContent.scss";
import {
  FaUserAlt,
  FaEnvelope,
  FaTag,
  FaPen,
  FaPhoneAlt,
  FaWhatsapp,
  FaChevronRight,
  FaInstagram,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";

const ContactContent = ({ onPolicyClick }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-page-container">
      {/* 1. HERO SECTION */}
      <section className="contact-hero">
        <div className="hero-bg-overlay">
          <img src="/games-bg.png" alt="Cyberpunk Background" />
        </div>

        <div className="hero-content">
          <div className="text-col">
            <h1 className="hero-title">CONTACT & SUPPORT</h1>
            <h3 className="hero-subtitle">We're Here to Help You!</h3>
            <p className="hero-description">
              Have questions about your subscription, game turns, prizes, or gameplay? 
              Reach out to our official MTN customer care and THE Gameio support channels.
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

      {/* 2. FORM & INFO CARDS SECTION */}
      <section className="contact-main-section">
        <div className="contact-grid">
          {/* LEFT: FORM */}
          <div className="form-card">
            <div className="card-header">
              <span className="accent-line"></span>
              <h3>SEND US A MESSAGE</h3>
            </div>

            {submitted ? (
              <div className="success-banner">
                <span>✨ Thank you! Your message has been sent to our customer care team.</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="input-group">
                <FaUserAlt className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <FaTag className="input-icon" />
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject / Mobile Number"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group textarea-group">
                <FaPen className="input-icon textarea-icon" />
                <textarea
                  name="message"
                  placeholder="Your Message / Query"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <span>SEND MESSAGE</span>
                <FaChevronRight className="arrow" />
              </button>
            </form>
          </div>

          {/* RIGHT: INFO CARDS */}
          <div className="info-cards-col">
            {/* CALL MTN */}
            <a href="tel:100" className="info-card-link" style={{ textDecoration: "none" }}>
              <div className="info-card">
                <div className="card-icon-box" style={{ background: "rgba(234, 179, 8, 0.2)", color: "#facc15" }}>
                  <FaPhoneAlt />
                </div>
                <div className="card-body">
                  <h4>MTN CUSTOMER CARE</h4>
                  <p className="primary-text">Dial 100</p>
                  <p className="sub-text">Toll-free customer care hotline</p>
                </div>
              </div>
            </a>

            {/* WHATSAPP */}
            <a
              href="https://wa.me/233554300000"
              target="_blank"
              rel="noopener noreferrer"
              className="info-card-link"
              style={{ textDecoration: "none" }}
            >
              <div className="info-card">
                <div className="card-icon-box" style={{ background: "rgba(34, 197, 94, 0.2)", color: "#22c55e" }}>
                  <FaWhatsapp />
                </div>
                <div className="card-body">
                  <h4>WHATSAPP SUPPORT</h4>
                  <p className="primary-text">0554300000</p>
                  <p className="sub-text">Quick support & chat assistance</p>
                </div>
              </div>
            </a>

            {/* EMAIL US */}
            <a href="mailto:customercare.GH@mtn.com" className="info-card-link" style={{ textDecoration: "none" }}>
              <div className="info-card">
                <div className="card-icon-box" style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38bdf8" }}>
                  <FaEnvelope />
                </div>
                <div className="card-body">
                  <h4>EMAIL SUPPORT</h4>
                  <p className="primary-text">customercare.GH@mtn.com</p>
                  <p className="sub-text">Official MTN Ghana support email</p>
                </div>
              </div>
            </a>

            {/* MTN SOCIAL CHANNELS */}
            <div className="info-card social-card">
              <div className="card-icon-box">
                <FaFacebook />
              </div>
              <div className="card-body">
                <h4>MTN GHANA SOCIALS</h4>
                <div className="social-icons-row">
                  <a
                    href="https://web.facebook.com/MTNGhana/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <FaFacebook />
                  </a>
                  <a
                    href="https://x.com/MTNGhana/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter / X"
                  >
                    <FaTwitter />
                  </a>
                  <a
                    href="https://www.instagram.com/mtnghana/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOOTER */}
      <footer className="contact-footer-container">
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

export default ContactContent;
