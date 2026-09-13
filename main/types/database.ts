// lib/types/database.ts

export type FetchStatus = 'pending' | 'fetched' | 'failed'

export interface Key {
    id: string
    submitted_url: string
    brand_name: string | null
    about: string | null
    key_logo: string | null
    current_bid_id: string | null
    current_bid_amount: number | null
    click_count: number
    key_slot: string | null
    created_at: string
    updated_at: string
}

export type PaymentStatus = 'created' | 'captured' | 'failed' | 'expired' | 'refunded'
export type BidStatus = 'holding' | 'outbid' | 'cancelled'

export interface Bid {
    id: string
    key_id: string
    bid_amount: number
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
    brand_name: string | null
    key_logo: string | null
}