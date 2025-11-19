// components/HeroSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

type Slide = {
  id: string;
  image: string;
  kicker?: string;
  title: string;
  ctaLabel?: string;
  ctaHref?: string;
};

const SLIDES: Slide[] = [
  {
    id: "bundles",
    image: "/people/landing.webp",
    kicker: "• 3-PACKS FOR $60",
    title: "NEW\nARRIVALS",
    ctaLabel: "Shop Now",
    ctaHref: "/collections/bundles",
  },
  {
    id: "bundles",
    image: "/people/image2.png",
    kicker: "• 3-PACKS FOR $60",
    title: "NEW\nARRIVALS",
    ctaLabel: "Shop Now",
    ctaHref: "/collections/bundles",
  },
  {
    id: "new",
    image: "/people/lingeries.webp",
    kicker: "• JUST DROPPED",
    title: "BOTTOMS\nBUNDLES",
    ctaLabel: "Shop Now",
    ctaHref: "/collections/new",
  },
  {
    id: "classic",
    image: "/people/image3.png",
    kicker: "• BEST SELLERS",
    title: "EVERYDAY\nESSENTIALS",
    ctaLabel: "Shop Now",
    ctaHref: "/collections/best-sellers",
  },
];

const AUTOPLAY_MS = 5500;

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const hovering = useRef(false);

  const next = () => setIndex((i) => (i + 1) % SLIDES.length);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  // autoplay with pause on hover / when tab hidden
  useEffect(() => {
    const start = () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = setInterval(() => {
        if (!hovering.current && !document.hidden) next();
      }, AUTOPLAY_MS);
    };
    start();
    const onVis = () => {
      if (document.hidden && timer.current) {
        clearInterval(timer.current);
      } else {
        start();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  // keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      {/* Slides (crossfade) */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            {/* bg image */}
            <Image
              src={s.image}
              alt={s.title.replace(/\n/g, " ")}
              fill
              priority={i === index}
              fetchPriority={i === index ? "high" : "auto"} // help LCP
              sizes="100vw" // full width
              quality={95} // ↑ from 75 default
              className="object-cover object-[center_00%]"
            />
          </div>
        ))}
      </div>

      {/* Bottom-left content block */}
      <div className="absolute bottom-10 left-6 md:left-10 z-10 max-w-[90%] sm:max-w-[70%]">
        <p className="text-xs tracking-widest text-white/80 mb-2 font-druk">
          {SLIDES[index].kicker}
        </p>

        <h1
          className="leading-[0.9] text-white font-extrabold tracking-tight font-druk
                       text-2xl sm:text-3xl md:text-6xl whitespace-pre-line drop-shadow"
        >
          {SLIDES[index].title}
        </h1>

        <div className="mt-5 flex items-center gap-4">
          {SLIDES[index].ctaHref && SLIDES[index].ctaLabel && (
            <Link
              href={SLIDES[index].ctaHref!}
              className="inline-block rounded-full border border-white/80 bg-white/10 px-6 py-2 text-white
                         backdrop-blur hover:bg-white hover:text-black transition"
            >
              {SLIDES[index].ctaLabel}
            </Link>
          )}

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              aria-label="Previous slide"
              onClick={prev}
              className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/30 text-white grid place-items-center backdrop-blur"
            >
              <FiChevronLeft className="text-xl" />
            </button>
            <button
              aria-label="Next slide"
              onClick={next}
              className="h-9 w-9 rounded-full bg-white/15 hover:bg-white/30 text-white grid place-items-center backdrop-blur"
            >
              <FiChevronRight className="text-xl" />
            </button>
          </div>
        </div>

        {/* Small index dots (optional) */}
        <div className="mt-4 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 w-6 rounded-full transition ${
                i === index ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
