"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  key: string;
  productId: number;
  name: string;
  price: number;
  image?: string;
  href?: string;

  size?: string;
  color?: string;

  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;

  hasHydrated: boolean;            // ✅ add
  setHasHydrated: (v: boolean) => void;

  open: () => void;
  close: () => void;
  toggle: () => void;

  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;

  count: () => number;
  subtotal: () => number;
};

function clampQty(qty: number) {
  if (!Number.isFinite(qty)) return 1;
  return Math.max(1, Math.floor(qty));
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),

      addItem: (item, qty = 1) => {
        const q = clampQty(qty);

        console.log("[CART:addItem] before", get().items);

        set((state) => {
          const idx = state.items.findIndex((x) => x.key === item.key);

          if (idx >= 0) {
            const copy = [...state.items];
            copy[idx] = { ...copy[idx], qty: copy[idx].qty + q };
            return { items: copy, isOpen: true };
          }

          return { items: [{ ...item, qty: q }, ...state.items], isOpen: true };
        });

        console.log("[CART:addItem] after", get().items);
      },

      removeItem: (key) => set((state) => ({ items: state.items.filter((x) => x.key !== key) })),
      setQty: (key, qty) => {
        const q = clampQty(qty);
        set((state) => ({
          items: state.items.map((x) => (x.key === key ? { ...x, qty: q } : x)),
        }));
      },

      clear: () => set({ items: [] }),

      count: () => get().items.reduce((sum, x) => sum + x.qty, 0),
      subtotal: () => get().items.reduce((sum, x) => sum + x.price * x.qty, 0),
    }),
    {
      name: "mova_cart_v1",
      partialize: (state) => ({ items: state.items }),
 
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("[CART] rehydrate error", error);
        } else {
          console.log("[CART] rehydrated", state?.items);
          state?.setHasHydrated(true);
        }
      },
    }
  )
);
