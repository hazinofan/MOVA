// lib/products.ts

export type AreaId =
  | "front"
  | "back"
  | "sleeve_right"
  | "sleeve_left"
  | "neck_label";

export type ProductType = "tshirt" | "hoodie" | "cap" | "cup";

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
  mockup: (c: ProductColor) => string | string;
  sourceAreaId?: "front" | "back";
  frame?: FrameRect;
  printArea?: PrintArea;

  previewAdjust?: PreviewAdjust;
};

export type ProductConfig = {
  id: ProductType;
  thumbnail: string;
  label: string;
  colors: ProductColor[];
  areas: AreaConfig[];
  views?: ProductView[];
};

export const PRODUCTS: ProductConfig[] = [
  // -------------------- TSHIRT --------------------
  {
    id: "tshirt",
    label: "T-Shirt",
    thumbnail: "/studio/tshirt-front-black.png",
    colors: ["white", "black"],
    areas: [
      {
        id: "front",
        label: "Front side",
        printArea: {
          white: { x: 0.25, y: 0.30, w: 0.50, h: 0.5 },
          black: { x: 0.26, y: 0.25, w: 0.5, h: 0.6 },
        },
        mockup: (c) => `/studio/tshirt-front-${c}.png`,
      },
      {
        id: "back",
        label: "Back side",
        printArea: {
          white: { x: 0.27, y: 0.27, w: 0.45, h: 0.55 },
          black: { x: 0.26, y: 0.25, w: 0.48, h: 0.54 },
        },
        mockup: (c) => `/studio/tshirt-back-${c}.png`,
      },
      {
        id: "sleeve_right",
        label: "Sleeve right",
        printArea: {
          white: { x: 0.6, y: 0.27, w: 0.14, h: 0.12 },
          black: { x: 0.6, y: 0.27, w: 0.14, h: 0.12 },
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

    // ✅ Preview views for right panel (Printify-like)
    // Note: we DO NOT change your print areas. We REUSE them.
    views: [
      {
        id: "front",
        label: "Front",
        mockup: (c) => `/studio/tshirt-front-${c}.png`,
        sourceAreaId: "front",

        // 👁️ preview camera
        frame: { x: 0, y: 0.12, w: 1, h: 0.8 },

        // 🖨️ real print zone (DO NOT TOUCH for preview tuning)
        printArea: { x: 0.275, y: 0.28, w: 0.45, h: 0.55 },

        // 🎯 preview-only tweak
        previewAdjust: {
          dx: 0,
          dy: 0,
          s: 1,
        },
      },

      {
        id: "back",
        label: "Back",
        mockup: (c) => `/studio/tshirt-back-${c}.png`,
        sourceAreaId: "back",

        frame: { x: 0, y: 0.15, w: 1, h: 0.7 },
        printArea: { x: 0.27, y: 0.18, w: 0.46, h: 0.6 },

        previewAdjust: {
          dx: 0,
          dy: 0,
          s: 1,
        },
      },

      {
        id: "hanging1",
        label: "Hanging 1",
        mockup: (c) => `/studio/tshirt-hanging1-${c}.png`,
        sourceAreaId: "front",

        // hanger bar → camera pushed down
        frame: { x: 0.02, y: 0.15, w: 1, h: 0.82 },
        printArea: { x: 0.3, y: 0.22, w: 0.8, h: 0.72 },

        // ⬇️ designs usually need to be lower + slightly bigger
        previewAdjust: {
          dx: -0.01,
          dy: 0.09,
          s: 1.08,
        },
      },

      // {
      //   id: "hanging2",
      //   label: "Hanging 2",
      //   mockup: (c) => `/studio/tshirt-hanging2-${c}.png`,
      //   sourceAreaId: "front",

      //   // tighter crop because of chair/props
      //   frame: { x: 0.12, y: 0.18, w: 0.76, h: 0.78 },
      //   printArea: { x: 0.34, y: 0.25, w: 0.52, h: 0.65 },

      //   // ⬇️⬆️ this one almost always needs correction
      //   previewAdjust: {
      //     dx: 0.1,
      //     dy: 0.2,
      //     s: 1,
      //   },
      // },
    ],
  },

  // -------------------- HOODIE --------------------
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
          white: { x: 0.24, y: 0.22, w: 0.53, h: 0.4 },
          black: { x: 0.24, y: 0.2, w: 0.54, h: 0.5 },
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
          white: { x: 0.6, y: 0.27, w: 0.14, h: 0.12 },
          black: { x: 0.6, y: 0.27, w: 0.14, h: 0.12 },
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

    views: [
      {
        id: "front",
        label: "Front",
        sourceAreaId: "front",
        mockup: (c) => `/studio/hoodie-front-${c}.png`,
        printArea: {
          white: { x: 0.28, y: 0.2, w: 0.44, h: 1 },
          black: { x: 0.24, y: 0.2, w: 0.54, h: 0.5 },
        },
      },
      {
        id: "back",
        label: "Back",
        sourceAreaId: "back",
        mockup: (c) => `/studio/hoodie-back-${c}.png`,
        printArea: {
          white: { x: 0.24, y: 0.28, w: 0.52, h: 0.52 },
          black: { x: 0.24, y: 0.28, w: 0.55, h: 0.54 },
        },
      },
      {
        id: "hanging1",
        label: "Hanging 1",
        sourceAreaId: "front",
        mockup: (c) => `/studio/hoodie-hanging1-${c}.png`,
        printArea: {
          white: { x: 0.28, y: 1, w: 0.44, h: 0.4 },
          black: { x: 0.24, y: 0.1, w: 0.54, h: 0.5 },
        },
        previewAdjust: {
          dx: -0.01,
          dy: 0.04,
          s: 1.08,
        },
      },
      // {
      //   id: "hanging2",
      //   label: "Hanging 2",
      //   sourceAreaId: "front",
      //   mockup: (c) => `/studio/hoodie-hanging2-${c}.png`,
      //   printArea: {
      //     white: { x: 0.28, y: 0.28, w: 0.44, h: 0.4 },
      //     black: { x: 0.24, y: 0.2, w: 0.54, h: 0.5 },
      //   },
      // },
    ],
  },

  // -------------------- CAP --------------------
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
    views: [
      {
        id: "front",
        label: "Front",
        sourceAreaId: "front",
        mockup: (c) => `/studio/cap-${c}.png`,
        printArea: {
          white: { x: 0.32, y: 0.33, w: 0.45, h: 0.16 },
          black: { x: 0.32, y: 0.33, w: 0.45, h: 0.16 },
        },
      },
    ],
  },

  // -------------------- CUP --------------------
  {
    id: "cup",
    label: "CUP",
    thumbnail: "/studio/cup-white.png",
    colors: ["white", "black"],
    areas: [
      {
        id: "front",
        label: "Front side",
        // ✅ Keep your per-color coordinates untouched
        printArea: {
          white: { x: 0.2, y: 0.32, w: 0.45, h: 0.28 },
          black: { x: 0.3, y: 0.32, w: 0.4, h: 0.28 },
        },
        mockup: (c) => `/studio/cup-${c}.png`,
      },
    ],

    // ✅ Preview views like your screenshot
    // These are only used by the preview panel. Your editor still uses areas[0].printArea.
    views: [
      {
        id: "front",
        label: "Front",
        sourceAreaId: "front",
        mockup: (c) => `/studio/cup-front-${c}.png`,
        printArea: {
          white: { x: 0.2, y: 0.32, w: 0.45, h: 0.28 },
          black: { x: 0.3, y: 0.32, w: 0.4, h: 0.28 },
        },
      },
      {
        id: "back",
        label: "Back",
        sourceAreaId: "back",
        mockup: (c) => `/studio/cup-back-${c}.png`,
        printArea: {
          white: { x: 0.2, y: 0.32, w: 0.45, h: 0.28 },
          black: { x: 0.3, y: 0.32, w: 0.4, h: 0.28 },
        },
      },

      // Context shots (no printArea needed unless you plan to overlay design)
      {
        id: "context1",
        label: "Context 1",
        mockup: (c) => `/studio/cup-context1-${c}.png`,
      },
      {
        id: "context2",
        label: "Context 2",
        mockup: (c) => `/studio/cup-context2-${c}.png`,
      },
      {
        id: "context3",
        label: "Context 3",
        mockup: (c) => `/studio/cup-context3-${c}.png`,
      },
      {
        id: "context4",
        label: "Context 4",
        mockup: (c) => `/studio/cup-context4-${c}.png`,
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
