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
import { INITIAL_OFFER_CODE, normalizeGhanaMsisdn } from "./config/subscription.js";
import { getPlanByOfferCode } from "./config/subscriptionPlans.js";
import { resolveCgwCallbackNotice } from "./utils/cgwStatus.js";
import "./App.scss";

function App() {
  const { isSubscribed, loading, applyCgwSession } = useAuth();
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
   * Active daily / weekly / monthly access launches the game.
   * Choose Package only appears when there is no valid session subscription.
   */
  const handleGameClick = useCallback(async (titleOrGame) => {
    const targetGame = typeof titleOrGame === "string" 
      ? getGameByTitleOrSlug(titleOrGame) 
      : titleOrGame || getGameByTitleOrSlug("");

    setSelectedGameTitle(targetGame.title);

    if (loading) {
      setPendingGameObj(targetGame);
      return;
    }

    if (!isSubscribed) {
      setPendingGameObj(targetGame);
      setIsSubscribeOpen(true);
      return;
    }

    if (isDeductingRef.current) return;

    isDeductingRef.current = true;
    setActiveGameObj(targetGame);
    setIsGameOpen(true);
    showToast(`🎮 Launching ${targetGame.title} (Unlimited Play Active)`);
    isDeductingRef.current = false;
  }, [isSubscribed, loading, showToast]);

  useEffect(() => {
    if (loading || !pendingGameObj || isSubscribeOpen || isGameOpen) return;
    if (!isSubscribed) return;
    const g = pendingGameObj;
    setPendingGameObj(null);
    setSelectedGameTitle(g.title);
    setActiveGameObj(g);
    setIsGameOpen(true);
    showToast(`🎮 Launching ${g.title} (Unlimited Play Active)`);
  }, [loading, isSubscribed, pendingGameObj, isSubscribeOpen, isGameOpen, showToast]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (isSubscribed) return;
    if (
      location.pathname === "/subscribe" ||
      params.get("fallback") === "true" ||
      params.get("subscribe") === "true"
    ) {
      setIsSubscribeOpen(true);
    }
  }, [location.search, location.pathname, isSubscribed]);

  useEffect(() => {
    if (!location.pathname.includes("/activation/callback") || callbackHandledRef.current) return;
    callbackHandledRef.current = true;

    const params = new URLSearchParams(location.search);
    const notice = resolveCgwCallbackNotice(params);
    const token = params.get("token");
    const offerCode = params.get("offerCode") || localStorage.getItem("offerCode") || INITIAL_OFFER_CODE;
    const msisdn = normalizeGhanaMsisdn(params.get("msisdn") || localStorage.getItem("phone") || "");
    const planId = params.get("plan") || localStorage.getItem("selectedPlanId");
    const alreadySubscribed = /already subscribed/i.test(notice.message || "");
    const isSuccess = notice.success;

    navigate("/", { replace: true });

    if (isSuccess) {
      applyCgwSession({
        token: token || `cgw_session_${Date.now()}`,
        msisdn,
        offerCode,
        planId,
      });
      const plan = getPlanByOfferCode(offerCode);
      showToast(
        alreadySubscribed
          ? "You are already subscribed. Unlimited play is active."
          : notice.message === "Success"
            ? `Successfully subscribed to ${plan?.name || "THE Gameio"}! Unlimited play is active.`
            : notice.message
      );
      return;
    }

    showToast(notice.message || "Subscription could not be completed. Please try again.");
    setIsSubscribeOpen(true);
  }, [location.pathname, location.search, applyCgwSession, navigate, showToast]);

  const handleBuyAttemptsClick = () => {
    if (isSubscribed) {
      showToast("You already have an active daily, weekly, or monthly subscription. Play any game.");
      return;
    }
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