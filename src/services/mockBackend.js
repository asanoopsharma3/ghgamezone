import { SUBSCRIPTION_PACKAGES as PLAN_PACKAGES } from "../config/subscriptionPlans.js";

const STORAGE_KEY_USERS = "ghgz_db_users";
const STORAGE_KEY_SESSION = "ghgz_db_current_session";
const STORAGE_KEY_OTPS = "ghgz_db_otps";

export const SUBSCRIPTION_PACKAGES = PLAN_PACKAGES;

const getInitialUsers = () => {
  const existing = localStorage.getItem(STORAGE_KEY_USERS);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch {
      // ignore
    }
  }
  const initial = [
    {
      id: "usr_101",
      username: "CYBERNINJA",
      phoneNumber: "+233541234567",
      email: "541234567@ghgamezone.com",
      password: "mtn_pass_auto",
      tokens: 999,
      maxTokens: 100,
      createdAt: new Date("2024-08-01").toISOString(),
      role: "VIP PRO",
      avatar: "/avatars/avatar.png",
      subscription: {
        active: true,
        planId: "pack_weekly",
        planName: "THE Gameio weekly",
        price: 5,
        currency: "GHS",
        activatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    },
  ];
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(initial));
  return initial;
};

const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
};

export const isSubscriptionValid = (subscription) => {
  if (!subscription || !subscription.active || !subscription.expiresAt) return false;
  return new Date(subscription.expiresAt).getTime() > Date.now();
};

