"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Size = "XS" | "S" | "M" | "L" | "XL";

type Product = {
  id: string | number;
  title: string;
  priceDh: number;
  image: string;
  swatchNote?: string;
  sizes?: Size[];
};

type Props = {
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  products: Product[];
  options?: EmblaOptionsType;
  onQuickAdd?: (p: Product, size: Size) => void;
};

export default function BestSellers({
  title = "BEST SELLERS",
  ctaLabel = "Shop Now",
  ctaHref = "/shop",
  products,
  options,
  onQuickAdd,
}: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: true,
    ...options,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <section className="w-full mt-20">
      <div className="mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(260px,28%)_1fr] gap-8 md:gap-12 items-center">
          {/* Left: section title + CTA */}
          <aside className="py-2 md:py-6">
            <h2 className="text-2xl md:text-3xl font-extrabold leading-none tracking-[.02em] font-druk">
              {title}
            </h2>
            <Link
              href={ctaHref}
              className="mt-4 inline-flex items-center text-3xl underline underline-offset-[6px] hover:no-underline"
            >
              {ctaLabel}
            </Link>
          </aside>

          {/* Right: carousel */}
          <div className="relative">
            <div className="absolute -top-14 right-0 hidden md:flex gap-2">
              <button
                onClick={scrollPrev}
                disabled={!canPrev}
                aria-label="Previous"
                className="h-10 w-10 rounded-full border grid place-items-center disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollNext}
                disabled={!canNext}
                aria-label="Next"
                className="h-10 w-10 rounded-full border grid place-items-center disabled:opacity-40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex will-change-transform touch-pan-y">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="shrink-0 basis-[88%] sm:basis-[48%] lg:basis-[32%]"
                  >
                    <ProductCard product={p} onQuickAdd={onQuickAdd} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  onQuickAdd,
}: {
  product: Product;
  onQuickAdd?: (p: Product, size: Size) => void;
}) {
  const sizes: Size[] = product.sizes ?? ["XS", "S", "M", "L", "XL"];

  return (
    <article className="group relative overflow-hidden bg-white">
      <div className="relative aspect-[3/4]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 88vw, (max-width: 1024px) 48vw, 32vw"
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="px-5 py-4">
        <div
          className="
            overflow-hidden
            max-h-0 opacity-0
            group-hover:max-h-24 group-hover:opacity-100
            transition-all duration-300 ease-out
          "
        >
          <div className="pb-3">
            <p className="text-[11px] font-semibold tracking-wide">
              QUICK ADD:
            </p>
            <div className="mt-1 flex flex-wrap gap-3">
              {sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => onQuickAdd?.(product, sz)}
                  className="h-8 px-3 rounded-full border text-sm leading-none hover:translate-y-[-1px] transition"
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        <h3 className="text-[16px] font-druk leading-tight tracking-[.01em]">
          {product.title}
        </h3>

        {!!product.swatchNote && (
          <p className="mt-1 text-[12px] opacity-70">{product.swatchNote}</p>
        )}

        <p className="mt-2 text-[13px] font-semibold">
          {product.priceDh.toFixed(2)} Dh
        </p>
      </div>
    </article>
  );
}
