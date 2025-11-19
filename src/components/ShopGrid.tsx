"use client";

import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/router";

type Product = {
  id: number;
  slug?: string;
  name: string;
  price: number;
  image: string;
  mainColor: string;
  quickAdd?: boolean;
};

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "LOW SHOW V BRALETTE",
    slug: "low-show-v-bralette",
    price: 475,
    image: "/assets/image1.png",
    mainColor: "White + 12 colors",
  },
  {
    id: 2,
    name: "LOW SHOW V BRALETTE",
    slug: "low-show-v-bralette",
    price: 475,
    image: "/assets/image2.png",
    mainColor: "Black + 12 colors",
  },
  {
    id: 3,
    name: "HIGH SCULPT BRA RIB",
    slug: "high-sculpt-bra-rib",
    price: 475,
    image: "/assets/image3.png",
    mainColor: "Black + 12 colors",
    quickAdd: true,
  },
  {
    id: 4,
    name: "LOW HIDE THONG",
    slug: "low-hide-thong",
    price: 285,
    image: "/assets/image4.png",
    mainColor: "Black + 11 colors",
    quickAdd: true,
  },
  {
    id: 4,
    name: "LOW HIDE THONG",
    slug: "low-hide-thong",
    price: 285,
    image: "/assets/image5.png",
    mainColor: "Black + 11 colors",
    quickAdd: true,
  },
  {
    id: 4,
    name: "LOW HIDE THONG",
    slug: "low-hide-thong",
    price: 285,
    image: "/assets/image6.png",
    mainColor: "Black + 11 colors",
    quickAdd: true,
  },
  {
    id: 4,
    name: "LOW HIDE THONG",
    slug: "low-hide-thong",
    price: 285,
    image: "/assets/sweatshirt.png",
    mainColor: "Black + 11 colors",
    quickAdd: true,
  },
];

export function ShopGrid() {
  return (
    <>
      <div className="mt-5 flex flex-row items-center ml-10 gap-5">
        {/* SIZES */}
        <Popover>
          <PopoverTrigger asChild>
            <span className="font-druk text-base underline cursor-pointer">
              SIZE
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-40 bg-gray-50/75">
            <div className="flex flex-col gap-2 text-xs font-druk">
              {/* S */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3 w-3 border border-black"
                />
                <span>S</span>
              </label>

              {/* M */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3 w-3 border border-black"
                />
                <span>M</span>
              </label>

              {/* L */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3 w-3 border border-black"
                />
                <span>L</span>
              </label>

              {/* XL */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3 w-3 border border-black"
                />
                <span>XL</span>
              </label>
            </div>
          </PopoverContent>
        </Popover>

        {/* COLORS */}
        <Popover>
          <PopoverTrigger asChild>
            <span className="font-druk text-base underline cursor-pointer">
              COLOR
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-40 bg-gray-50/75">
            <div className="flex flex-col gap-2 text-xs font-druk">
              {/* BLACK */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3 w-3 border border-black"
                />
                <span className="h-3 w-3 bg-black" />
                <span>BLACK</span>
              </label>

              {/* WHITE */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3 w-3 border border-black"
                />
                <span className="h-3 w-3 bg-white border border-black" />
                <span>WHITE</span>
              </label>

              {/* BEIGE */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3 w-3 border border-black"
                />
                <span
                  className="h-3 w-3"
                  style={{ backgroundColor: "#d7bfa3" }}
                />
                <span>BEIGE</span>
              </label>

              {/* DARK GREY */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3 w-3 border border-black"
                />
                <span className="h-3 w-3 bg-neutral-800" />
                <span>DARK GREY</span>
              </label>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <section className="w-full bg-[#f5f5f5]">
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-4">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  return (
    <>
      <div className="group relative flex flex-col">
        {/* IMAGE AREA */}
        <div className="relative w-full bg-[#f5f5f5] aspect-[3/4] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover h-full cursor-pointer"
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

        {/* TEXT AREA */}
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
    </>
  );
}
