"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (id: string) => boolean;
  getCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        if (get().isWishlisted(item.id)) return;
        set((s) => ({ items: [...s.items, item] }));
      },

      removeItem: (id) => {
        set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
      },

      toggleItem: (item) => {
        if (get().isWishlisted(item.id)) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },

      isWishlisted: (id) => get().items.some((i) => i.id === id),

      getCount: () => get().items.length,
    }),
    { name: "aluna-wishlist" }
  )
);
