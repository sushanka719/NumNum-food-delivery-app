"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { FaqItem } from "@/lib/data/faq";

const FALLBACK: FaqItem[] = [
  { id: "1", question: "What are your candles made from?", answer: "All Aluna candles are hand-poured using 100% natural soy wax, premium fragrance oils, and cotton wicks. We never use paraffin or synthetic dyes.", category: "Products" },
  { id: "2", question: "How long do the candles burn?", answer: "Our standard 200g candle burns for approximately 40–50 hours when trimmed and used correctly. The 100g travel candle burns for 20–25 hours.", category: "Products" },
  { id: "3", question: "Do you ship internationally?", answer: "Yes! We ship to over 30 countries across Europe, North America, and Asia. Shipping times vary by region — typically 3–7 business days within Europe.", category: "Shipping" },
  { id: "4", question: "What is your return policy?", answer: "We accept returns within 30 days of delivery for unused, unopened items. Please contact our team to initiate a return and we'll guide you through the process.", category: "Returns" },
  { id: "5", question: "Can I customize an order for gifting?", answer: "Absolutely. We offer gift wrapping and personalized message cards. For corporate or bulk orders of 10+ items, please reach out for a custom quote.", category: "Products" },
];

function groupByCategory(items: FaqItem[]): Record<string, FaqItem[]> {
  return items.reduce<Record<string, FaqItem[]>>((acc, item) => {
    const cat = item.category ?? "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});
}

function AccordionItem({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[var(--card-border)] last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-start gap-6 px-6 md:px-12 lg:px-16 py-8 text-left hover:bg-[var(--section-bg)] transition-colors group"
      >
        <span className="text-xs font-medium text-[var(--text-secondary)] mt-1 min-w-[24px]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-base md:text-lg font-serif text-[var(--foreground)]">
          {item.question}
        </span>
        <span className="text-[var(--text-secondary)] group-hover:text-[var(--foreground)] transition-colors mt-1 flex-shrink-0">
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-12 lg:px-16 pb-8 pl-[calc(1.5rem+24px+24px)] md:pl-[calc(3rem+24px+24px)] lg:pl-[calc(4rem+24px+24px)]">
              <p className="text-[var(--text-secondary)] leading-relaxed font-light">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ({
  items,
  showCategories = true,
}: {
  items: FaqItem[];
  showCategories?: boolean;
}) {
  const display = items.length > 0 ? items : FALLBACK;
  const grouped = showCategories ? groupByCategory(display) : { "": display };
  const categories = Object.keys(grouped);
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "");

  const currentItems = grouped[activeCategory] ?? display;

  return (
    <section className="border-b border-[var(--card-border)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between px-6 md:px-12 lg:px-16 py-12 border-b border-[var(--card-border)]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-3">Support</p>
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Category filter */}
        {showCategories && categories.length > 1 && (
          <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-[0.2em] px-4 py-2 border transition-colors ${
                  activeCategory === cat
                    ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                    : "border-[var(--card-border)] text-[var(--text-secondary)] hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {cat || "All"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Accordion */}
      <div>
        {currentItems.map((item, index) => (
          <AccordionItem key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}
