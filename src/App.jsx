import React, { useState, useRef, useCallback, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Games from "./Pages/Games/Games";
import CategoryGames from "./Pages/CategoryGames/CategoryGames";
import About from "./Pages/About/About";
import HowToPlay from "./Pages/HowToPlay/HowToPlay";
import Contact from "./Pages/Contact/Contact";
import Leaderboard from "./Pages/Leaderboard/Leaderboard";
import SubscribeModal from "./components/SubscribeModal/SubscribeModal";
import PolicyModal from "./components/PolicyModal/PolicyModal";
import GameModal from "./components/GameModal/GameModal";
import { getGameByTitleOrSlug } from "./data/gamesCatalog";
import { useAuth } from "./context/AuthContext.jsx";
import { deductToken } from "./services/tokenService.js";
import { INITIAL_OFFER_CODE, normalizeGhanaMsisdn } from "./config/subscription.js";
import { getPlanByOfferCode } from "./config/subscriptionPlans.js";
import { resolveCgwCallbackNotice } from "./utils/cgwStatus.js";
import "./App.scss";

function App() {
  const { isSubscribed, applyCgwSession } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  
  const [selectedPolicyType, setSelectedPolicyType] = useState("Terms & Conditions");
  const [selectedGameTitle, setSelectedGameTitle] = useState("");
  const [activeGameObj, setActiveGameObj] = useState(null);
  const [pendingGameObj, setPendingGameObj] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const isDeductingRef = useRef(false);
  const callbackHandledRef = useRef(false);

  const showToast = useCallback((msg, duration = 4000) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), duration);
  }, []);

  /**
   * Time-based Unlimited Game Play Initiation:
   * 1. If not logged in or no active subscription -> Prompt Subscription Modal (Daily / Weekly / Monthly)
   * 2. If active subscription -> Launch embedded game iframe with unlimited play!
   */
  const handleGameClick = useCallback(async (titleOrGame) => {
    const targetGame = typeof titleOrGame === "string" 
      ? getGameByTitleOrSlug(titleOrGame) 
      : titleOrGame || getGameByTitleOrSlug("");

    setSelectedGameTitle(targetGame.title);

    // 1. Not logged in or not subscribed -> Open Subscribe Modal directly
    if (!isSubscribed) {
      setPendingGameObj(targetGame);
      setIsSubscribeOpen(true);
      return;
    }

    // 2. Prevent race conditions
    if (isDeductingRef.current) return;

    try {
      isDeductingRef.current = true;
      const result = await deductToken();

      setActiveGameObj(targetGame);
      setIsGameOpen(true);
      showToast(`🎮 Launching ${targetGame.title} (Unlimited Play Active)`);
    } catch (err) {
      console.error("Game launch error:", err);
      showToast(err.message || "Please subscribe to get unlimited daily/weekly access.");
      setPendingGameObj(targetGame);
      setIsSubscribeOpen(true);
    } finally {
      isDeductingRef.current = false;
    }
  }, [isSubscribed, showToast]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (
      location.pathname === "/subscribe" ||
      params.get("fallback") === "true" ||
      params.get("subscribe") === "true"
    ) {
      setIsSubscribeOpen(true);
    }
  }, [location.search, location.pathname]);

  useEffect(() => {
    if (!location.pathname.includes("/activation/callback") || callbackHandledRef.current) return;
    callbackHandledRef.current = true;

    const params = new URLSearchParams(location.search);
    const notice = resolveCgwCallbackNotice(params);
    const token = params.get("token");
    const offerCode = params.get("offerCode") || localStorage.getItem("offerCode") || INITIAL_OFFER_CODE;
    const msisdn = normalizeGhanaMsisdn(params.get("msisdn") || localStorage.getItem("phone") || "");
    const planId = params.get("plan") || localStorage.getItem("selectedPlanId");
    const isSuccess = notice.success && Boolean(token);

    navigate("/", { replace: true });

    if (isSuccess && token) {
      applyCgwSession({ token, msisdn, offerCode, planId });
      const plan = getPlanByOfferCode(offerCode);
      showToast(
        notice.message === "Success"
          ? `Successfully subscribed to ${plan?.name || "THE Gameio"}! Unlimited play is active.`
          : notice.message
      );
      return;
    }

    showToast(notice.message || "Subscription could not be completed. Please try again.");
    setIsSubscribeOpen(true);
  }, [location.pathname, location.search, applyCgwSession, navigate, showToast]);

  const handleBuyAttemptsClick = () => {
    setSelectedGameTitle("");
    setIsSubscribeOpen(true);
  };

  const handlePolicyClick = (type) => {
    setSelectedPolicyType(type || "Terms & Conditions");
    setIsPolicyOpen(true);
  };

  // Called after payment confirmed and subscription activated in database
  const handleSubscribeSuccess = (planName) => {
    showToast(`🎉 Successfully Subscribed to ${planName || "THE Gameio"}! Unlimited Play Active.`);

    if (pendingGameObj) {
      const g = pendingGameObj;
      setPendingGameObj(null);
      setTimeout(() => {
        handleGameClick(g);
      }, 500);
    }
  };

  return (
    <div className="app-container">
      {toastMessage && (
        <div className="global-toast-notification">
          <span>{toastMessage}</span>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <Home
              onGameClick={handleGameClick}
              onSubscribeClick={handleBuyAttemptsClick}
              onPolicyClick={handlePolicyClick}
            />
          }
        />
        <Route
          path="/activation/callback"
          element={
            <Home
              onGameClick={handleGameClick}
              onSubscribeClick={handleBuyAttemptsClick}
              onPolicyClick={handlePolicyClick}
            />
          }
        />
        <Route
          path="/subscribe"
          element={
            <Home
              onGameClick={handleGameClick}
              onSubscribeClick={handleBuyAttemptsClick}
              onPolicyClick={handlePolicyClick}
            />
          }
        />
        <Route
          path="/games"
          element={
            <Games
              onGameClick={handleGameClick}
              onBuyAttemptsClick={handleBuyAttemptsClick}
            />
          }
        />
        <Route
          path="/category/:categorySlug"
          element={
            <CategoryGames
              onGameClick={handleGameClick}
              onSubscribeClick={handleBuyAttemptsClick}
              onFooterPolicyClick={handlePolicyClick}
            />
          }
        />
        <Route
          path="/about"
          element={
            <About
              onSubscribeClick={handleBuyAttemptsClick}
              onPolicyClick={handlePolicyClick}
            />
          }
        />
        <Route
          path="/how-to-play"
          element={
            <HowToPlay
              onSubscribeClick={handleBuyAttemptsClick}
              onPolicyClick={handlePolicyClick}
            />
          }
        />
        <Route
          path="/contact"
          element={
            <Contact
              onSubscribeClick={handleBuyAttemptsClick}
              onPolicyClick={handlePolicyClick}
            />
          }
        />
        <Route
          path="/leaderboard"
          element={
            <Leaderboard
              onSubscribeClick={handleBuyAttemptsClick}
              onPolicyClick={handlePolicyClick}
            />
          }
        />
        <Route path="/profile" element={<Navigate to="/" replace />} />
      </Routes>

      {/* POPUP MODALS */}
      <GameModal
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
        game={activeGameObj}
        turnsRemaining={null}
        onBuyTokensClick={() => {
          setIsGameOpen(false);
          setIsSubscribeOpen(true);
        }}
        onPlayAgain={(game) => {
          setIsGameOpen(false);
          setTimeout(() => {
            handleGameClick(game);
          }, 200);
        }}
      />

      <SubscribeModal
        isOpen={isSubscribeOpen}
        onClose={() => {
          setIsSubscribeOpen(false);
          setPendingGameObj(null);
        }}
        gameTitle={selectedGameTitle}
        onSubscribeSuccess={handleSubscribeSuccess}
      />

      <PolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        policyType={selectedPolicyType}
      />
    </div>
  );
}

export default App;