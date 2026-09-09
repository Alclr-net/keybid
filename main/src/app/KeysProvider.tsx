// lib/providers/KeysProvider.tsx
//
// Mount this ONCE at the app root. Fetches keys data one time on page load
// and populates the global store. No realtime — components only get fresh
// data on next page load/refetch, not live pushes.

'use client';

import { useEffect, useRef } from 'react';
import { getAllKeys } from '@/lib/helpers/keys';
import { useKeysStore } from '@/lib/store/keysStore';

export interface KeysProviderProps {
  children: React.ReactNode;
}

export function KeysProvider({ children }: KeysProviderProps) {
  const setKeys = useKeysStore((state) => state.setKeys);
  const setLoading = useKeysStore((state) => state.setLoading);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    async function loadKeys() {
      setLoading(true);
      try {
        const data = await getAllKeys();
        setKeys(data);
      } catch (error) {
        console.error('Failed to load keys in KeysProvider:', error);
      } finally {
        setLoading(false);
      }
    }

    loadKeys();
  }, [setKeys, setLoading]);

  return <>{children}</>;
}

export default KeysProvider;