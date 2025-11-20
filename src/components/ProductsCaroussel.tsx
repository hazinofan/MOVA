"use client";

import Image from "next/image";
import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type ProductCarouselProps = {
  images: string[]; // array of image paths in /public
};

export function ProductCarousel({ images }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    loop: false,
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
    <section className="relative w-full bg-white">
      {/* viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        {/* slides container */}
        <div className="flex">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="relative flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] h-[90vh] border-l border-white"            >
              <Image
                src={src}
                alt={`Product image ${idx + 1}`}
                fill
                priority={idx === 0}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
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
