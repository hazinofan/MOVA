"use client";

import React from "react";
import { useRouter } from "next/router";

const categories = [
  { label: "Jackets", slug: "jackets", image: "/assets/jackets.png" },
  { label: "Hoodies / Sweatshirts", slug: "hoodies", image: "/assets/sweatshirt.png" },
  { label: "Tshirts", slug: "tshirts", image: "/assets/tshirt.png" },
];

export const Categories = () => {
  const router = useRouter();

  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3">
      {categories.map((cat) => (
        <button
          key={cat.slug}
          type="button"
          onClick={() => router.push(`/shop?category=${encodeURIComponent(cat.slug)}`)}
          className="relative cursor-pointer group h-[70vh] overflow-hidden text-left"
        >
          <img
            src={cat.image}
            alt={cat.label}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          <div
            className="
              absolute inset-x-0 bottom-0 z-10
              bg-black/40 backdrop-blur-sm
              py-4 text-center text-white text-xl font-semibold tracking-wide
              opacity-0 translate-y-4
              group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-300 ease-out
            "
          >
            {cat.label}
          </div>
        </button>
      ))}
    </div>
  );
};
