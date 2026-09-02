export interface StartupData {
  id: string;
  name: string;
  url: string;
  logo: string;
  tagline?: string;
  color?: string;
  claimedAt?: string;
  claimedBy?: string;
}

export interface KeyConfig {
  id: string;
  label: string;
  widthMultiplier?: number;
  row: number;
  startup?: StartupData;
  isSpecial?: boolean;
}

export type KeyboardTheme = 'cyber' | 'stealth' | 'retro' | 'neon';
