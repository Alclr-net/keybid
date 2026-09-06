"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  value: string | string[];
  onItemToggle: (itemValue: string) => void;
  isItemOpen: (itemValue: string) => boolean;
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(
  undefined
);

function useAccordion() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion");
  }
  return context;
}

interface AccordionItemContextValue {
  value: string;
}

const AccordionItemContext = React.createContext<
  AccordionItemContextValue | undefined
>(undefined);

function useAccordionItem() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error("AccordionItem components must be used within an AccordionItem");
  }
  return context;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: any) => void;
}

export function Accordion({
  type = "single",
  collapsible = true,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    () => {
      if (defaultValue !== undefined) return defaultValue;
      return type === "multiple" ? [] : "";
    }
  );

  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : internalValue;

  const isItemOpen = React.useCallback(
    (itemValue: string) => {
      if (Array.isArray(activeValue)) {
        return activeValue.includes(itemValue);
      }
      return activeValue === itemValue;
    },
    [activeValue]
  );

  const onItemToggle = React.useCallback(
    (itemValue: string) => {
      let nextValue: string | string[];

      if (type === "multiple") {
        const currentList = Array.isArray(activeValue) ? activeValue : [];
        if (currentList.includes(itemValue)) {
          nextValue = currentList.filter((v) => v !== itemValue);
        } else {
          nextValue = [...currentList, itemValue];
        }
      } else {
        if (activeValue === itemValue) {
          nextValue = collapsible ? "" : itemValue;
        } else {
          nextValue = itemValue;
        }
      }

      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [type, collapsible, activeValue, isControlled, onValueChange]
  );

  return (
    <AccordionContext.Provider
      value={{
        value: activeValue,
        onItemToggle,
        isItemOpen,
      }}
    >
      <div className={cn("divide-y divide-zinc-200 dark:divide-white/10", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function AccordionItem({
  value,
  className,
  children,
  ...props
}: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div
        data-state={useAccordion().isItemOpen(value) ? "open" : "closed"}
        className={cn("border-b border-zinc-200 dark:border-white/10 last:border-b-0", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const { onItemToggle, isItemOpen } = useAccordion();
  const { value } = useAccordionItem();
  const isOpen = isItemOpen(value);

  return (
    <div className="flex">
      <button
        type="button"
        data-state={isOpen ? "open" : "closed"}
        onClick={() => onItemToggle(value)}
        className={cn(
          "flex flex-1 items-center justify-between py-4 sm:py-5 font-semibold text-sm sm:text-base text-zinc-900 dark:text-zinc-100 transition-all hover:text-blue-600 dark:hover:text-blue-400 text-left cursor-pointer group",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        <IconChevronDown
          size={18}
          className={cn(
            "text-zinc-400 dark:text-zinc-500 transition-transform duration-200 shrink-0 ml-4 group-hover:text-blue-600 dark:group-hover:text-blue-400",
            isOpen && "rotate-180 text-blue-600 dark:text-blue-400"
          )}
        />
      </button>
    </div>
  );
}

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function AccordionContent({
  className,
  children,
  ...props
}: AccordionContentProps) {
  const { isItemOpen } = useAccordion();
  const { value } = useAccordionItem();
  const isOpen = isItemOpen(value);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div
            className={cn(
              "pb-4 sm:pb-5 pt-0 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
