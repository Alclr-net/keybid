"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconChevronDown } from "@tabler/icons-react";
import { cn } from "@/src/lib/utils";
import { useAccordionStore } from "@/lib/store/accordionStore";

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
  const initValue = useAccordionStore((state) => state.initValue);

  React.useEffect(() => {
    if (defaultValue !== undefined) {
      initValue(defaultValue);
    }
  }, [defaultValue, initValue]);

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      useAccordionStore.setState({
        activeItems: Array.isArray(controlledValue) ? controlledValue : [controlledValue],
      });
    }
  }, [controlledValue]);

  return (
    <div className={cn("divide-y divide-zinc-200 dark:divide-white/10", className)} {...props}>
      {children}
    </div>
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
  const isOpen = useAccordionStore((state) => state.activeItems.includes(value));

  return (
    <div
      data-state={isOpen ? "open" : "closed"}
      data-value={value}
      className={cn("border-b border-zinc-200 dark:border-white/10 last:border-b-0", className)}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ itemValue?: string }>, {
            itemValue: value,
          });
        }
        return child;
      })}
    </div>
  );
}

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  itemValue?: string;
}

export function AccordionTrigger({
  className,
  children,
  itemValue,
  onClick,
  ...props
}: AccordionTriggerProps) {
  const isOpen = useAccordionStore((state) =>
    itemValue ? state.activeItems.includes(itemValue) : false
  );
  const toggleItem = useAccordionStore((state) => state.toggleItem);

  return (
    <div className="flex">
      <button
        type="button"
        data-state={isOpen ? "open" : "closed"}
        onClick={(e) => {
          if (itemValue) toggleItem(itemValue);
          onClick?.(e);
        }}
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
  extends React.HTMLAttributes<HTMLDivElement> {
  itemValue?: string;
}

export function AccordionContent({
  className,
  children,
  itemValue,
  ...props
}: AccordionContentProps) {
  const isOpen = useAccordionStore((state) =>
    itemValue ? state.activeItems.includes(itemValue) : false
  );

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
