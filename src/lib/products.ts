// lib/products.ts

export type AreaId =
  | "front"
  | "back"
  | "sleeve_right"
  | "sleeve_left"
  | "neck_label";

export type ProductType = "tshirt" | "hoodie" | "cap" | "cup";

export type ProductFeature = {
  id: string;
  icon: "size" | "stitch" | "seamless" | "fabric" | "origin" | "material";
  title: string;
  description: string;
};

export type ProductDetails = {
  about: string;
  keyFeatures: ProductFeature[];
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
  mockup: (c: ProductColor) => string | string;
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
  metrics?: ProductMetric[]
  areas: AreaConfig[];
  views?: ProductView[];

  // ✅ NEW
  details?: ProductDetails;
};


export const PRODUCTS: ProductConfig[] = [
  // -------------------- TSHIRT --------------------
  {
    id: "tshirt",
    label: "T-Shirt",
    thumbnail: "/studio/tshirt-front-black.png",
    colors: ["white", "black"],
    metrics: [
      {
        key: "quality",
        title: "Best quality",
        value: "Top rated",
        sub: "Fulfilled by a trusted provider, covered by our Quality Promise.",
      },
      {
        key: "price",
        title: "Lowest price",
        value: "From USD 12.41",
        sub: "From USD 10.72 with Premium",
        note: "Get the best prices available in our network.",
      },
      {
        key: "shipping",
        title: "Most shipping options",
        value: "From USD 3.99",
        sub: "Economy or Standard shipping available.",
      },
      {
        key: "delivery",
        title: "Fastest delivery",
        value: "1.6 days*",
        sub: "Orders optimized for US customers.",
        note: "* avg. production time",
      },
    ],


    details: {
      about: `Comfort Colors introduces the “Comfort Colors 1717” garment-dyed t-shirt; 
              a fully customizable tee made with 100% ring-spun cotton. 
              The soft-washed, garment-dyed fabric brings extra coziness to your wardrobe while 
              the relaxed fit makes it an excellent daily choice. 
              The double-needle stitching throughout the tee makes it highly durable, 
              while the lack of side seams helps the shirt retain its tubular shape.`,

      keyFeatures: [
        {
          id: "sizes",
          icon: "size",
          title: "S to 4XL",
          description:
            "Available in multiple sizes from S to 4XL (select partners) so customers can find the perfect fit.",
        },
        {
          id: "stitching",
          icon: "stitch",
          title: "Double-needle stitching",
          description:
            "Sewn around the finished edges with double stitching for extra durability.",
        },
        {
          id: "seamless",
          icon: "seamless",
          title: "Without side seams",
          description:
            "Tubular knit construction reduces fabric waste and helps the garment keep its shape.",
        },
        {
          id: "fabric",
          icon: "fabric",
          title: "Garment-dyed fabric",
          description:
            "Dyed after construction, giving each shirt a soft texture and rich color.",
        },
        {
          id: "origin",
          icon: "origin",
          title: "Country of origin",
          description: "Made in Morocco.",
        },
        {
          id: "material",
          icon: "material",
          title: "100% Cotton",
          description:
            "Made from 100% ring-spun US cotton for long-lasting comfort.",
        },
      ],
    },
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