export const mockBackend = {
  // 1. Send OTP to Mobile Number
  sendOtp: async (phoneNumber) => {
    await new Promise((r) => setTimeout(r, 250));
    const cleanNum = phoneNumber.trim().replace(/\s+/g, "").replace(/^0/, "").replace(/^\+?233/, "");
    if (!cleanNum || cleanNum.length < 8) {
      throw new Error("Invalid mobile number format");
    }

    // Generate 4-digit OTP code
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const otps = JSON.parse(localStorage.getItem(STORAGE_KEY_OTPS) || "{}");
    otps[cleanNum] = {
      code: generatedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 min expiry
    };
    localStorage.setItem(STORAGE_KEY_OTPS, JSON.stringify(otps));

    return {
      success: true,
      phoneNumber: `+233${cleanNum}`,
      otp: generatedOtp,
      expiresIn: 300,
      message: `OTP sent successfully to +233 ${cleanNum}`,
    };
  },

  // 2. Verify OTP & Authenticate/Register
  verifyOtp: async (phoneNumber, enteredOtp, optionalUsername) => {
    await new Promise((r) => setTimeout(r, 300));
    const cleanNum = phoneNumber.trim().replace(/\s+/g, "").replace(/^0/, "").replace(/^\+?233/, "");
    const otps = JSON.parse(localStorage.getItem(STORAGE_KEY_OTPS) || "{}");
    const storedData = otps[cleanNum];

    // Allow entered OTP if it matches or if master test OTP '1234' is provided
    const isValidOtp = (storedData && storedData.code === enteredOtp.trim()) || enteredOtp.trim() === "1234";

    if (!isValidOtp) {
      throw new Error("Invalid OTP code. Please check SMS and try again.");
    }

    // Delete used OTP
    delete otps[cleanNum];
    localStorage.setItem(STORAGE_KEY_OTPS, JSON.stringify(otps));

    const email = `${cleanNum}@ghgamezone.com`;
    const fullPhone = `+233${cleanNum}`;
    const users = getInitialUsers();
    let user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.phoneNumber === fullPhone
    );

    if (!user) {
      const newUser = {
        id: `usr_${Date.now()}`,
        username: optionalUsername?.trim() || `Gamer_${cleanNum.slice(-4)}`,
        phoneNumber: fullPhone,
        email: email.toLowerCase(),
        password: "mtn_pass_auto",
        tokens: 0,
        maxTokens: 100,
        createdAt: new Date().toISOString(),
        role: "MEMBER",
        avatar: "/avatars/avatar.png",
        subscription: null,
      };
      users.push(newUser);
      saveUsers(users);
      user = newUser;
    } else {
      user.phoneNumber = fullPhone;
      if (optionalUsername?.trim()) {
        user.username = optionalUsername.trim();
      }
      saveUsers(users);
    }

    const token = `mock_jwt_${user.id}_${Date.now()}`;
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({ user, token }));

    return {
      user,
      token,
      subscription: user.subscription,
      tokens: isSubscriptionValid(user.subscription) ? 999 : (user.tokens || 0),
    };
  },

  signIn: async (email, password, optionalUsername) => {
    await new Promise((r) => setTimeout(r, 200));
    const users = getInitialUsers();
    let user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      const newUser = {
        id: `usr_${Date.now()}`,
        username: optionalUsername?.trim() || email.split("@")[0].toUpperCase() || "PLAYER",
        phoneNumber: email.includes("@") && /^\d+$/.test(email.split("@")[0]) ? `+233${email.split("@")[0]}` : "+233540000000",
        email: email.toLowerCase(),
        password,
        tokens: 0,
        maxTokens: 100,
        createdAt: new Date().toISOString(),
        role: "MEMBER",
        avatar: "/avatars/avatar.png",
        subscription: null,
      };
      users.push(newUser);
      saveUsers(users);
      const token = `mock_jwt_${newUser.id}_${Date.now()}`;
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({ user: newUser, token }));
      return { user: newUser, token, subscription: newUser.subscription, tokens: newUser.tokens };
    }

    if (optionalUsername?.trim()) {
      user.username = optionalUsername.trim();
      saveUsers(users);
    }

    const token = `mock_jwt_${user.id}_${Date.now()}`;
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({ user, token }));
    return {
      user,
      token,
      subscription: user.subscription,
      tokens: isSubscriptionValid(user.subscription) ? 999 : (user.tokens || 0),
    };
  },

  signUp: async (username, email, password) => {
    await new Promise((r) => setTimeout(r, 200));
    const users = getInitialUsers();
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      username: username || email.split("@")[0].toUpperCase() || "PLAYER",
      phoneNumber: "+233540000000",
      email: email.toLowerCase(),
      password,
      tokens: 0,
      maxTokens: 100,
      createdAt: new Date().toISOString(),
      role: "VIP PRO",
      avatar: "/avatars/avatar.png",
      subscription: null,
    };

    users.push(newUser);
    saveUsers(users);

    const token = `mock_jwt_${newUser.id}_${Date.now()}`;
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify({ user: newUser, token }));
    return { user: newUser, token, subscription: null, tokens: 0 };
  },

  getCurrentUser: async () => {
    await new Promise((r) => setTimeout(r, 100));
    const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!sessionStr) throw new Error("Unauthorized");
    const session = JSON.parse(sessionStr);
    const users = getInitialUsers();
    const current = users.find((u) => u.id === session.user?.id);
    if (!current) throw new Error("User not found");

    return {
      user: current,
      subscription: current.subscription,
      tokens: isSubscriptionValid(current.subscription) ? 999 : (current.tokens || 0),
    };
  },

  logout: async () => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    return { success: true };
  },

  // 3. Subscription & Duration Management
  subscribeUser: async (packageId, paymentId = `pay_${Date.now()}`) => {
    await new Promise((r) => setTimeout(r, 200));
    const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!sessionStr) throw new Error("Unauthorized: Please sign in first.");
    const session = JSON.parse(sessionStr);
    const users = getInitialUsers();
    const userIndex = users.findIndex((u) => u.id === session.user?.id);
    if (userIndex === -1) throw new Error("User account not found.");

    const pkg = SUBSCRIPTION_PACKAGES.find((p) => p.id === packageId) || SUBSCRIPTION_PACKAGES[0];
    const now = Date.now();

    // If existing active subscription, extend the expiry time!
    let baseTime = now;
    if (
      users[userIndex].subscription &&
      users[userIndex].subscription.active &&
      new Date(users[userIndex].subscription.expiresAt).getTime() > now
    ) {
      baseTime = new Date(users[userIndex].subscription.expiresAt).getTime();
    }

    const expiresAt = new Date(baseTime + pkg.durationMs).toISOString();

    const newSubscription = {
      active: true,
      planId: pkg.id,
      planName: pkg.name,
      label: pkg.label,
      price: pkg.price,
      currency: pkg.currency,
      durationHours: pkg.durationHours,
      durationLabel: pkg.durationLabel,
      activatedAt: new Date().toISOString(),
      expiresAt: expiresAt,
      paymentRef: paymentId,
    };

    users[userIndex].subscription = newSubscription;
    users[userIndex].tokens = 999; // Unlimited access
    saveUsers(users);

    localStorage.setItem(
      STORAGE_KEY_SESSION,
      JSON.stringify({ ...session, user: users[userIndex] })
    );

    return {
      success: true,
      user: users[userIndex],
      subscription: newSubscription,
      tokens: 999,
      message: `🎉 Successfully subscribed to ${pkg.name}! Enjoy unlimited gaming.`,
    };
  },

  getTokenBalance: async () => {
    await new Promise((r) => setTimeout(r, 100));
    const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!sessionStr) throw new Error("Unauthorized");
    const session = JSON.parse(sessionStr);
    const users = getInitialUsers();
    const current = users.find((u) => u.id === session.user?.id);
    if (!current) throw new Error("User not found");

    const valid = isSubscriptionValid(current.subscription);
    return {
      tokens: valid ? 999 : (current.tokens || 0),
      maxTokens: current.maxTokens || 100,
      subscription: current.subscription,
      hasActiveSubscription: valid,
    };
  },

  deductToken: async () => {
    await new Promise((r) => setTimeout(r, 100));
    const sessionStr = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!sessionStr) throw new Error("Unauthorized: Please sign in first.");
    const session = JSON.parse(sessionStr);
    const users = getInitialUsers();
    const userIndex = users.findIndex((u) => u.id === session.user?.id);
    if (userIndex === -1) throw new Error("User account not found.");

    const valid = isSubscriptionValid(users[userIndex].subscription);
    if (valid) {
      // User has active unlimited subscription! No deduction required.
      return {
        success: true,
        tokens: 999,
        unlimited: true,
        message: "Unlimited subscription active! Game launched.",
      };
    }

    if (users[userIndex].tokens < 1) {
      throw new Error("No active subscription. Please subscribe to get unlimited daily/weekly access.");
    }

    users[userIndex].tokens -= 1;
    saveUsers(users);
    localStorage.setItem(
      STORAGE_KEY_SESSION,
      JSON.stringify({ ...session, user: users[userIndex] })
    );

    return {
      success: true,
      tokens: users[userIndex].tokens,
      unlimited: false,
      message: "1 Game attempt authorized",
    };
  },

  addTokens: async (amount = 10, packageId = "pack_daily") => {
    return await mockBackend.subscribeUser(packageId);
  },
};
