import React, { useState, useRef, useEffect, useCallback } from "react";
import "./GameModal.scss";
import {
  FaTimes,
  FaExpand,
  FaCompress,
  FaGamepad,
  FaRedoAlt,
  FaMobileAlt,
  FaDesktop,
  FaExternalLinkAlt,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const GameModal = ({
  isOpen,
  onClose,
  game,
  turnsRemaining,
  onBuyTokensClick,
  onPlayAgain,
}) => {
  const isDualCompatible =
    game?.orientation === "responsive" ||
    game?.slug === "call-break" ||
    game?.slug === "cyber-solitaire";

  const isWideDefault = isDualCompatible || game?.orientation === "landscape";

  // Desktop viewport mode: "mobile" (420px phone) or "wide" (1040px wide for laptop/desktop)
  const [viewMode, setViewMode] = useState("mobile");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  // Set default view mode whenever a new game opens
  useEffect(() => {
    if (isOpen && game) {
      setIsLoading(true);
      setLoadError(false);
      setIsFullscreen(false);
      // If the game is compatible with laptop (Solitaire, Call Break, landscape), default to wide view on desktop/laptop
      setViewMode(isWideDefault ? "wide" : "mobile");
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, game, isWideDefault]);

  // Fullscreen sync
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const handleClose = useCallback(() => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    onClose();
  }, [onClose]);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleReload = () => {
    setIsLoading(true);
    setLoadError(false);
    setIframeKey((k) => k + 1);
  };

  if (!isOpen || !game) return null;

  return (
    <div className="game-modal-overlay" onClick={handleClose}>
      <div
        ref={containerRef}
        className={`game-modal-container mode-${viewMode} ${isFullscreen ? "is-fullscreen" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* COMPACT TOP NAVIGATION BAR */}
        <header className="game-modal-header">
          <div className="game-header-left">
            <div className="game-icon-pod">
              <FaGamepad />
            </div>
            <div className="game-title-info">
              <h3 title={game.title}>{game.title}</h3>
              <span className="tag-category">{game.category}</span>
              {isDualCompatible && (
                <span className="tag-device-compat" title="Optimized for Laptop & Mobile">
                  Laptop & Mobile
                </span>
              )}
            </div>
          </div>

          <div className="game-header-actions">
            {/* Single Toggle Button: Mobile <-> Laptop/Wide */}
            <button
              type="button"
              className={`action-icon-btn mode-toggle-btn ${viewMode === "wide" ? "is-wide" : ""}`}
              onClick={() => setViewMode((m) => (m === "mobile" ? "wide" : "mobile"))}
              title={viewMode === "mobile" ? "Expand to Laptop View (1040px)" : "Switch to Mobile Phone View (420px)"}
            >
              {viewMode === "mobile" ? <FaDesktop /> : <FaMobileAlt />}
            </button>

            {/* Restart Game */}
            <button
              type="button"
              className="action-icon-btn reload-btn"
              onClick={handleReload}
              title="Restart Game"
            >
              <FaRedoAlt />
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              className="action-icon-btn fs-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>

            {/* Close */}
            <button
              type="button"
              className="action-icon-btn close-btn"
              onClick={handleClose}
              title="Close Game"
            >
              <FaTimes />
            </button>
          </div>
        </header>

        {/* IFRAME VIEWPORT STAGE */}
        <div className="game-stage-viewport">
          {isLoading && (
            <div className="stage-loader">
              <FaSpinner className="spin-icon" />
              <span>LAUNCHING {game.title.toUpperCase()}...</span>
            </div>
          )}

          {loadError && (
            <div className="stage-error">
              <FaExclamationTriangle className="error-icon" />
              <h4>Unable to load {game.title}</h4>
              <p>The game server might be loading slowly or network blocked.</p>
              <div className="error-buttons">
                <button type="button" onClick={handleReload} className="btn-retry">
                  <FaRedoAlt /> Retry
                </button>
                <a
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-open-tab"
                >
                  <FaExternalLinkAlt /> Open Direct
                </a>
              </div>
            </div>
          )}

          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={game.url}
            title={game.title}
            className="game-iframe-element"
            allow="fullscreen; autoplay; gamepad; accelerometer; gyroscope; payment"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setLoadError(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GameModal;
