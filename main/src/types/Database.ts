// lib/types/database.ts

// lib/types/database.ts

export type FetchStatus = 'pending' | 'fetched' | 'failed'

export interface Key {
  id: string
  submitted_url: string
  keyboard_key: string | null  // The keyboard letter this company owns, e.g. "V"
  key_name: string | null      // The company/brand name, e.g. "Vercel"
  about: string | null
  key_logo: string | null
  fetch_status: FetchStatus
  fetched_at: string | null
  current_bid_id: string | null
  current_bid_amount: number | null
  click_count: number | null
  created_at: string
  updated_at: string
}

export type PaymentStatus = 'created' | 'captured' | 'failed' | 'expired' | 'refunded'
export type BidStatus = 'holding' | 'outbid' | 'cancelled'

export interface Bid {
  id: string
  key_id: string
  bid_amount: number
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  razorpay_contact: string | null
  payment_status: PaymentStatus
  bid_status: BidStatus
  expires_at: string | null
  created_at: string
}

// Safe, public-facing shape — comes from the `public_bids` view.
// No payment/contact fields, since this is readable by anyone.
export interface PublicBid {
  id: string
  key_id: string
  bid_amount: number
  bid_status: BidStatus
  created_at: string
}

// Leaderboard row = a public bid joined with its key's display info.
export interface LeaderboardEntry extends PublicBid {
  key_name: string | null
  key_logo: string | null
}