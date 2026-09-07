import React, { useEffect, useState } from "react";
import "./SubscribeModal.scss";
import { FaTimes, FaShieldAlt, FaSpinner, FaBolt } from "react-icons/fa";
import { SUBSCRIPTION_PACKAGES } from "../../config/subscriptionPlans.js";
import {
  activateLocalSubscription,
  COUNTRY_CODE,
  isValidLocalPhoneInput,
  LOCAL_SUBSCRIPTION_ENABLED,
  PHONE_INPUT_MAX_LENGTH,
  sanitizeLocalPhoneInput,
  shouldUseHeFlow,
  startCgwByNetwork,
  subscribeToNetworkFlowChange,
} from "../../config/subscription.js";

const SubscribeModal = ({ isOpen, onClose, gameTitle, onSubscribeSuccess }) => {
  const [packages] = useState(SUBSCRIPTION_PACKAGES);
  const [selectedPkgId, setSelectedPkgId] = useState("pack_weekly");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(() => !shouldUseHeFlow());
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const sync = () => setShowPhoneInput(!shouldUseHeFlow());
    sync();
    return subscribeToNetworkFlowChange(sync);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage("");
    setIsProcessing(false);
    setShowPhoneInput(!shouldUseHeFlow());
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedPackage = packages.find((pkg) => pkg.id === selectedPkgId) || packages[0];

  const handleConfirmSubscription = async () => {
    setErrorMessage("");

    if (showPhoneInput && !isValidLocalPhoneInput(phoneNumber)) {
      setErrorMessage("Please enter a valid MTN Ghana mobile number");
      return;
    }

    setIsProcessing(true);

    try {
      const offerCode = selectedPackage.offerCode;
      const planId = selectedPackage.planKey;
      const msisdn = showPhoneInput ? `${COUNTRY_CODE}${sanitizeLocalPhoneInput(phoneNumber)}` : "";

      localStorage.setItem("offerCode", offerCode);
      localStorage.setItem("selectedPlanId", selectedPackage.id);

      if (LOCAL_SUBSCRIPTION_ENABLED) {
        const result = await activateLocalSubscription(msisdn, offerCode);
        const params = new URLSearchParams({
          token: result.token,
          status: "success",
          offerCode: result.offerCode || offerCode,
          msisdn: result.msisdn || msisdn,
          plan: planId,
        });
        window.location.href = `/activation/callback?${params.toString()}`;
        return;
      }

      startCgwByNetwork(msisdn, offerCode, planId);
    } catch (err) {
      console.error("Subscription redirect error:", err);
      setErrorMessage(err.message || "Subscription failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="subscribe-modal-overlay" onClick={onClose}>
      <div className="subscribe-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal" disabled={isProcessing}>
          <FaTimes />
        </button>

        <div className="sub-step-package">
          <div className="package-step-header">
            <h2 className="modal-title">Choose Package</h2>
          </div>

          {gameTitle && (
            <p className="game-hint">
              Unlock unlimited access for <span>{gameTitle}</span>
            </p>
          )}

          {showPhoneInput ? (
            <div className="nhe-phone-block">
              <label className="input-label" htmlFor="subscribe-mtn-phone">
                MTN Mobile number
              </label>
              <div className="phone-input-group">
                <span className="country-prefix">+{COUNTRY_CODE}</span>
                <input
                  id="subscribe-mtn-phone"
                  type="tel"
                  inputMode="numeric"
                  className="phone-input"
                  placeholder="e.g. 541234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(sanitizeLocalPhoneInput(e.target.value))}
                  maxLength={PHONE_INPUT_MAX_LENGTH}
                  autoComplete="tel-national"
                  disabled={isProcessing}
                />
              </div>
            </div>
          ) : (
            <p className="he-auto-note">MTN mobile data detected. Your number will be applied automatically.</p>
          )}

          {errorMessage && <div className="error-banner">{errorMessage}</div>}

          <div className="packages-selection-list">
            {packages.map((pkg) => {
              const isSelected = pkg.id === selectedPkgId;
              return (
                <div
                  key={pkg.id}
                  className={`package-card ${isSelected ? "selected" : ""}`}
                  onClick={() => !isProcessing && setSelectedPkgId(pkg.id)}
                >
                  <div className="pkg-left">
                    <div className="radio-indicator">{isSelected && <div className="radio-dot"></div>}</div>
                    <div className="pkg-info">
                      <div className="pkg-name">{pkg.name}</div>
                      <div className="pkg-desc">{pkg.desc}</div>
                    </div>
                  </div>
                  <div className="pkg-right">
                    <div className="pkg-price">
                      {pkg.price} {pkg.currency || "GHS"}
                    </div>
                    {pkg.popular && <span className="popular-badge">POPULAR</span>}
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
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="spin-icon" />
                  <span>Redirecting to MTN...</span>
                </>
              ) : (
                <>
                  <FaBolt />
                  <span>
                    Subscribe ({selectedPackage.price} {selectedPackage.currency || "GHS"})
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="security-note">
            <FaShieldAlt className="shield-icon" />
            <span>Official MTN Ghana Consent Gateway • Instant activation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribeModal;
