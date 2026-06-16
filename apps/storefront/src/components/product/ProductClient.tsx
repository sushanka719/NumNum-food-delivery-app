"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Heart,
  Minus,
  Plus,
  Star,
  ChevronDown,
  Truck,
  Shield,
  RotateCcw,
  Package,
} from "lucide-react";
import { StorefrontProduct, ProductVariant } from "@/lib/data/types";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import ProductCard from "@/components/ProductCard";
import { blurDataURL } from "@/lib/image";

function Accordion({
  title,
  children,
  isOpen,
  onClick,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-[var(--card-border)]">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="font-medium text-[var(--foreground)] uppercase tracking-[0.2em] text-sm group-hover:opacity-70 transition-opacity">
          {title}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className="text-[var(--text-secondary)]" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-[var(--text-secondary)] font-light leading-relaxed text-sm">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function findMatchingVariant(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>
): ProductVariant | null {
  return (
    variants.find((v) =>
      Object.entries(selectedOptions).every(([key, val]) => v.options[key] === val)
    ) ?? null
  );
}

interface ProductClientProps {
  product: StorefrontProduct;
  relatedProducts: StorefrontProduct[];
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("description");
  const { addItem, isLoading } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);

  // Initialize selected options from the first variant (not the raw option values array)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    if (product.variants.length > 0) return { ...product.variants[0].options };
    const init: Record<string, string> = {};
    for (const opt of product.options) {
      if (opt.values.length > 0) init[opt.title] = opt.values[0];
    }
    return init;
  });

  const selectedVariant = useMemo(
    () => findMatchingVariant(product.variants, selectedOptions),
    [product.variants, selectedOptions]
  );

  const displayPrice = selectedVariant?.price ?? product.price;
  const isInStock = selectedVariant ? selectedVariant.inStock : product.inStock;
  const hasVariants = product.variants.length > 0;

  const images = product.images.length > 0 ? product.images : product.image ? [product.image] : [];

  const handleAddToCart = async () => {
    const variantId = selectedVariant?.id ?? product.variantId;
    if (!variantId) return;
    await addItem(variantId, product.id, product.name, displayPrice, product.image, quantity);
  };

  const isOptionValueAvailable = (optionTitle: string, value: string) => {
    const testOptions = { ...selectedOptions, [optionTitle]: value };
    const match = findMatchingVariant(product.variants, testOptions);
    return match !== null;
  };

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="flex flex-col border-b border-[var(--card-border)] bg-[var(--background)]">
      {/* Breadcrumbs */}
      <div className="px-6 md:px-12 lg:px-16 py-4 border-b border-[var(--card-border)] text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
        <Link href="/shop" className="hover:text-[var(--foreground)] transition-colors">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/shop?category=${product.categorySlug ?? product.category.toLowerCase()}`}
          className="hover:text-[var(--foreground)] transition-colors"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row items-start">
        {/* Left: Image Gallery */}
        <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hide">
          <div className="relative aspect-square w-full bg-[var(--section-bg)]">
            {images[selectedImage] ? (
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                placeholder="blur"
                blurDataURL={blurDataURL}
                priority
              />
            ) : (
              <div className="w-full h-full bg-[var(--section-bg)] flex items-center justify-center">
                <Package size={48} className="text-[var(--card-border)]" />
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-6 left-6 px-3 py-1 bg-[var(--accent)] text-white text-xs uppercase tracking-[0.2em]">
                New Arrival
              </div>
            )}
            {!isInStock && (
              <div className="absolute top-6 right-6 px-3 py-1 bg-black/70 text-white text-xs uppercase tracking-[0.2em]">
                Sold Out
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 divide-x divide-[var(--card-border)] border-t border-[var(--card-border)]">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square w-full transition-opacity ${
                    selectedImage === idx ? "opacity-100" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`View ${idx + 1}`}
                    fill
                    sizes="25vw"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={blurDataURL}
                  />
                  {selectedImage === idx && (
                    <div className="absolute inset-0 border-2 border-[var(--foreground)] pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="p-6 md:p-12 lg:p-16 flex-1">
            {/* Category + Rating */}
            <div className="mb-4 flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                {product.category}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} className="fill-[var(--foreground)] text-[var(--foreground)]" />
                ))}
              </div>
            </div>

            {/* Name */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--foreground)] mb-6 leading-none">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-2xl font-medium text-[var(--foreground)]">
                ${displayPrice.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-[var(--text-secondary)] line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* SKU */}
            {selectedVariant?.sku && (
              <p className="text-xs text-[var(--text-secondary)] mb-8 uppercase tracking-[0.15em]">
                SKU: {selectedVariant.sku}
              </p>
            )}

            {/* Description */}
            <p className="text-[var(--text-secondary)] text-base font-light leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Option Selectors */}
            {hasVariants && product.options.map((option) => (
              <div key={option.id} className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-[0.2em] font-medium text-[var(--foreground)]">
                    {option.title}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {selectedOptions[option.title]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const available = isOptionValueAvailable(option.title, value);
                    const selected = selectedOptions[option.title] === value;
                    return (
                      <button
                        key={value}
                        onClick={() => {
                          if (!available) return;
                          setSelectedOptions((prev) => ({ ...prev, [option.title]: value }));
                        }}
                        disabled={!available}
                        className={`relative min-w-[3rem] h-11 px-4 text-sm font-medium border transition-all duration-150
                          ${selected
                            ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]"
                            : available
                            ? "border-[var(--card-border)] text-[var(--foreground)] hover:border-[var(--foreground)]"
                            : "border-[var(--card-border)] text-[var(--card-border)] cursor-not-allowed"
                          }`}
                      >
                        {value}
                        {!available && (
                          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="absolute w-full h-px bg-[var(--card-border)] rotate-45 scale-x-[1.2]" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Stock Status */}
            <div className="mb-8">
              {isInStock ? (
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-green-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <div className="flex items-center border border-[var(--card-border)] h-14 w-full sm:w-32">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-full flex items-center justify-center hover:bg-[var(--section-bg)] transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="flex-1 text-center font-medium text-[var(--foreground)]">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!isInStock}
                  className="w-10 h-full flex items-center justify-center hover:bg-[var(--section-bg)] transition-colors disabled:opacity-40"
                >
                  <Plus size={16} />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: isInStock ? 1.02 : 1 }}
                whileTap={{ scale: isInStock ? 0.98 : 1 }}
                onClick={handleAddToCart}
                disabled={isLoading || !isInStock || (!selectedVariant && hasVariants)}
                className="flex-1 h-14 bg-[var(--foreground)] text-[var(--background)] font-medium uppercase tracking-[0.2em] text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={18} />
                {isLoading ? "Adding..." : !isInStock ? "Sold Out" : "Add to Cart"}
              </motion.button>

              <button
                onClick={() => toggleItem({ id: product.id, slug: product.slug, name: product.name, price: displayPrice, image: product.image })}
                aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
                className="h-14 w-14 border border-[var(--card-border)] flex items-center justify-center hover:bg-[var(--section-bg)] transition-colors"
              >
                <Heart
                  size={20}
                  className={wishlisted ? "fill-current text-[var(--foreground)]" : "text-[var(--foreground)]"}
                />
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-[var(--card-border)]">
              <Accordion
                title="Description"
                isOpen={openAccordion === "description"}
                onClick={() => toggleAccordion("description")}
              >
                <p>{product.description}</p>
              </Accordion>

              {/* Product Details */}
              {(product.weight || product.material || product.variants.length > 0) && (
                <Accordion
                  title="Product Details"
                  isOpen={openAccordion === "details"}
                  onClick={() => toggleAccordion("details")}
                >
                  <ul className="space-y-2">
                    {product.material && (
                      <li className="flex gap-4">
                        <span className="w-24 shrink-0 font-medium text-[var(--foreground)] uppercase tracking-[0.1em]">Material</span>
                        <span>{product.material}</span>
                      </li>
                    )}
                    {product.weight && (
                      <li className="flex gap-4">
                        <span className="w-24 shrink-0 font-medium text-[var(--foreground)] uppercase tracking-[0.1em]">Weight</span>
                        <span>{product.weight}g</span>
                      </li>
                    )}
                    {selectedVariant?.sku && (
                      <li className="flex gap-4">
                        <span className="w-24 shrink-0 font-medium text-[var(--foreground)] uppercase tracking-[0.1em]">SKU</span>
                        <span>{selectedVariant.sku}</span>
                      </li>
                    )}
                    {product.options.map((opt) => (
                      <li key={opt.id} className="flex gap-4">
                        <span className="w-24 shrink-0 font-medium text-[var(--foreground)] uppercase tracking-[0.1em]">{opt.title}</span>
                        <span>{opt.values.join(", ")}</span>
                      </li>
                    ))}
                  </ul>
                </Accordion>
              )}

              <Accordion
                title="Shipping & Returns"
                isOpen={openAccordion === "shipping"}
                onClick={() => toggleAccordion("shipping")}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Truck size={18} className="text-[var(--text-secondary)] shrink-0" />
                    <span>Free shipping on all orders over $100</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw size={18} className="text-[var(--text-secondary)] shrink-0" />
                    <span>30-day return policy for unopened items</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-[var(--text-secondary)] shrink-0" />
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                </div>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-[var(--card-border)] bg-[var(--background)]">
          <div className="px-6 md:px-12 lg:px-16 py-12 border-b border-[var(--card-border)]">
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--foreground)]">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--card-border)]">
            {relatedProducts.map((p, index) => (
              <div key={p.id} className="group relative p-8 hover:bg-[var(--section-bg)] transition-colors">
                <ProductCard product={p} index={index} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
