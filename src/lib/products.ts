// lib/products.ts

export type AreaId =
  | "front"
  | "back"
  | "sleeve_right"
  | "sleeve_left"
  | "neck_label";

export type ProductType = "tshirt" | "hoodie" | "cap" | "cup";
export type ProductColor = "white" | "black";

export type PrintArea = {
  white: {
    x: number;
    y: number;
    w: number;
    h: number;
  },
  black: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
};

export type AreaConfig = {
  id: AreaId;
  label: string;
  printArea: PrintArea;
  mockup: (color: ProductColor) => string;
};

export type ProductConfig = {
  id: ProductType;
  thumbnail: string;
  label: string;
  colors: ProductColor[];
  areas: AreaConfig[];
};

export const PRODUCTS: ProductConfig[] = [
  {
    id: "tshirt",
    label: "T-Shirt",
    thumbnail: "/studio/tshirt-front-white.png",
    colors: ["white", "black"],
    areas: [
      {
        id: "front",
        label: "Front side",
        printArea: {
          white: { x: 0.28, y: 0.28, w: 0.44, h: 0.50 },
          black: { x: 0.25, y: 0.14, w: 0.50, h: 0.70 },
        },
        mockup: (c) => `/studio/tshirt-front-${c}.png`,
      },
      {
        id: "back",
        label: "Back side",
        printArea: {
          white: { x: 0.23, y: 0.12, w: 0.52, h: 0.70 },
          black: { x: 0.31, y: 0.16, w: 0.38, h: 0.54 },
        },
        mockup: (c) => `/studio/tshirt-back-${c}.png`,
      },
      {
        id: "sleeve_right",
        label: "Sleeve right",
        printArea: {
          white: { x: 0.60, y: 0.27, w: 0.14, h: 0.12 },
          black: { x: 0.60, y: 0.27, w: 0.14, h: 0.12 },
        },
        mockup: (c) => `/studio/tshirt-sleeve-right-${c}.png`,
      },
      {
        id: "sleeve_left",
        label: "Sleeve left",
        printArea: {
          white: { x: 0.26, y: 0.27, w: 0.14, h: 0.12 },
          black: { x: 0.26, y: 0.27, w: 0.14, h: 0.12 },
        },
        mockup: (c) => `/studio/tshirt-sleeve-left-${c}.png`,
      },
      {
        id: "neck_label",
        label: "Neck label inner",
        printArea: {
          white: { x: 0.44, y: 0.12, w: 0.12, h: 0.08 },
          black: { x: 0.44, y: 0.12, w: 0.12, h: 0.08 },
        },
        mockup: (c) => `/studio/tshirt-neck-${c}.png`,
      },
    ],
  },
  {
    id: "hoodie",
    label: "HOODIE",
    thumbnail: "/studio/hoodie-front-white.png",
    colors: ["white", "black"],
    areas: [
      {
        id: "front",
        label: "Front side",
        printArea: {
          white: { x: 0.28, y: 0.28, w: 0.44, h: 0.40 },
          black: { x: 0.24, y: 0.20, w: 0.54, h: 0.50 },
        },
        mockup: (c) => `/studio/hoodie-front-${c}.png`,
      },
      {
        id: "back",
        label: "Back side",
        printArea: {
          white: { x: 0.24, y: 0.28, w: 0.52, h: 0.52 },
          black: { x: 0.24, y: 0.28, w: 0.55, h: 0.54 },
        },
        mockup: (c) => `/studio/hoodie-back-${c}.png`,
      },
      {
        id: "sleeve_right",
        label: "Sleeve right",
        printArea: {
          white: { x: 0.60, y: 0.27, w: 0.14, h: 0.12 },
          black: { x: 0.60, y: 0.27, w: 0.14, h: 0.12 },
        },
        mockup: (c) => `/studio/hoodie-sleeve-right-${c}.png`,
      },
      {
        id: "sleeve_left",
        label: "Sleeve left",
        printArea: {
          white: { x: 0.26, y: 0.27, w: 0.14, h: 0.12 },
          black: { x: 0.26, y: 0.27, w: 0.14, h: 0.12 },
        },
        mockup: (c) => `/studio/hoodie-sleeve-left-${c}.png`,
      },
      {
        id: "neck_label",
        label: "Neck label inner",
        printArea: {
          white: { x: 0.44, y: 0.12, w: 0.12, h: 0.08 },
          black: { x: 0.44, y: 0.12, w: 0.12, h: 0.08 },
        },
        mockup: (c) => `/studio/hoodie-neck-${c}.png`,
      },
    ],
  },
  {
    id: "cap",
    label: "CAP",
    thumbnail: "/studio/cap-white.png",
    colors: ["white", "black"],
    areas: [
      {
        id: "front",
        label: "Front side",
        printArea: {
          white: { x: 0.32, y: 0.33, w: 0.45, h: 0.16 },
          black: { x: 0.32, y: 0.33, w: 0.45, h: 0.16 },
        },
        mockup: (c) => `/studio/cap-${c}.png`,
      },
    ],
  },
  {
    id: "cup",
    label: "CUP",
    thumbnail: "/studio/cup-white.png",
    colors: ["white", "black"],
    areas: [
      {
        id: "front",
        label: "Front side",
        // The printable zone on the mug face (tweak later with your mockup)
        printArea: {
          white: { x: 0.20, y: 0.32, w: 0.45, h: 0.28 },
          black: { x: 0.30, y: 0.32, w: 0.40, h: 0.28 },
        },
        mockup: (c) => `/studio/cup-${c}.png`,
      },
    ],
  },
];

export function getProduct(id: ProductType): ProductConfig {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) {
    throw new Error(`Product "${id}" not found`);
  }
  return product;
}
