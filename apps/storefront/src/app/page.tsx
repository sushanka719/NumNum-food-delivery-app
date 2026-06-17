import Hero from "@/components/Hero";
import MarqueeBanner from "@/components/MarqueeBanner";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoriesGrid from "@/components/CategoriesGrid";
import FullWidthBanner from "@/components/FullWidthBanner";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import JournalSection from "@/components/JournalSection";
import LookbookSection from "@/components/LookbookSection";
import FAQ from "@/components/FAQ";
import Newsletter from "@/components/Newsletter";
import LogoCloud from "@/components/LogoCloud";
import { getProducts, getProductCategories } from "@/lib/data/products";
import { getBlogPosts } from "@/lib/data/blog";
import { getLookbooks } from "@/lib/data/lookbook";
import { getActivePromotion } from "@/lib/data/promotions";
import { getTestimonials } from "@/lib/data/testimonials";
import { getFaqItems } from "@/lib/data/faq";

export default async function Home() {
  const [
    { products },
    categories,
    blogPosts,
    lookbooks,
    promo,
    testimonials,
    faqItems,
  ] = await Promise.all([
    getProducts({ limit: 4 }),
    getProductCategories(),
    getBlogPosts(),
    getLookbooks(),
    getActivePromotion(),
    getTestimonials(),
    getFaqItems(),
  ]);

  const featuredProduct = products[0]
    ? { name: products[0].name, price: products[0].price, slug: products[0].slug }
    : null;

  const shopCategories = categories.filter((c) => c.slug !== "all");

  return (
    <div className="flex flex-col">
      <Hero featuredProduct={featuredProduct} promo={promo} />
      <MarqueeBanner />
      <FeaturedProducts products={products} />
      <CategoriesGrid categories={shopCategories} />
      <FullWidthBanner />
      <LookbookSection items={lookbooks} />
      <AboutSection />
      <LogoCloud />
      <TestimonialsSection testimonials={testimonials} />
      <JournalSection posts={blogPosts.slice(0, 3)} />
      <FAQ items={faqItems} />
      <Newsletter />
    </div>
  );
}
