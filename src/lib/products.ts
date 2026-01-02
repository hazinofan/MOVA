// lib/products.ts

export type AreaId =
  | "front"
  | "back"
  | "sleeve_right"
  | "sleeve_left"
  | "neck_label";

export type ProductType = "tshirt" | "hoodie" | "cap" | "cup";

export type SizeGuide = {
  note?: string;
  columns: string[];
  rows: { label: string; values: (string | number)[] }[];
};

export type ProductFeature = {
  id: string;
  icon: "size" | "stitch" | "seamless" | "fabric" | "origin" | "material";
  title: string;
  description: string;
};

export type ProductDetails = {
  about: string;
  keyFeatures: ProductFeature[];
  sizeGuide?: SizeGuide;
};

export type PreviewAdjust = {
  dx?: number;
  dy?: number;
  s?: number;
};

export type FrameRect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type ProductColor = "white" | "black";
export type Rect = { x: number; y: number; w: number; h: number };

// ✅ Keep your printing area logic exactly like this:
export type PrintArea = Rect | Record<ProductColor, Rect>;

export type AreaConfig = {
  id: AreaId;
  label: string;
  printArea: PrintArea;
  mockup: (color: ProductColor) => string;
};

export type ProductViewId =
  | "front"
  | "back"
  | "front2"
  | "back2"
  | "hanging1"
  | "hanging2"
  | "hanging3"
  | "left"
  | "right"
  | "context1"
  | "context2"
  | "context3"
  | "context4";

export type ProductView = {
  id: ProductViewId;
  label: string;
  mockup: (c: ProductColor) => string;
  sourceAreaId?: "front" | "back";
  frame?: FrameRect;
  printArea?: PrintArea;
  previewAdjust?: PreviewAdjust;
};

export type MetricKey = "quality" | "price" | "shipping" | "delivery";

export type ProductMetric = {
  key: MetricKey;
  title: string;
  value: string;
  sub?: string;
  note?: string;
};

export type ProductConfig = {
  id: ProductType;
  thumbnail: string;
  label: string;
  colors: ProductColor[];
  metrics?: ProductMetric[];
  areas: AreaConfig[];
  views?: ProductView[];
  details?: ProductDetails;
};

/**
 * This is the DB/API shape coming from your Nest resource
 * (matches ProductConfigEntity fields).
 */
export type ProductConfigRow = {
  id: ProductType;
  label: string;
  thumbnail: string;
  colors_json: ProductColor[];
  config_json: any;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
};
