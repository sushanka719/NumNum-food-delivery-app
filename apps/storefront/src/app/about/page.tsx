import { getBrandStory } from "@/lib/data/brandstory";
import { getFaqItems } from "@/lib/data/faq";
import AboutContent from "@/components/AboutContent";

export const metadata = {
  title: "About | Aluna",
  description: "The story, values and people behind Aluna.",
};

export default async function AboutPage() {
  const [cms, faqItems] = await Promise.all([getBrandStory(), getFaqItems()]);
  return <AboutContent cms={cms} faqItems={faqItems} />;
}
