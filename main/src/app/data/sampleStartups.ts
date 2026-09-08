import { KeyConfig, StartupData } from '../../../app/types/keyboard';

export const INITIAL_KEYBOARD_LAYOUT: KeyConfig[][] = [
  // Row 0: ThinkPad Function Row (17 keys)
  [
    { id: 'ESC', label: 'Esc', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'F1', label: 'F1', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'F2', label: 'F2', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'F3', label: 'F3', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'F4', label: 'F4', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'F5', label: 'F5', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'F6', label: 'F6', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'F7', label: 'F7', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'F8', label: 'F8', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'F9', label: 'F9', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'F10', label: 'F10', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'F11', label: 'F11', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'F12', label: 'F12', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'HOME', label: 'Home', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'END', label: 'End', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'INSERT', label: 'Insert', row: 0, widthMultiplier: 1, isSpecial: true },
    { id: 'DELETE', label: 'Delete', row: 0, widthMultiplier: 1, isSpecial: true },
  ],
  // Row 1: Number Row
  [
    { id: '`', label: '` ~', row: 1, widthMultiplier: 1 },
    { id: '1', label: '1 !', row: 1, widthMultiplier: 1 },
    { id: '2', label: '2 @', row: 1, widthMultiplier: 1 },
    { id: '3', label: '3 #', row: 1, widthMultiplier: 1 },
    { id: '4', label: '4 $', row: 1, widthMultiplier: 1 },
    { id: '5', label: '5 %', row: 1, widthMultiplier: 1 },
    { id: '6', label: '6 ^', row: 1, widthMultiplier: 1 },
    { id: '7', label: '7 &', row: 1, widthMultiplier: 1 },
    { id: '8', label: '8 *', row: 1, widthMultiplier: 1 },
    { id: '9', label: '9 (', row: 1, widthMultiplier: 1 },
    { id: '0', label: '0 )', row: 1, widthMultiplier: 1 },
    { id: '-', label: '- _', row: 1, widthMultiplier: 1 },
    { id: '=', label: '= +', row: 1, widthMultiplier: 1 },
    { id: 'BACKSPACE', label: 'Backspace', row: 1, widthMultiplier: 2.2, isSpecial: true },
  ],
  // Row 2: QWERTY Row
  [
    { id: 'TAB', label: 'Tab', row: 2, widthMultiplier: 1.5, isSpecial: true },
    { id: 'Q', label: 'Q', row: 2, widthMultiplier: 1 },
    { id: 'W', label: 'W', row: 2, widthMultiplier: 1 },
    { id: 'E', label: 'E', row: 2, widthMultiplier: 1 },
    { id: 'R', label: 'R', row: 2, widthMultiplier: 1 },
    { id: 'T', label: 'T', row: 2, widthMultiplier: 1 },
    { id: 'Y', label: 'Y', row: 2, widthMultiplier: 1 },
    { id: 'U', label: 'U', row: 2, widthMultiplier: 1 },
    { id: 'I', label: 'I', row: 2, widthMultiplier: 1 },
    { id: 'O', label: 'O', row: 2, widthMultiplier: 1 },
    { id: 'P', label: 'P', row: 2, widthMultiplier: 1 },
    { id: '[', label: '[ {', row: 2, widthMultiplier: 1 },
    { id: ']', label: '] }', row: 2, widthMultiplier: 1 },
    { id: '\\', label: '\\ |', row: 2, widthMultiplier: 1.4, isSpecial: true },
  ],
  // Row 3: ASDFGHJKL Row (TrackPoint resides between G, H & B below)
  [
    { id: 'CAPS', label: 'CapsLock', row: 3, widthMultiplier: 1.8, isSpecial: true },
    { id: 'A', label: 'A', row: 3, widthMultiplier: 1 },
    { id: 'S', label: 'S', row: 3, widthMultiplier: 1 },
    { id: 'D', label: 'D', row: 3, widthMultiplier: 1 },
    { id: 'F', label: 'F', row: 3, widthMultiplier: 1 },
    { id: 'G', label: 'G', row: 3, widthMultiplier: 1 },
    { id: 'H', label: 'H', row: 3, widthMultiplier: 1 },
    { id: 'J', label: 'J', row: 3, widthMultiplier: 1 },
    { id: 'K', label: 'K', row: 3, widthMultiplier: 1 },
    { id: 'L', label: 'L', row: 3, widthMultiplier: 1 },
    { id: ';', label: '; :', row: 3, widthMultiplier: 1 },
    { id: "'", label: "' \"", row: 3, widthMultiplier: 1 },
    { id: 'ENTER', label: 'Enter', row: 3, widthMultiplier: 2.3, isSpecial: true },
  ],
  // Row 4: ZXCVBNM Row
  [
    { id: 'LSHIFT', label: 'Shift', row: 4, widthMultiplier: 2.2, isSpecial: true },
    { id: 'Z', label: 'Z', row: 4, widthMultiplier: 1 },
    { id: 'X', label: 'X', row: 4, widthMultiplier: 1 },
    { id: 'C', label: 'C', row: 4, widthMultiplier: 1 },
    { id: 'V', label: 'V', row: 4, widthMultiplier: 1 },
    { id: 'B', label: 'B', row: 4, widthMultiplier: 1 },
    { id: 'N', label: 'N', row: 4, widthMultiplier: 1 },
    { id: 'M', label: 'M', row: 4, widthMultiplier: 1 },
    { id: ',', label: ', <', row: 4, widthMultiplier: 1 },
    { id: '.', label: '. >', row: 4, widthMultiplier: 1 },
    { id: '/', label: '/ ?', row: 4, widthMultiplier: 1 },
    { id: 'RSHIFT', label: 'Shift', row: 4, widthMultiplier: 2.7, isSpecial: true },
  ],
  // Row 5: ThinkPad Bottom Row with Arrow Cluster
  [
    { id: 'FN', label: 'Fn', row: 5, widthMultiplier: 1.1, isSpecial: true },
    { id: 'LCTRL', label: 'Ctrl', row: 5, widthMultiplier: 1.1, isSpecial: true },
    { id: 'LWIN', label: '❖', row: 5, widthMultiplier: 1.1, isSpecial: true },
    { id: 'LALT', label: 'Alt', row: 5, widthMultiplier: 1.1, isSpecial: true },
    { id: 'SPACE', label: ' ', row: 5, widthMultiplier: 5.5, isSpecial: true },
    { id: 'RALT', label: 'Alt', row: 5, widthMultiplier: 1.1, isSpecial: true },
    { id: 'PRTSC', label: 'PrtSc', row: 5, widthMultiplier: 1.1, isSpecial: true },
    { id: 'RCTRL', label: 'Ctrl', row: 5, widthMultiplier: 1.1, isSpecial: true },
    { id: 'PGUP', label: 'PgUp', row: 5, widthMultiplier: 0.9, isSpecial: true },
    { id: 'UP', label: '▲', row: 5, widthMultiplier: 0.9, isSpecial: true },
    { id: 'PGDN', label: 'PgDn', row: 5, widthMultiplier: 0.9, isSpecial: true },
  ]
];

