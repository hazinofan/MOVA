"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Sparkles, Palette, Truck } from "lucide-react";

type StudioItem = {
  id: number | string;
  title: string;
  subtitle: string;
  priceFrom: number;
  image: string;
  pill?: string;
};

const TOP_ROW: StudioItem[] = [
  {
    id: 1,
    title: "Custom Tee Printing",
    subtitle: "DTF / VINYL • FULL COLOR",
    priceFrom: 89,
    image: "/studio/tee.png",
    pill: "Best seller",
  },
  {
    id: 2,
    title: "Hoodie + Back Print",
    subtitle: "FRONT + BACK • PREMIUM",
    priceFrom: 179,
    image: "/studio/hoodie.png",
    pill: "New",
  },
  {
    id: 3,
    title: "Crewneck / Sweat",
    subtitle: "SOFT TOUCH • CLEAN FINISH",
    priceFrom: 149,
    image: "/studio/sweat.png",
  },
  {
    id: 4,
    title: "Caps & Beanies",
    subtitle: "EMBROIDERY • PATCH",
    priceFrom: 79,
    image: "/studio/cap.png",
  },
  {
    id: 5,
    title: "Tote Bags",
    subtitle: "PRINT • SIMPLE / BOLD",
    priceFrom: 49,
    image: "/studio/tote.png",
  },
];

const BOTTOM_ROW: StudioItem[] = [
  {
    id: 6,
    title: "Logo Placement",
    subtitle: "CHEST / SLEEVE / BACK",
    priceFrom: 0,
    image: "/assets/ChatGPT Image 2 janv. 2026, 11_26_17.png",
    pill: "Guided",
  },
  {
    id: 7,
    title: "Upload Your Design",
    subtitle: "PNG / SVG • HIGH RES",
    priceFrom: 0,
    image: "/assets/upload-design.webp",
  },
  {
    id: 8,
    title: "Pick Your Color",
    subtitle: "WHITE / BLACK • MORE SOON",
    priceFrom: 0,
    image: "/assets/colors.webp",
  },
  {
    id: 9,
    title: "Fast Production",
    subtitle: "READY IN 24-72H",
    priceFrom: 0,
    image: "/assets/fastProduction.webp",
  },
];

function Dh(n: number) {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    maximumFractionDigits: 0,
  }).format(n);
}

function StudioCarousel({ items }: { items: StudioItem[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: true,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative bg-neutral-100 py-4 md:py-0">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {items.map((p) => (
            <article
              key={p.id}
              className="
                basis-[82%]
                md:basis-1/3
                lg:basis-1/3
                shrink-0 border border-neutral-100 bg-white
              "
            >
              <div className="flex flex-col aspect-[3/4]">
                <div className="flex-1 flex items-center justify-center px-4 md:px-8 pt-2 md:pt-0">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={p.image}
                      alt={p.title}
                      width={320}
                      height={320}
                      className="object-contain"
                      priority={false}
                    />

                    {p.pill ? (
                      <span className="absolute left-4 top-4 rounded-full border bg-white px-3 py-1 text-[10px] md:text-xs font-semibold tracking-[0.12em] uppercase">
                        {p.pill}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div
                  className="
                    relative
                    px-4 md:px-6
                    pb-4 md:pb-6
                    pt-2
                    text-[10px] md:text-xs
                    tracking-[0.18em] uppercase
                  "
                >
                  <div className="max-w-[80%]">
                    <p className="font-medium text-neutral-900">{p.title}</p>
                    <p className="mt-1 text-[10px] text-neutral-500">{p.subtitle}</p>
                  </div>

                  {p.priceFrom > 0 ? (
                    <span className="absolute right-4 md:right-6 bottom-4 md:bottom-6 text-[10px] md:text-xs font-medium">
                      From {Dh(p.priceFrom)}
                    </span>
                  ) : (
                    <span className="absolute right-4 md:right-6 bottom-4 md:bottom-6 text-[10px] md:text-xs font-medium text-neutral-600">
                      Included
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={scrollPrev}
        className="
          absolute left-2 md:left-3
          top-1/2 -translate-y-1/2
          z-10 flex h-8 w-8 items-center justify-center
          rounded-full bg-white shadow-sm border text-xs
          hover:bg-neutral-50 transition
        "
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={scrollNext}
        className="
          absolute right-2 md:right-3
          top-1/2 -translate-y-1/2
          z-10 flex h-8 w-8 items-center justify-center
          rounded-full bg-white shadow-sm border text-xs
          hover:bg-neutral-50 transition
        "
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export function MovaStudioPrintSection() {
  return (
    <section className="w-full px-4 md:px-16 bg-white py-12 md:py-16 lg:py-24">
      <div className="grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-between gap-8 md:gap-0">
          <div className="relative w-full max-w-sm aspect-[3/4] mx-auto lg:mx-0 overflow-hidden">
            <Image
              src="/assets/movabrand-custom.webp"
              alt="MOVA Studio printing preview"
              fill
              className="object-cover"
            />

            {/* subtle overlay card */}
<div className="absolute left-4 right-4 bottom-4">
  <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/95 backdrop-blur-md shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
    
    {/* accent line */}
    <div className="absolute inset-x-0 top-0 h-[2px] bg-black" />

    <div className="flex items-start gap-4 px-5 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">
        <Sparkles className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <img src="/assets/mova-minilogo.webp" className="w-16" alt="" />

        <div className="mt-1 text-sm font-semibold text-neutral-900 leading-tight">
          Print your design on premium blanks
        </div>

        <div className="mt-1 text-xs leading-relaxed text-neutral-600">
          Tees, hoodies, sweats, caps. Clean finish. Fast turnaround.
        </div>
      </div>
    </div>
  </div>
</div>

          </div>

          <div className="mt-6 md:mt-12 text-center lg:text-left">
            <p className="text-xs md:text-sm tracking-[0.2em] uppercase text-neutral-700">
              Design → Print → Delivered
            </p>

            <h2 className="mt-3 md:mt-4 text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight font-druk">
              MOVA STUDIO PRINTS
            </h2>

            <p className="mt-4 max-w-xl mx-auto lg:mx-0 text-sm md:text-base text-neutral-600">
              Upload artwork, pick garment + color, choose placement, and we’ll
              print it sharp and durable. Your wardrobe, your rules. 🎨
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs tracking-[0.14em] uppercase">
                <Palette className="h-4 w-4" />
                Custom placements
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs tracking-[0.14em] uppercase">
                <Sparkles className="h-4 w-4" />
                High-quality prints
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs tracking-[0.14em] uppercase">
                <Truck className="h-4 w-4" />
                Fast turnaround
              </div>
            </div>

            <Link
              href="/creative"
              className="mt-6 inline-flex items-center justify-center rounded-tr-3xl rounded-bl-3xl border px-16 py-2 text-sm md:text-base font-semibold hover:bg-green-100 hover:rounded-full transition-all duration-300"
            >
              Start Printing
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col bg-neutral-100 gap-px">
          <StudioCarousel items={TOP_ROW} />
          <StudioCarousel items={BOTTOM_ROW} />
        </div>
      </div>
    </section>
  );
}
