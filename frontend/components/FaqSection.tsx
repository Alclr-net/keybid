"use client";

import React from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const items = [
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

export function AccordionBasic() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="w-full"
    >
      {items.map((item) => (
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
    <section id="faq" className="w-full py-20 sm:py-28 px-4 sm:px-6 bg-zinc-50/50 dark:bg-zinc-950/40 border-t border-zinc-200/70 dark:border-white/5">
      <div className="max-w-4xl mx-auto">
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
          <div className="border-t border-zinc-200/80 dark:border-white/10">
            <AccordionBasic />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
