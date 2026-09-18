import { publicFetch, authFetch, setToken, clearToken, getToken } from "./api.js";
import { mockBackend } from "./mockBackend.js";

export const sendOtp = async (phoneNumber) => {
  try {
    const data = await publicFetch("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
    });
    if (data?.success) return data;
  } catch {
    // fallback to mock
  }
  return await mockBackend.sendOtp(phoneNumber);
};

export const verifyOtp = async (phoneNumber, otp, username) => {
  try {
    const data = await publicFetch("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phoneNumber, otp, username }),
    });
    if (data?.token) {
      setToken(data.token);
      return data;
    }
  } catch {
    // fallback to mock
  }

  const mockData = await mockBackend.verifyOtp(phoneNumber, otp, username);
  setToken(mockData.token);
  return mockData;
};

export const signIn = async (email, password) => {
  try {
    const data = await publicFetch("/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data?.token) {
      setToken(data.token);
      return data;
    }
  } catch {
    // fallback to local mock
  }

  const mockData = await mockBackend.signIn(email, password);
  setToken(mockData.token);
  return mockData;
};

export const signUp = async (username, email, password) => {
  try {
    const data = await publicFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    if (data?.token) {
      setToken(data.token);
      return data;
    }
  } catch {
    // fallback to local mock
  }

  const mockData = await mockBackend.signUp(username, email, password);
  setToken(mockData.token);
  return mockData;
};

export const logout = async () => {
  try {
    await authFetch("/auth/logout", { method: "POST" });
  } catch {
    // ignore
  }
  await mockBackend.logout();
  clearToken();
};

export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) throw new Error("No token");

  const storedCgw = localStorage.getItem("ghgz_cgw_session");
  if (storedCgw && !token.startsWith("mock_")) {
    try {
      const data = await authFetch("/v1/subscription/status");
      const status = data?.subscription?.subscriptionStatus;
      if (status && status !== "active") {
        localStorage.removeItem("ghgz_cgw_session");
        throw new Error("Subscription expired");
      }
      const parsed = JSON.parse(storedCgw);
      if (data?.subscription?.nextPlayTime && parsed.subscription) {
        parsed.subscription.expiresAt = data.subscription.nextPlayTime;
        parsed.subscription.active = status === "active";
      }
      return parsed;
    } catch (err) {
      if (err.message === "Subscription expired") throw err;
      try {
        return JSON.parse(storedCgw);
      } catch {
        // fall through
      }
    }
  }

  try {
    const data = await authFetch("/auth/me");
    if (data && (data.user || data.id)) return data;
  } catch {
    // fallback to local mock session
  }

  return await mockBackend.getCurrentUser();
};
