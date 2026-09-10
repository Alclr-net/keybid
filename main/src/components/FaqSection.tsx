"use client";

import React from "react";
import ScrollReveal from "@/src/components/ui/ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { FAQ_ITEMS } from "@/lib/constant";

export function AccordionBasic() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="w-full"
    >
      {FAQ_ITEMS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function FaqSection() {


  return (
    <section id="faq" className="w-full py-10 sm:py-20 px-4 sm:px-6 bg-zinc-50/70 dark:bg-zinc-950/40 border-t border-zinc-300/80 dark:border-white/5">
      <div className="max-w-4xl mx-auto">

        {/* Section Header */}
        <ScrollReveal>
          <div className="mb-10 sm:mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Questions & Answers
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 font-normal">
              Everything you need to know about the auction and hardware placement.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="border-t border-zinc-300 dark:border-white/10">
            <AccordionBasic />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
