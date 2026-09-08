// lib/helpers/keys.ts
// Frontend read helpers — only touch the `keys` table (public data).
// Uses the frontend client, so RLS applies automatically.

import { supabase } from '@/lib/supabase/client'
import type { Key } from '@/types/Database'
import type { RealtimeChannel } from '@supabase/supabase-js'

/**
 * Fetch all keys for display (e.g. homepage/board).
 */
export async function getAllKeys(): Promise<Key[]> {
  const { data, error } = await supabase
    .from('keys')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getAllKeys error:', error.message)
    return []
  }
  return data as Key[]
}

/**
 * Increment click count for a key when a user clicks its link.
 */
export async function trackKeyClick(keyId: string): Promise<void> {
  if (!keyId) return
  try {
    const { error: rpcError } = await supabase.rpc('increment_click_count', { key_id: keyId })
    if (!rpcError) return

    const { data } = await supabase
      .from('keys')
      .select('click_count')
      .eq('id', keyId)
      .single()

    const currentCount = (data?.click_count as number) || 0
    await supabase
      .from('keys')
      .update({ click_count: currentCount + 1 })
      .eq('id', keyId)
  } catch (err) {
    console.warn('Unable to persist click increment:', err)
  }
}

/**
 * Fetch a single key by id (e.g. key detail page).
 */
export async function getKeyById(keyId: string): Promise<Key | null> {
  const { data, error } = await supabase
    .from('keys')
    .select('*')
    .eq('id', keyId)
    .single()

  if (error) {
    console.error('getKeyById error:', error.message)
    return null
  }
  return data as Key
}

/**
 * Subscribe to realtime updates on the keys table (e.g. live price updates).
 * Returns the channel so the caller can unsubscribe on unmount.
 */
export function subscribeToKeyUpdates(
  onUpdate: (updatedKey: Key) => void
): RealtimeChannel {
  const uniqueId = `keys-changes-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  const channel = supabase
    .channel(uniqueId)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'keys' },
      (payload) => onUpdate(payload.new as Key)
    )
    .subscribe()

  return channel
}
