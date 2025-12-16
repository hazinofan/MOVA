"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { toast } from "sonner";
import { fetchProducts } from "@/core/services/products.service";
import { useCartStore } from "@/core/stores/cart.store";
import { ImGit } from "react-icons/im";
 

type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

type BackendReview = { rating?: number | string | null };
type BackendImage = { url?: string | null } | string;
type BackendVariant = { size?: string | null } | string;

type BackendProduct = {
  id: string | number;
  name?: string;
  title?: string;
  price?: number | string;
  salePrice?: number | string | null;
  images?: BackendImage[];
  variants?: BackendVariant[];
  reviews?: BackendReview[];
  swatchNote?: string | null;
};

type UIProduct = {
  id: string | number;
  title: string;
  priceDh: number;
  image: string;
  swatchNote?: string;
  sizes: Size[];
  ratingAvg: number; // 0..5
};

type Props = {
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  options?: EmblaOptionsType;
  onQuickAdd?: (p: UIProduct, size: Size) => void;
};

const FALLBACK_SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

function toAbsoluteUrl(path: string) {
  if (!path) return "/images/placeholder-product.jpg";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // encode spaces and special chars but keep slashes
  const encoded = path
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");

  return `${API_URL}${encoded.startsWith("/") ? "" : "/"}${encoded}`;
}

/** --- Cart (simple, works out-of-the-box) --- */
type CartItem = {
  productId: string;
  size: Size;
  qty: number;
};
const CART_KEY = "mova_cart_v1";

function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("cart:updated", { detail: items }));
}

function addToCart(productId: string | number, size: Size, qty = 1) {
  const id = String(productId);
  const cart = readCart();
  const existing = cart.find((c) => c.productId === id && c.size === size);
  if (existing) existing.qty += qty;
  else cart.push({ productId: id, size, qty });
  writeCart(cart);
}

