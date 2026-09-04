'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'motion/react';
import { IconGripHorizontal, IconSun, IconMoon } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export type AnimationVariant =
  | 'circle'
  | 'rectangle'
  | 'gif'
  | 'polygon'
  | 'circle-blur';

export type AnimationStart =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'
  | 'top-center'
  | 'bottom-center'
  | 'bottom-up'
  | 'top-down'
  | 'left-right'
  | 'right-left';

interface Animation {
  name: string;
  css: string;
}

const getPositionCoords = (position: AnimationStart) => {
  switch (position) {
    case 'top-left':
      return { cx: '0', cy: '0' };
    case 'top-right':
      return { cx: '40', cy: '0' };
    case 'bottom-left':
      return { cx: '0', cy: '40' };
    case 'bottom-right':
      return { cx: '40', cy: '40' };
    case 'top-center':
      return { cx: '20', cy: '0' };
    case 'bottom-center':
      return { cx: '20', cy: '40' };
    case 'bottom-up':
    case 'top-down':
    case 'left-right':
    case 'right-left':
      return { cx: '20', cy: '20' };
  }
};

const generateSVG = (variant: AnimationVariant, start: AnimationStart) => {
  if (variant === 'circle-blur') {
    if (start === 'center') {
      return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="20" cy="20" r="18" fill="white" filter="url(%23blur)"/></svg>`;
    }
    const positionCoords = getPositionCoords(start);
    if (!positionCoords) return '';
    const { cx, cy } = positionCoords;
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><filter id="blur"><feGaussianBlur stdDeviation="2"/></filter></defs><circle cx="${cx}" cy="${cy}" r="18" fill="white" filter="url(%23blur)"/></svg>`;
  }

  if (start === 'center') return '';
  if (variant === 'rectangle') return '';

  const positionCoords = getPositionCoords(start);
  if (!positionCoords) return '';
  const { cx, cy } = positionCoords;

  if (variant === 'circle') {
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="${cx}" cy="${cy}" r="20" fill="white"/></svg>`;
  }

  return '';
};

const getTransformOrigin = (start: AnimationStart) => {
  switch (start) {
    case 'top-left':
      return 'top left';
    case 'top-right':
      return 'top right';
    case 'bottom-left':
      return 'bottom left';
    case 'bottom-right':
      return 'bottom right';
    case 'top-center':
      return 'top center';
    case 'bottom-center':
      return 'bottom center';
    case 'bottom-up':
    case 'top-down':
    case 'left-right':
    case 'right-left':
      return 'center';
  }
};

export const createAnimation = (
  variant: AnimationVariant,
  start: AnimationStart = 'top-right',
  blur = false,
  url?: string,
  coords?: { x: number; y: number }
): Animation => {
  const svg = generateSVG(variant, start);
  const transformOrigin = getTransformOrigin(start);
  const expoOut = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  const expoIn = 'cubic-bezier(0.55, 0, 0.7, 0.06)';

  // If exact mouse click coordinates are available and variant is circle
  if (variant === 'circle' && coords && typeof window !== 'undefined') {
    const { x, y } = coords;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    return {
      name: `circle-coords-${x}-${y}`,
      css: `
      ::view-transition-group(root) {
        animation-duration: 1.2s;
        animation-timing-function: ${expoOut};
      }
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 1.2s;
        animation-timing-function: ${expoOut};
        mix-blend-mode: normal;
      }
      ::view-transition-new(root) {
        animation-name: reveal-light-coords;
        ${blur ? 'filter: blur(2px);' : ''}
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark-coords;
        ${blur ? 'filter: blur(2px);' : ''}
      }
      @keyframes reveal-dark-coords {
        from {
          clip-path: circle(0px at ${x}px ${y}px);
          ${blur ? 'filter: blur(8px);' : ''}
        }
        ${blur ? '50% { filter: blur(4px); }' : ''}
        to {
          clip-path: circle(${endRadius}px at ${x}px ${y}px);
          ${blur ? 'filter: blur(0px);' : ''}
        }
      }
      @keyframes reveal-light-coords {
        from {
          clip-path: circle(0px at ${x}px ${y}px);
          ${blur ? 'filter: blur(8px);' : ''}
        }
        ${blur ? '50% { filter: blur(4px); }' : ''}
        to {
          clip-path: circle(${endRadius}px at ${x}px ${y}px);
          ${blur ? 'filter: blur(0px);' : ''}
        }
      }
      html.theme-transitioning,
      html.theme-transitioning *,
      html.theme-transitioning *:before,
      html.theme-transitioning *:after {
        transition: none !important;
      }
      `,
    };
  }

  if (variant === 'rectangle') {
    const getClipPath = (direction: AnimationStart) => {
      switch (direction) {
        case 'bottom-up':
          return {
            from: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          };
        case 'top-down':
          return {
            from: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          };
        case 'left-right':
          return {
            from: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
            to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          };
        case 'right-left':
          return {
            from: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
            to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          };
        case 'top-left':
          return {
            from: 'polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)',
            to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          };
        case 'top-right':
          return {
            from: 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)',
            to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          };
        case 'bottom-left':
          return {
            from: 'polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)',
            to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          };
        case 'bottom-right':
          return {
            from: 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)',
            to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          };
        default:
          return {
            from: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
            to: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          };
      }
    };

    const clipPath = getClipPath(start);

    return {
      name: `${variant}-${start}${blur ? '-blur' : ''}`,
      css: `
      ::view-transition-group(root) {
        animation-duration: 1.2s;
        animation-timing-function: ${expoOut};
      }
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 1.2s;
        animation-timing-function: ${expoOut};
        mix-blend-mode: normal;
      }
      ::view-transition-new(root) {
        animation-name: reveal-light-${start}${blur ? '-blur' : ''};
        ${blur ? 'filter: blur(2px);' : ''}
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark-${start}${blur ? '-blur' : ''};
        ${blur ? 'filter: blur(2px);' : ''}
      }
      @keyframes reveal-dark-${start}${blur ? '-blur' : ''} {
        from {
          clip-path: ${clipPath.from};
          ${blur ? 'filter: blur(8px);' : ''}
        }
        ${blur ? '50% { filter: blur(4px); }' : ''}
        to {
          clip-path: ${clipPath.to};
          ${blur ? 'filter: blur(0px);' : ''}
        }
      }
      @keyframes reveal-light-${start}${blur ? '-blur' : ''} {
        from {
          clip-path: ${clipPath.from};
          ${blur ? 'filter: blur(8px);' : ''}
        }
        ${blur ? '50% { filter: blur(4px); }' : ''}
        to {
          clip-path: ${clipPath.to};
          ${blur ? 'filter: blur(0px);' : ''}
        }
      }
      html.theme-transitioning,
      html.theme-transitioning *,
      html.theme-transitioning *:before,
      html.theme-transitioning *:after {
        transition: none !important;
      }
      `,
    };
  }

  if (variant === 'circle' && start === 'center') {
    return {
      name: `${variant}-${start}${blur ? '-blur' : ''}`,
      css: `
      ::view-transition-group(root) {
        animation-duration: 1.2s;
        animation-timing-function: ${expoOut};
      }
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 1.2s;
        animation-timing-function: ${expoOut};
        mix-blend-mode: normal;
      }
      ::view-transition-new(root) {
        animation-name: reveal-light${blur ? '-blur' : ''};
        ${blur ? 'filter: blur(2px);' : ''}
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark${blur ? '-blur' : ''};
        ${blur ? 'filter: blur(2px);' : ''}
      }
      @keyframes reveal-dark${blur ? '-blur' : ''} {
        from {
          clip-path: circle(0% at 50% 50%);
          ${blur ? 'filter: blur(8px);' : ''}
        }
        ${blur ? '50% { filter: blur(4px); }' : ''}
        to {
          clip-path: circle(100.0% at 50% 50%);
          ${blur ? 'filter: blur(0px);' : ''}
        }
      }
      @keyframes reveal-light${blur ? '-blur' : ''} {
        from {
           clip-path: circle(0% at 50% 50%);
           ${blur ? 'filter: blur(8px);' : ''}
        }
        ${blur ? '50% { filter: blur(4px); }' : ''}
        to {
          clip-path: circle(100.0% at 50% 50%);
          ${blur ? 'filter: blur(0px);' : ''}
        }
      }
      html.theme-transitioning,
      html.theme-transitioning *,
      html.theme-transitioning *:before,
      html.theme-transitioning *:after {
        transition: none !important;
      }
      `,
    };
  }

  if (variant === 'circle') {
    const getClipPathPosition = (position: AnimationStart) => {
      switch (position) {
        case 'top-left':
          return '0% 0%';
        case 'top-right':
          return '100% 0%';
        case 'bottom-left':
          return '0% 100%';
        case 'bottom-right':
          return '100% 100%';
        case 'top-center':
          return '50% 0%';
        case 'bottom-center':
          return '50% 100%';
        default:
          return '100% 0%';
      }
    };

    const clipPosition = getClipPathPosition(start);

    return {
      name: `${variant}-${start}${blur ? '-blur' : ''}`,
      css: `
      ::view-transition-group(root) {
        animation-duration: 1.2s;
        animation-timing-function: ${expoOut};
      }
      ::view-transition-old(root),
      ::view-transition-new(root) {
        animation-duration: 1.2s;
        animation-timing-function: ${expoOut};
        mix-blend-mode: normal;
      }
      ::view-transition-new(root) {
        animation-name: reveal-light-${start}${blur ? '-blur' : ''};
        ${blur ? 'filter: blur(2px);' : ''}
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: none;
        z-index: -1;
      }
      .dark::view-transition-new(root) {
        animation-name: reveal-dark-${start}${blur ? '-blur' : ''};
        ${blur ? 'filter: blur(2px);' : ''}
      }
      @keyframes reveal-dark-${start}${blur ? '-blur' : ''} {
        from {
          clip-path: circle(0% at ${clipPosition});
          ${blur ? 'filter: blur(8px);' : ''}
        }
        ${blur ? '50% { filter: blur(4px); }' : ''}
        to {
          clip-path: circle(160.0% at ${clipPosition});
          ${blur ? 'filter: blur(0px);' : ''}
        }
      }
      @keyframes reveal-light-${start}${blur ? '-blur' : ''} {
        from {
           clip-path: circle(0% at ${clipPosition});
           ${blur ? 'filter: blur(8px);' : ''}
        }
        ${blur ? '50% { filter: blur(4px); }' : ''}
        to {
          clip-path: circle(160.0% at ${clipPosition});
          ${blur ? 'filter: blur(0px);' : ''}
        }
      }
      html.theme-transitioning,
      html.theme-transitioning *,
      html.theme-transitioning *:before,
      html.theme-transitioning *:after {
        transition: none !important;
      }
      `,
    };
  }

  if (variant === 'gif') {
    return {
      name: `${variant}-${start}`,
      css: `
      ::view-transition-group(root) {
        animation-timing-function: ${expoIn};
      }
      ::view-transition-old(root),
      ::view-transition-new(root) {
        mix-blend-mode: normal;
      }
      ::view-transition-new(root) {
        mask: url('${url || ''}') center / 0 no-repeat;
        animation: scale-gif 3s;
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: scale-gif 3s;
      }
      @keyframes scale-gif {
        0% {
          mask-size: 0;
        }
        10% {
          mask-size: 50vmax;
        }
        90% {
          mask-size: 50vmax;
        }
        100% {
          mask-size: 2000vmax;
        }
      }`,
    };
  }

  if (variant === 'circle-blur') {
    return {
      name: `${variant}-${start}`,
      css: `
      ::view-transition-group(root) {
        animation-timing-function: ${expoOut};
      }
      ::view-transition-old(root),
      ::view-transition-new(root) {
        mix-blend-mode: normal;
      }
      ::view-transition-new(root) {
        mask: url('${svg}') ${start.replace('-', ' ')} / 0 no-repeat;
        mask-origin: content-box;
        animation: scale-cb-${start} 1s;
        transform-origin: ${transformOrigin};
      }
      ::view-transition-old(root),
      .dark::view-transition-old(root) {
        animation: scale-cb-${start} 1s;
        transform-origin: ${transformOrigin};
        z-index: -1;
      }
      @keyframes scale-cb-${start} {
        to {
          mask-size: 350vmax;
        }
      }
      `,
    };
  }

  // Polygon variant
  return {
    name: `${variant}-${start}`,
    css: `
    ::view-transition-group(root) {
      animation-duration: 1.2s;
      animation-timing-function: ${expoOut};
    }
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation-duration: 1.2s;
      animation-timing-function: ${expoOut};
      mix-blend-mode: normal;
    }
    ::view-transition-new(root) {
      animation-name: reveal-polygon;
    }
    ::view-transition-old(root),
    .dark::view-transition-old(root) {
      animation: none;
      z-index: -1;
    }
    .dark::view-transition-new(root) {
      animation-name: reveal-polygon;
    }
    @keyframes reveal-polygon {
      from {
        clip-path: polygon(150% -71%, 250% 71%, 250% 71%, 150% -71%);
      }
      to {
        clip-path: polygon(150% -71%, 250% 71%, 50% 171%, -71% 50%);
      }
    }
    `,
  };
};

/**
 * useThemeTransition hook
 * Works seamlessly with next-themes useTheme()
 */
export const useThemeTransition = ({
  variant = 'circle',
  start = 'top-right',
  blur = false,
  gifUrl = '',
}: {
  variant?: AnimationVariant;
  start?: AnimationStart;
  blur?: boolean;
  gifUrl?: string;
} = {}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = (resolvedTheme || theme) === 'dark';
  const styleId = 'theme-transition-styles';

  const updateStyles = useCallback((css: string) => {
    if (typeof window === 'undefined') return;

    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = css;
  }, []);

  const toggleTheme = useCallback(
    (event?: React.MouseEvent | { clientX: number; clientY: number }) => {
      const targetTheme = isDark ? 'light' : 'dark';

      let coords: { x: number; y: number } | undefined;
      if (event && 'clientX' in event && typeof event.clientX === 'number') {
        coords = { x: event.clientX, y: event.clientY };
      }

      const animation = createAnimation(variant, start, blur, gifUrl, coords);
      updateStyles(animation.css);

      if (typeof window === 'undefined') return;

      // Fallback if browser doesn't support View Transitions
      if (!('startViewTransition' in document)) {
        setTheme(targetTheme);
        return;
      }

      // Synchronously switch theme state and DOM class during the transition
      document.documentElement.classList.add('theme-transitioning');
      const transition = (document as any).startViewTransition(() => {
        if (targetTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        setTheme(targetTheme);
      });

      transition.finished
        .catch(() => {})
        .finally(() => {
          document.documentElement.classList.remove('theme-transitioning');
        });
    },
    [isDark, variant, start, blur, gifUrl, updateStyles, setTheme]
  );

  return {
    isDark,
    mounted,
    theme,
    resolvedTheme,
    toggleTheme,
  };
};

/**
 * Drop-in Keybid Navbar Toggle
 */
export const KeybidThemeToggleWithTransition = ({
  className = '',
  variant = 'circle',
  start = 'top-right',
  blur = false,
  gifUrl = '',
}: {
  className?: string;
  variant?: AnimationVariant;
  start?: AnimationStart;
  blur?: boolean;
  gifUrl?: string;
}) => {
  const { isDark, toggleTheme, mounted } = useThemeTransition({
    variant,
    start,
    blur,
    gifUrl,
  });

  return (
    <div
      className={cn(
        'group size-15 flex justify-center items-center rounded-[14px] hover:cursor-pointer bg-violet-400/20 mx-[1] transition-transform active:scale-95',
        className
      )}
      onClick={(e) => toggleTheme(e)}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTheme();
        }
      }}
    >
      {mounted ? (
        <>
          <IconSun
            stroke={1}
            className={cn(
              'text-zinc-700 dark:block hidden cursor-pointer size-5 fill-zinc-700 group-hover:fill-yellow-500 transition-all duration-300'
            )}
          />
          <IconMoon
            stroke={1}
            className={cn(
              'text-zinc-700 dark:hidden block cursor-pointer size-5 fill-zinc-700 group-hover:fill-neutral-200 transition-all duration-300'
            )}
          />
        </>
      ) : (
        <div className="size-5 rounded-full bg-zinc-400/30 animate-pulse" />
      )}
    </div>
  );
};
