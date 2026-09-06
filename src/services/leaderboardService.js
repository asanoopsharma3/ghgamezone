import { APP_CONFIG, getApiUrl } from "../config/app.config.js";

export const maskMsisdn = (msisdn) => {
  const digits = String(msisdn || "").replace(/\D/g, "");
  if (digits.length < 8) return "***";
  const stars = "*".repeat(Math.max(digits.length - 8, 4));
  return `${digits.slice(0, 5)}${stars}${digits.slice(-3)}`;
};

const DUMMY_SUBSCRIBERS = [
  { msisdn: "233541110001", packageKey: "daily", packageName: "GHGameZone daily" },
  { msisdn: "233541110002", packageKey: "daily", packageName: "GHGameZone daily" },
  { msisdn: "233541110003", packageKey: "daily", packageName: "GHGameZone daily" },
  { msisdn: "233241110004", packageKey: "weekly", packageName: "GHGameZone weekly" },
  { msisdn: "233241110005", packageKey: "weekly", packageName: "GHGameZone weekly" },
  { msisdn: "233201110006", packageKey: "monthly", packageName: "GHGameZone monthly" },
  { msisdn: "233551110007", packageKey: "daily", packageName: "GHGameZone daily" },
  { msisdn: "233271110008", packageKey: "weekly", packageName: "GHGameZone weekly" },
];

const toPlayerRows = (rows) =>
  rows.map((row, index) => ({
    rank: row.rank || index + 1,
    msisdn: row.msisdn?.includes("*") ? row.msisdn : maskMsisdn(row.msisdn),
    packageKey: row.packageKey,
    packageName: row.packageName,
    subscribedAt: row.subscribedAt || null,
  }));

export const getDummySubscribers = (packageKey = APP_CONFIG.leaderboardPackage) => {
  const key = String(packageKey || "daily").toLowerCase();
  const filtered = DUMMY_SUBSCRIBERS.filter((row) => row.packageKey === key);
  return {
    success: true,
    package: key,
    source: "dummy",
    players: toPlayerRows(filtered),
  };
};

export const fetchSubscribedPlayers = async (packageKey = APP_CONFIG.leaderboardPackage) => {
  const key = String(packageKey || APP_CONFIG.leaderboardPackage || "daily").toLowerCase();
  if (APP_CONFIG.useDummyLeaderboard) {
    return getDummySubscribers(key);
  }

  const url = `${getApiUrl(APP_CONFIG.endpoints.leaderboardSubscribers)}?package=${encodeURIComponent(key)}`;
  const res = await fetch(url);
  const data = (await res.json().catch(() => ({}))) || {};
  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || "Could not load subscribed players");
  }

  return {
    success: true,
    package: data.package || key,
    source: data.source || "database",
    players: toPlayerRows(Array.isArray(data.players) ? data.players : []),
  };
};
