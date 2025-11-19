"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS = [
  {
    quote:
      '"Minimal streetwear designed for comfort, movement and everyday confidence."',
    brand: "Hype Street Magazine",
  },
  {
    quote: '"Where comfort meets clean silhouettes — MOVA sets the new tone."',
    brand: "Urban Aesthetic",
  },
  {
    quote: '"A rising Moroccan label redefining modern basics with attitude."',
    brand: "Daily Fit Review",
  },
];

export default function AsSeenOnCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="w-full">
      <div className="grid grid-cols-[380px_1fr] h-[160px] md:h-[200px]">
        {/* LEFT SIDE LABEL */}
        <div className="bg-[#BDE0FE] flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-haas uppercase font-druk">
            AS SEEN ON
          </h2>
        </div>

        {/* RIGHT SIDE CAROUSEL */}
        <div className="relative bg-black text-white flex items-center">
          {/* Embla viewport */}
          <div ref={emblaRef} className="overflow-hidden w-full">
            <div className="flex">
              {ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="flex-none w-full flex items-center justify-center px-6 md:px-12"
                >
                  <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 text-center lg:text-left max-w-7xl mx-auto">
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold leading-snug">
                      {item.quote}
                    </p>

                    <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-haas uppercase opacity-90 font-mono">
                      {item.brand}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ARROWS */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-3">
            <button
              onClick={scrollPrev}
              className="h-9 w-9 md:h-10 md:w-10 border rounded-md flex items-center justify-center hover:bg-white hover:text-black transition"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={scrollNext}
              className="h-9 w-9 md:h-10 md:w-10 border rounded-md flex items-center justify-center hover:bg-white hover:text-black transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
