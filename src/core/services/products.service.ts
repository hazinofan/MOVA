import { PaginatedProducts, Product } from "../types/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL

const headers = {
  "Content-Type": "application/json",
};

export async function fetchProducts(
  page = 1,
  limit = 20,
  includeArchived = false
): Promise<PaginatedProducts> {
  const res = await fetch(
    `${API_URL}/products?page=${page}&limit=${limit}&includeArchived=${includeArchived}`
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error("Product not found");
  return res.json();
}

export async function fetchProductBySlug(slug: string) {
  const res = await fetch(`${API_URL}/products/slug/${slug}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export async function createProduct(data: Product): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id: number, data: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function archiveProduct(id: number) {
  const res = await fetch(`${API_URL}/products/${id}/archive`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to archive product");
  return res.json();
}

export async function unarchiveProduct(id: number) {
  const res = await fetch(`${API_URL}/products/${id}/unarchive`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to unarchive product");
  return res.json();
}

export async function deleteProduct(id: number) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

export async function uploadProductPhotos(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("photos", file));

  const res = await fetch(`${API_URL}/upload/products/photos`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload product photos");

  const data = await res.json();
  // backend returns: [{ originalName, filename, url }]
  return data.map((f: any) => f.url);
}

