// core/services/product-configs.service.ts
import type { ProductType } from "@/lib/products"; // adjust path if needed

// If you already have these types elsewhere, import them instead of redefining.
export type ProductConfig = {
  id: ProductType; 
  [key: string]: any;
};

export type UpsertProductConfigDto = {
  id: ProductType;
  // ...dto fields (unknown here)
  [key: string]: any;
};

export type PatchProductConfigDto = Partial<Omit<UpsertProductConfigDto, "id">> & {
  // optional: keep flexible
  [key: string]: any;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set");
}

const jsonHeaders = {
  "Content-Type": "application/json",
};

async function handle(res: Response) {
  if (res.ok) {
    // some DELETE endpoints might return empty body; handle both safely
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  }

  let message = "Request failed";
  try {
    const data = await res.json();
    message =
      data?.message?.toString?.() ||
      (Array.isArray(data?.message) ? data.message.join(", ") : message);
  } catch {}
  throw new Error(message);
}

// -------------------- PUBLIC --------------------

/** GET /product-configs */
export async function fetchProductConfigs(): Promise<ProductConfig[]> {
  const res = await fetch(`${API_URL}/product-configs`, {
    method: "GET",
    // cache: "no-store", // uncomment if you want always-fresh in Next
  });
  return handle(res);
}

/** GET /product-configs/:id */
export async function fetchProductConfig(id: ProductType): Promise<ProductConfig> {
  const res = await fetch(`${API_URL}/product-configs/${id}`, {
    method: "GET",
  });
  return handle(res);
}

// -------------------- ADMIN --------------------

/** POST /product-configs (upsert) */
export async function upsertProductConfig(
  dto: UpsertProductConfigDto
): Promise<ProductConfig> {
  const res = await fetch(`${API_URL}/product-configs`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(dto),
  });
  return handle(res);
}

/** PATCH /product-configs/:id */
export async function patchProductConfig(
  id: ProductType,
  dto: PatchProductConfigDto
): Promise<ProductConfig> {
  const res = await fetch(`${API_URL}/product-configs/${id}`, {
    method: "PATCH",
    headers: jsonHeaders,
    body: JSON.stringify(dto),
  });
  return handle(res);
}

/** DELETE /product-configs/:id */
export async function deleteProductConfig(id: ProductType): Promise<null | any> {
  const res = await fetch(`${API_URL}/product-configs/${id}`, {
    method: "DELETE",
  });
  return handle(res);
}
