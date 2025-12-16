export type ProductVariant = {
  id?: number;
  size: string;
  stock: number;
};

export type ProductImage = {
  id?: number;
  url: string;
  alt?: string | null;
  position: number;
};

export type Product = {
  isVisible: any;
  id?: number | undefined;
  name: string;
  price: number;
  salePrice?: number | null;
  longDescription?: string | null;
  bulletPoints?: string[] | null;
  tags?: string[] | null;

  categoryId?: number | null;
  subCategoryId?: number | null;

  isFeatured: boolean;
  isNewArrival: boolean;
  isArchived?: boolean;

  slug: string;
  metaTitle?: string | null;
  metaDescription?: string | null;

  variants: ProductVariant[];
  images: ProductImage[];

  createdAt?: string;
  updatedAt?: string;
};

export type PaginatedProducts = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
};
