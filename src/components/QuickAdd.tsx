"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Product = {
  id: number | string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
};

const BRAS: Product[] = [
  {
    id: 1,
    title: "Soft Triangle Bra in Blush",
    subtitle: "ARCTIC BLUE + 5 OTHER",
    price: 475,
    image: "/assets/image1.png",
  },
  {
    id: 2,
    title: "High Sculpt Bra in Arctic Blue",
    subtitle: "ARCTIC BLUE + 5 OTHER",
    price: 475,
    image: "/assets/image2.png",
  },
  {
    id: 3,
    title: "High Sculpt Bra in Sand",
    subtitle: "SAND + 5 OTHER",
    price: 475,
    image: "/assets/image3.png",
  },
  {
    id: 3,
    title: "High Sculpt Bra in Sand",
    subtitle: "SAND + 5 OTHER",
    price: 475,
    image: "/assets/image4.png",
  },
  {
    id: 3,
    title: "High Sculpt Bra in Sand",
    subtitle: "SAND + 5 OTHER",
    price: 475,
    image: "/assets/image5.png",
  },
  // add more if you want the carousel to scroll further
];

const BOTTOMS: Product[] = [
  {
    id: 4,
    title: "Soft Brief in Blush",
    subtitle: "BLUSH + 5 OTHER",
    price: 285,
    image: "/assets/image4.png",
  },
  {
    id: 5,
    title: "Low Hide Thong in Arctic Blue",
    subtitle: "ARCTIC BLUE + 5 OTHER",
    price: 285,
    image: "/assets/image5.png",
  },
  {
    id: 6,
    title: "Low Hide Thong in Sand",
    subtitle: "SAND + 5 OTHER",
    price: 285,
    image: "/assets/image6.png",
  },
  // add more bottoms here if needed
];

function ProductCarousel({ products }: { products: Product[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  });

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative bg-neutral-100">
      {/* slides wrapper */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {products.map((p) => (
            <article
              key={p.id}
              className="basis-full md:basis-1/3 lg:basis-1/3 shrink-0 border border-neutral-100 bg-white"
            >
              <div className="flex flex-col aspect-[3/4]">
                {/* product image */}
                <div className="flex-1 flex items-center justify-center px-8">
                  <Image
                    src={p.image}
                    alt={p.title}
                    width={260}
                    height={200}
                    className="object-contain"
                  />
                </div>

                {/* product text */}
                <div className="relative px-6 pb-6 pt-2 text-[10px] md:text-xs tracking-[0.18em] uppercase">
                  <div className="max-w-[80%]">
                    <p className="font-medium">{p.title}</p>
                    <p className="mt-1 text-[10px] text-neutral-500">
                      {p.subtitle}
                    </p>
                  </div>
                  <span className="absolute right-6 bottom-6 text-[10px] md:text-xs font-medium">
                    {p.price} DH
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* arrows like on the design */}
      <button
        type="button"
        onClick={scrollPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border text-xs"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm border text-xs"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export function MixAndMatchSection() {
  return (
    <section className="w-full px-5 bg-white py-16 md:py-24">
      <div className=" grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-between">
          <div className="relative w-full max-w-sm aspect-[3/4]">
            <Image
              src="/sections/QuickAdd.png"
              alt="Mix and match set"
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-12">
            <p className="text-xs md:text-sm tracking-[0.2em] uppercase">
              Sets for every action packed day
            </p>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight font-druk">
              MIX AND MATCH
            </h2>

            <Link
              href="/collections/sets"
              className="mt-6 inline-block text-base md:text-lg font-medium underline underline-offset-4"
            >
              Build Your Set
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: two stacked carousels */}
        <div className="flex flex-col bg-neutral-100 gap-px">
          {/* bras carousel (top) */}
          <ProductCarousel products={BRAS} />
          {/* bottoms carousel (bottom) */}
          <ProductCarousel products={BOTTOMS} />
        </div>
      </div>
    </section>
  );
}
