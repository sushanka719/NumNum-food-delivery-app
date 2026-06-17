"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Leaf, Heart, Award } from "lucide-react";
import { blurDataURL } from "@/lib/image";
import type { BrandStory, TeamMember, BrandValue } from "@/lib/data/brandstory";
import FAQ from "@/components/FAQ";
import type { FaqItem } from "@/lib/data/faq";

const VALUE_ICONS = [Sparkles, Leaf, Heart, Award];

const DEFAULT_VALUES: BrandValue[] = [
  { title: "Artisan Craftsmanship", description: "Each product is meticulously handcrafted by skilled artisans using time-honoured techniques." },
  { title: "Sustainable Sourcing", description: "We partner with ethical suppliers to source the finest natural ingredients responsibly." },
  { title: "Passion for Quality", description: "Our unwavering commitment to excellence drives every decision we make." },
  { title: "Award-Winning", description: "Recognised globally for our innovative fragrances and exceptional products." },
];

const DEFAULT_TEAM: TeamMember[] = [
  { name: "Elena Rivera", role: "Founder & Creative Director", image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400", bio: "Elena founded Aluna after leaving her career in fashion to pursue her love of scent and slow living." },
  { name: "Marcus Chen", role: "Head Perfumer", image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400", bio: "With 15 years of experience in fine fragrance, Marcus leads all scent development at Aluna." },
  { name: "Sofia Laurent", role: "Design Director", image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400", bio: "Sofia brings a minimalist Parisian aesthetic to every product, campaign, and touchpoint." },
];

const DEFAULT_JOURNEY = [
  "Founded in 2014, Aluna began as a small candle atelier in the heart of Paris, where founder Elena Rivera poured her first collection of slow-burning scented candles.",
  "What started as a passion project quickly evolved into a globally recognised brand, known for its commitment to quality and sustainability.",
  "Today, Aluna ships to over 30 countries, each parcel wrapped with the same care as that very first candle.",
];

interface Props {
  cms: BrandStory | null;
  faqItems: FaqItem[];
}

export default function AboutContent({ cms, faqItems }: Props) {
  const heroTitle = cms?.heroTitle ?? "The Art of Aluna";
  const heroSubtitle = cms?.heroSubtitle ?? "Born from a passion for artisanal candle making and sustainable luxury home fragrance.";
  const heroImage = cms?.heroImage ?? "https://images.unsplash.com/photo-1631014858587-71607fd96391?q=80&w=2070&auto=format&fit=crop";
  const journeyTitle = cms?.journeyTitle ?? "A Journey of Discovery";
  const journeyParagraphs = cms?.journeyParagraphs?.length ? cms.journeyParagraphs : DEFAULT_JOURNEY;
  const journeyImage = cms?.journeyImage ?? "https://images.unsplash.com/photo-1737982418598-7b1ef37d87a7?q=80&w=3132&auto=format&fit=crop";
  const values: BrandValue[] = cms?.values?.length ? cms.values : DEFAULT_VALUES;
  const team: TeamMember[] = cms?.team?.length ? cms.team : DEFAULT_TEAM;

  const titleWords = heroTitle.split(" ");

  return (
    <div className="flex flex-col border-b border-[var(--card-border)]">
      {/* Page Header */}
      <section className="flex flex-col lg:flex-row border-b border-[var(--card-border)]">
        <div className="w-full lg:w-1/3 px-6 md:px-12 lg:px-16 py-16 lg:py-20 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[var(--card-border)]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-left">
            <p className="text-xs uppercase tracking-[0.3em] mb-6 text-[var(--text-secondary)]">Our Story</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[var(--foreground)] mb-6 leading-none">
              {titleWords.length > 1 ? (
                <>
                  {titleWords.slice(0, -1).join(" ")}{" "}
                  <span className="italic block mt-2">{titleWords.at(-1)}</span>
                </>
              ) : (
                <span className="italic">{heroTitle}</span>
              )}
            </h1>
            <p className="text-[var(--text-secondary)] font-light leading-relaxed max-w-sm">
              {heroSubtitle}
            </p>
          </motion.div>
        </div>
        <div className="hidden lg:block w-full lg:w-2/3 relative min-h-[400px]">
          <Image
            src={heroImage}
            alt="About Aluna studio"
            fill sizes="66vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={blurDataURL}
          />
        </div>
      </section>

      {/* Journey Section */}
      <section className="flex flex-col lg:flex-row border-b border-[var(--card-border)]">
        <div className="w-full lg:w-1/3 px-6 md:px-12 lg:px-16 py-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[var(--card-border)]">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)] mb-8 leading-tight">
              {journeyTitle}
            </h2>
            <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed font-light text-sm md:text-base">
              {journeyParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </motion.div>
        </div>
        <div className="w-full lg:w-2/3 relative min-h-[400px]">
          <Image
            src={journeyImage}
            alt="Aluna atelier"
            fill sizes="66vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={blurDataURL}
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-[var(--background)] border-b border-[var(--card-border)]">
        <div className="px-6 md:px-12 lg:px-16 py-12 border-b border-[var(--card-border)]">
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[var(--card-border)]">
          {values.map((value, index) => {
            const Icon = VALUE_ICONS[index % VALUE_ICONS.length];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="px-6 md:px-12 lg:px-16 py-8 md:py-12 hover:bg-[var(--section-bg)] transition-colors group"
              >
                <div className="w-12 h-12 mb-6 rounded-full bg-[var(--section-bg)] group-hover:bg-[var(--background)] transition-colors flex items-center justify-center text-[var(--foreground)]">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-medium text-[var(--foreground)] mb-4 uppercase tracking-[0.2em] text-xs md:text-sm">{value.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed font-light">{value.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-[var(--background)] border-b border-[var(--card-border)]">
        <div className="px-6 md:px-12 lg:px-16 py-12 border-b border-[var(--card-border)]">
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">Meet the Team</h2>
        </div>
        <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--card-border)]">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-12 text-center hover:bg-[var(--section-bg)] transition-colors group"
            >
              {member.image && (
                <div className="relative w-48 h-48 mx-auto mb-8 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill sizes="192px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                  />
                </div>
              )}
              <h3 className="font-serif text-2xl text-[var(--foreground)] mb-2 italic">{member.name}</h3>
              <p className="text-[var(--text-secondary)] text-xs uppercase tracking-[0.2em]">{member.role}</p>
              {member.bio && (
                <p className="text-[var(--text-secondary)] text-sm mt-4 font-light leading-relaxed max-w-xs mx-auto">
                  {member.bio}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ items={faqItems} />
    </div>
  );
}
