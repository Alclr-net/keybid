"use client";

import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface TabItem {
  name: string;
  value: string;
  headline?: string;
  content: React.ReactNode;
}

const keybidStudio: TabItem[] = [
  {
    name: "Magic Keyboard Keys",
    value: "keys",
    headline: "Your logo on physical Magic Keyboard keys.",
    content: (
      <>
        Claim a key directly on my{" "}
        <span className="text-zinc-950 dark:text-white font-semibold">
          Apple Magic Keyboard
        </span>
        . Winning bidders receive custom precision UV-cured keycap decals that
        stay permanently on my daily-driver setup wherever I design and engineer.
      </>
    ),
  },
  {
    name: "Studio Workstation",
    value: "display",
    headline: "Front and center on my desk setup.",
    content: (
      <>
        Showcase your brand front and center on my{" "}
        <span className="text-zinc-950 dark:text-white font-semibold">
          Apple Magic Keyboard
        </span>
        . Featured daily in design engineering screencasts, live demo videos, desk tours, and tech community meetups.
      </>
    ),
  },
  {
    name: "Live Backlink",
    value: "backlink",
    headline: "365 days of guaranteed traffic.",
    content: (
      <>
        Gain a permanent, clickable{" "}
        <span className="text-zinc-950 dark:text-white font-semibold">
          sponsor backlink
        </span>{" "}
        on Keybid. Track real-time click metrics, capture viral developer and designer
        attention, and secure high-intent inbound visits for your startup.
      </>
    ),
  },
];

interface Tabs8Props {
  items?: TabItem[];
  defaultValue?: string;
  className?: string;
}

const Tabs8 = ({
  items = keybidStudio,
  defaultValue = "keys",
  className,
}: Tabs8Props) => {
  return (
    <Tabs defaultValue={defaultValue} className={`w-full gap-4 ${className || ""}`}>
      <div className="w-fit max-w-full overflow-x-auto overflow-y-hidden scrollbar-hide py-1">
        <TabsList className="bg-transparent flex w-max justify-start gap-2 p-0">
          {items.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={cn("rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white",
                "dark:data-[state=active]:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0.5px_0.05px_rgba(255,255,255,0.2),inset_0_-1px_0.5px_0.05px_rgba(0,0,0,0.1)]",
                "dark:data-[state=active]:text-shadow-xs"

              )}
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {items.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="pt-4 transition-opacity duration-200"
        >
          {tab.headline && (
            <h4 className="font-display mb-2 text-xl sm:text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
              {tab.headline}
            </h4>
          )}
          <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            {tab.content}
          </p>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default Tabs8;
