"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { fetchProducts } from "@/core/services/products.service";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type UIProduct = {
  id: number;
  slug?: string;
  name: string;
  price: number;
  image: string;
  mainColor: string;
  quickAdd?: boolean;
};

type ApiProduct = any;

const SIZE_OPTIONS = ["S", "M", "L", "XL"] as const;
const COLOR_OPTIONS = ["BLACK", "WHITE", "BEIGE", "DARK GREY"] as const;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toggleInArray(
  value: string,
  arr: string[],
  setArr: (v: string[]) => void
) {
  setArr(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
}

function normalizeToken(s: string) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-"); // "DARK GREY" -> "dark-grey"
}

export function ShopGrid() {
  const [rawProducts, setRawProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // category.slug

  const page = 1;
  const limit = 20;

  const API_ASSETS =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchProducts(page, limit, false);
        if (!cancelled) setRawProducts(data?.items || []);
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

  // Build categories dynamically from API results
  const categories = useMemo(() => {
    const map = new Map<string, { slug: string; name: string }>();
    rawProducts.forEach((p: any) => {
      const slug = p?.category?.slug;
      const name = p?.category?.name;
      if (slug && name) map.set(slug, { slug, name });
    });
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [rawProducts]);

  const filteredProducts: UIProduct[] = useMemo(() => {
    const productInAnyCategory = (p: any) => {
      if (!selectedCategories.length) return true;
      const slug = p?.category?.slug;
      return !!slug && selectedCategories.includes(slug);
    };

    const productHasAnySize = (p: any) => {
      if (!selectedSizes.length) return true;
      const availableSizes = (p?.variants || []).map((v: any) =>
        String(v.size).toUpperCase()
      );
      return selectedSizes.some((s) =>
        availableSizes.includes(String(s).toUpperCase())
      );
    };

    // COLOR NOTE:
    // Your API has no "color" field. We filter by tags.
    // For this to work, include tags like: "black", "white", "beige", "dark-grey"
    const productHasAnyColor = (p: any) => {
      if (!selectedColors.length) return true;
      const tags = (p?.tags || []).map((t: string) => normalizeToken(t));
      const wanted = selectedColors.map((c) => normalizeToken(c));
      return wanted.some((w) => tags.includes(w));
    };

    const filtered = rawProducts
      .filter(productInAnyCategory)
      .filter(productHasAnySize)
      .filter(productHasAnyColor);

    return filtered.map((p: any) => {
      const mainImg = p?.images?.[0]?.url; // your API doesn't have isMain yet
      const src = mainImg
        ? mainImg.startsWith("http")
          ? mainImg
          : `${API_ASSETS}${mainImg.startsWith("/") ? "" : "/"}${mainImg}`
        : "/assets/image1.png";

      return {
        id: p.id,
        slug: p.slug || (p.name ? slugify(p.name) : String(p.id)),
        name: p.name ?? "Unnamed",
        price: Number(p.price ?? 0),
        image: src,
        // you don’t have a real mainColor from API; show first tag or category
        mainColor:
          (p.tags?.[0] ? String(p.tags[0]).toUpperCase() : p?.category?.name) ||
          "—",
        quickAdd: true,
      };
    });
  }, [
    rawProducts,
    selectedCategories,
    selectedSizes,
    selectedColors,
    API_ASSETS,
  ]);

  const activeFiltersCount =
    selectedCategories.length + selectedSizes.length + selectedColors.length;

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  }

  return (
    <>
      {/* Filters */}
      <div className="mt-5 flex flex-row items-center ml-10 gap-5">
        {/* CATEGORY */}
        <Popover>
          <PopoverTrigger asChild>
            <span className="font-druk text-base underline cursor-pointer">
              CATEGORY
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-52 bg-gray-50/75">
            <div className="flex flex-col gap-2 text-xs font-druk">
              {categories.length === 0 ? (
                <div className="text-slate-500">No categories</div>
              ) : (
                categories.map((cat) => (
                  <label
                    key={cat.slug}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.slug)}
                      onChange={() =>
                        toggleInArray(
                          cat.slug,
                          selectedCategories,
                          setSelectedCategories
                        )
                      }
                      className="h-3 w-3 border border-black"
                    />
                    <span className="uppercase">{cat.name}</span>
                  </label>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* SIZE */}
        <Popover>
          <PopoverTrigger asChild>
            <span className="font-druk text-base underline cursor-pointer">
              SIZE
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-40 bg-gray-50/75">
            <div className="flex flex-col gap-2 text-xs font-druk">
              {SIZE_OPTIONS.map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(s)}
                    onChange={() =>
                      toggleInArray(s, selectedSizes, setSelectedSizes)
                    }
                    className="h-3 w-3 border border-black"
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* COLOR */}
        <Popover>
          <PopoverTrigger asChild>
            <span className="font-druk text-base underline cursor-pointer">
              COLOR
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-40 bg-gray-50/75">
            <div className="flex flex-col gap-2 text-xs font-druk">
              {COLOR_OPTIONS.map((c) => (
                <label key={c} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(c)}
                    onChange={() =>
                      toggleInArray(c, selectedColors, setSelectedColors)
                    }
                    className="h-3 w-3 border border-black"
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear */}
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="font-druk text-base underline cursor-pointer"
          >
            CLEAR ({activeFiltersCount})
          </button>
        )}
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
            <>
              <div className="px-10 pb-4 text-[11px] md:text-xs font-druk tracking-[0.12em] text-slate-600">
                SHOWING {filteredProducts.length} PRODUCTS
                {activeFiltersCount > 0 ? " (FILTERED)" : ""}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="py-20 text-center font-druk tracking-[0.12em]">
                  NO PRODUCTS MATCH YOUR FILTERS
                </div>
              )}
            </>
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
        <img
          src={product.image}
          alt={product.name}
          className="object-cover h-full w-full cursor-pointer"
          onClick={() => {
            router.push(`/shop/${product.slug}`);
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
