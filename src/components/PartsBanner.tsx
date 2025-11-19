import React from "react";

type Hotspot = {
  id: number;
  x: number; 
  y: number; 
  title: string;
  price: string;
  description: string;
  subtitle?: string;
};

const HOTSPOTS: Hotspot[] = [
  {
    id: 1,
    x: 51,
    y: 35,
    title: "Blue Seamless Top",
    price: "475 DH",
    description: "Supportive ribbed top made for daily movement.",
    subtitle: "WHITE MOVA TSHIRT GENERATION"
    
  },
  {
    id: 2,
    x: 60,
    y: 61,
    title: "High Rise Bottom",
    price: "285 DH",
    description: "Soft, sculpting fit with a clean waistband.",
    subtitle:" JOGGERS MOVA PANTS"
  },
];

export const PartsBanner = () => {
  return (
    <div className="relative w-full mt-5">
      {/* Banner image */}
      <img
        src="/assets/banner.png"
        alt="banner for choices"
        className="w-full h-auto object-cover"
      />

      {/* Hotspots */}
      {HOTSPOTS.map((spot) => (
        <div
          key={spot.id}
          style={{
            top: `${spot.y}%`,
            left: `${spot.x}%`,
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 group"
        >
          {/* Dot */}
          <button
            className="h-4 w-4 rounded-full border-2 bg-black/70 
                       flex items-center justify-center shadow-lg"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </button>
          <span className=" font-druk text-xs"> {spot.subtitle} </span>

          {/* Card on hover */}
          <div
            className="pointer-events-none absolute left-1/2 top-8 z-20 w-[220px] 
                       -translate-x-1/2 rounded-lg bg-black/90 p-4 text-white 
                       opacity-0 shadow-xl backdrop-blur 
                       transition-opacity duration-200 ease-out 
                       group-hover:opacity-100 group-hover:pointer-events-auto"
          >
            <h3 className="text-sm font-semibold">{spot.title}</h3>
            <p className="mt-1 text-xs text-neutral-300">{spot.description}</p>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="font-semibold">{spot.price}</span>
              <button className="text-[11px] uppercase tracking-wide underline underline-offset-2">
                View product
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
