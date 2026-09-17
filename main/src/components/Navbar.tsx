'use client';
import React from 'react';
import { KeybidThemeToggleWithTransition } from "./ThemeTransition";
import { cn } from "@/src/lib/utils";
import StackIcon from "./StackIcon";
import { IconMenu2, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import Ping from './Ping';
import Link from 'next/link';

function Navbar() {

    const { scrollY } = useScroll();
    const [menuOpen, setMenuOpen] = React.useState(false);

    const blurOpacity = useTransform(scrollY, [0, 70], [0, 1]);
    const navLinks = [
        { href: "/privacy", label: "Privacy" },
        { href: "/policy", label: "Policy" },
        { href: "/rules", label: "Rules" },
        { href: "/terms", label: "Terms" },
    ];


    return (
        <>
            {/* Smooth Multi-Layer Progressive Top Blur on Scroll */}
            <motion.div
                aria-hidden="true"
                style={{ opacity: blurOpacity }}
                className="pointer-events-none fixed top-0 inset-x-0 h-28 sm:h-32 z-40 select-none overflow-hidden"
            >
                {/* Layer 1: Ambient soft base blur across the entire height */}
                <div
                    className="absolute inset-0"
                    style={{
                        backdropFilter: "blur(8px)",
                        WebkitBackdropFilter: "blur(8px)",
                        maskImage:
                            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)",
                        WebkitMaskImage:
                            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.2) 80%, rgba(0,0,0,0) 100%)",
                    }}
                />

                {/* Layer 2: Deeper blur closer to the top and navbar */}
                <div
                    className="absolute inset-0"
                    style={{
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        maskImage:
                            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0) 75%)",
                        WebkitMaskImage:
                            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0) 75%)",
                    }}
                />

                {/* Layer 3: Soft ambient background gradient to dissolve content */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc]/80 via-[#f8fafc]/30 to-transparent dark:from-[#080a0d]/85 dark:via-[#080a0d]/35 dark:to-transparent" />
            </motion.div>

            <header className={cn("w-[95%] max-w-6xl mx-auto flex justify-between items-stretch sticky top-4 sm:top-5 z-50 bg-white/85 dark:bg-zinc-900/80 border border-neutral-200/80 dark:border-white/10 backdrop-blur-2xl rounded-2xl shadow-xs")}>

                {/* Left: logo group */}
                <Link href={"/"}>
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">

                        <StackIcon className={cn("size-15")} />

                        <div className={cn("text-neutral-700/90 flex justify-center items-center shrink-0")}>
                            <svg className={cn("h-6 w-auto")} viewBox="0 0 66 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.72001 9L4.98001 4.5C5.14001 4.124 5.29601 3.748 5.44801 3.372C5.60001 2.996 5.75201 2.624 5.90401 2.256C6.06401 1.88 6.22001 1.504 6.37201 1.128C6.53201 0.752 6.68801 0.376 6.84001 -7.15256e-07H12.24C12.104 0.279999 11.944 0.604 11.76 0.972C11.576 1.34 11.388 1.712 11.196 2.088C11.012 2.464 10.84 2.812 10.68 3.132C10.52 3.452 10.388 3.712 10.284 3.912C10.188 4.104 10.14 4.2 10.14 4.2C10.14 4.2 10.192 4.316 10.296 4.548C10.4 4.772 10.536 5.068 10.704 5.436C10.872 5.804 11.056 6.204 11.256 6.636C11.456 7.06 11.652 7.48 11.844 7.896C12.036 8.312 12.208 8.68 12.36 9H6.72001ZM9.78261e-06 9C9.78261e-06 8.416 9.78261e-06 7.832 9.78261e-06 7.248C9.78261e-06 6.656 9.78261e-06 6.068 9.78261e-06 5.484C9.78261e-06 4.9 9.78261e-06 4.316 9.78261e-06 3.732C9.78261e-06 3.14 9.78261e-06 2.552 9.78261e-06 1.968C9.78261e-06 1.64 9.78261e-06 1.312 9.78261e-06 0.983999C9.78261e-06 0.655999 9.78261e-06 0.327999 9.78261e-06 -7.15256e-07H4.98001C4.98001 0.367999 4.98001 0.735999 4.98001 1.104C4.98001 1.472 4.98001 1.84 4.98001 2.208C4.98001 2.576 4.98001 2.944 4.98001 3.312C4.98001 3.68 4.98001 4.048 4.98001 4.416C4.98001 4.424 4.98001 4.436 4.98001 4.452C4.98001 4.468 4.98001 4.484 4.98001 4.5C4.98001 4.508 4.98001 4.516 4.98001 4.524C4.98001 4.532 4.98001 4.544 4.98001 4.56C4.98001 4.568 4.98001 4.576 4.98001 4.584C4.98001 5.32 4.98001 6.056 4.98001 6.792C4.98001 7.528 4.98001 8.264 4.98001 9H9.78261e-06ZM22.6779 3.024H17.4579C17.4499 3.024 17.4459 3.024 17.4459 3.024V3.684C17.4459 3.692 17.4459 3.7 17.4459 3.708C17.4539 3.708 17.4579 3.708 17.4579 3.708H22.4979V5.4H17.4579C17.4579 5.4 17.4539 5.4 17.4459 5.4C17.4459 5.4 17.4459 5.404 17.4459 5.412C17.4459 5.412 17.4459 5.416 17.4459 5.424V6.096C17.4539 6.096 17.4579 6.096 17.4579 6.096H22.7499V9H12.5859C12.5859 8.528 12.5859 8.056 12.5859 7.584C12.5859 7.104 12.5859 6.628 12.5859 6.156C12.5859 5.684 12.5859 5.212 12.5859 4.74C12.5859 4.26 12.5859 3.784 12.5859 3.312C12.5859 2.832 12.5859 2.356 12.5859 1.884C12.5859 1.572 12.5859 1.26 12.5859 0.948C12.5859 0.628 12.5859 0.312 12.5859 -7.15256e-07H22.6779V3.024ZM30.5485 -7.15256e-07H35.9965C35.5565 0.799999 35.1165 1.6 34.6765 2.4C34.2365 3.2 33.7925 4 33.3445 4.8C32.9045 5.6 32.4645 6.4 32.0245 7.2V9H27.0445V7.188C26.7645 6.708 26.4845 6.228 26.2045 5.748C25.9325 5.268 25.6565 4.788 25.3765 4.308C25.1045 3.828 24.8285 3.352 24.5485 2.88C24.2685 2.4 23.9885 1.92 23.7085 1.44C23.4365 0.959999 23.1605 0.479999 22.8805 -7.15256e-07H28.6405C28.7445 0.384 28.8445 0.768 28.9405 1.152C29.0445 1.536 29.1485 1.92 29.2525 2.304C29.3565 2.688 29.4565 3.072 29.5525 3.456C29.5525 3.456 29.5525 3.46 29.5525 3.468C29.5605 3.468 29.5645 3.468 29.5645 3.468C29.5725 3.46 29.5765 3.456 29.5765 3.456C29.6565 3.168 29.7365 2.88 29.8165 2.592C29.8965 2.304 29.9765 2.016 30.0565 1.728C30.1445 1.44 30.2285 1.152 30.3085 0.864C30.3885 0.575999 30.4685 0.287999 30.5485 -7.15256e-07Z" className="fill-zinc-950 dark:fill-white" />
                                <path d="M36.2109 -7.15256e-07H45.5829C46.1189 -7.15256e-07 46.5629 0.103999 46.9149 0.312C47.2669 0.511999 47.5309 0.771999 47.7069 1.092C47.8909 1.412 47.9829 1.748 47.9829 2.1C47.9829 2.452 47.8909 2.796 47.7069 3.132C47.5229 3.46 47.2509 3.728 46.8909 3.936C46.5309 4.144 46.0829 4.248 45.5469 4.248C45.5469 4.248 45.5429 4.248 45.5349 4.248C45.5349 4.248 45.5349 4.252 45.5349 4.26C45.5429 4.26 45.5469 4.26 45.5469 4.26C46.1949 4.26 46.7309 4.376 47.1549 4.608C47.5789 4.84 47.8949 5.136 48.1029 5.496C48.3109 5.856 48.4149 6.236 48.4149 6.636C48.4149 6.932 48.3549 7.22 48.2349 7.5C48.1229 7.78 47.9509 8.036 47.7189 8.268C47.4869 8.492 47.1989 8.672 46.8549 8.808C46.5109 8.936 46.1109 9 45.6549 9H36.2109C36.2109 8.456 36.2109 7.916 36.2109 7.38C36.2109 6.836 36.2109 6.292 36.2109 5.748C36.2109 5.204 36.2109 4.664 36.2109 4.128C36.2109 3.584 36.2109 3.04 36.2109 2.496C36.2109 2.08 36.2109 1.664 36.2109 1.248C36.2109 0.832 36.2109 0.416 36.2109 -7.15256e-07ZM40.9389 4.728C40.9389 4.816 40.9389 4.904 40.9389 4.992C40.9389 5.08 40.9389 5.168 40.9389 5.256C40.9389 5.32 40.9389 5.384 40.9389 5.448C40.9389 5.504 40.9389 5.56 40.9389 5.616C40.9389 5.672 40.9389 5.728 40.9389 5.784C40.9389 5.792 40.9429 5.796 40.9509 5.796H42.6549C42.8709 5.796 43.0309 5.74 43.1349 5.628C43.2469 5.516 43.3029 5.388 43.3029 5.244C43.3029 5.172 43.2909 5.108 43.2669 5.052C43.2429 4.988 43.2069 4.932 43.1589 4.884C43.1189 4.828 43.0629 4.788 42.9909 4.764C42.9269 4.732 42.8509 4.716 42.7629 4.716H40.9509C40.9509 4.716 40.9469 4.72 40.9389 4.728ZM40.9509 3.036C40.9429 3.036 40.9389 3.04 40.9389 3.048C40.9389 3.096 40.9389 3.152 40.9389 3.216C40.9389 3.272 40.9389 3.332 40.9389 3.396C40.9389 3.452 40.9389 3.512 40.9389 3.576C40.9389 3.664 40.9389 3.756 40.9389 3.852C40.9389 3.94 40.9389 4.024 40.9389 4.104C40.9389 4.112 40.9429 4.116 40.9509 4.116H42.5949C42.7389 4.116 42.8589 4.092 42.9549 4.044C43.0509 3.988 43.1229 3.92 43.1709 3.84C43.2189 3.752 43.2429 3.66 43.2429 3.564C43.2429 3.428 43.1949 3.308 43.0989 3.204C43.0109 3.092 42.8789 3.036 42.7029 3.036H40.9509ZM48.7617 9C48.7617 8.632 48.7617 8.268 48.7617 7.908C48.7617 7.54 48.7617 7.176 48.7617 6.816C48.7617 6.448 48.7617 6.084 48.7617 5.724C48.7617 5.572 48.7617 5.42 48.7617 5.268C48.7617 5.116 48.7617 4.964 48.7617 4.812C49.2257 4.812 49.6857 4.812 50.1417 4.812C50.6057 4.812 51.0697 4.812 51.5337 4.812C51.9977 4.812 52.4577 4.812 52.9137 4.812C52.9137 5.276 52.9137 5.74 52.9137 6.204C52.9137 6.668 52.9137 7.136 52.9137 7.608C52.9137 8.072 52.9137 8.536 52.9137 9H48.7617ZM48.7617 4.812C48.7617 4.268 48.7617 3.724 48.7617 3.18C48.7617 2.096 48.7617 2.096 48.7617 1.56H52.9137C52.9137 1.824 52.9137 2.088 52.9137 2.352C52.9137 2.616 52.9137 2.88 52.9137 3.144C52.9137 3.408 52.9137 3.672 52.9137 3.936C52.9137 3.936 52.9097 3.94 52.9017 3.948C52.2137 4.092 51.5217 4.236 50.8257 4.38C50.1377 4.524 49.4497 4.668 48.7617 4.812ZM60.5426 -7.15256e-07C61.2946 -7.15256e-07 61.9586 0.0839994 62.5346 0.252C63.1186 0.411999 63.6186 0.635999 64.0346 0.924C64.4506 1.212 64.7906 1.548 65.0546 1.932C65.3186 2.308 65.5146 2.712 65.6426 3.144C65.7706 3.576 65.8346 4.016 65.8346 4.464C65.8346 5.032 65.7306 5.588 65.5226 6.132C65.3226 6.668 65.0066 7.152 64.5746 7.584C64.1506 8.016 63.6026 8.36 62.9306 8.616C62.2666 8.872 61.4706 9 60.5426 9H53.3906C53.3906 8.488 53.3906 7.98 53.3906 7.476C53.3906 6.964 53.3906 6.456 53.3906 5.952C53.3906 5.44 53.3906 4.932 53.3906 4.428C53.3906 3.916 53.3906 3.404 53.3906 2.892C53.3906 2.412 53.3906 1.932 53.3906 1.452C53.3906 0.964 53.3906 0.479999 53.3906 -7.15256e-07H60.5426ZM59.5826 3.456H58.1546C58.1546 3.456 58.1506 3.456 58.1426 3.456C58.1426 3.456 58.1426 3.46 58.1426 3.468C58.1426 3.468 58.1426 3.472 58.1426 3.48V5.52C58.1426 5.528 58.1426 5.536 58.1426 5.544C58.1506 5.544 58.1546 5.544 58.1546 5.544H59.6066C59.7826 5.544 59.9386 5.516 60.0746 5.46C60.2186 5.404 60.3386 5.328 60.4346 5.232C60.5306 5.136 60.6026 5.024 60.6506 4.896C60.7066 4.768 60.7346 4.636 60.7346 4.5C60.7346 4.308 60.6866 4.132 60.5906 3.972C60.5026 3.812 60.3746 3.688 60.2066 3.6C60.0386 3.504 59.8306 3.456 59.5826 3.456Z" className={cn("fill-blue-600/80")} />
                            </svg>
                        </div>
                    </div>
                </Link>

                {/* Navigation links */}
                {/* <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    <a href="#auction" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Auction
                    </a>
                    <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        How it works
                    </a>
                    <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        FAQ
                    </a>
                </div> */}

                {/* Right: pool total + theme toggle */}
                <div className="hidden sm:flex items-center justify-center gap-2 sm:gap-3 ">
                    <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 mr-5">
                        {navLinks.map((link) => (
                            <a href={link.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                {link.label}
                            </a>
                        ))}

                    </div>


                    <KeybidThemeToggleWithTransition variant="circle" start="top-center" blur={true} />
                </div>

                {/* Mobile: theme toggle + hamburger */}
                <div className="flex sm:hidden items-center gap-2">

                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        className="relative flex h-9 w-9 items-center justify-center rounded-full text-zinc-700 dark:text-zinc-300"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {menuOpen ? (
                                <motion.span
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <IconX size={22} stroke={1.75} />
                                </motion.span>
                            ) : (
                                <motion.span
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <IconMenu2 size={22} stroke={1.75} />
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                    <KeybidThemeToggleWithTransition variant="circle" start="top-center" blur={true} />
                </div>


            </header>
            {/* Mobile dropdown menu */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -12, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -12, scale: 0.98 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="fixed left-[2.5%] right-[2.5%] top-[76px] z-50 sm:hidden rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl shadow-lg p-3"
                        >
                            <nav className="flex flex-col gap-1">
                                {navLinks.map((link, i) => (
                                    <motion.a
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMenuOpen(false)}
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * i, duration: 0.2 }}
                                        className="rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        {link.label}
                                    </motion.a>
                                ))}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
export default Navbar