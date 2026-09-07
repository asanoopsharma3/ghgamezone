import { APP_CONFIG, getApiUrl, isDevelopmentEnv } from "./app.config.js";

const getConnection = () => {
  if (typeof navigator === "undefined") return undefined;
  return navigator.connection || navigator.mozConnection || navigator.webkitConnection;
};

const getConnectionType = () => String(getConnection()?.type || "").toLowerCase();

export const INITIAL_OFFER_CODE = APP_CONFIG.cgw.initialOfferCode;
export const HE_REDIRECT_URL = APP_CONFIG.cgw.heRedirectUrl;
export const CGW_BACKEND_CALLBACK_URL = APP_CONFIG.cgw.callbackUrl;
/** NHE always uses SIT Portal. HE never uses this URL. */
export const CGW_NHE_PORTAL_URL = APP_CONFIG.cgw.nhePortalStaging;
export const FORCE_HE = isDevelopmentEnv() && APP_CONFIG.cgw.forceHe;
export const COUNTRY_CODE = "233";
export const PHONE_INPUT_MAX_LENGTH = 9;

export const isWifiOrLanConnection = () => {
  const connectionType = getConnectionType();
  return (
    connectionType === "wifi" ||
    connectionType === "ethernet" ||
    connectionType === "bluetooth" ||
    connectionType === "mixed" ||
    connectionType === "other" ||
    connectionType === "none"
  );
};

export const isMobileDevice = () => {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;
  if (navigator.userAgentData?.mobile === true) return true;
  const ua = navigator.userAgent || "";
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Silk|SamsungBrowser/i.test(ua)) {
    return true;
  }
  return Boolean(window.matchMedia?.("(max-width: 729px)")?.matches);
};

export const isMobileNetworkCandidate = () => {
  if (isWifiOrLanConnection()) return false;
  return getConnectionType() === "cellular";
};

export const shouldUseHeFlow = () => {
  if (FORCE_HE) return true;
  if (isWifiOrLanConnection()) return false;
  return isMobileNetworkCandidate();
};

export const subscribeToNetworkFlowChange = (onChange) => {
  if (typeof window === "undefined") return () => undefined;

  const connection = getConnection();
  connection?.addEventListener?.("change", onChange);
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);

  return () => {
    connection?.removeEventListener?.("change", onChange);
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
};

const cleanAbsoluteUrl = (url) => url.replace(/([^:]\/)\/+/g, "$1");

const HE_CALLBACK_BASE = (APP_CONFIG.cgw.heCallbackUrl || CGW_BACKEND_CALLBACK_URL).replace(/\/+$/, "");

const buildCallbackUrl = (flow, planId) => {
  const callbackUrl = new URL(cleanAbsoluteUrl(HE_CALLBACK_BASE));
  callbackUrl.searchParams.set("flow", flow);
  if (planId) callbackUrl.searchParams.set("plan", planId);
  return callbackUrl.toString();
};

export const normalizeGhanaMsisdn = (phoneNumber) => {
  const digits = String(phoneNumber || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("233")) return digits;
  if (digits.startsWith("0")) return `233${digits.slice(1)}`;
  return `233${digits}`;
};

export const sanitizeLocalPhoneInput = (value) =>
  String(value || "").replace(/\D/g, "").slice(0, PHONE_INPUT_MAX_LENGTH);

export const isValidLocalPhoneInput = (value) =>
  sanitizeLocalPhoneInput(value).length === PHONE_INPUT_MAX_LENGTH;

export const getHeRedirectParams = (offerCode = INITIAL_OFFER_CODE, planId = "daily", msisdn = "") => {
  const rawMsisdn =
    msisdn || (FORCE_HE && APP_CONFIG.cgw.localHeMsisdn ? APP_CONFIG.cgw.localHeMsisdn : "");
  return {
    OfferCode: offerCode,
    msisdn: rawMsisdn ? normalizeGhanaMsisdn(rawMsisdn) : "",
    redirectUrl: buildCallbackUrl("HE", planId),
  };
};

export const startHeSubscription = (offerCode = INITIAL_OFFER_CODE, planId = "daily", msisdn = "") => {
  localStorage.setItem("offerCode", offerCode);
  localStorage.setItem("selectedPlanId", planId);
  const normalized = normalizeGhanaMsisdn(msisdn);
  if (normalized) localStorage.setItem("phone", normalized);
  const params = new URLSearchParams(getHeRedirectParams(offerCode, planId, msisdn));
  window.location.replace(`${HE_REDIRECT_URL}?${params.toString()}`);
};

export const startNheSubscription = (msisdn, offerCode = INITIAL_OFFER_CODE, planId = "daily") => {
  localStorage.setItem("offerCode", offerCode);
  localStorage.setItem("selectedPlanId", planId);
  const normalized = normalizeGhanaMsisdn(msisdn);
  if (normalized) localStorage.setItem("phone", normalized);

  const params = new URLSearchParams({
    OfferCode: offerCode,
    redirectUrl: buildCallbackUrl("NHE", planId),
    mobileNumber: normalized,
  });
  window.location.href = `${CGW_NHE_PORTAL_URL}?${params.toString()}`;
};

export const startCgwByNetwork = (msisdn, offerCode = INITIAL_OFFER_CODE, planId = "daily") => {
  if (shouldUseHeFlow()) {
    startHeSubscription(offerCode, planId, msisdn);
    return;
  }
  if (msisdn) {
    startNheSubscription(msisdn, offerCode, planId);
  }
};

export const LOCAL_SUBSCRIPTION_ENABLED =
  isDevelopmentEnv() && !FORCE_HE && APP_CONFIG.cgw.localSubscription;

export const activateLocalSubscription = async (msisdn, offerCode = INITIAL_OFFER_CODE) => {
  const response = await fetch(getApiUrl(APP_CONFIG.endpoints.subscriptionDevActivate), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ msisdn, offerCode }),
  });

  const data = (await response.json().catch(() => ({}))) || {};
  if (!response.ok || !data?.success || !data?.token) {
    throw new Error(data?.message || "Local subscription activation failed");
  }
  return data;
};
