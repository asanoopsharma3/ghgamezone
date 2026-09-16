const CGW_SESSION_KEY = "ghgz_cgw_session";
const PLAY_SESSION_KEY = "ghgz_play_access";
const MUST_SUBSCRIBE_KEY = "ghgz_must_subscribe";

export const isMustSubscribe = () => localStorage.getItem(MUST_SUBSCRIBE_KEY) === "1";

export const clearMustSubscribe = () => {
  localStorage.removeItem(MUST_SUBSCRIBE_KEY);
};

export const markMustSubscribe = () => {
  localStorage.setItem(MUST_SUBSCRIBE_KEY, "1");
  sessionStorage.removeItem(PLAY_SESSION_KEY);
};

export const isSubscriptionValid = (subscription) => {
  if (isMustSubscribe()) return false;
  if (!subscription) return false;
  if (subscription.active === false) return false;
  if (subscription.expiresAt) {
    return new Date(subscription.expiresAt).getTime() > Date.now();
  }
  return subscription.active === true;
};

export const getSubscriptionFromSession = (session) =>
  session?.subscription || session?.user?.subscription || null;

export const readStoredCgwSession = () => {
  try {
    const raw = localStorage.getItem(CGW_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const readSessionPlayAccess = () => {
  try {
    const raw = sessionStorage.getItem(PLAY_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const persistPlayAccess = (sessionPayload) => {
  const subscription = getSubscriptionFromSession(sessionPayload);
  const record = {
    active: true,
    planId: subscription?.planId || sessionPayload?.planId || "",
    planKey: subscription?.planKey || "",
    expiresAt: subscription?.expiresAt || null,
    token: sessionPayload?.token || "",
  };
  sessionStorage.setItem(PLAY_SESSION_KEY, JSON.stringify(record));
};

export const clearPlayAccess = () => {
  sessionStorage.removeItem(PLAY_SESSION_KEY);
};

export const revokeLocalSubscription = () => {
  markMustSubscribe();
  localStorage.removeItem(CGW_SESSION_KEY);
  localStorage.removeItem("offerCode");
  localStorage.removeItem("selectedPlanId");
};

export const isRemoteDeactivated = (payload) => {
  const sub = payload?.subscription || payload;
  if (!sub) return false;
  if (sub.deactivated === true) return true;
  const sdpStatus = String(sub.sdpStatus || "").trim().toUpperCase();
  return sdpStatus === "D";
};

export const hasActivePlayAccess = (subscription) => {
  if (isMustSubscribe()) return false;
  if (isSubscriptionValid(subscription)) return true;

  const stored = readStoredCgwSession();
  if (isSubscriptionValid(getSubscriptionFromSession(stored))) return true;

  const sessionAccess = readSessionPlayAccess();
  if (!sessionAccess?.active) return false;
  if (sessionAccess.expiresAt) {
    return new Date(sessionAccess.expiresAt).getTime() > Date.now();
  }
  return true;
};
