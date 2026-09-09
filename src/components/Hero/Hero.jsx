import React, { useState, useEffect } from 'react'
import "./Hero.scss"
import { IoGameControllerOutline } from "react-icons/io5";
import { GoTrophy } from "react-icons/go";
import { useNavigate } from "react-router-dom";

const heroSlides = [
  {
    id: 1,
    bg: "/hero-bg.png",
    tagPlay: "PLAY •",
    tagCompete: "COMPETE •",
    tagConquer: "CONQUER",
    headingPrefix: "WELCOME TO",
    isSingleLine: true,
    titleWhite: "THE ",
    titlePurple: "Gameio",
    desc: "Your ultimate destination for free mini games. Play instantly. No downloads. Just pure fun!",
    primaryBtnText: "Explore Games",
    secondaryBtnText: "Leaderboard",
    primaryAction: "games",
    secondaryAction: "leaderboard"
  },
  {
    id: 2,
    bg: "/hero-slide-2.png",
    tagPlay: "FEATURED •",
    tagCompete: "RACING •",
    tagConquer: "SPEED",
    headingPrefix: "HIGH-SPEED NEON",
    titleWhite: "CAR RUSH",
    titlePurple: "PRO",
    desc: "Feel the speed on intense neon tracks! Outrun rivals, dodge obstacles and top the global rankings.",
    primaryBtnText: "Play Car Rush",
    secondaryBtnText: "Leaderboard",
    primaryAction: "CAR RUSH",
    secondaryAction: "leaderboard"
  },
  {
    id: 3,
    bg: "/hero-slide-3.png",
    tagPlay: "PUZZLE •",
    tagCompete: "SKILL •",
    tagConquer: "STRATEGY",
    headingPrefix: "CLASSIC RETRO",
    titleWhite: "TETRIS",
    titlePurple: "SUPREME",
    desc: "Master the blocks in the classic puzzle challenge reimagined! Stack fast, clear rows and set high scores.",
    primaryBtnText: "Play Tetris",
    secondaryBtnText: "Explore Games",
    primaryAction: "TETRIS",
    secondaryAction: "games"
  },
  {
    id: 4,
    bg: "/games-bg.png",
    tagPlay: "ACTION •",
    tagCompete: "COMBAT •",
    tagConquer: "BATTLE",
    headingPrefix: "EPIC ARENA",
    titleWhite: "STICKMAN",
    titlePurple: "WARRIORS",
    desc: "Unleash devastating combat combos in smooth physics arenas! Prove your reflexes and claim victory.",
    primaryBtnText: "Play Stickman",
    secondaryBtnText: "Leaderboard",
    primaryAction: "STICKMAN WARRIORS",
    secondaryAction: "leaderboard"
  }
];

const Hero = ({ onExploreClick, onLeaderboardClick }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrimaryClick = (action) => {
    if (action === "games") {
      if (onExploreClick) onExploreClick();
      else navigate('/games');
    } else if (onExploreClick) {
      onExploreClick(action);
    } else {
      navigate('/games');
    }
  };

  const handleSecondaryClick = (action) => {
    if (action === "leaderboard") {
      if (onLeaderboardClick) onLeaderboardClick();
      else navigate('/leaderboard');
    } else {
      navigate('/games');
    }
  };

  const activeSlide = heroSlides[currentSlide];

  return (
    <div 
      className="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Sliding Background Images */}
      <div className="overlay-hero-slider">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`hero-bg-slide ${idx === currentSlide ? "bg-active" : ""}`}
          >
            <img 
              src={slide.bg} 
              alt={`Hero Background ${idx + 1}`}
              onError={(e) => { e.target.src = "/hero-bg.png"; }}
            />
            <div className="bg-dark-overlay" />
          </div>
        ))}
      </div>

      <div className="hero-content">
        <div className="hero-1" key={currentSlide}>
          <span className="hero-tag">
            <svg className="frame" viewBox="0 0 1400 72" preserveAspectRatio="none">
              <defs>
                <linearGradient id="borderGradient">
                  <stop offset="0%" stopColor="#ff4df8"/>
                  <stop offset="100%" stopColor="#7c3aed"/>
                </linearGradient>
              </defs>

              <path
                d="
                  M30 1
                  H1370
                  L1399 18
                  V54
                  L1370 71
                  H30
                  L1 54
                  V18
                  Z
                "
                fill="none"
                stroke="url(#borderGradient)"
                strokeWidth="5"
              />
            </svg>
            <span className="play">{activeSlide.tagPlay}</span>{" "}
            <span className="compete">{activeSlide.tagCompete}</span>{" "}
            <span className="conquer">{activeSlide.tagConquer}</span>
          </span>

          <h2>{activeSlide.headingPrefix}</h2>

          <h1 className="hero-title">
            {activeSlide.isSingleLine ? (
              <span className="single-line-title">
                <span className="white">{activeSlide.titleWhite}</span>
                <span className="purple">{activeSlide.titlePurple}</span>
              </span>
            ) : (
              <>
                <span className="white">{activeSlide.titleWhite}</span>
                <span className="purple">{activeSlide.titlePurple}</span>
              </>
            )}
          </h1>

          <p>{activeSlide.desc}</p>

          <div className="hero-buttons">
            <button 
              className="primary-btn" 
              onClick={() => handlePrimaryClick(activeSlide.primaryAction)}
            >
              <IoGameControllerOutline /> {activeSlide.primaryBtnText}
            </button>

            <button 
              className="secondary-btn" 
              onClick={() => handleSecondaryClick(activeSlide.secondaryAction)}
            >
              <GoTrophy /> {activeSlide.secondaryBtnText}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Slide Indicators */}
      <div className="hero-slider-pagination">
        {heroSlides.map((slide, idx) => (
          <button
            key={slide.id}
            className={`pagination-bar ${idx === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Switch to slide ${idx + 1}`}
          >
            <span className="bar-number">0{idx + 1}</span>
            <span className="bar-line"></span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Hero;


