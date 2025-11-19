"use client";

import React from "react";

const REASONS = [
  {
    number: "01",
    title: "Performs Under Pressure",
    answer:
      "MOVA pieces stay in place when you move – no rolling waistbands, no see-through fabric, just reliable support from warm-up to cool-down.",
  },
  {
    number: "02",
    title: "Sculpts Without the Squeeze",
    answer:
      "Our cuts follow your natural lines, giving a clean, sculpted look without feeling tight, stiff, or hard to breathe in.",
  },
  {
    number: "03",
    title: "Keeps You Dry + Fresh",
    answer:
      "Breathable, sweat-friendly fabrics help keep you dry and comfortable, whether you're training, walking, or chilling.",
  },
  {
    number: "04",
    title: "Fits So Well You’ll Want to Show It Off",
    answer:
      "Minimal design, sharp silhouettes, and everyday comfort – built so you actually want to wear MOVA beyond the gym.",
  },
];

export function WhyMovaSection() {
  return (
    <section className="w-full bg-[#f5f5f5] border-t border-neutral-200">
      <div className="px-4 md:px-6 lg:px-10 py-12 md:py-16">
        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-druk uppercase mb-10">
          WHY MOVA
        </h2>

        {/* List */}
        <div className="divide-y divide-neutral-200">
          {REASONS.map((item) => (
            <div
              key={item.number}
              className="group cursor-default py-6 md:py-8"
            >
              {/* Question row */}
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-xl md:text-3xl font-semibold">
                  {item.title}
                  <span className="ml-1 align-super text-[10px] md:text-xs">
                    {item.number}
                  </span>
                </p>
              </div>

              {/* Answer (revealed on hover) */}
              <p
                className="mt-2 max-w-3xl text-sm md:text-base text-neutral-600 
                           opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40
                           transition-all duration-200 ease-out"
              >
                {item.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Discover more link */}
        <button className="mt-8 cursor-pointer text-base md:text-2xl font-semibold underline underline-offset-4">
          Discover More
        </button>
      </div>
    </section>
  );
}
