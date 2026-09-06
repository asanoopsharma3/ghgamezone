import React, { createContext, useReducer, useEffect, useCallback } from "react";
import { getCurrentUser } from "../services/authService";
import { getToken, clearToken, setToken } from "../services/api";
import { isSubscriptionValid } from "../services/mockBackend";
import {
  buildSubscriptionFromPlan,
  getPlanById,
  getPlanByOfferCode,
} from "../config/subscriptionPlans.js";
import { normalizeGhanaMsisdn } from "../config/subscription.js";

const initialState = {
  user: null,
  subscription: null,
  tokens: 0,
  maxTokens: 100,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "LOGIN_SUCCESS": {
      const user = action.payload.user;
      const subscription = action.payload.subscription || user?.subscription || null;
      return {
        ...state,
        user: user,
        subscription: subscription,
        tokens: action.payload.tokens ?? (isSubscriptionValid(subscription) ? 999 : (user?.tokens ?? 0)),
        loading: false,
        error: null,
      };
    }
    case "LOGOUT":
      return { ...initialState, loading: false };
    case "SET_TOKENS":
      return { ...state, tokens: action.payload };
    case "SET_SUBSCRIPTION": {
      const sub = action.payload;
      return {
        ...state,
        subscription: sub,
        tokens: isSubscriptionValid(sub) ? 999 : state.tokens,
        user: state.user ? { ...state.user, subscription: sub } : state.user,
      };
    }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();
      if (!token) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }
      try {
        const userData = await getCurrentUser();
        const user = userData.user || userData;
        const subscription = userData.subscription || user?.subscription || null;
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: {
            user: user,
            subscription: subscription,
            tokens: userData.tokens ?? (isSubscriptionValid(subscription) ? 999 : (user?.tokens ?? 0)),
          },
        });
      } catch {
        clearToken();
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    restoreSession();
  }, []);

  const loginSuccess = useCallback((user, tokens, subscription) => {
    dispatch({ 
      type: "LOGIN_SUCCESS", 
      payload: { 
        user, 
        tokens, 
        subscription: subscription || user?.subscription || null 
      } 
    });
  }, []);

  const applyCgwSession = useCallback((payload) => {
    const token = payload?.token;
    const msisdn = normalizeGhanaMsisdn(payload?.msisdn || localStorage.getItem("phone") || "");
    const offerCode = payload?.offerCode || localStorage.getItem("offerCode") || "";
    const plan =
      getPlanById(payload?.planId || payload?.plan || localStorage.getItem("selectedPlanId")) ||
      getPlanByOfferCode(offerCode);
    const subscription = buildSubscriptionFromPlan(plan, {
      expiresAt: payload?.expiresAt,
    });
    const user = {
      id: `cgw_${msisdn || "he"}`,
      username: msisdn ? `Player_${msisdn.slice(-4)}` : "Player",
      phoneNumber: msisdn ? `+${msisdn}` : "",
      email: msisdn ? `${msisdn}@ghgamezone.com` : "player@ghgamezone.com",
      role: "MEMBER",
      avatar: "/avatars/avatar.png",
      subscription,
    };

    if (token) setToken(token);
    if (msisdn) localStorage.setItem("phone", msisdn);
    if (offerCode) localStorage.setItem("offerCode", offerCode);
    localStorage.setItem("selectedPlanId", plan.id);
    localStorage.setItem(
      "ghgz_cgw_session",
      JSON.stringify({ user, subscription, token: token || getToken() })
    );

    dispatch({
      type: "LOGIN_SUCCESS",
      payload: { user, tokens: 999, subscription },
    });

    return { user, subscription };
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("ghgz_cgw_session");
    localStorage.removeItem("offerCode");
    localStorage.removeItem("selectedPlanId");
    dispatch({ type: "LOGOUT" });
  }, []);

  const updateTokens = useCallback((newBalance) => {
    dispatch({ type: "SET_TOKENS", payload: newBalance });
  }, []);

  const updateSubscription = useCallback((newSubscription) => {
    dispatch({ type: "SET_SUBSCRIPTION", payload: newSubscription });
  }, []);

  const setError = useCallback((msg) => {
    dispatch({ type: "SET_ERROR", payload: msg });
  }, []);

  const isSubscribed = isSubscriptionValid(state.subscription || state.user?.subscription);

  const value = {
    ...state,
    isLoggedIn: Boolean(state.user),
    isSubscribed,
    subscription: state.subscription || state.user?.subscription || null,
    loginSuccess,
    applyCgwSession,
    logoutUser,
    updateTokens,
    updateSubscription,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth } from "../hooks/useAuth";
export default AuthContext;
