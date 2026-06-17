"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";
import { blurDataURL } from "@/lib/image";
import type { Testimonial } from "@/lib/data/testimonials";

const FALLBACK: Testimonial[] = [
  { id: "1", name: "Sarah M.", location: "New York", rating: 5, text: "The quality of these candles is exceptional. The scent fills my entire home and lasts for hours. Truly a luxury experience." },
  { id: "2", name: "James L.", location: "London", rating: 5, text: "I've tried many fragrance oils, but nothing compares to Aluna. The natural ingredients make all the difference." },
  { id: "3", name: "Emily R.", location: "Paris", rating: 5, text: "Beautiful packaging, amazing scent, and fast delivery. This has become my go-to gift for special occasions." },
];

export default function TestimonialsSection({ testimonials }: { testimonials?: Testimonial[] }) {
  const items = testimonials && testimonials.length > 0 ? testimonials : FALLBACK;

  const avgRating = (items.reduce((sum, t) => sum + t.rating, 0) / items.length).toFixed(1);

  return (
    <section className="flex flex-col lg:flex-row border-b border-[var(--card-border)]">
      {/* Left: Header */}
      <div className="w-full lg:w-1/3 px-6 md:px-12 lg:px-16 py-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[var(--card-border)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-4">
          What Our Customers Say
        </p>
        <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-6 leading-tight">
          Testimonials
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" className="text-[var(--foreground)]" />
            ))}
          </div>
          <span className="text-sm text-[var(--text-secondary)]">{avgRating} average</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-4 font-light">
          Based on {items.length} reviews
        </p>
      </div>

      {/* Right: Testimonials List */}
      <div className="w-full lg:w-2/3 divide-y divide-[var(--card-border)]">
        {items.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="px-6 md:px-12 lg:px-16 py-12 flex flex-col md:flex-row gap-8 group hover:bg-[var(--section-bg)] transition-colors"
          >
            {/* Number */}
            <span className="text-xs font-medium text-[var(--text-secondary)] mt-2">
              {String(index + 1).padStart(2, "0")}
            </span>

            {/* Content */}
            <div className="flex-1">
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" className="text-[var(--foreground)]" />
                ))}
              </div>

              <blockquote className="text-2xl md:text-3xl font-serif text-[var(--foreground)] leading-tight mb-8">
                &ldquo;{testimonial.text}&rdquo;
              </blockquote>

              <div className="flex items-center gap-4">
                {testimonial.avatar && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={blurDataURL}
                    />
                  </div>
                )}
                {!testimonial.avatar && <div className="h-px w-8 bg-[var(--card-border)]" />}
                <span className="text-sm font-medium text-[var(--foreground)]">
                  {testimonial.name}
                </span>
                {testimonial.location && (
                  <span className="text-sm text-[var(--text-secondary)]">
                    — {testimonial.location}
                  </span>
                )}
                {testimonial.verified && (
                  <span className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)] border border-[var(--card-border)] px-2 py-0.5">
                    Verified
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
