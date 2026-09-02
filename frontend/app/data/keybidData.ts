export interface Company {
  id: string;
  name: string;
  url: string;
  tagline: string;
  iconUrl: string;
  bid: number;          // current bid in dollars
  clicks: number;
  submittedAt: string;
  keySlot: string;      // which keyboard key they're on
}

// In-memory store (replace with DB/API in production)
export const COMPANIES: Company[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    url: 'https://vercel.com',
    tagline: 'Develop. Preview. Ship. The platform for frontend developers.',
    iconUrl: 'https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico',
    bid: 43,
    clicks: 264,
    submittedAt: '2026-08-10',
    keySlot: 'V',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    url: 'https://stripe.com',
    tagline: 'Financial infrastructure for the internet.',
    iconUrl: 'https://stripe.com/favicon.ico',
    bid: 31,
    clicks: 198,
    submittedAt: '2026-08-12',
    keySlot: 'S',
  },
  {
    id: 'linear',
    name: 'Linear',
    url: 'https://linear.app',
    tagline: 'Purpose-built for modern product development.',
    iconUrl: 'https://linear.app/favicon.ico',
    bid: 22,
    clicks: 150,
    submittedAt: '2026-08-14',
    keySlot: 'L',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    url: 'https://openai.com',
    tagline: 'Creating safe Artificial General Intelligence.',
    iconUrl: 'https://openai.com/favicon.ico',
    bid: 18,
    clicks: 132,
    submittedAt: '2026-08-15',
    keySlot: 'O',
  },
  {
    id: 'figma',
    name: 'Figma',
    url: 'https://figma.com',
    tagline: 'Nothing great is made alone.',
    iconUrl: 'https://static.figma.com/app/icon/1/favicon.ico',
    bid: 14,
    clicks: 98,
    submittedAt: '2026-08-17',
    keySlot: 'F',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    url: 'https://cursor.com',
    tagline: 'The AI Code Editor built for pair programming.',
    iconUrl: 'https://cursor.com/favicon.ico',
    bid: 11,
    clicks: 87,
    submittedAt: '2026-08-19',
    keySlot: 'C',
  },
  {
    id: 'raycast',
    name: 'Raycast',
    url: 'https://raycast.com',
    tagline: 'Supercharged productivity. Blaze through your Mac.',
    iconUrl: 'https://raycast.com/favicon-production.png',
    bid: 8,
    clicks: 65,
    submittedAt: '2026-08-20',
    keySlot: 'R',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    url: 'https://supabase.com',
    tagline: 'The open source Firebase alternative.',
    iconUrl: 'https://supabase.com/favicon/favicon.ico',
    bid: 6,
    clicks: 54,
    submittedAt: '2026-08-22',
    keySlot: 'P',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    tagline: 'Rapidly build modern websites without ever leaving your HTML.',
    iconUrl: 'https://tailwindcss.com/favicons/favicon.ico',
    bid: 4,
    clicks: 43,
    submittedAt: '2026-08-24',
    keySlot: 'T',
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    url: 'https://nextjs.org',
    tagline: 'The React Framework for the Web.',
    iconUrl: 'https://nextjs.org/favicon.ico',
    bid: 3,
    clicks: 31,
    submittedAt: '2026-08-25',
    keySlot: 'N',
  },
];
