import React, { useState, useEffect, useRef } from "react";
import "./AuthModal.scss";
import { 
  FaTimes, 
  FaShieldAlt, 
  FaSpinner, 
  FaPhoneAlt, 
  FaArrowLeft, 
  FaUser, 
  FaCheckCircle, 
  FaKey, 
  FaRedoAlt,
  FaBolt,
  FaCommentDots
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";
import { sendOtp, verifyOtp } from "../../services/authService.js";
import { SUBSCRIPTION_PACKAGES } from "../../config/subscriptionPlans.js";
import {
  isValidLocalPhoneInput,
  shouldUseHeFlow,
  startCgwByNetwork,
} from "../../config/subscription.js";

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  // Step: 1 = Phone number, 2 = OTP verification, 3 = Name/Profile, 4 = Subscription selection
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [simulatedSmsOtp, setSimulatedSmsOtp] = useState(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [name, setName] = useState("");
  const [packages, setPackages] = useState(SUBSCRIPTION_PACKAGES);
  const [selectedPkgId, setSelectedPkgId] = useState("pack_weekly");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const { loginSuccess } = useAuth();
  const otpInputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setPhoneNumber("");
      setOtpDigits(["", "", "", ""]);
      setSimulatedSmsOtp(null);
      setName("");
      setErrorMessage("");
      setLoading(false);
      setAuthenticatedUser(null);
    }
  }, [isOpen]);

  // Resend OTP countdown timer
  useEffect(() => {
    let interval = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const selectedPackage = packages.find((p) => p.id === selectedPkgId) || packages[0];

  // STEP 1: Send OTP to Phone Number
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    const cleanNum = phoneNumber.trim().replace(/\s+/g, "").replace(/^0/, "").replace(/^\+?233/, "");
    if (!cleanNum || cleanNum.length < 8 || !/^\d+$/.test(cleanNum)) {
      setErrorMessage("Please enter a valid MTN Ghana mobile number");
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(cleanNum);
      setPhoneNumber(cleanNum);
      setSimulatedSmsOtp(res.otp);
      setOtpDigits(["", "", "", ""]);
      setResendTimer(30);
      setStep(2);

      // Auto focus first OTP input box on next tick
      setTimeout(() => {
        if (otpInputRefs[0]?.current) {
          otpInputRefs[0].current.focus();
        }
      }, 150);
    } catch (err) {
      console.error("Send OTP error:", err);
      setErrorMessage(err.message || "Failed to send OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle individual OTP digit typing
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto move to next input if digit entered
    if (value && index < 3) {
      otpInputRefs[index + 1]?.current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{4}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtpDigits(digits);
      otpInputRefs[3]?.current?.focus();
    }
  };

  const handleAutoFillSimulatedOtp = () => {
    if (simulatedSmsOtp && simulatedSmsOtp.length === 4) {
      setOtpDigits(simulatedSmsOtp.split(""));
      otpInputRefs[3]?.current?.focus();
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    const fullOtp = otpDigits.join("");
    if (fullOtp.length < 4) {
      setErrorMessage("Please enter the 4-digit verification code");
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `+233${phoneNumber}`;
      const authRes = await verifyOtp(phoneNumber, fullOtp, name.trim() || undefined);
      
      if (authRes?.user) {
        setAuthenticatedUser(authRes.user);
        setName(authRes.user.username || "");
        
        // If user already has a configured name, move straight to package selection or finish
        if (authRes.user.username && !authRes.user.username.startsWith("Gamer_") && !authRes.user.username.startsWith("Player_")) {
          loginSuccess(authRes.user, authRes.tokens || 0, authRes.subscription);
          if (onLoginSuccess) {
            onLoginSuccess(authRes.user.username);
          }
          setStep(4);
        } else {
          setStep(3);
        }
      }
    } catch (err) {
      console.error("Verify OTP error:", err);
      setErrorMessage(err.message || "Invalid OTP code. Please check SMS or enter '1234'.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Confirm Profile / Name
  const handleProceedName = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    const gamerName = name.trim();
    if (!gamerName) {
      setErrorMessage("Please enter your name or gamer tag");
      return;
    }

    setLoading(true);
    try {
      const updatedUser = {
        ...authenticatedUser,
        username: gamerName,
      };
      loginSuccess(updatedUser, 999, authenticatedUser?.subscription);
      if (onLoginSuccess) {
        onLoginSuccess(gamerName);
      }
      setStep(4);
    } catch (err) {
      setErrorMessage(err.message || "Failed to update gamer profile");
    } finally {
      setLoading(false);
    }
  };

  // STEP 4: Confirm Subscription Package via MTN HE / NHE
  const handleConfirmSubscription = async () => {
    setErrorMessage("");
    const useHe = shouldUseHeFlow();
    const msisdn = phoneNumber || authenticatedUser?.phoneNumber || "";

    if (!useHe && !isValidLocalPhoneInput(msisdn.replace(/^\+?233/, ""))) {
      setErrorMessage("Please enter a valid MTN Ghana mobile number");
      return;
    }

    setLoading(true);
    try {
      localStorage.setItem("offerCode", selectedPackage.offerCode);
      localStorage.setItem("selectedPlanId", selectedPackage.id);
      startCgwByNetwork(msisdn, selectedPackage.offerCode, selectedPackage.planKey);
    } catch (err) {
      console.error("Subscription redirect error:", err);
      setErrorMessage(err.message || "Subscription failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          className="close-btn" 
          onClick={onClose} 
          aria-label="Close modal" 
          disabled={loading}
        >
          <FaTimes />
        </button>

        {/* STEP 1: MOBILE NUMBER ENTRY */}
        {step === 1 && (
          <div className="sub-step-phone">
            <h2 className="modal-title">Sign In / Register</h2>
            <p className="step-subtitle">Instant OTP verification to your MTN mobile number</p>

            {errorMessage && (
              <div className="error-banner">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSendOtp} className="phone-form">
              <label className="input-label" htmlFor="auth-mtn-phone-input">
                MTN Mobile Number
              </label>

              <div className="phone-input-group">
                <span className="country-prefix">+233</span>
                <input
                  id="auth-mtn-phone-input"
                  type="tel"
                  className="phone-input"
                  placeholder="e.g. 54 123 4567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  autoFocus
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="proceed-yellow-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spin-icon" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <FaKey />
                    <span>Get OTP Verification Code</span>
                  </>
                )}
              </button>
            </form>

            <div className="security-note">
              <FaShieldAlt className="shield-icon" />
              <span>Official MTN Ghana SMS Gateway & Session Authentication</span>
            </div>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 2 && (
          <div className="sub-step-phone">
            <div className="step-header-row">
              <button 
                className="back-btn" 
                onClick={() => setStep(1)} 
                disabled={loading}
                type="button"
                title="Change Number"
              >
                <FaArrowLeft />
              </button>
              <h2 className="modal-title">Enter OTP</h2>
            </div>

            <div className="selected-phone-pill">
              <span className="phone-tag"><FaPhoneAlt /> +233 {phoneNumber}</span>
              <button 
                type="button" 
                className="change-num-btn" 
                onClick={() => setStep(1)}
                disabled={loading}
              >
                Change
              </button>
            </div>

            {/* SIMULATED SMS TOAST BANNER */}
            {simulatedSmsOtp && (
              <div className="simulated-sms-banner" onClick={handleAutoFillSimulatedOtp} title="Click to auto-fill OTP">
                <div className="sms-icon-col">
                  <FaCommentDots className="sms-icon" />
                </div>
                <div className="sms-content-col">
                  <span className="sms-sender">📲 MTN SMS NOTIFICATION</span>
                  <span className="sms-text">
                    Your THE Gameio verification OTP is <strong className="otp-highlight">{simulatedSmsOtp}</strong>. (Tap to fill)
                  </span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="error-banner">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="phone-form">
              <label className="input-label">
                4-Digit Verification Code
              </label>

              <div className="otp-digit-inputs" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpInputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className={`otp-box ${digit ? "filled" : ""}`}
                    disabled={loading}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <div className="resend-row">
                {resendTimer > 0 ? (
                  <span className="timer-text">Resend code in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    className="resend-btn"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    <FaRedoAlt /> Resend OTP
                  </button>
                )}
                <button
                  type="button"
                  className="test-code-btn"
                  onClick={() => setOtpDigits(["1", "2", "3", "4"])}
                >
                  Use test code: 1234
                </button>
              </div>

              <button 
                type="submit" 
                className="proceed-yellow-btn"
                disabled={loading || otpDigits.join("").length < 4}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spin-icon" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    <span>Verify & Sign In</span>
                  </>
                )}
              </button>
            </form>

            <div className="security-note">
              <FaShieldAlt className="shield-icon" />
              <span>256-Bit Encrypted Mobile Verification</span>
            </div>
          </div>
        )}

        {/* STEP 3: NAME / GAMER TAG ENTRY */}
        {step === 3 && (
          <div className="sub-step-phone">
            <div className="step-header-row">
              <button 
                className="back-btn" 
                onClick={() => setStep(2)} 
                disabled={loading}
                type="button"
              >
                <FaArrowLeft />
              </button>
              <h2 className="modal-title">Gamer Profile</h2>
            </div>

            <div className="selected-phone-pill">
              <span className="phone-tag"><FaPhoneAlt /> +233 {phoneNumber}</span>
              <span className="signed-in-badge"><FaCheckCircle /> Phone Verified</span>
            </div>

            {errorMessage && (
              <div className="error-banner">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleProceedName} className="phone-form">
              <label className="input-label" htmlFor="auth-name-input">
                Choose your gamer username
              </label>

              <div className="name-input-group">
                <FaUser className="user-icon" />
                <input
                  id="auth-name-input"
                  type="text"
                  className="name-input"
                  placeholder="e.g. Kwame or CYBERNINJA"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="proceed-yellow-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spin-icon" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  "Continue to Subscription Plans"
                )}
              </button>
            </form>

            <div className="security-note">
              <FaShieldAlt className="shield-icon" />
              <span>Your gamer identity for rankings and rewards</span>
            </div>
          </div>
        )}

        {/* STEP 4: CHOOSE SUBSCRIPTION PLAN (UNLIMITED TIME ACCESS) */}
        {step === 4 && (
          <div className="sub-step-package">
            <div className="package-step-header">
              <h2 className="modal-title">Select Subscription</h2>
            </div>

            <div className="selected-phone-pill">
              <span className="phone-tag"><FaUser /> {name || "Player"} (+233 {phoneNumber})</span>
              <span className="signed-in-badge"><FaCheckCircle /> Signed In</span>
            </div>

            <p className="plan-helper-text">
              Choose your access pass for unlimited uninterrupted play across all games!
            </p>

            {errorMessage && (
              <div className="error-banner">
                {errorMessage}
              </div>
            )}

            <div className="packages-selection-list">
              {packages.map((pkg) => {
                const isSelected = pkg.id === selectedPkgId;
                return (
                  <div
                    key={pkg.id}
                    className={`package-card ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedPkgId(pkg.id)}
                  >
                    <div className="pkg-left">
                      <div className="radio-indicator">
                        {isSelected && <div className="radio-dot"></div>}
                      </div>
                      <div className="pkg-info">
                        <div className="pkg-name">
                          {pkg.name}
                        </div>
                        <div className="pkg-desc">
                          {pkg.desc}
                        </div>
                      </div>
                    </div>

                    <div className="pkg-right">
                      <div className="pkg-price">
                        {pkg.price} {pkg.currency || "GHS"}
                      </div>
                      {pkg.popular && (
                        <span className="popular-badge">POPULAR</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="package-actions">
              <button
                type="button"
                className="proceed-yellow-btn confirm-btn"
                onClick={handleConfirmSubscription}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spin-icon" />
                    <span>Activating Subscription...</span>
                  </>
                ) : (
                  <span>
                    Proceed to Subscribe ({selectedPackage.price} {selectedPackage.currency || "GHS"})
                  </span>
                )}
              </button>

              <button 
                type="button" 
                className="back-text-btn" 
                onClick={onClose}
                disabled={loading}
              >
                Skip to Games & Profile
              </button>
            </div>

            <div className="security-note">
              <FaShieldAlt className="shield-icon" />
              <span>Instant activation • 256-Bit Encrypted • Safe & Secure</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
