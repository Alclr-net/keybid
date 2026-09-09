export interface PendingOrder {
  orderId: string;
  keySlot: string;
  bidAmount: number;
  brandName: string;
  email?: string;
  website?: string;
  iconUrl?: string;
  isLiveRazorpay?: boolean;
  createdAt?: number;
  status?: string;
  currency?: string;
}

export interface KeyLiveState {
  keySlot: string;
  currentHighestBid: number;
  leaderBrand?: string;
  leaderWebsite?: string;
  leaderIcon?: string;
  updatedAt: number;
}

const pendingOrders: Map<string, PendingOrder> = new Map();
const keyLiveStates: Map<string, KeyLiveState> = new Map();

export function getBasePrice(): number {
  const envPrice = process.env.BASE_PRICE || process.env.NEXT_PUBLIC_BASE_PRICE;
  if (envPrice) {
    const parsed = parseFloat(envPrice);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return 10;
}

export function savePendingOrder(orderId: string, data: PendingOrder) {
  pendingOrders.set(orderId, { ...data, orderId, createdAt: Date.now() });
}

export function getPendingOrder(orderId: string): PendingOrder | undefined {
  return pendingOrders.get(orderId);
}

export function getKeyLiveState(keySlot: string): KeyLiveState {
  const slotUpper = keySlot.trim().toUpperCase();
  const existing = keyLiveStates.get(slotUpper);
  if (existing) return existing;

  const basePrice = getBasePrice();
  return {
    keySlot: slotUpper,
    currentHighestBid: 0,
    updatedAt: Date.now(),
  };
}

export function validateIncomingBid(
  keySlot: string,
  bidAmount: number,
  lastSeenHighestBid?: number
): {
  valid: boolean;
  error?: string;
  code?: string;
  currentHighestBid: number;
  minimumNextBid: number;
} {
  const slotUpper = keySlot.trim().toUpperCase();
  const currentLive = getKeyLiveState(slotUpper);
  const basePrice = getBasePrice();

  const currentHighest = currentLive.currentHighestBid;
  const minimumNextBid = currentHighest > 0 ? Math.max(basePrice, currentHighest + 1) : basePrice;

  if (bidAmount < minimumNextBid) {
    return {
      valid: false,
      error: `Minimum next bid for Key [${slotUpper}] is $${minimumNextBid}`,
      code: "OUTBID",
      currentHighestBid: currentHighest,
      minimumNextBid,
    };
  }

  if (
    typeof lastSeenHighestBid === "number" &&
    lastSeenHighestBid < currentHighest
  ) {
    return {
      valid: false,
      error: `Another sponsor just bid $${currentHighest} on Key [${slotUpper}]. Minimum next bid is $${minimumNextBid}.`,
      code: "OUTBID",
      currentHighestBid: currentHighest,
      minimumNextBid,
    };
  }

  return {
    valid: true,
    currentHighestBid: currentHighest,
    minimumNextBid,
  };
}

export function finalizeWinningBid(
  keySlot: string,
  data: {
    bidAmount: number;
    brandName: string;
    email?: string;
    website?: string;
    iconUrl?: string;
    orderId: string;
    paymentId: string;
  }
): KeyLiveState {
  const slotUpper = keySlot.trim().toUpperCase();
  const newState: KeyLiveState = {
    keySlot: slotUpper,
    currentHighestBid: data.bidAmount,
    leaderBrand: data.brandName,
    leaderWebsite: data.website,
    leaderIcon: data.iconUrl,
    updatedAt: Date.now(),
  };

  keyLiveStates.set(slotUpper, newState);
  return newState;
}
