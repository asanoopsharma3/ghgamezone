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
  FaExclamationTriangle
} from "react-icons/fa";

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
  const iframeRef = useRef(null);

  useEffect(() => {
    if (isOpen && game) {
      setIsLoading(true);
      setLoadError(false);
    }
  }, [isOpen, game]);

  if (!isOpen || !game) return null;

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

  return (
    <div className="game-modal-overlay" onClick={onClose}>
      <div 
        className={`game-modal-container ${isFullscreen ? "fullscreen" : ""}`} 
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
            <button 
              className="action-icon-btn" 
              onClick={toggleFullscreen} 
              title={isFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
            <button 
              className="action-icon-btn close-btn" 
              onClick={onClose} 
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
            <span>GhGameZone • Official Embedded Game Experience</span>
          </div>

          <div className="footer-btns">
            {onPlayAgain && (
              <button 
                className="open-tab-direct-btn"
                onClick={() => onPlayAgain(game)}
                title="Use 1 token to play again"
              >
                <FaBolt /> Play Again (-1 Turn)
              </button>
            )}
            <button className="get-turns-btn" onClick={onBuyTokensClick}>
              <FaBolt /> Buy Tokens
            </button>
            <button className="exit-game-btn" onClick={onClose}>
              Exit Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
