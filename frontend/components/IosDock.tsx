"use client";

import React from "react";
import {
    AnimatePresence,
    motion,
    MotionValue,
    useMotionValue,
    useSpring,
    useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ── Branded icons ──────────────────────────────────────────────
import AppStoreIcon from "./icons/AppStoreIcon";
import AppleMusicIcon from "./icons/AppleMusicIcon";
import ApplePodcastsIcon from "./icons/ApplePodcast";
import AppleTvIcon from "./icons/AppleTv";
import ClaudeIcon from "./icons/ClaudeIcon";
import SlackIcon from "./icons/SlackIcon";
import SpotifyIcon from "./icons/SpotifyIcon";
import VSCodeIcon from "./icons/VsCodeIcon";
import YoutubeIcon from "./icons/YoutubeIcon";

// ── Types ───────────────────────────────────────────────────────
export type DockItem = {
    title: string;
    icon: React.ReactNode;
    href: string;
};

export interface FloatingDockProps {
    className?: string;
    items?: DockItem[];
}

interface IconsContainerProps {
    el: DockItem;
    mouseX: MotionValue<number>;
}

// ── Default dock items ──────────────────────────────────────────
const DEFAULT_LINKS: DockItem[] = [

    {
        title: "Spotify",
        icon: <SpotifyIcon className="w-full h-full" />,
        href: "#",
    },
    {
        title: "YouTube",
        icon: <YoutubeIcon className="w-full h-full" />,
        href: "#",
    },
    {
        title: "Slack",
        icon: <SlackIcon className="w-full h-full" />,
        href: "#",
    },
    {
        title: "VS Code",
        icon: <VSCodeIcon className="w-full h-full" />,
        href: "#",
    },
    {
        title: "Claude",
        icon: <ClaudeIcon className="" />,
        href: "#",
    },
];

// ── Dock container ──────────────────────────────────────────────
function IosDock({ className, items = DEFAULT_LINKS }: FloatingDockProps) {
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className={cn(
                "relative flex items-center justify-center h-11 sm:h-12 w-fit gap-2 px-2 rounded-2xl",
                "bg-white/15 dark:bg-black/30 backdrop-blur-2xl backdrop-saturate-150",
                "border border-white/20 dark:border-white/10",
                "shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_0.5px_0.5px_rgba(255,255,255,0.25)]",
                className,
            )}
        >
            {items.map((el) => (
                <IconsContainer key={el.title} el={el} mouseX={mouseX} />
            ))}
        </motion.div>
    );
}

// ── Individual icon cell ────────────────────────────────────────
function IconsContainer({
    el,
    mouseX,
}: IconsContainerProps): React.JSX.Element {
    const ref = React.useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = React.useState(false);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthTransform = useTransform(distance, [-130, 0, 130], [34, 58, 34]);
    const heightTransform = useTransform(distance, [-130, 0, 130], [34, 58, 34]);
    const widthIconTransform = useTransform(distance, [-130, 0, 130], [20, 32, 20]);
    const heightIconTransform = useTransform(distance, [-130, 0, 130], [20, 32, 20]);
    const borderRadiusTransform = useTransform(distance, [-130, 0, 130], [8, 14, 8]);

    const springCfg = { mass: 0.1, stiffness: 160, damping: 12 };
    const width = useSpring(widthTransform, springCfg);
    const height = useSpring(heightTransform, springCfg);
    const widthIcon = useSpring(widthIconTransform, springCfg);
    const heightIcon = useSpring(heightIconTransform, springCfg);
    const borderRadius = useSpring(borderRadiusTransform, springCfg);

    return (
        <motion.div
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ width, height, borderRadius }}
            className={cn(
                "relative flex items-center justify-center cursor-pointer select-none",
                "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md",
                "shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1.5px_1px_0.5px_rgba(255,255,255,0.2),inset_0_-2px_1px_0.05px_rgba(0,0,0,0.1)]",
                "hover:shadow-[0_6px_14px_rgba(0,0,0,0.25)] transition-shadow duration-150",
            )}
        >

            {/* Clickable link wrapping icon */}
            <Link
                href={el.href}
                className="w-full h-full flex items-center justify-center"
            >
                <motion.div
                    className="flex items-center justify-center"
                    style={{ width: widthIcon, height: heightIcon }}
                >
                    {el.icon}
                </motion.div>
            </Link>
        </motion.div>
    );
}

export { IosDock };