/** --- Helpers --- */
function toNumber(v: any, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeSize(s: string): Size | null {
  const up = s.trim().toUpperCase();
  if (up === "XS" || up === "S" || up === "M" || up === "L" || up === "XL" || up === "XXL") return up;
  return null;
}

function getAvgRating(reviews: BackendReview[] | undefined): number {
  const arr = (reviews ?? [])
    .map((r) => toNumber(r?.rating, NaN))
    .filter((n) => Number.isFinite(n) && n >= 0);
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function pickImage(p: any): string {
  const first = p?.images?.[0];
  const url = typeof first === "string" ? first : first?.url;

  return url ? toAbsoluteUrl(url) : "/images/placeholder-product.jpg";
}

type ApiProduct = any;

function mapToUI(p: ApiProduct): UIProduct | null {
  const id = p?.id;
  if (id == null) return null; // guard undefined/null ids

  const title = p.title ?? p.name ?? "Untitled";
  const priceDh = toNumber(p.salePrice ?? p.price ?? p.priceDh, 0);

  const ratingAvg = getAvgRating(p.reviews);

  const sizesFromVariants =
    (p.variants ?? [])
      .map((v: any) => (typeof v === "string" ? v : v?.size ?? ""))
      .map((s: any) => normalizeSize(String(s || "")))
      .filter(Boolean) as Size[];

  const sizes = sizesFromVariants.length
    ? Array.from(new Set(sizesFromVariants))
    : FALLBACK_SIZES;

  const image = pickImage(p);

  return {
    id,
    title,
    priceDh,
    image,
    swatchNote: p.swatchNote ?? undefined,
    sizes,
    ratingAvg,
  };
}


/**
 * Choose 6–8 products:
 * - Prefer true 5.0 average rating
 * - If fewer than 6, fill with top-rated next
 * - Cap at 8
 */
function selectBestSellers(all: UIProduct[]): UIProduct[] {
  const sorted = [...all].sort((a, b) => b.ratingAvg - a.ratingAvg);

  const fiveStar = sorted.filter((p) => p.ratingAvg >= 4.999);
  const picked: UIProduct[] = fiveStar.slice(0, 8);

  if (picked.length < 6) {
    for (const p of sorted) {
      if (picked.some((x) => x.id === p.id)) continue;
      picked.push(p);
      if (picked.length >= 6) break;
    }
  }

  // If we somehow exceeded 8 (shouldn't), trim.
  return picked.slice(0, 8);
}

export default function BestSellers({
  title = "BEST SELLERS",
  ctaLabel = "Shop Now",
  ctaHref = "/shop",
  options,
  onQuickAdd,
}: Props) {
  const [items, setItems] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: true,
    ...options,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Grab enough to find 5★ products
        const res = await fetchProducts(1, 30, false); 
        console.log("Fetched products for best sellers:", res);
        const ui = (res.items ?? []).map(mapToUI).filter((p): p is UIProduct => p !== null);

        const selected = selectBestSellers(ui);

        if (mounted) setItems(selected);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load best sellers");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="py-16 text-sm opacity-70">Loading best sellers…</div>
      );
    }
    if (error) {
      return (
        <div className="py-16 text-sm text-red-600">
          {error}
        </div>
      );
    }
    if (!items.length) {
      return (
        <div className="py-16 text-sm opacity-70">
          No rated products found yet.
        </div>
      );
    }

    return (
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex will-change-transform touch-pan-y">
          {items.map((p) => (
            <div
              key={p.id}
              className="shrink-0 basis-[88%] sm:basis-[48%] lg:basis-[32%]"
            >
              <ProductCard
                product={p}
                onQuickAdd={(prod:any, size:any) => {
                  if (onQuickAdd) return onQuickAdd(prod, size);

                  addToCart(prod.id, size, 1);
                  toast.success("Added to cart", {
                    description: `${prod.title} • ${size}`,
                  });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }, [loading, error, items, emblaRef, onQuickAdd]);

  return (
    <section className="w-full mt-20">
      <div className="mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(260px,28%)_1fr] gap-8 md:gap-12 items-center">
          <aside className="py-2 md:py-6">
            <h2 className="text-2xl md:text-3xl font-extrabold leading-none tracking-[.02em] font-druk">
              {title}
            </h2>
            <Link
              href={ctaHref}
              className="mt-4 inline-flex items-center text-3xl underline underline-offset-[6px] hover:no-underline"
            >
              {ctaLabel}
            </Link>
          </aside>

          <div className="relative">
            <div className="absolute -top-14 right-0 hidden md:flex gap-2">
              <button
                onClick={scrollPrev}
                disabled={!canPrev}
                aria-label="Previous"
                className="h-10 w-10 rounded-full border grid place-items-center disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollNext}
                disabled={!canNext}
                aria-label="Next"
                className="h-10 w-10 rounded-full border grid place-items-center disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {content}
          </div>
        </div>
      </div>
    </section>
  );
}

function StarsRow({ value }: { value: number }) {
  // This section is specifically for showing 5★ products
  const full = 5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
      <span className="ml-2 text-xs opacity-70">5.0</span>
    </div>
  );
}

function ProductCard({
  product,
  onQuickAdd,
}: {
  product: UIProduct;
  onQuickAdd?: (prod: UIProduct, size: Size) => void;
}) {
  const sizes = product.sizes?.length ? product.sizes : FALLBACK_SIZES;

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [adding, setAdding] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Select a size first");
      return;
    }

    setAdding(true);
    try {
      // unique per product+size so adding again increments qty
      const key = `${product.id}-${selectedSize}`;

      addItem(
        {
          key,
          productId: Number(product.id),
          name: product.title,
          price: product.priceDh,
          image: product.image,
          // update this if you have slug
          href: `/shop/${product.id}`,
          size: selectedSize,
        },
        1
      );

      openCart();
      toast.success("Added to cart", {
        description: `${product.title} • ${selectedSize}`,
      });
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="group relative overflow-hidden bg-white">
      <div className="relative aspect-[3/4]">
        <img
          src={product.image}
          alt={product.title} 
          sizes="(max-width: 768px) 88vw, (max-width: 1024px) 48vw, 32vw"
          className="object-cover" 
        />
      </div>

      <div className="px-5 py-4">
        <div className="mb-2">
          <StarsRow value={product.ratingAvg} />
        </div>

        {/* Select size + add button */}
        <div
          className="
            overflow-hidden
            max-h-0 opacity-0
            group-hover:max-h-44 group-hover:opacity-100
            transition-all duration-300 ease-out
          "
        >
          <div className="pb-3">
            <p className="text-[11px] font-semibold tracking-wide">SELECT SIZE:</p>

            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((sz) => {
                const active = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize((prev) => (prev === sz ? null : sz))}
                    className={[
                      "h-8 px-3 rounded-full border text-sm leading-none transition",
                      "hover:translate-y-[-1px]",
                      active
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-black/30",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedSize || adding}
              className={[
                "mt-3 w-full rounded-xl px-4 py-2 text-sm font-semibold transition",
                !selectedSize || adding
                  ? "bg-black/30 text-white cursor-not-allowed"
                  : "bg-black text-white hover:opacity-90",
              ].join(" ")}
            >
              {adding
                ? "Adding…"
                : selectedSize
                ? `Add to cart (${selectedSize})`
                : "Select a size to add"}
            </button>
          </div>
        </div>

        <h3 className="text-[16px] font-druk leading-tight tracking-[.01em]">
          {product.title}
        </h3>

        {!!product.swatchNote && (
          <p className="mt-1 text-[12px] opacity-70">{product.swatchNote}</p>
        )}

        <p className="mt-2 text-[13px] font-semibold">
          {product.priceDh.toFixed(2)} Dh
        </p>
      </div>
    </article>
  );
}
