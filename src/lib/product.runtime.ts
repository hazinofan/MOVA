// lib/products.runtime.ts
import { fetchProductConfig, fetchProductConfigs } from "@/core/services/product-config.service";
import type {
  ProductConfig,
  ProductConfigRow,
  ProductType,
  ProductColor,
  AreaConfig,
  ProductView,
} from "@/lib/products";

function makeMockupFn(template: string) {
  return (c: ProductColor) =>
    template.replace("{color}", c);
}

export function hydrateProductConfig(row: ProductConfigRow): ProductConfig {
  // 1️⃣ Merge everything FIRST
  const merged: any = {
    ...row,
    ...(row.config_json ?? {}),
  };

  // 2️⃣ Normalize top-level fields
  const product: ProductConfig = {
    id: merged.id,
    label: merged.label,
    thumbnail: merged.thumbnail,
    colors: merged.colors ?? merged.colors_json ?? [],
    metrics: merged.metrics,
    details: merged.details,
    areas: [],
    views: merged.views,
  };

  // 3️⃣ Hydrate areas (restore mockup functions)
  product.areas = Array.isArray(merged.areas)
    ? merged.areas.map((a: any) => {
        const tpl =
          a.mockupTemplate ??
          (typeof a.mockup === "string" ? a.mockup : null);

        return {
          ...a,
          mockup:
            typeof a.mockup === "function"
              ? a.mockup
              : tpl
              ? makeMockupFn(tpl)
              : () => "",
        };
      })
    : [];

  // 4️⃣ Hydrate views (restore mockup functions)
  product.views = Array.isArray(merged.views)
    ? merged.views.map((v: any) => {
        const tpl =
          v.mockupTemplate ??
          (typeof v.mockup === "string" ? v.mockup : null);

        return {
          ...v,
          mockup:
            typeof v.mockup === "function"
              ? v.mockup
              : tpl
              ? makeMockupFn(tpl)
              : () => "",
        };
      })
    : undefined;

  return product;
}


/** Simple in-memory cache so your studio doesn't refetch 50 times */
let _cacheAll: ProductConfig[] | null = null;
const _cacheById = new Map<ProductType, ProductConfig>();

export async function getProducts(): Promise<ProductConfig[]> {
  if (_cacheAll) return _cacheAll;

  const rows = (await fetchProductConfigs()) as ProductConfigRow[];
  const hydrated = rows.map(hydrateProductConfig);

  _cacheAll = hydrated;
  hydrated.forEach((p) => _cacheById.set(p.id, p));
  return hydrated;
}

export async function getProduct(id: ProductType): Promise<ProductConfig> {
  console.log("🟦 [runtime] getProduct called with:", id);

  try {
    const row = (await fetchProductConfig(id)) as ProductConfigRow;
    console.log("🟩 [runtime] fetchProductConfig result:", row);

    const hydrated = hydrateProductConfig(row);
    console.log("🟨 [runtime] hydrated:", hydrated);

    return hydrated;
  } catch (e) {
    console.error("🟥 [runtime] getProduct failed:", e);
    throw e;
  }
}


/** Optional: clear cache after admin edits */
export function invalidateProductsCache() {
  _cacheAll = null;
  _cacheById.clear();
}
