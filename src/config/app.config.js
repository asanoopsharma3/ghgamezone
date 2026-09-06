const trimTrailingSlash = (url) => String(url || "").replace(/\/+$/, "");

const env = import.meta.env;
const isProduction = env.PROD === true || env.MODE === "production";

const SITE_URL = trimTrailingSlash(
  env.VITE_SITE_URL || (isProduction ? "https://ghgamezone.com" : "http://localhost:5173")
);

const API_BASE_URL = trimTrailingSlash(
  env.VITE_API_BASE_URL || (isProduction ? "https://ghgamezone.com/api" : `${SITE_URL}/api`)
);

const CGW_ENV =
  String(env.VITE_CGW_ENV || "staging").toLowerCase() === "production"
    ? "production"
    : "staging";

const HE_REDIRECT_URL = env.VITE_HE_REDIRECT_URL || "http://98.71.49.187/Redirect";
const API_CALLBACK_URL = trimTrailingSlash(
  env.VITE_HE_CALLBACK_URL || `${API_BASE_URL}/callback`
);
const NHE_PORTAL_STAGING = "https://sitcgw.mtn.com.gh/Portal";
const NHE_PORTAL_PRODUCTION = "https://cg.mtn.com.gh/Portal";
const NHE_PORTAL_URL =
  env.VITE_NHE_PORTAL_URL ||
  (CGW_ENV === "production" ? NHE_PORTAL_PRODUCTION : NHE_PORTAL_STAGING);

const APP_RUNTIME = String(env.VITE_APP_ENV || (isProduction ? "production" : "local")).toLowerCase();
const LEADERBOARD_PACKAGE = String(env.VITE_LEADERBOARD_PACKAGE || "daily").toLowerCase();

const INITIAL_OFFER_CODE = env.VITE_OFFER_CODE || "9910110199";
const OFFER_CODE_DAILY = env.VITE_OFFER_CODE_DAILY || INITIAL_OFFER_CODE;
const OFFER_CODE_WEEKLY = env.VITE_OFFER_CODE_WEEKLY || INITIAL_OFFER_CODE;
const OFFER_CODE_MONTHLY = env.VITE_OFFER_CODE_MONTHLY || INITIAL_OFFER_CODE;

export const APP_CONFIG = {
  environment: isProduction ? "production" : "development",
  appEnv: APP_RUNTIME,
  siteUrl: SITE_URL,
  apiBaseUrl: `${API_BASE_URL}/v1`,
  isProduction,
  useDummyLeaderboard: APP_RUNTIME === "local" || APP_RUNTIME === "development",
  leaderboardPackage: ["daily", "weekly", "monthly"].includes(LEADERBOARD_PACKAGE)
    ? LEADERBOARD_PACKAGE
    : "daily",
  endpoints: {
    subscriptionStatus: "/subscription/status",
    subscriptionDevActivate: "/subscription/dev-activate",
    leaderboardSubscribers: "/leaderboard/subscribers",
  },
  cgw: {
    initialOfferCode: INITIAL_OFFER_CODE,
    offerCodeDaily: OFFER_CODE_DAILY,
    offerCodeWeekly: OFFER_CODE_WEEKLY,
    offerCodeMonthly: OFFER_CODE_MONTHLY,
    env: CGW_ENV,
    heRedirectUrl: HE_REDIRECT_URL,
    heCallbackUrl: API_CALLBACK_URL,
    nhePortalStaging: NHE_PORTAL_STAGING,
    nhePortalProduction: NHE_PORTAL_PRODUCTION,
    nhePortalUrl: NHE_PORTAL_URL,
    callbackUrl: API_CALLBACK_URL,
    forceHe: env.VITE_FORCE_HE === "true",
    localSubscription: env.VITE_LOCAL_SUBSCRIPTION === "true",
    localHeMsisdn: env.VITE_LOCAL_HE_MSISDN || "",
  },
};

export const isDevelopmentEnv = () => APP_CONFIG.environment === "development";

export const getApiUrl = (endpoint) => `${APP_CONFIG.apiBaseUrl}${endpoint}`;
