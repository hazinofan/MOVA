// lib/products.ts

export type AreaId =
  | "front"
  | "back"
  | "sleeve_right"
  | "sleeve_left"
  | "neck_label";

export type ProductType = "tshirt" | "hoodie" | "cap";
export type ProductColor = "white" | "black";

export type PrintArea = {
  x: number; // normalized 0..1
  y: number;
  w: number;
  h: number;
};

export type AreaConfig = {
  id: AreaId;
  label: string;
  printArea: PrintArea;
  /**
   * Returns the mockup image path for this area & color
   */
  mockup: (color: ProductColor) => string;
};

export type ProductConfig = {
  id: ProductType;
  label: string;
  colors: ProductColor[];
  areas: AreaConfig[];
};

export const PRODUCTS: ProductConfig[] = [
  {
    id: "tshirt",
    label: "T-Shirt",
    colors: ["white", "black"],
    areas: [
      {
        id: "front",
        label: "Front side",
        printArea: { x: 0.33, y: 0.22, w: 0.34, h: 0.48 },
        mockup: (c) => `/studio/tshirt-front-${c}.png`,
      },
      {
        id: "back",
        label: "Back side",
        printArea: { x: 0.33, y: 0.18, w: 0.34, h: 0.52 },
        mockup: (c) => `/studio/tshirt-back-${c}.png`,
      },
      {
        id: "sleeve_right",
        label: "Sleeve right",
        printArea: { x: 0.60, y: 0.27, w: 0.14, h: 0.12 },
        mockup: (c) => `/studio/tshirt-sleeve-right-${c}.png`,
      },
      {
        id: "sleeve_left",
        label: "Sleeve left",
        printArea: { x: 0.26, y: 0.27, w: 0.14, h: 0.12 },
        mockup: (c) => `/studio/tshirt-sleeve-left-${c}.png`,
      },
      {
        id: "neck_label",
        label: "Neck label inner",
        printArea: { x: 0.44, y: 0.12, w: 0.12, h: 0.08 },
        mockup: (c) => `/studio/tshirt-neck-${c}.png`,
      },
    ],
  },
  {
    id: "hoodie",
    label: "HOODIE",
    colors: ["white", "black"],
    areas: [
      {
        id: "front",
        label: "Front side",
        printArea: { x: 0.33, y: 0.22, w: 0.34, h: 0.48 },
        mockup: (c) => `/studio/hoodie-front-${c}.png`,
      },
      {
        id: "back",
        label: "Back side",
        printArea: { x: 0.33, y: 0.18, w: 0.34, h: 0.52 },
        mockup: (c) => `/studio/hoodie-back-${c}.png`,
      },
      {
        id: "sleeve_right",
        label: "Sleeve right",
        printArea: { x: 0.60, y: 0.27, w: 0.14, h: 0.12 },
        mockup: (c) => `/studio/hoodie-sleeve-right-${c}.png`,
      },
      {
        id: "sleeve_left",
        label: "Sleeve left",
        printArea: { x: 0.26, y: 0.27, w: 0.14, h: 0.12 },
        mockup: (c) => `/studio/hoodie-sleeve-left-${c}.png`,
      },
      {
        id: "neck_label",
        label: "Neck label inner",
        printArea: { x: 0.44, y: 0.12, w: 0.12, h: 0.08 },
        mockup: (c) => `/studio/hoodie-neck-${c}.png`,
      },
    ],
  },

  // You can add Hoodie & Cap later with the same structure
];

export function getProduct(id: ProductType): ProductConfig {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    throw new Error(`Product "${id}" not found`);
  }
  return product;
}
