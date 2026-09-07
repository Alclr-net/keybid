import { COMPANIES, Company } from "@/app/data/keybidData";

export interface KeyState {
  keySlot: string;
  claimed: boolean;
  currentHolder: {
    id: string;
    name: string;
    url: string;
    tagline: string;
    iconUrl: string;
    bid: number;
    clicks: number;
  } | null;
  currentHighestBid: number;
  minimumNextBid: number;
  lastUpdated: string;
}

// Global in-memory store preserved across hot-reloads in Next.js development
declare global {
  // eslint-disable-next-line no-var
  var __keybidStore: Map<string, KeyState> | undefined;
  // eslint-disable-next-line no-var
  var __keybidPendingBids: Map<string, any> | undefined;
}

function getStore(): Map<string, KeyState> {
  if (!global.__keybidStore) {
    const store = new Map<string, KeyState>();

    // Seed initial companies from keybidData
    COMPANIES.forEach((c) => {
      const slot = c.keySlot.toUpperCase();
      const currentHighest = Math.max(0, c.bid);
      // Minimum bid rule: every single key minimum is $10. If current bid is >= 10, next is bid + 1.
      const minNext = currentHighest < 10 ? 10 : currentHighest + 1;

      store.set(slot, {
        keySlot: slot,
        claimed: true,
        currentHolder: {
          id: c.id,
          name: c.name,
          url: c.url,
          tagline: c.tagline,
          iconUrl: c.iconUrl,
          bid: currentHighest,
          clicks: c.clicks,
        },
        currentHighestBid: currentHighest,
        minimumNextBid: minNext,
        lastUpdated: new Date().toISOString(),
      });
    });

    global.__keybidStore = store;
  }
  return global.__keybidStore;
}

function getPendingStore(): Map<string, any> {
  if (!global.__keybidPendingBids) {
    global.__keybidPendingBids = new Map();
  }
  return global.__keybidPendingBids;
}

export function getKeyLiveState(rawSlot: string): KeyState {
  const slot = rawSlot.trim().toUpperCase();
  const store = getStore();

  const existing = store.get(slot);
  if (existing) {
    return existing;
  }

  // Unclaimed key slot default
  const unclaimedState: KeyState = {
    keySlot: slot,
    claimed: false,
    currentHolder: null,
    currentHighestBid: 0,
    minimumNextBid: 10, // Minimum bid amount for every key is $10
    lastUpdated: new Date().toISOString(),
  };

  return unclaimedState;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  code?: "OUTBID" | "BELOW_MINIMUM" | "INVALID_DATA";
  currentHighestBid: number;
  minimumNextBid: number;
}

export function validateIncomingBid(
  rawSlot: string,
  bidAmount: number,
  lastSeenHighest?: number
): ValidationResult {
  const state = getKeyLiveState(rawSlot);
  const currentHighest = state.currentHighestBid;
  const minimumNext = state.minimumNextBid;

  // 1. Check if user's last-seen highest bid is stale (Live outbid protection)
  if (lastSeenHighest !== undefined && lastSeenHighest < currentHighest) {
    return {
      valid: false,
      code: "OUTBID",
      error: `This key was just outbid at $${currentHighest} — refresh to see the new minimum`,
      currentHighestBid: currentHighest,
      minimumNextBid: minimumNext,
    };
  }

  // 2. Absolute minimum check: must be at least $10
  if (bidAmount < 10) {
    return {
      valid: false,
      code: "BELOW_MINIMUM",
      error: "Minimum bid amount for every single key is $10.",
      currentHighestBid: currentHighest,
      minimumNextBid: minimumNext,
    };
  }

  // 3. Must exceed current highest bid
  if (bidAmount <= currentHighest) {
    return {
      valid: false,
      code: "OUTBID",
      error: `This key was just outbid at $${currentHighest} — refresh to see the new minimum`,
      currentHighestBid: currentHighest,
      minimumNextBid: minimumNext,
    };
  }

  return {
    valid: true,
    currentHighestBid: currentHighest,
    minimumNextBid: minimumNext,
  };
}

export function savePendingOrder(orderId: string, data: any) {
  const pending = getPendingStore();
  pending.set(orderId, {
    ...data,
    createdAt: Date.now(),
  });
}

export function getPendingOrder(orderId: string) {
  const pending = getPendingStore();
  return pending.get(orderId);
}

export function finalizeWinningBid(
  rawSlot: string,
  bidData: {
    bidAmount: number;
    brandName: string;
    email: string;
    website?: string;
    iconUrl?: string;
    orderId: string;
    paymentId: string;
  }
): KeyState {
  const slot = rawSlot.trim().toUpperCase();
  const store = getStore();

  const brandId =
    bidData.brandName.toLowerCase().replace(/[^a-z0-9]/g, "-") || `sponsor-${Date.now()}`;

  const newState: KeyState = {
    keySlot: slot,
    claimed: true,
    currentHolder: {
      id: brandId,
      name: bidData.brandName,
      url: bidData.website || "#",
      tagline: `Claimed Keycap [${slot}] on Apple Magic Keyboard`,
      iconUrl:
        bidData.iconUrl ||
        `https://www.google.com/s2/favicons?domain=${
          bidData.website ? new URL(bidData.website.startsWith("http") ? bidData.website : `https://${bidData.website}`).hostname : "keybid.lol"
        }&sz=128`,
      bid: bidData.bidAmount,
      clicks: 0,
    },
    currentHighestBid: bidData.bidAmount,
    minimumNextBid: bidData.bidAmount + 1,
    lastUpdated: new Date().toISOString(),
  };

  store.set(slot, newState);
  return newState;
}
