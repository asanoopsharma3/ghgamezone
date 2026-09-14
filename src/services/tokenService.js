import { authFetch } from "./api.js";
import { mockBackend } from "./mockBackend.js";
import { hasActivePlayAccess } from "../utils/playAccess.js";

export const getTokenBalance = async () => {
  try {
    const data = await authFetch("/tokens/balance");
    if (typeof data?.tokens === "number") return data;
  } catch {
    // fallback
  }
  return await mockBackend.getTokenBalance();
};

export const deductToken = async () => {
  if (hasActivePlayAccess()) {
    return {
      success: true,
      tokens: 999,
      unlimited: true,
      message: "Unlimited subscription active! Game launched.",
    };
  }

  try {
    const data = await authFetch("/tokens/deduct", {
      method: "POST",
      body: JSON.stringify({ amount: 1 }),
    });
    if (typeof data?.tokens === "number") return data;
  } catch {
    // fallback
  }
  return await mockBackend.deductToken();
};

export const addTokens = async (packageId, paymentRef, amount = 10) => {
  try {
    const data = await authFetch("/tokens/add", {
      method: "POST",
      body: JSON.stringify({ packageId, paymentRef, amount }),
    });
    if (typeof data?.tokens === "number") return data;
  } catch {
    // fallback
  }
  return await mockBackend.addTokens(amount, packageId);
};
