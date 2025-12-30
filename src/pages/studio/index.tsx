"use client";

import { MoveLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Item = {
  id: "tshirt" | "hoodie" | "cap" | "cup";
  label: string;
  desc: string;
  href: string;
  badge?: string;
  mockupSrc: string; // from /public
  meta?: string; // small extra line
};

const ITEMS: Item[] = [
  {
    id: "tshirt",
    label: "T-Shirts",
    desc: "Front & back prints. Clean everyday fit.",
    href: "/studio/tshirt",
    badge: "Most popular",
    mockupSrc: "/mockups/tshirts.webp",
    meta: "Best for big graphics",
  },
  {
    id: "hoodie",
    label: "Hoodies",
    desc: "Heavy feel. Premium look, big canvas.",
    href: "/studio/hoodie",
    badge: "Premium",
    mockupSrc: "/mockups/hoodie.webp",
    meta: "Looks insane in preview",
  },
  {
    id: "cap",
    label: "Caps",
    desc: "Small area. Sharp details, minimal style.",
    href: "/studio/cap",
    mockupSrc: "/mockups/caps.webp",
    meta: "Logo-focused",
  },
  {
    id: "cup",
    label: "Cups",
    desc: "Gift-ready. Wrap-like placement feel.",
    href: "/studio/cup",
    mockupSrc: "/mockups/cup.webp",
    meta: "Great for quotes",
  },
];

export default function StudioChooseProductPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-neutral-50 text-neutral-900">
      {/* soft background texture */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.55]">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-pink-200 blur-3xl" />
        <div className="absolute top-10 -right-40 h-[520px] w-[520px] rounded-full bg-indigo-200 blur-3xl" />
        <div className="absolute bottom-[-200px] left-1/3 h-[520px] w-[520px] rounded-full bg-emerald-200 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[115rem] px-5 py-10">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-neutral-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                MOVA Studio
              </div>

              <h1 className="mt-4 text-4xl md:text-6xl font-druk tracking-tight leading-[0.95]">
                Choose what to customize
              </h1>

              <p className="mt-3 max-w-2xl text-neutral-600 text-base md:text-lg">
                Pick a product, upload your design, and adjust it with accurate
                placement previews.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="h-11 px-4 rounded-xl border border-black/10 bg-white/70 hover:bg-white transition shadow-sm flex flex-row gap-2 items-center text-base"
              >
                <MoveLeft />
                Back
              </Link>
            </div>
          </div>

          {/* mini info row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <InfoPill title="Best uploads" value="PNG (transparent)" />
            <InfoPill title="Preview style" value="1st look design" />
            <InfoPill title="Checkout" value="When you're satisfied" />
          </div>
        </div>

        {/* Cards grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={[
                "group rounded-3xl border border-black/10 bg-white/70 backdrop-blur shadow-sm",
                "hover:shadow-md hover:bg-white transition overflow-hidden",
                "focus:outline-none focus:ring-2 focus:ring-black/20",
              ].join(" ")}
            >
              {/* mockup */}
              <div className="relative h-52 w-full bg-gradient-to-b from-black/[0.03] to-transparent">
                <Image
                  src={item.mockupSrc}
                  alt={`${item.label} mockup`}
                  fill
                  priority={item.id === "tshirt"}
                  className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.03]"
                />

                {/* badge */}
                {item.badge && (
                  <div className="absolute left-4 top-4 rounded-full border border-black/10 bg-white/80 px-2.5 py-1 text-xs text-neutral-700 shadow-sm">
                    {item.badge}
                  </div>
                )}

                {/* arrow bubble */}
                <div className="absolute right-4 top-4 h-9 w-9 rounded-full border border-black/10 bg-white/80 shadow-sm grid place-items-center transition group-hover:bg-black group-hover:text-white">
                  →
                </div>
              </div>

              {/* content */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-2xl font-druk tracking-tight">
                    {item.label}
                  </div>
                </div>

                <div className="mt-2 text-sm text-neutral-600 leading-relaxed">
                  {item.desc}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-neutral-500">
                    {item.meta ?? "Open editor"}
                  </div>
                  <div className="text-xs font-semibold text-neutral-900">
                    Customize
                  </div>
                </div>

                <div className="mt-4 h-px bg-black/10" />

                <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-black/60" />
                    Preview ready
                  </span>
                  <span className="text-neutral-900 font-medium group-hover:underline">
                    Open
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer hint */}
        <div className="mt-10 text-sm text-neutral-600">
          Tip: Upload a high-res PNG. SVG works too (best for logos).
        </div>
      </div>
    </div>
  );
}

function InfoPill({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 backdrop-blur shadow-sm p-4">
      <div className="text-xs text-neutral-500">{title}</div>
      <div className="mt-1 text-base font-semibold text-neutral-900">
        {value}
      </div>
    </div>
  );
}


StudioChooseProductPage.hideNavbar = true;
StudioChooseProductPage.hideFooter = true;