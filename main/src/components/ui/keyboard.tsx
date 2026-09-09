"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";
import type { Key } from "@/types/database";
import { useKeysStore } from "@/lib/store/keysStore";
import {
  IconBrightnessDown,
  IconBrightnessUp,
  IconCaretRightFilled,
  IconCaretUpFilled,
  IconChevronUp,
  IconMicrophone,
  IconMoon,
  IconPlayerSkipForward,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconTable,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconSearch,
  IconWorld,
  IconCommand,
  IconCaretLeftFilled,
  IconCaretDownFilled,
} from "@tabler/icons-react";

// Map key codes to display labels
const KEY_DISPLAY_LABELS: Record<string, string> = {
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

const getKeyDisplayLabel = (keyCode: string): string => {
  if (KEY_DISPLAY_LABELS[keyCode]) return KEY_DISPLAY_LABELS[keyCode];
  if (keyCode.startsWith("Key")) return keyCode.slice(3);
  if (keyCode.startsWith("Digit")) return keyCode.slice(5);
  if (keyCode.startsWith("F") && keyCode.length <= 3) return keyCode;
  return keyCode;
};

export const getKeySlotFromCode = (keyCode: string): string => {
  if (!keyCode) return "";
  if (keyCode.startsWith("Key")) return keyCode.slice(3).toUpperCase();
  if (keyCode.startsWith("Digit")) return keyCode.slice(5);
  if (keyCode === "Space") return "SPACE";
  if (keyCode === "Enter") return "RETURN";
  if (keyCode === "Escape") return "ESC";
  if (keyCode === "Backspace") return "DELETE";
  if (keyCode === "Tab") return "TAB";
  if (keyCode === "CapsLock") return "CAPS";
  if (keyCode === "ShiftLeft" || keyCode === "ShiftRight") return "SHIFT";
  if (keyCode === "MetaLeft" || keyCode === "MetaRight") return "CMD";
  if (keyCode === "AltLeft" || keyCode === "AltRight") return "OPT";
  if (keyCode === "ControlLeft" || keyCode === "ControlRight") return "CTRL";
  if (keyCode === "TouchID" || keyCode === "Power") return "TOUCH ID";
  if (keyCode === "BracketLeft") return "[";
  if (keyCode === "BracketRight") return "]";
  if (keyCode === "Backslash") return "\\";
  if (keyCode === "Semicolon") return ";";
  if (keyCode === "Quote") return "'";
  if (keyCode === "Comma") return ",";
  if (keyCode === "Period") return ".";
  if (keyCode === "Slash") return "/";
  if (keyCode === "Minus") return "-";
  if (keyCode === "Equal") return "=";
  if (keyCode === "Backquote") return "`";
  if (keyCode.startsWith("F") && keyCode.length <= 3) return keyCode;
  return keyCode;
};

interface KeyboardContextType {
  pressedKeys: Set<string>;
  setPressed: (keyCode: string) => void;
  setReleased: (keyCode: string) => void;
  lastPressedKey: string | null;
  onKeyClick?: (keySlot: string, keyData: Key | null) => void;
  keysMap: Map<string, Key>;
  isLoading: boolean;
  keysCount: number;
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

export const useKeyboardSound = () => {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboardSound must be used within KeyboardProvider");
  }
  return context;
};

export const useKeyboardContext = useKeyboardSound;

function KeyLogoContent({
  logo,
  alt,
  fallback,
}: {
  logo: string;
  alt: string;
  fallback: React.ReactNode;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !logo) {
    return <>{fallback}</>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo}
      alt={alt}
      title={alt}
      onError={() => setHasError(true)}
      className="absolute inset-0 h-full w-full object-cover rounded-[3.5px] select-none pointer-events-none"
      style={{ imageRendering: "auto" }}
    />
  );
}

export function ClaimedKeyIcon({
  letter,
  fallback,
}: {
  letter: string;
  fallback: React.ReactNode;
}) {
  const { keysMap } = useKeyboardSound();
  const claimedKey = keysMap.get(letter.toUpperCase());

  if (claimedKey && claimedKey.key_logo) {
    return (
      <KeyLogoContent
        logo={claimedKey.key_logo}
        alt={claimedKey.key_name || letter}
        fallback={fallback}
      />
    );
  }

  return <>{fallback}</>;
}