// High quality clean SVG Data URIs for default sample startups
const SVG_DATA_PREFIX = 'data:image/svg+xml;utf8,';

const createSvgDataUrl = (svgContent: string) => {
  return `${SVG_DATA_PREFIX}${encodeURIComponent(svgContent)}`;
};

export const SAMPLE_STARTUPS: Record<string, StartupData> = {
  'N': {
    id: 'nextjs',
    name: 'Next.js',
    url: 'https://nextjs.org',
    tagline: 'The React Framework for the Web',
    color: '#000000',
    logo: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" fill="none"><circle cx="90" cy="90" r="90" fill="black"/><path d="M149.508 157.52L69.142 54H54V126H67.8816V74.8398L136.29 162.77C141.054 161.312 145.549 159.55 149.508 157.52Z" fill="white"/><rect x="115" y="54" width="14" height="72" fill="white"/></svg>`),
    claimedAt: '2026-01-15'
  },
  'V': {
    id: 'vercel',
    name: 'Vercel',
    url: 'https://vercel.com',
    tagline: 'Develop. Preview. Ship.',
    color: '#000000',
    logo: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none"><path d="M256 48L512 464H0L256 48Z" fill="#ffffff"/></svg>`),
    claimedAt: '2026-01-18'
  },
  'S': {
    id: 'stripe',
    name: 'Stripe',
    url: 'https://stripe.com',
    tagline: 'Financial infrastructure for the internet',
    color: '#635bff',
    logo: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="#635BFF"/><path d="M47.7 34.3c0-2.4 2-3.3 5.3-3.3 4.7 0 10.7 1.5 15.4 4.1v-12c-5.4-2.2-10.7-3.1-15.4-3.1-12.7 0-21.3 6.6-21.3 17 0 16.6 22.8 13.9 22.8 21.1 0 2.8-2.5 3.7-6 3.7-5.2 0-12.1-2.1-17.4-5.1v12.2c6 2.6 12.1 3.7 17.4 3.7 13.1 0 22-6.5 22-17.1-.1-17.9-22.8-14.8-22.8-21.2z" fill="white"/></svg>`),
    claimedAt: '2026-02-01'
  },
  'P': {
    id: 'supabase',
    name: 'Supabase',
    url: 'https://supabase.com',
    tagline: 'The Open Source Firebase Alternative',
    color: '#3ecf8e',
    logo: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="#1C1C1C"/><path d="M57.4 15L15 62.4h32.1L42.6 85 85 37.6H52.9L57.4 15z" fill="url(#supa-grad)"/><defs><linearGradient id="supa-grad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse"><stop stop-color="#3ECF8E"/><stop offset="1" stop-color="#249361"/></linearGradient></defs></svg>`),
    claimedAt: '2026-02-03'
  },
  'L': {
    id: 'linear',
    name: 'Linear',
    url: 'https://linear.app',
    tagline: 'Purpose-built for modern software development',
    color: '#5e6ad2',
    logo: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="#5E6AD2"/><path d="M25 75L75 25M25 50L50 25M50 75L75 50" stroke="white" stroke-width="8" stroke-linecap="round"/></svg>`),
    claimedAt: '2026-02-05'
  },
  'O': {
    id: 'openai',
    name: 'OpenAI',
    url: 'https://openai.com',
    tagline: 'Creating safe Artificial General Intelligence',
    color: '#10a37f',
    logo: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="#10A37F"/><circle cx="50" cy="50" r="24" stroke="white" stroke-width="7" stroke-dasharray="25 10"/></svg>`),
    claimedAt: '2026-02-10'
  },
  'F': {
    id: 'figma',
    name: 'Figma',
    url: 'https://figma.com',
    tagline: 'How teams design together',
    color: '#f24e1e',
    logo: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="#1E1E1E"/><circle cx="35" cy="30" r="14" fill="#F24E1E"/><circle cx="65" cy="30" r="14" fill="#FF7262"/><circle cx="35" cy="50" r="14" fill="#A259FF"/><circle cx="65" cy="50" r="14" fill="#1ABCFE"/><circle cx="35" cy="70" r="14" fill="#0ACF83"/></svg>`),
    claimedAt: '2026-02-12'
  },
  'C': {
    id: 'cursor',
    name: 'Cursor',
    url: 'https://cursor.com',
    tagline: 'The AI Code Editor',
    color: '#000000',
    logo: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="#000000"/><path d="M30 25L75 50L50 55L30 75V25Z" fill="#3B82F6" stroke="white" stroke-width="4"/></svg>`),
    claimedAt: '2026-02-15'
  },
  'R': {
    id: 'raycast',
    name: 'Raycast',
    url: 'https://raycast.com',
    tagline: 'Supercharged productivity tool',
    color: '#ff6363',
    logo: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="#FF6363"/><path d="M25 25L75 75M75 25L25 75" stroke="white" stroke-width="10" stroke-linecap="round"/></svg>`),
    claimedAt: '2026-02-18'
  },
  'T': {
    id: 'tailwind',
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    tagline: 'Rapidly build modern websites',
    color: '#38bdf8',
    logo: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="#0F172A"/><path d="M20 50c5-10 15-15 25-10 6 3 10 9 15 10 10 2 20-5 20-5s-5 10-15 15c-6 3-10-1-15-2-10-2-20 2-20 2zM35 70c5-10 15-15 25-10 6 3 10 9 15 10 10 2 20-5 20-5s-5 10-15 15c-6 3-10-1-15-2-10-2-20 2-20 2z" fill="#38BDF8"/></svg>`),
    claimedAt: '2026-02-20'
  },
  'SPACE': {
    id: 'keybid',
    name: 'Keybid ThinkPad',
    url: 'https://keybid.dev',
    tagline: 'The ThinkPad edition startup keyboard!',
    color: '#e11d48',
    logo: createSvgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 60" fill="none"><rect width="300" height="60" rx="12" fill="#E11D48"/><text x="150" y="38" fill="white" font-family="sans-serif" font-weight="900" font-size="22" text-anchor="middle" letter-spacing="3">THINKPAD KEYBID</text></svg>`),
    claimedAt: '2026-02-22'
  }
};
