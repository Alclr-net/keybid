"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";
import { useTabsStore } from "@/lib/store/tabsStore";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const activeTab = useTabsStore((state) => state.activeTab);
  const setActiveTab = useTabsStore((state) => state.setActiveTab);

  React.useEffect(() => {
    if (defaultValue && !activeTab) {
      setActiveTab(defaultValue);
    }
  }, [defaultValue, activeTab, setActiveTab]);

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setActiveTab(controlledValue);
    }
  }, [controlledValue, setActiveTab]);

  React.useEffect(() => {
    if (activeTab && onValueChange) {
      onValueChange(activeTab);
    }
  }, [activeTab, onValueChange]);

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {children}
    </div>
  );
}

export function TabsList({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex max-w-full items-center justify-center rounded-lg p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({
  value,
  className,
  children,
  onClick,
  ...props
}: TabsTriggerProps) {
  const activeTab = useTabsStore((state) => state.activeTab);
  const setActiveTab = useTabsStore((state) => state.setActiveTab);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      onClick={(e) => {
        setActiveTab(value);
        onClick?.(e);
      }}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const activeTab = useTabsStore((state) => state.activeTab);
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      className={cn("mt-2 ring-offset-background focus-visible:outline-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
}
