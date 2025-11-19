import React from "react";

const categories = [
  { label: "Jackets", image: "/assets/jackets.png" },
  { label: "Hoodies / Sweatshirts", image: "/assets/sweatshirt.png" },
  { label: "Tshirts", image: "/assets/tshirt.png" },
];

export const Categories = () => {
  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3">
      {categories.map((cat) => (
        <div
          key={cat.label}
          className="relative group h-[70vh] overflow-hidden"
        >
          {/* IMAGE */}
          <img
            src={cat.image}
            alt={cat.label}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          {/* BOTTOM OVERLAY ON TOP OF IMAGE */}
          <div
            className="
              absolute inset-x-0 bottom-0
              z-10
              bg-black/40 backdrop-blur-sm
              py-4 text-center
              text-white text-xl font-semibold tracking-wide

              opacity-0 translate-y-4
              group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-300 ease-out
            "
          >
            {cat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
