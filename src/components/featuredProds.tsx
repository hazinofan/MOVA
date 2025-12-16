"use client";

import Image from "next/image";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type CarouselItem = {
  image: string;
  title?: string;     // ex: "LOW HIDE BRIEF"
  subtitle?: string;  // ex: "Heather Grey + 5 Other"
  price?: string;     // ex: "285.00 Dh"
};

type ProductCarouselProps = {
  /**
   * BACKWARD-COMPAT: simple usage with just images
   */
  images?: string[];
  /**
   * New preferred API: full objects with title/price
   */
  items?: CarouselItem[];
};

export function FeaturedProducts({ images, items }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    loop: false,
  });

  // Build final slides from items OR images[]
  const slides: CarouselItem[] =
    items ??
    (images ?? []).map((src) => ({
      image: src,
    }));

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="relative w-full bg-white">
      {/* viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* slides container */}
        <div className="flex">
          {slides.map((item, idx) => (
            <div
              key={idx}
              className="relative flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] 
                         min-h-[90vh] border-l border-white flex flex-col"
            >
              {/* IMAGE */}
              <div className="relative flex-1">
                <Image
                  src={item.image}
                  alt={item.title || `Product image ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              {/* CAPTION (title + subtitle + price) */}
              {(item.title || item.subtitle || item.price) && (
                <div className="bg-white px-4 py-4">
                  {item.title && (
                    <h3 className="font-druk tracking-[0.18em] uppercase text-sm md:text-base">
                      {item.title}
                    </h3>
                  )}

                  {item.subtitle && (
                    <p className="mt-1 text-xs md:text-sm flex items-center gap-2">
                      {/* small color square like the example (optional visual) */}
                      <span className="inline-block h-3 w-3 bg-blue-500" />
                      <span>{item.subtitle}</span>
                    </p>
                  )}

                  {item.price && (
                    <p className="mt-2 text-sm md:text-base font-medium">
                      {item.price}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* arrows */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-end gap-3 px-6">
        <button
          onClick={scrollPrev}
          className="pointer-events-auto h-9 w-9 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition"
          aria-label="Previous image"
        >
          <FiChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={scrollNext}
          className="pointer-events-auto h-9 w-9 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition"
          aria-label="Next image"
        >
          <FiChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
