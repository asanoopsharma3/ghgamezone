import React, { useState, useRef, useEffect } from "react";
import "./GameModal.scss";
import { 
  FaTimes, 
  FaExpand, 
  FaCompress, 
  FaGamepad, 
  FaBolt,
  FaShieldAlt,
  FaSpinner,
  FaExclamationTriangle,
  FaSyncAlt
} from "react-icons/fa";

const LANDSCAPE_SLUGS = new Set([
  "airport-rush",
  "billiards",
  "blocks-super-match3",
  "candy-match3",
  "crazy-car",
  "goof-runner",
  "math-game-kids",
  "panda-love",
  "pops-billiards",
  "scary-run",
  "sea-animal",
  "war-battleship"
]);

const GameModal = ({ 
  isOpen, 
  onClose, 
  game, 
  turnsRemaining, 
  onBuyTokensClick,
  onPlayAgain 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isRotated, setIsRotated] = useState(true);
  const iframeRef = useRef(null);

  const isLandscapeGame = Boolean(
    game?.orientation === "landscape" || 
    LANDSCAPE_SLUGS.has(game?.id) || 
    LANDSCAPE_SLUGS.has(game?.slug)
  );

  useEffect(() => {
    if (isOpen && game) {
      setIsLoading(true);
      setLoadError(false);
      setIsRotated(true);
      document.body.style.overflow = "hidden";

      // Attempt screen orientation lock if supported (PWA or Android full screen)
      if (isLandscapeGame && screen.orientation && typeof screen.orientation.lock === "function") {
        screen.orientation.lock("landscape").catch(() => {
          // Fallback to CSS rotation if browser denies programmatic lock
        });
      }
    }

    return () => {
      document.body.style.overflow = "";
      if (screen.orientation && typeof screen.orientation.unlock === "function") {
        try {
          screen.orientation.unlock();
        } catch (e) {}
      }
    };
  }, [isOpen, game, isLandscapeGame]);

  if (!isOpen || !game) return null;

  const handleClose = () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    if (screen.orientation && typeof screen.orientation.unlock === "function") {
      try {
        screen.orientation.unlock();
      } catch (e) {}
    }
    onClose();
  };

  const toggleFullscreen = () => {
    const container = iframeRef.current?.parentElement?.parentElement;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  const shouldRotate = isLandscapeGame && isRotated;

  return (
    <div 
      className={`game-modal-overlay ${shouldRotate ? "landscape-mode-overlay" : ""}`} 
      onClick={handleClose}
    >
      <div 
        className={`game-modal-container ${isFullscreen ? "fullscreen" : ""} ${shouldRotate ? "landscape-rotated" : ""} ${isLandscapeGame ? "is-landscape-game" : ""}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="game-modal-header">
          <div className="game-header-left">
            <div className="game-icon-pod">
              <FaGamepad />
            </div>
            <div className="game-title-info">
              <h3>{game.title}</h3>
              <div className="game-meta-pills">
                <span className="category-pill">{game.category}</span>
                <span className="turns-pill">
                  <FaBolt className="coin-icon" /> Unlimited Play
                </span>
              </div>
            </div>
          </div>

          <div className="game-header-actions">
            {isLandscapeGame && (
              <button 
                className={`action-icon-btn rotate-btn ${isRotated ? "active" : ""}`} 
                onClick={() => setIsRotated((prev) => !prev)} 
                title={isRotated ? "Switch to Upright Portrait" : "Rotate to Wide Screen"}
                aria-label="Toggle Screen Rotation"
              >
                <FaSyncAlt style={{ transform: isRotated ? "rotate(90deg)" : "none", transition: "transform 0.25s ease" }} />
              </button>
            )}
            <button 
              className="action-icon-btn" 
              onClick={toggleFullscreen} 
              title={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
            <button 
              className="action-icon-btn close-btn" 
              onClick={handleClose} 
              title="Exit Game"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Game iframe Container */}
        <div className="game-modal-body">
          {isLoading && (
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#080414",
              color: "#e879f9",
              gap: "12px",
              zIndex: 10
            }}>
              <FaSpinner style={{ fontSize: "28px", animation: "spin 1s linear infinite" }} />
              <span style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "1px", color: "#fff" }}>
                LAUNCHING {game.title}...
              </span>
            </div>
          )}

          {loadError && (
            <div style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "#080414",
              color: "#f87171",
              gap: "12px",
              padding: "20px",
              textAlign: "center",
              zIndex: 10
            }}>
              <FaExclamationTriangle style={{ fontSize: "32px" }} />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>
                Unable to load {game.title}
              </span>
              <p style={{ fontSize: "12px", color: "#94a3b8", maxWidth: "400px" }}>
                The game server might be temporarily unreachable.
              </p>
              <button
                onClick={() => {
                  setLoadError(false);
                  setIsLoading(true);
                  if (iframeRef.current) iframeRef.current.src = game.url;
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #d946ef",
                  background: "rgba(217, 70, 239, 0.2)",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "12px"
                }}
              >
                Retry
              </button>
            </div>
          )}

          <iframe
            ref={iframeRef}
            src={game.url}
            title={game.title}
            className="game-iframe"
            allow="fullscreen; autoplay; gamepad; accelerometer; gyroscope"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>

        {/* Bottom Control Bar */}
        <div className="game-modal-footer">
          <div className="footer-info">
            <FaShieldAlt className="shield-icon" />
            <span>THE Gameio • Official Embedded Game Experience</span>
          </div>

          <div className="footer-btns">
            <button className="exit-game-btn" onClick={handleClose}>
              Exit Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
