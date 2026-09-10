// src/lib/constant.ts
// Central constants file for Keybid

export interface FaqItem {
    value: string;
    trigger: string;
    content: string;
}

export const FAQ_ITEMS: FaqItem[] = [
    {
        value: "item-1",
        trigger: "Is this real?",
        content:
            "Yes, 100%. Every claimed key is mapped to custom UV-printed decals applied directly to my daily driver Apple Magic Keyboard and displayed in the virtual interactive keyboard.",
    },
    {
        value: "item-2",
        trigger: "How does the bidding work?",
        content:
            "Every key has an initial starting bid of $1. Anyone can outbid the current holder by at least $1. If you're outbid, your spot is replaced and you can choose to outbid back to reclaim it.",
    },
    {
        value: "item-3",
        trigger: "What happens if I get outbid?",
        content:
            "When you get outbid, the new highest bidder takes over that key slot. You will receive an immediate notification so you have the opportunity to defend your spot before the auction closes.",
    },
    {
        value: "item-4",
        trigger: "Can I change my logo or destination link later?",
        content:
            "Yes. Once the auction concludes and you are locked in as the winner for that key, you can submit an updated icon or redirect URL anytime through your verified claim link.",
    },
    {
        value: "item-5",
        trigger: "Can I bid on multiple keys?",
        content:
            "Absolutely! Several companies choose to bid on whole word combinations (e.g., 'A', 'I', or their company initial) or arrow keys for prominent visibility.",
    },
    {
        value: "item-6",
        trigger: "What if the keyboard is damaged, lost, or replaced?",
        content:
            "If the keyboard requires repair or replacement during the 365-day placement period, the exact same custom keycap decal set is reprinted and applied to the replacement Apple Magic Keyboard at zero cost to sponsors.",
    },
];


export interface StepItem {
    num: string;
    title: string;
    desc: string;
    tag: string;
}

export const HOW_IT_WORKS_STEPS: StepItem[] = [
    {
        num: "01",
        title: "Browse available keys",
        desc: "View every key on the keyboard along with its current highest bid and recent activity. Compare options and pick the key position that fits your brand.",
        tag: "Step 1",
    },
    {
        num: "02",
        title: "Place a bid",
        desc: "Submit a bid starting from $10, or place a higher bid on a key that's already taken. The current highest bid for each key is always visible on the page.",
        tag: "Step 2",
    },
    {
        num: "03",
        title: "Confirm and submit your logo",
        desc: "Once the round closes, the highest bidder for each key is confirmed and asked to submit a vector logo. A custom decal is then produced and applied to the keyboard.",
        tag: "Step 3",
    },
    {
        num: "04",
        title: "Get ongoing visibility",
        desc: "Your logo stays on the keyboard used in day-to-day builds, project demos, and desk setup content — giving your brand consistent, real exposure.",
        tag: "Step 4",
    },
];

export const CANVAS_TEXT_COLORS: string[] = [
    "rgba(0, 153, 255, 1)",
    "rgba(0, 153, 255, 0.9)",
    "rgba(0, 153, 255, 0.8)",
    "rgba(0, 153, 255, 0.7)",
    "rgba(0, 153, 255, 0.6)",
    "rgba(0, 153, 255, 0.5)",
    "rgba(0, 153, 255, 0.4)",
    "rgba(0, 153, 255, 0.3)",
    "rgba(0, 153, 255, 0.2)",
    "rgba(0, 153, 255, 0.1)",
];

export interface PodiumTier {
    rank: number;
    label: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    buttonColor: string;
    buttonOuterColor: string;
    colors: number[][];
    containerBg: string;
    animationSpeed: number;
    dotSize: number;
    borderHover: string;
}

export const PODIUM_CONFIG: Record<number, PodiumTier> = {
    1: {
        rank: 1,
        label: "Gold Rank",
        badgeBg: "bg-amber-500/15 dark:bg-amber-500/20",
        badgeText: "text-amber-800 dark:text-amber-400",
        badgeBorder: "border-amber-500/50",
        buttonColor: "bg-amber-400 hover:bg-amber-500 text-zinc-950",
        buttonOuterColor: "bg-amber-500/25",
        colors: [
            [245, 158, 11],
            [251, 191, 36],
            [217, 119, 6],
        ],
        containerBg: "bg-amber-950/80 dark:bg-black",
        animationSpeed: 3.2,
        dotSize: 2.5,
        borderHover: "hover:border-amber-500/60 dark:hover:border-amber-500/70",
    },
    2: {
        rank: 2,
        label: "Silver Rank",
        badgeBg: "bg-slate-500/15 dark:bg-slate-400/20",
        badgeText: "text-slate-800 dark:text-slate-300",
        badgeBorder: "border-slate-400/50",
        buttonColor: "bg-blue-600 hover:bg-blue-500 text-white",
        buttonOuterColor: "bg-blue-600/20",
        colors: [
            [203, 213, 225],
            [148, 163, 184],
            [226, 232, 240],
        ],
        containerBg: "bg-slate-950/80 dark:bg-black",
        animationSpeed: 3.2,
        dotSize: 2.3,
        borderHover: "hover:border-slate-400/60 dark:hover:border-slate-400/70",
    },
    3: {
        rank: 3,
        label: "Bronze Rank",
        badgeBg: "bg-amber-900/15 dark:bg-amber-800/20",
        badgeText: "text-amber-900 dark:text-amber-400",
        badgeBorder: "border-amber-700/50",
        buttonColor: "bg-blue-600 hover:bg-blue-500 text-white",
        buttonOuterColor: "bg-blue-600/20",
        colors: [
            [180, 83, 9],
            [217, 119, 6],
            [146, 64, 14],
        ],
        containerBg: "bg-amber-950/80 dark:bg-black",
        animationSpeed: 3.0,
        dotSize: 2.5,
        borderHover: "hover:border-amber-700/60 dark:hover:border-amber-700/70",
    },
};

export const KEY_DISPLAY_LABELS: Record<string, string> = {
    Escape: "esc",
    Backspace: "delete",
    Tab: "tab",
    Enter: "return",
    ShiftLeft: "shift",
    ShiftRight: "shift",
    ControlLeft: "control",
    ControlRight: "control",
    AltLeft: "option",
    AltRight: "option",
    MetaLeft: "command",
    MetaRight: "command",
    Space: "space",
    CapsLock: "caps",
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
    Backquote: "`",
    Minus: "-",
    Equal: "=",
    BracketLeft: "[",
    BracketRight: "]",
    Backslash: "\\",
    Semicolon: ";",
    Quote: "'",
    Comma: ",",
    Period: ".",
    Slash: "/",
};

export const getFaviconProviders = (domain: string): string[] => [
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://${domain}/favicon.ico`,
];

export const SITE_CONFIG = {
    name: "Keybid",
    creator: "Rachit Seth",
    twitterUrl: "https://x.com/seth_rachit_",
    description: "The startup keyboard leaderboard. Bid to claim a key, outbid anyone to take their spot.",
};

export const FOOTER_NAV_LINKS = [
    { href: "#auction", label: "Spots" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/policy", label: "Content & Sponsorship Policy" },
];

export const DITHER_SHADER_CONFIG = {
    light: {
        colorMode: "original" as const,
        brightness: 0,
        contrast: 1,
        threshold: 0.5,
        primaryColor: "#000000",
        secondaryColor: "#f5f5f5",
    },
    dark: {
        colorMode: "grayscale" as const,
        brightness: -0.22,
        contrast: 1.25,
        threshold: 0.58,
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
    },
};