/** Derive the single-letter keyboard slot from a Key record.
 * Uses keyboard_key field first (the DB column that stores the claimed letter, e.g. "V"),
 * then falls back to the first char of submitted_url domain.
 */
function deriveKeySlot(k: Key): string {
  // 1. Use the explicit keyboard_key field (e.g. "V", "W", "A")
  if (k.keyboard_key && k.keyboard_key.trim().length > 0) {
    return k.keyboard_key.trim().toUpperCase();
  }
  // 2. Fallback: Extract from submitted_url domain's first alphanumeric character
  if (k.submitted_url) {
    try {
      const domain = k.submitted_url
        .replace(/^(https?:\/\/)?(www\.)?/, "")
        .split("/")[0]
        .split(":")[0];
      const firstChar = domain.match(/[a-zA-Z0-9]/)?.[0]?.toUpperCase();
      if (firstChar) return firstChar;
    } catch {
      // fall through
    }
  }
  // 3. If key_name is exactly 1 character, treat it as the slot
  if (k.key_name && k.key_name.trim().length === 1) {
    return k.key_name.trim().toUpperCase();
  }
  return "";
}

const KeyboardProvider = ({
  children,
  containerRef,
  syncPhysicalKeyboard = false,
  onKeyClick,
  keys: externalKeys,
}: {
  children: React.ReactNode;
  enableSound?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  syncPhysicalKeyboard?: boolean;
  onKeyClick?: (keySlot: string, keyData: Key | null) => void;
  /** Optional pre-fetched keys — if supplied, internal fetch is skipped */
  keys?: Key[];
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const storeKeys = useKeysStore((state) => state.keys);
  const storeLoading = useKeysStore((state) => state.isLoading);
  const activeKeys = externalKeys !== undefined ? externalKeys : storeKeys;
  const isLoading = externalKeys !== undefined ? false : storeLoading;

  const keysMap = React.useMemo(() => {
    const map = new Map<string, Key>();
    activeKeys.forEach((k) => {
      const slot = deriveKeySlot(k);
      if (slot) map.set(slot, k);
    });
    return map;
  }, [activeKeys]);

  const setPressed = useCallback((keyCode: string) => {
    setPressedKeys((prev) => new Set(prev).add(keyCode));
    setLastPressedKey(keyCode);
  }, []);

  const setReleased = useCallback((keyCode: string) => {
    setPressedKeys((prev) => {
      const next = new Set(prev);
      next.delete(keyCode);
      return next;
    });
  }, []);

  // Track visibility with IntersectionObserver
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [containerRef]);

  // Handle physical keyboard events (disabled by default so user keyboard is not synced)
  useEffect(() => {
    if (!syncPhysicalKeyboard || !isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent repeat events
      if (e.repeat) return;

      const keyCode = e.code;
      setPressed(keyCode);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyCode = e.code;
      setReleased(keyCode);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [syncPhysicalKeyboard, isVisible, setPressed, setReleased]);

  return (
    <KeyboardContext.Provider
      value={{
        pressedKeys,
        setPressed,
        setReleased,
        lastPressedKey,
        onKeyClick,
        keysMap,
        isLoading,
        keysCount: keysMap.size,
      }}
    >
      {children}
    </KeyboardContext.Provider>
  );
};

const KeystrokePreview = () => {
  const { lastPressedKey, pressedKeys } = useKeyboardSound();
  const [displayKey, setDisplayKey] = useState<string | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (lastPressedKey) {
      // Clear display if space or shift is pressed
      if (
        lastPressedKey === "Space" ||
        lastPressedKey === "ShiftLeft" ||
        lastPressedKey === "ShiftRight"
      ) {
        setDisplayKey(null);
        return;
      }

      setDisplayKey(getKeyDisplayLabel(lastPressedKey));
      setAnimationKey((prev) => prev + 1);
    }
  }, [lastPressedKey]);

  const isPressed = pressedKeys.size > 0;

  return (
    <div className="relative flex h-12 w-full items-center justify-center">
      <AnimatePresence mode="popLayout">
        {displayKey && (
          <motion.div
            key={animationKey}
            layout
            initial={{ opacity: 0, scale: 0.5, y: 5 }}
            animate={{
              opacity: 1,
              scale: isPressed ? 0.95 : 1,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.8, y: -5 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            }}
            className="absolute flex items-center justify-center rounded-lg px-4 py-2 font-mono text-2xl font-black text-neutral-700"
          >
            <motion.span
              initial={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
              animate={{ opacity: 0.6, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.05 }}
              className="text-2xl"
            >
              {displayKey}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Keyboard = ({
  className,
  showPreview = false,
  syncPhysicalKeyboard = false,
  onKeyClick,
  keys,
}: {
  className?: string;
  enableSound?: boolean;
  showPreview?: boolean;
  syncPhysicalKeyboard?: boolean;
  onKeyClick?: (keySlot: string, keyData: Key | null) => void;
  /** Pre-fetched keys from Supabase — pass these to avoid double-fetching */
  keys?: Key[];
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <KeyboardProvider
      containerRef={containerRef}
      syncPhysicalKeyboard={syncPhysicalKeyboard}
      onKeyClick={onKeyClick}
      keys={keys}
    >
      <div
        ref={containerRef}
        className={cn(
          "mx-auto w-fit [zoom:0.68] min-[360px]:[zoom:0.75] min-[390px]:[zoom:0.84] min-[440px]:[zoom:0.95] min-[520px]:[zoom:1.1] sm:[zoom:1.25] md:[zoom:1.5] lg:[zoom:1.75] xl:[zoom:2]",
          className,
        )}
      >
        {showPreview && <KeystrokePreview />}
        <Keypad />
      </div>
    </KeyboardProvider>
  );
};

export const Keypad = () => {
  return (
    <div className="h-full w-fit rounded-xl bg-[#e3e4e8] dark:bg-[#14161a] p-1 ring-1 ring-black/10 dark:ring-white/20 shadow-[0_1px_2px_rgba(0,0,0,0.14),0_2px_4px_rgba(0,0,0,0.12),0_6px_14px_-2px_rgba(0,0,0,0.16),0_16px_32px_-4px_rgba(0,0,0,0.18)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_3px_6px_rgba(0,0,0,0.6),0_8px_18px_-2px_rgba(0,0,0,0.7),0_20px_40px_-4px_rgba(0,0,0,0.85)] transition-all duration-250">
      {/* Function Row */}
      <Row>
        <Key
          keyCode="Escape"
          containerClassName="rounded-tl-xl"
          className="w-10 rounded-tl-lg"
          childrenClassName="items-start justify-end pb-[2px] pl-[4px]"
        >
          <span>esc</span>
        </Key>
        <Key keyCode="F1">
          <IconBrightnessDown className="h-[6px] w-[6px]" />
          <span className="mt-1">F1</span>
        </Key>
        <Key keyCode="F2">
          <IconBrightnessUp className="h-[6px] w-[6px]" />
          <span className="mt-1">F2</span>
        </Key>
        <Key keyCode="F3">
          <IconTable className="h-[6px] w-[6px]" />
          <span className="mt-1">F3</span>
        </Key>
        <Key keyCode="F4">
          <IconSearch className="h-[6px] w-[6px]" />
          <span className="mt-1">F4</span>
        </Key>
        <Key keyCode="F5">
          <IconMicrophone className="h-[6px] w-[6px]" />
          <span className="mt-1">F5</span>
        </Key>
        <Key keyCode="F6">
          <IconMoon className="h-[6px] w-[6px]" />
          <span className="mt-1">F6</span>
        </Key>
        <Key keyCode="F7">
          <IconPlayerTrackPrev className="h-[6px] w-[6px]" />
          <span className="mt-1">F7</span>
        </Key>
        <Key keyCode="F8">
          <IconPlayerSkipForward className="h-[6px] w-[6px]" />
          <span className="mt-1">F8</span>
        </Key>
        <Key keyCode="F9">
          <IconPlayerTrackNext className="h-[6px] w-[6px]" />
          <span className="mt-1">F9</span>
        </Key>
        <Key keyCode="F10">
          <IconVolume3 className="h-[6px] w-[6px]" />
          <span className="mt-1">F10</span>
        </Key>
        <Key keyCode="F11">
          <IconVolume2 className="h-[6px] w-[6px]" />
          <span className="mt-1">F11</span>
        </Key>
        <Key keyCode="F12">
          <IconVolume className="h-[6px] w-[6px]" />
          <span className="mt-1">F12</span>
        </Key>
        <Key keyCode="TouchID" containerClassName="rounded-tr-xl" className="rounded-tr-lg">
          <div className="h-[17px] w-[17px] rounded-full p-[1px] bg-gradient-to-b from-neutral-300 via-neutral-200 to-neutral-300 dark:from-neutral-600 dark:via-neutral-700 dark:to-neutral-600 shadow-sm flex items-center justify-center">
            <div className="h-full w-full rounded-full overflow-hidden flex items-center justify-center bg-black">
              <img
                src="/icon_no_border.svg"
                alt="Keybid"
                className="h-full w-full object-cover rounded-full"
              />
            </div>
          </div>
        </Key>
      </Row>

      {/* Number Row */}
      <Row>
        <Key keyCode="Backquote">
          <span>~</span>
          <span>`</span>
        </Key>
        <Key keyCode="Digit1">
          <span>!</span>
          <span>1</span>
        </Key>
        <Key keyCode="Digit2">
          <span>@</span>
          <span>2</span>
        </Key>
        <Key keyCode="Digit3">
          <span>#</span>
          <span>3</span>
        </Key>
        <Key keyCode="Digit4">
          <span>$</span>
          <span>4</span>
        </Key>
        <Key keyCode="Digit5">
          <span>%</span>
          <span>5</span>
        </Key>
        <Key keyCode="Digit6">
          <span>^</span>
          <span>6</span>
        </Key>
        <Key keyCode="Digit7">
          <span>&</span>
          <span>7</span>
        </Key>
        <Key keyCode="Digit8">
          <span>*</span>
          <span>8</span>
        </Key>
        <Key keyCode="Digit9">
          <span>(</span>
          <span>9</span>
        </Key>
        <Key keyCode="Digit0">
          <span>)</span>
          <span>0</span>
        </Key>
        <Key keyCode="Minus">
          <span>—</span>
          <span>_</span>
        </Key>
        <Key keyCode="Equal">
          <span>+</span>
          <span>=</span>
        </Key>
        <Key
          keyCode="Backspace"
          className="w-10"
          childrenClassName="items-end justify-end pr-[4px] pb-[2px]"
        >
          <span>delete</span>
        </Key>
      </Row>

      {/* QWERTY Row */}
      <Row>
        <Key
          keyCode="Tab"
          className="w-10"
          childrenClassName="items-start justify-end pb-[2px] pl-[4px]"
        >
          <span>tab</span>
        </Key>
        {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((letter) => (
          <Key key={letter} keyCode={`Key${letter}`}>
            {letter}
          </Key>
        ))}
        <Key keyCode="BracketLeft">
          <span>{`{`}</span>
          <span>{`[`}</span>
        </Key>
        <Key keyCode="BracketRight">
          <span>{`}`}</span>
          <span>{`]`}</span>
        </Key>
        <Key keyCode="Backslash">
          <span>{`|`}</span>
          <span>{`\\`}</span>
        </Key>
      </Row>

      {/* Home Row */}
      <Row>
        <Key
          keyCode="CapsLock"
          className="w-[2.8rem]"
          childrenClassName="items-start justify-end pb-[2px] pl-[4px]"
        >
          <span>caps lock</span>
        </Key>
        {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((letter) => (
          <Key key={letter} keyCode={`Key${letter}`}>
            {letter}
          </Key>
        ))}
        <Key keyCode="Semicolon">
          <span>:</span>
          <span>;</span>
        </Key>
        <Key keyCode="Quote">
          <span>{`"`}</span>
          <span>{`'`}</span>
        </Key>
        <Key
          keyCode="Enter"
          className="w-[2.85rem]"
          childrenClassName="items-end justify-end pr-[4px] pb-[2px]"
        >
          <span>return</span>
        </Key>
      </Row>

      {/* Bottom Letter Row */}
      <Row>
        <Key
          keyCode="ShiftLeft"
          className="w-[3.65rem]"
          childrenClassName="items-start justify-end pb-[2px] pl-[4px]"
        >
          <span>shift</span>
        </Key>
        {["Z", "X", "C", "V", "B", "N", "M"].map((letter) => (
          <Key key={letter} keyCode={`Key${letter}`}>
            {letter}
          </Key>
        ))}
        <Key keyCode="Comma">
          <span>{`<`}</span>
          <span>,</span>
        </Key>
        <Key keyCode="Period">
          <span>{`>`}</span>
          <span>.</span>
        </Key>
        <Key keyCode="Slash">
          <span>?</span>
          <span>/</span>
        </Key>
        <Key
          keyCode="ShiftRight"
          className="w-[3.65rem]"
          childrenClassName="items-end justify-end pr-[4px] pb-[2px]"
        >
          <span>shift</span>
        </Key>
      </Row>

      {/* Modifier Row */}
      <Row>
        <ModifierKey
          keyCode="Fn"
          containerClassName="rounded-bl-xl"
          className="rounded-bl-lg"
        >
          <span>fn</span>
          <IconWorld className="h-[6px] w-[6px]" />
        </ModifierKey>
        <ModifierKey keyCode="ControlLeft">
          <IconChevronUp className="h-[6px] w-[6px]" />
          <span>control</span>
        </ModifierKey>
        <ModifierKey keyCode="AltLeft">
          <OptionKey className="h-[6px] w-[6px]" />
          <span>option</span>
        </ModifierKey>
        <ModifierKey keyCode="MetaLeft" className="w-8">
          <IconCommand className="h-[6px] w-[6px]" />
          <span>command</span>
        </ModifierKey>
        <Key keyCode="Space" className="w-[8.2rem]" />
        <ModifierKey keyCode="MetaRight" className="w-8">
          <IconCommand className="h-[6px] w-[6px]" />
          <span>command</span>
        </ModifierKey>
        <ModifierKey keyCode="AltRight">
          <OptionKey className="h-[6px] w-[6px]" />
          <span>option</span>
        </ModifierKey>
        {/* Arrow Keys */}
        <div className="flex h-6 w-[4.9rem] items-center justify-end rounded-[4px] p-[0.5px]">
          <Key keyCode="ArrowLeft" className="h-6 w-6">
            <IconCaretLeftFilled className="h-[6px] w-[6px]" />
          </Key>
          <div className="flex flex-col">
            <Key keyCode="ArrowUp" className="h-3 w-6">
              <IconCaretUpFilled className="h-[6px] w-[6px]" />
            </Key>
            <Key keyCode="ArrowDown" className="h-3 w-6">
              <IconCaretDownFilled className="h-[6px] w-[6px]" />
            </Key>
          </div>
          <Key
            keyCode="ArrowRight"
            containerClassName="rounded-br-xl"
            className="h-6 w-6 rounded-br-lg"
          >
            <IconCaretRightFilled className="h-[6px] w-[6px]" />
          </Key>
        </div>
      </Row>
    </div>
  );
};

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">{children}</div>
);

const Key = ({
  className,
  childrenClassName,
  containerClassName,
  children,
  keyCode,
}: {
  className?: string;
  childrenClassName?: string;
  containerClassName?: string;
  children?: React.ReactNode;
  keyCode?: string;
}) => {
  const { pressedKeys, setPressed, setReleased, onKeyClick, keysMap } =
    useKeyboardSound();
  const isPressed = keyCode ? pressedKeys.has(keyCode) : false;

  const keySlot = keyCode ? getKeySlotFromCode(keyCode) : "";
  const claimedKey = keySlot
    ? keysMap.get(keySlot.toUpperCase()) || null
    : null;

  const handleMouseDown = () => {
    if (keyCode) {
      setPressed(keyCode);
    }
  };

  const handleMouseUp = () => {
    if (keyCode && isPressed) {
      setReleased(keyCode);
    }
  };

  const handleMouseLeave = () => {
    if (keyCode && isPressed) {
      setReleased(keyCode);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onKeyClick && keySlot) {
      onKeyClick(keySlot, claimedKey);
    }
  };

  return (
    <div className={cn("rounded-[4px] p-[0.5px]", containerClassName)}>
      <button
        type="button"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        title={
          claimedKey
            ? `${claimedKey.key_name || "Key"} (Key [${keySlot}]) · Current bid $${claimedKey.current_bid_amount || 0} · Click to Outbid`
            : keySlot
              ? `Key [${keySlot}] · Open · Click to Bid`
              : undefined
        }
        className={cn(
          "relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-[3.5px] overflow-hidden bg-white dark:bg-[#23252a] text-neutral-800 dark:text-neutral-200 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.35),0px_1px_1.5px_0px_rgba(0,0,0,0.12),0px_1px_0px_0px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_0px_rgba(0,0,0,0.85),0px_1px_1.5px_0px_rgba(0,0,0,0.5),0px_1px_0px_0px_rgba(255,255,255,0.08)_inset] transition-all duration-75 active:scale-[0.98]",
          claimedKey
            ? "hover:ring-1 hover:ring-amber-500/80 hover:brightness-105"
            : "hover:ring-1 hover:ring-blue-500/60 hover:brightness-105",
          isPressed &&
          "scale-[0.98] bg-neutral-200/90 dark:bg-[#1a1b20] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.2)] dark:shadow-[0px_0px_1px_0px_rgba(0,0,0,0.9)]",
          className,
        )}
      >
        {claimedKey && claimedKey.key_logo ? (
          <KeyLogoContent
            logo={claimedKey.key_logo}
            alt={claimedKey.key_name || keySlot}
            fallback={
              <div className={cn(
                "flex h-full w-full flex-col items-center justify-center text-[5px] text-neutral-700 dark:text-neutral-200 font-medium",
                childrenClassName,
              )}>
                {children}
              </div>
            }
          />
        ) : (
          <div
            className={cn(
              "flex h-full w-full flex-col items-center justify-center text-[5px] text-neutral-700 dark:text-neutral-200 font-medium",
              childrenClassName,
            )}
          >
            {children}
          </div>
        )}
      </button>
    </div>
  );
};

const ModifierKey = ({
  className,
  containerClassName,
  children,
  keyCode,
}: {
  className?: string;
  childrenClassName?: string;
  containerClassName?: string;
  children?: React.ReactNode;
  keyCode?: string;
}) => {
  const { pressedKeys, setPressed, setReleased, onKeyClick, keysMap } =
    useKeyboardSound();
  const isPressed = keyCode ? pressedKeys.has(keyCode) : false;

  const keySlot = keyCode ? getKeySlotFromCode(keyCode) : "";
  const claimedKey = keySlot
    ? keysMap.get(keySlot.toUpperCase()) || null
    : null;

  const handleMouseDown = () => {
    if (keyCode) {
      setPressed(keyCode);
    }
  };

  const handleMouseUp = () => {
    if (keyCode && isPressed) {
      setReleased(keyCode);
    }
  };

  const handleMouseLeave = () => {
    if (keyCode && isPressed) {
      setReleased(keyCode);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onKeyClick && keySlot) {
      onKeyClick(keySlot, claimedKey);
    }
  };

  return (
    <div className={cn("rounded-[4px] p-[0.5px]", containerClassName)}>
      <button
        type="button"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        title={
          claimedKey
            ? `${claimedKey.key_name || "Key"} (Key [${keySlot}]) · Current bid $${claimedKey.current_bid_amount || 0} · Click to Outbid`
            : keySlot
              ? `Key [${keySlot}] · Open · Click to Bid`
              : undefined
        }
        className={cn(
          "relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-[3.5px] overflow-hidden bg-white dark:bg-[#23252a] text-neutral-800 dark:text-neutral-200 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.35),0px_1px_1.5px_0px_rgba(0,0,0,0.12),0px_1px_0px_0px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_0px_rgba(0,0,0,0.85),0px_1px_1.5px_0px_rgba(0,0,0,0.5),0px_1px_0px_0px_rgba(255,255,255,0.08)_inset] transition-all duration-75 active:scale-[0.98]",
          claimedKey
            ? "hover:ring-1 hover:ring-amber-500/80 hover:brightness-105"
            : "hover:ring-1 hover:ring-blue-500/60 hover:brightness-105",
          isPressed &&
          "scale-[0.98] bg-neutral-200/90 dark:bg-[#1a1b20] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.2)] dark:shadow-[0px_0px_1px_0px_rgba(0,0,0,0.9)]",
          className,
        )}
      >
        {claimedKey && claimedKey.key_logo ? (
          <KeyLogoContent
            logo={claimedKey.key_logo}
            alt={claimedKey.key_name || keySlot}
            fallback={
              <div className="flex h-full w-full flex-col items-start justify-between p-1 text-[5px] text-neutral-700 dark:text-neutral-200 font-medium">
                {children}
              </div>
            }
          />
        ) : (
          <div className="flex h-full w-full flex-col items-start justify-between p-1 text-[5px] text-neutral-700 dark:text-neutral-200 font-medium">
            {children}
          </div>
        )}
      </button>
    </div>
  );
};

const OptionKey = ({ className }: { className?: string }) => {
  return (
    <svg
      fill="none"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <rect
        stroke="currentColor"
        strokeWidth={2}
        x="18"
        y="5"
        width="10"
        height="2"
      />
      <polygon
        stroke="currentColor"
        strokeWidth={2}
        points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25"
      />
    </svg>
  );
};
