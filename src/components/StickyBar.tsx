"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/core/stores/cart.store";
import { useRouter } from "next/router";
import { fetchProductBySlug, fetchProduct } from "@/core/services/products.service";

type StickyBarProps = {
  productId?: number;
  name?: string;
  price?: number;
  image?: string;
  href?: string;
  averageRating: number;
  reviewCount: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

function firstImageFromProduct(p: any): string | undefined {
  const imgs = Array.isArray(p?.images) ? [...p.images] : [];
  imgs.sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0));

  const raw = imgs?.[0]?.url;
  if (!raw) return undefined;

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
  return raw.startsWith("http") ? raw : `${API_URL}${raw}`;
}

export default function StickyAddToCartBar({
  productId: productIdProp,
  name: nameProp,
  price: priceProp,
  image: imageProp,
  href: hrefProp,
  averageRating,
  reviewCount,
}: StickyBarProps) {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : undefined;

  const [size, setSize] = useState("S");
  const [qty, setQty] = useState(1);

  const [product, setProduct] = useState<any | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);

  // ✅ Fetch the current product (by slug if exists, else by id prop)
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoadingProduct(true);
        console.log("Fetching product...");

        let p: any | null = null;

        if (slug) {
          p = await fetchProductBySlug(slug);
        } else if (typeof productIdProp === "number") {
          p = await fetchProduct(productIdProp);
        }

        if (!cancelled) setProduct(p);
        console.log("Fetched product:", p);
      } catch (error) {
        console.error("Error fetching product:", error);
        if (!cancelled) setProduct(null);
      } finally {
        if (!cancelled) setLoadingProduct(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, productIdProp]);

  // ✅ Resolve displayed values (prefer fetched product, fallback to props)
  const resolved = useMemo(() => {
    const id = product?.id ?? productIdProp ?? 0;
    const name = product?.name ?? nameProp ?? "PRODUCT";
    const price = Number(product?.price ?? priceProp ?? 0);
    const image = firstImageFromProduct(product) ?? imageProp;
    const href = product?.slug ? `/shop/${product.slug}` : hrefProp ?? (id ? `/shop/${id}` : "/shop");

    console.log("Resolved product details:", { id, name, price, image, href });

    return { id, name, price, image, href };
  }, [product, productIdProp, nameProp, priceProp, imageProp, hrefProp]);

  const minus = () => setQty((q) => Math.max(1, q - 1));
  const plus = () => setQty((q) => q + 1);

  const handleAddToCart = () => {
    console.log("Adding item to cart with size:", size, "and quantity:", qty);

    if (!resolved.id) {
      console.error("No resolved product ID available.");
      return;
    }

    const key = `${resolved.id}|size:${size}`; // unique per size variant

    addItem(
      {
        key,
        productId: resolved.id,
        name: resolved.name,
        price: resolved.price,
        image: resolved.image,
        href: resolved.href,
        size,
      },
      qty
    );

    console.log("Item added to cart:", { key, qty });
    openCart();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 bg-white">
      <div className="flex items-stretch text-xs md:text-sm">
        <div className="flex-1 px-6 py-5 flex items-center gap-6">
          <div className="flex-1">
            <div className="font-druk tracking-[0.16em] text-[11px] md:text-xl uppercase">
              {loadingProduct ? "LOADING..." : resolved.name}
            </div>

            <div className="mt-1 flex items-center gap-2 text-[18px]">
              <span>{"★★★★★".slice(0, Math.round(averageRating))}</span>
              <span className="text-black/60">{reviewCount} Reviews</span>
            </div>

            <div className="mt-1 text-[12px] md:text-[18px] font-semibold">
              {resolved.price} DH
            </div>
          </div>

          <div className="hidden md:flex flex-[1.2] items-center justify-center gap-10">
            <div className="flex flex-col gap-1">
              <span className="font-druk tracking-[0.18em] text-[14px] uppercase">
                Color
              </span>
              {/* TODO: replace with real color from variants */}
              <button className="underline text-[16px]">Black</button>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-druk tracking-[0.18em] text-[14px] uppercase">
                Size
              </span>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="border-none bg-transparent underline text-[16px] outline-none cursor-pointer"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-druk tracking-[0.18em] text-[15px] uppercase">
                Amount
              </span>
              <div className="flex items-center gap-3 text-[13px]">
                <button onClick={minus} className="px-2">-</button>
                <span>{qty}</span>
                <button onClick={plus} className="px-2">+</button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[420px]">
          <Button
            className="w-full h-full rounded-none bg-black text-white text-xs md:text-sm font-druk tracking-[0.18em] uppercase"
            onClick={handleAddToCart}
            disabled={!resolved.id || loadingProduct}
          >
            Add To Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
