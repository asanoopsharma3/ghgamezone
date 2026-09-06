import { APP_CONFIG } from "./app.config.js";

export const SUBSCRIPTION_PACKAGES = [
  {
    id: "pack_daily",
    planKey: "daily",
    label: "DAILY PASS",
    name: "GHGameZone daily",
    price: 1,
    currency: "GHS",
    durationLabel: "1 Whole Day",
    durationHours: 24,
    durationDays: 1,
    durationMs: 24 * 60 * 60 * 1000,
    popular: false,
    desc: "Unlimited Play for 1 Whole Day (24 Hours)",
    offerCode: APP_CONFIG.cgw.offerCodeDaily,
  },
  {
    id: "pack_weekly",
    planKey: "weekly",
    label: "WEEKLY PASS",
    name: "GHGameZone weekly",
    price: 5,
    currency: "GHS",
    durationLabel: "1 Whole Week",
    durationHours: 168,
    durationDays: 7,
    durationMs: 7 * 24 * 60 * 60 * 1000,
    popular: true,
    desc: "Unlimited Play for a Week (7 Days)",
    offerCode: APP_CONFIG.cgw.offerCodeWeekly,
  },
  {
    id: "pack_monthly",
    planKey: "monthly",
    label: "MONTHLY PASS",
    name: "GHGameZone monthly",
    price: 18,
    currency: "GHS",
    durationLabel: "1 Whole Month",
    durationHours: 720,
    durationDays: 30,
    durationMs: 30 * 24 * 60 * 60 * 1000,
    popular: false,
    desc: "Unlimited Play for a Month (30 Days)",
    offerCode: APP_CONFIG.cgw.offerCodeMonthly,
  },
];

export const resolvePlanKey = (value) => {
  const key = String(value || "").toLowerCase();
  if (key.includes("week")) return "weekly";
  if (key.includes("month")) return "monthly";
  return "daily";
};

export const getPlanById = (id) =>
  SUBSCRIPTION_PACKAGES.find((plan) => plan.id === id || plan.planKey === id);

export const getPlanByOfferCode = (offerCode) => {
  const match = SUBSCRIPTION_PACKAGES.find((plan) => plan.offerCode === offerCode);
  if (match) {
    const uniqueCodes = new Set(SUBSCRIPTION_PACKAGES.map((plan) => plan.offerCode));
    if (uniqueCodes.size > 1) return match;
  }
  return getPlanById(localStorage.getItem("selectedPlanId")) || SUBSCRIPTION_PACKAGES[0];
};

export const buildSubscriptionFromPlan = (plan, extra = {}) => {
  const selected = plan || SUBSCRIPTION_PACKAGES[0];
  const now = Date.now();
  return {
    active: true,
    planId: selected.id,
    planKey: selected.planKey,
    planName: selected.name,
    label: selected.label,
    price: selected.price,
    currency: selected.currency,
    durationHours: selected.durationHours,
    durationLabel: selected.durationLabel,
    offerCode: selected.offerCode,
    activatedAt: extra.activatedAt || new Date().toISOString(),
    expiresAt: extra.expiresAt || new Date(now + selected.durationMs).toISOString(),
  };
};
