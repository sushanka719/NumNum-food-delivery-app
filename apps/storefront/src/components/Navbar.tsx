"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, ShoppingBag, Search, Heart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { useWishlistStore } from "@/store/wishlist";
import SearchOverlay from "@/components/SearchOverlay";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { toggleCart, getTotalItems } = useCartStore();
  const { customer, logout, _hasHydrated } = useAuthStore();
  const { getCount } = useWishlistStore();
  const totalItems = getTotalItems();
  const wishlistCount = getCount();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <motion.nav
        className={`sticky top-0 z-50 bg-[var(--background)] border-b border-[var(--card-border)]`}
      >
        <div className="relative flex items-center justify-between h-20 px-6 md:px-12 lg:px-16">
          
          {/* Left: Menu Trigger */}
          <div className="flex-1 flex items-center justify-start z-10">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="text-[var(--foreground)] hover:text-[var(--text-secondary)] transition-colors p-2 -ml-2"
              aria-label="Menu"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Center: Logo - Absolutely Centered (hidden on mobile to avoid overlap) */}
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
            <Link href="/">
              <h1 className="font-serif text-3xl tracking-tight text-[var(--foreground)]">
                Aluna
              </h1>
            </Link>
          </div>

          {/* Right: Login & Cart */}
          <div className="flex-1 flex items-center justify-end gap-5 z-10">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center text-[var(--foreground)] hover:text-[var(--text-secondary)] transition-colors"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <Link
              href="/wishlist"
              className="relative flex items-center text-[var(--foreground)] hover:text-[var(--text-secondary)] transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.5} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--foreground)] text-[var(--background)] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            {mounted && _hasHydrated && customer ? (
              <div ref={accountRef} className="relative">
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  className="flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--text-secondary)] transition-colors text-xs uppercase tracking-[0.15em]"
                >
                  <User size={20} strokeWidth={1.5} />
                  <span className="hidden lg:inline">{customer.first_name}</span>
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-36 bg-[var(--background)] border border-[var(--card-border)] shadow-sm z-50"
                    >
                      <Link
                        href="/orders"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-3 text-xs uppercase tracking-[0.15em] text-[var(--foreground)] hover:bg-[var(--card-border)] transition-colors"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-3 text-xs uppercase tracking-[0.15em] text-[var(--foreground)] hover:bg-[var(--card-border)] transition-colors border-t border-[var(--card-border)]"
                      >
                        Wishlist {mounted && wishlistCount > 0 && `(${wishlistCount})`}
                      </Link>
                      <button
                        onClick={() => { setAccountOpen(false); logout(); }}
                        className="w-full text-left px-4 py-3 text-xs uppercase tracking-[0.15em] text-[var(--foreground)] hover:bg-[var(--card-border)] transition-colors border-t border-[var(--card-border)]"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-[var(--foreground)] hover:text-[var(--text-secondary)] transition-colors"
              >
                <User size={20} strokeWidth={1.5} />
              </Link>
            )}
            <button
              onClick={toggleCart}
              className="flex items-center gap-1 text-[var(--foreground)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="text-sm font-medium">({mounted ? totalItems : 0})</span>
            </button>
          </div>
        </div>
      </motion.nav>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[var(--background)] flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-6 right-6 p-2 text-[var(--foreground)] hover:rotate-90 transition-transform duration-300"
            >
              <X size={32} strokeWidth={1.5} />
            </button>

            <div className="flex flex-col items-start gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-start gap-4"
                  >
                    <span className="text-xs font-medium text-[var(--text-secondary)] mt-2 group-hover:text-[var(--foreground)] transition-colors">
                      0{index + 1}
                    </span>
                    <span className="text-5xl md:text-6xl font-serif text-[var(--foreground)] group-hover:italic transition-all duration-300">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
