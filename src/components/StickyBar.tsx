import { useState } from "react";
import { Button } from "@/components/ui/button";

type StickyBarProps = {
  name: string;
  price: number;
  averageRating: number;
  reviewCount: number;
};

function StickyAddToCartBar({
  name,
  price,
  averageRating,
  reviewCount,
}: StickyBarProps) {
  const [size, setSize] = useState("S");
  const [qty, setQty] = useState(1);

  const minus = () => setQty((q) => Math.max(1, q - 1));
  const plus = () => setQty((q) => q + 1);

  return (
<div className="fixed inset-x-0 bottom-0 z-40 bg-white">
  {/* whole bar */}
  <div className="flex items-stretch text-xs md:text-sm">
    {/* LEFT + MIDDLE: padded content */}
    <div className="flex-1 px-6 py-5 flex items-center gap-6">
      {/* LEFT: name + rating + price */}
      <div className="flex-1">
        <div className="font-druk tracking-[0.16em] text-[11px] md:text-xl uppercase">
          {name}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[18px]">
          <span>{"★★★★★".slice(0, Math.round(averageRating))}</span>
          <span className="text-black/60">{reviewCount} Reviews</span>
        </div>
        <div className="mt-1 text-[12px] md:text-[18px] font-semibold">
          {price} DH
        </div>
      </div>

      {/* MIDDLE: color / size / qty */}
      <div className="hidden md:flex flex-[1.2] items-center justify-center gap-10">
        <div className="flex flex-col gap-1">
          <span className="font-druk tracking-[0.18em] text-[14px] uppercase">
            Color
          </span>
          <button className="underline text-[16px]">
            Black
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-druk tracking-[0.18em] text-[14px] uppercase">
            Size
          </span>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="border-none bg-transparent underline text-[16px] outline-none cursor-pointer"
          >
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <span className="font-druk tracking-[0.18em] text-[15px] uppercase">
            Amount
          </span>
          <div className="flex items-center gap-3 text-[13px]">
            <button onClick={minus} className="px-2">
              -
            </button>
            <span>{qty}</span>
            <button onClick={plus} className="px-2">
              +
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT: Add to cart – full height, full remaining width */}
    <div className="w-full max-w-[420px]">
      <Button
        className="w-full h-full rounded-none bg-black text-white text-xs md:text-sm font-druk tracking-[0.18em] uppercase"
        onClick={() => {
          console.log("Add to cart", { name, size, qty });
        }}
      >
        Add To Cart
      </Button>
    </div>
  </div>
</div>

  );
}

export default StickyAddToCartBar;