// lib/helpers/leaderboard.ts
// Frontend read helpers for leaderboard and bids.
// Uses the frontend client, so RLS applies automatically.

import { supabase } from '@/lib/supabase/client';
import type { LeaderboardEntry, PublicBid } from '@/lib/types/database';

/**
 * Fetch overall top bids for leaderboard.
 */
export async function getTopBids(limit = 10): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .order('bid_amount', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getTopBids error:', error.message);
    return [];
  }
  return (data || []) as LeaderboardEntry[];
}

/**
 * Fetch bid history for a single key.
 */
export async function getBidsForKey(keyId: string, limit = 10): Promise<PublicBid[]> {
  const { data, error } = await supabase
    .from('public_bids')
    .select('*')
    .eq('key_id', keyId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getBidsForKey error:', error.message);
    return [];
  }
  return (data || []) as PublicBid[];
}

/**
 * Fetch current highest bid for a key.
 */
export async function getCurrentBidForKey(keyId: string): Promise<PublicBid | null> {
  const { data, error } = await supabase
    .from('public_bids')
    .select('*')
    .eq('key_id', keyId)
    .order('bid_amount', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('getCurrentBidForKey error:', error.message);
    return null;
  }
  return data as PublicBid | null;
}
