"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { fetchProducts } from "@/core/services/products.service"; 
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type UIProduct = {
  id: number;
  slug?: string;
  name: string;
  price: number;
  image: string;
  mainColor: string;
  quickAdd?: boolean;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ShopGrid() {
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // later: make these real filters/pagination
  const page = 1;
  const limit = 20;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchProducts(page, limit, false);

        // ✅ map backend product -> UIProduct
        const mapped: UIProduct[] = data.items.map((p: any) => {
          // ---- IMPORTANT: adapt these fields to your backend response ----
          const imageFromApi =
            p.image ||
            p.mainImage ||
            p.thumbnail ||
            (Array.isArray(p.photos) ? p.photos?.[0] : undefined) ||
            "/assets/image1.png"; // fallback

          const slugFromApi = p.slug || (p.name ? slugify(p.name) : String(p.id));

          return {
            id: p.id,
            slug: slugFromApi,
            name: p.name ?? "Unnamed",
            price: Number(p.price ?? 0),
            image: imageFromApi,
            mainColor: p.mainColor ?? "—",
            quickAdd: true,
          };
        });

        if (!cancelled) setProducts(mapped);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [page, limit]);

  return (
    <>
      {/* filters UI stays the same */}
      <div className="mt-5 flex flex-row items-center ml-10 gap-5">
        <Popover>
          <PopoverTrigger asChild>
            <span className="font-druk text-base underline cursor-pointer">
              SIZE
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-40 bg-gray-50/75">
            <div className="flex flex-col gap-2 text-xs font-druk">
              {["S", "M", "L", "XL"].map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-3 w-3 border border-black" />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <span className="font-druk text-base underline cursor-pointer">
              COLOR
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-40 bg-gray-50/75">
            <div className="flex flex-col gap-2 text-xs font-druk">
              {["BLACK", "WHITE", "BEIGE", "DARK GREY"].map((c) => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="h-3 w-3 border border-black" />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <section className="w-full bg-[#f5f5f5]">
        <div className="mt-16">
          {loading ? (
            <div className="py-20 text-center font-druk tracking-[0.12em]">
              LOADING PRODUCTS...
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function ProductCard({ product }: { product: UIProduct }) {
  const router = useRouter();

  return (
    <div className="group relative flex flex-col">
      <div className="relative w-full bg-[#f5f5f5] aspect-[3/4] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover h-full cursor-pointer"
          onClick={() => {
            // if you route by slug:
            router.push(`/shop/${product.slug}`);
            // if your backend uses id route instead:
            // router.push(`/shop/${product.id}`);
          }}
        />

        <div
          className="
            pointer-events-none
            absolute left-1/2 bottom-0 
            w-[70%] translate-x-[-50%] translate-y-full
            bg-white text-black text-[11px] md:text-xs
            text-center py-3
            font-druk tracking-[0.12em]
            transition-all duration-200
            group-hover:translate-y-0
          "
        >
          <div className="mb-1">QUICK ADD:</div>
          <div className="flex items-center justify-center gap-3">
            {["XS", "S", "M", "L", "XL"].map((size) => (
              <span key={size}>{size}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 text-[11px] md:text-xs font-druk tracking-[0.09em]">
        <div className="uppercase">{product.name}</div>

        <div className="mt-1 flex items-center gap-2 text-[10px] md:text-[11px]">
          <span className="inline-block h-[2px] w-5 bg-black" />
          <span>{product.mainColor}</span>
        </div>

        <div className="mt-3 text-[12px] md:text-[13px]">
          {product.price} DH
        </div>
      </div>
    </div>
  );
}
