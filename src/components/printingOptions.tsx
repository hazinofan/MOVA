"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Shirt,
  Layers,
  Droplets,
  MapPin,
  BadgeCheck,
  type LucideIcon,
  Award,
  Banknote,
  Box,
  Maximize2,
  Truck,
} from "lucide-react";

type MetricKey = "quality" | "price" | "shipping" | "delivery";

type Metric = {
  key: MetricKey;
  title: string;
  value: string;
  sub?: string;
  note?: string;
  sizeGuide?: SizeGuide;
};

type SizeGuide = {
  note?: string; // small text under title
  tabs?: ("Imperial" | "Metric")[]; // optional, default: ["Imperial"]
  columns: string[]; // ex: ["S","M","L"...] or ["OS"]
  rows: { label: string; values: (string | number)[] }[];
};

type Props = {
  defaultTab?: "choice" | "manual";
  details?: ProductDetails;
  // Header
  brand: string;
  productName?: string; // ex: "Choice" or "Standard"
  headline: string;
  description?: string;

  // Metrics (dynamic)
  metrics?: Metric[];

  // Specs (dynamic)
  colorsCount?: number;
  colors?: string[]; // list of hex codes
  sizesCount?: number;
  sizesLabel?: string;

  printAreas?: { id: "front" | "back" | string; label: string }[];

  // Features (dynamic)
  features?: string[];

  // CTAs (dynamic)
  startHref?: string;
  onStart?: () => void;

  detailsHref?: string;
  onDetails?: () => void;

  // Optional: style
  backgroundClassName?: string; // allow each product to change card background if you want
};

function clsx(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

/** FRONT svg */
function FrontPrintIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="35"
      viewBox="0 0 40 40"
      fill="none"
    >
      <script id="eppiocemhmnlbhjplcgkofciiegomcon" />
      <script />
      <script />
      <path
        d="M12.7465 10.3861C12.8449 10.5501 12.8544 10.7531 12.7728 10.9261L8.53845 19.9056C8.38464 20.2318 7.97163 20.337 7.68103 20.1234L1.95837 15.9174C1.7499 15.7641 1.6741 15.4994 1.76501 15.2699C2.25385 14.0357 3.31139 11.473 4.58142 9.02478C5.21665 7.80027 5.8996 6.61466 6.5863 5.64197C7.28216 4.65635 7.94725 3.94086 8.53162 3.59802C8.5706 3.57516 8.60549 3.55646 8.63611 3.54041L12.7465 10.3861Z"
        fill="#F5F5F0"
        stroke="#2F2E0C"
        strokeLinejoin="round"
      />
      <path
        d="M26.96 10.2955C26.8615 10.4595 26.852 10.6625 26.9336 10.8356L31.168 19.815C31.3218 20.1412 31.7348 20.2464 32.0254 20.0328L37.748 15.8268C37.9565 15.6736 38.0323 15.4089 37.9414 15.1793C37.4526 13.9451 36.395 11.3824 35.125 8.93419C34.4898 7.70968 33.8068 6.52407 33.1201 5.55138C32.4243 4.56576 31.7592 3.85027 31.1748 3.50743C31.1358 3.48457 31.1009 3.46587 31.0703 3.44981L26.96 10.2955Z"
        fill="#F5F5F0"
        stroke="#2F2E0C"
        strokeLinejoin="round"
      />
      <path
        d="M19.1827 1.50488H26.5929C26.6601 1.50488 26.7273 1.51847 26.7902 1.54492C28.1806 2.1312 29.9696 2.85144 30.8947 3.22168C31.0829 3.29711 31.2076 3.47775 31.212 3.67969L31.4562 14.8174V37.9971C31.4562 38.2746 31.2317 38.4998 30.9542 38.5H8.39075C8.11314 38.5 7.88782 38.2747 7.88782 37.9971V14.8174L8.13196 3.67969C8.1364 3.47769 8.26197 3.29707 8.45032 3.22168C9.37596 2.85119 11.1661 2.13033 12.5568 1.54395C12.6195 1.51754 12.684 1.50415 12.7491 1.50391C13.4029 1.50149 15.6464 1.49527 19.1827 1.50488Z"
        fill="#F5F5F0"
        stroke="#2F2E0C"
        strokeLinejoin="round"
      />
      <path
        d="M19.0507 1.50488H26.1923C25.5235 4.59246 22.7958 6.90021 19.538 6.90039C16.2793 6.90039 13.5508 4.59159 12.8827 1.50293C13.7681 1.50022 15.8945 1.49631 19.0507 1.50488Z"
        fill="#F5F5F0"
        stroke="#2F2E0C"
        strokeLinejoin="round"
      />
      <rect x="13.2" y="12" width="13" height="16" fill="#A8A794" />
    </svg>
  );
}

function BackPrintIcon() {
  return (
    <svg width="35" height="35" viewBox="0 0 40 40" fill="none">
      <path
        d="M12.7465 10.3861C12.8449 10.5501 12.8544 10.7531 12.7728 10.9261L8.53845 19.9056C8.38464 20.2318 7.97163 20.337 7.68103 20.1234L1.95837 15.9174C1.7499 15.7641 1.6741 15.4994 1.76501 15.2699C2.25385 14.0357 3.31139 11.473 4.58142 9.02478C5.21665 7.80027 5.8996 6.61466 6.5863 5.64197C7.28216 4.65635 7.94725 3.94086 8.53162 3.59802L12.7465 10.3861Z"
        fill="#F5F5F0"
        stroke="#2F2E0C"
        strokeLinejoin="round"
      />
      <path
        d="M26.96 10.2955C26.8615 10.4595 26.852 10.6625 26.9336 10.8356L31.168 19.815C31.3218 20.1412 31.7348 20.2464 32.0254 20.0328L37.748 15.8268C37.9565 15.6736 38.0323 15.4089 37.9414 15.1793C37.4526 13.9451 36.395 11.3824 35.125 8.93419C34.4898 7.70968 33.8068 6.52407 33.1201 5.55138C32.4243 4.56576 31.7592 3.85027 31.1748 3.50743L26.96 10.2955Z"
        fill="#F5F5F0"
        stroke="#2F2E0C"
        strokeLinejoin="round"
      />
      <path
        d="M19.1827 1.50488H26.5929C26.6601 1.50488 26.7273 1.51847 26.7902 1.54492C28.1806 2.1312 29.9696 2.85144 30.8947 3.22168C31.0829 3.29711 31.2076 3.47775 31.212 3.67969L31.4562 14.8174V37.9971C31.4562 38.2746 31.2317 38.4998 30.9542 38.5H8.39075C8.11314 38.5 7.88782 38.2747 7.88782 37.9971V14.8174L8.13196 3.67969C8.1364 3.47769 8.26197 3.29707 8.45032 3.22168C9.37596 2.85119 11.1661 2.13033 12.5568 1.54395C12.6195 1.51754 12.684 1.50415 12.7491 1.50391L19.1827 1.50488Z"
        fill="#F5F5F0"
        stroke="#2F2E0C"
        strokeLinejoin="round"
      />
      <rect x="13.2" y="8" width="13" height="16" fill="#A8A794" />
    </svg>
  );
}

const CARE_TEXT =
  "Machine wash: cold (max 30C or 90F); Do not bleach; Tumble dry: low heat; Iron, steam or dry: low heat; Do not dryclean.";

function fmt(n: string | number) {
  if (typeof n === "number") return n.toFixed(2);
  return n;
}

// minimal “laundry icons” (inline SVG, no dependency)
function CareIcon({
  kind,
}: {
  kind: "wash" | "bleach" | "dry" | "iron" | "dryclean";
}) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none" as const,
  };
  switch (kind) {
    case "wash":
      return (
        <svg {...common}>
          <path
            d="M6 7h12l-1 13H7L6 7Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M9 7V5.8C9 4.8 9.8 4 10.8 4h2.4C14.2 4 15 4.8 15 5.8V7"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "bleach":
      return (
        <svg {...common}>
          <path
            d="M12 4l7 16H5l7-16Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M9.5 14.5h5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "dry":
      return (
        <svg {...common}>
          <rect
            x="5"
            y="5"
            width="14"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle
            cx="12"
            cy="12"
            r="3.2"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      );
    case "iron":
      return (
        <svg {...common}>
          <path
            d="M6 16h12v-4c0-2.2-1.8-4-4-4H8c-1.1 0-2 .9-2 2v6Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M8 18h10" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="9.2" cy="11.2" r="0.7" fill="currentColor" />
        </svg>
      );
    case "dryclean":
      return (
        <svg {...common}>
          <circle
            cx="12"
            cy="12"
            r="7"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path d="M8.5 8.5l7 7" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
}

function metricIcon(key: MetricKey) {
  const common = { size: 18, strokeWidth: 1.8 };
  switch (key) {
    case "quality":
      return <Award {...common} />;
    case "price":
      return <Banknote {...common} />;
    case "shipping":
      return <Truck {...common} />;
    case "delivery":
      return <Box {...common} />;
    default:
      return <Award {...common} />;
  }
}

type ProductFeatureIcon =
  | "size"
  | "stitch"
  | "seamless"
  | "fabric"
  | "origin"
  | "material";

type ProductFeature = {
  id: string;
  icon: ProductFeatureIcon;
  title: string;
  description: string;
};

type ProductDetails = {
  about: string;
  keyFeatures: ProductFeature[];
  sizeGuide?: SizeGuide;
};

const ICONS: Record<ProductFeatureIcon, LucideIcon> = {
  size: Maximize2,
  stitch: BadgeCheck,
  seamless: Layers,
  fabric: Droplets,
  origin: MapPin,
  material: Shirt,
};

export default function FulfillmentOptionCard({
  defaultTab = "choice",
  details,
  brand,
  productName,
  headline,
  description,

  metrics,

  colorsCount,
  colors = [],
  sizesCount,
  sizesLabel,

  printAreas = [],

  onDetails,
  detailsHref,
  onStart,
  startHref,

  backgroundClassName = "bg-[#f5f5f0]",
}: Props) {
  const [tab, setTab] = useState<"choice" | "manual">(defaultTab);

  const printAreasCount = printAreas.length;

  const resolvedMetrics = useMemo(() => {
    // If you don't pass metrics from product config, render nothing (not fake values)
    return metrics ?? [];
  }, [metrics]);

  useEffect(() => {
    console.log("metrics:", metrics);
  }, []);

  const about = details?.about?.trim();
  const features = Array.isArray(details?.keyFeatures)
    ? details.keyFeatures
    : [];
  const sizeGuide = details?.sizeGuide;

  const keyFeatures = Array.isArray(details?.keyFeatures)
    ? details.keyFeatures
    : [];
  const featureChips = Array.isArray(features) ? features : [];

  return (
    <section className="w-full bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-[90rem] px-6 py-10">
        <div className="flex flex-col gap-5">
          {/* Heading */}
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-semibold tracking-tight">
              Select a fulfillment option
            </h2>

            {/* Tabs (keep choice only for now, but still dynamic) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTab("choice")}
                className={clsx(
                  "h-9 rounded-full px-4 text-sm font-semibold border transition",
                  tab === "choice"
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-white text-neutral-800 border-black/10 hover:border-black/30"
                )}
              >
                {brand} choice network
              </button>
            </div>
          </div>

          {/* Main Card */}
          <div
            className={clsx(
              " border border-black/10 overflow-hidden",
              backgroundClassName
            )}
          >
            {/* Top band */}
            <div className="bg-neutral-50 border-b border-black/10 px-6 py-5">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <div className="text-4xl font-black tracking-tight">
                    {brand}
                    {productName ? (
                      <span
                        className="ml-2 font-semibold text-neutral-600 text-base"
                        style={{ fontFamily: "cursive" }}
                      >
                        {productName}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xl font-semibold">{headline}</div>
                </div>

                {description ? (
                  <p className="text-base text-neutral-600 max-w-[920px]">
                    {description}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="px-6 py-12">
              {/* Metrics */}
              {resolvedMetrics.length > 0 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resolvedMetrics.map((x) => (
                      <div key={x.key} className="flex gap-3">
                        <div className="h-10 w-16 rounded-xl bg-neutral-100 border border-black/10 grid place-items-center text-neutral-800">
                          {metricIcon(x.key)}
                        </div>

                        <div className="min-w-0">
                          <div className="text-base font-semibold text-neutral-600">
                            {x.title}
                          </div>
                          <div className="mt-2 text-lg font-semibold">
                            {x.value}
                          </div>
                          {x.sub ? (
                            <div className="mt-1 text-sm text-neutral-600 leading-snug">
                              {x.sub}
                            </div>
                          ) : null}
                          {x.note ? (
                            <div className="mt-2 text-xs text-neutral-500">
                              {x.note}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="my-6 border-t border-black/10" />
                </>
              )}

              {/* Specs row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colors */}
                <div>
                  <div className="text-sm font-semibold">
                    Widest selection of colors & sizes{" "}
                    <span className="text-neutral-400">*</span>
                  </div>

                  {(colorsCount != null || colors.length > 0) && (
                    <>
                      <div className="mt-4 text-sm text-neutral-600">
                        Colors •{" "}
                        <span className="font-semibold">
                          {colorsCount ?? colors.length}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {colors.slice(0, 18).map((c, i) => (
                          <div
                            key={`${c}-${i}`}
                            className="h-5 w-5 rounded-full border border-black/15"
                            style={{ background: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <div className="mt-2 text-xs text-neutral-500">
                    * Based on availability
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  {(sizesCount != null || sizesLabel) && (
                    <>
                      <div className="mt-9 lg:mt-0 text-sm text-neutral-600">
                        Sizes •{" "}
                        <span className="font-semibold">
                          {sizesCount ?? "—"}
                        </span>
                      </div>
                      {sizesLabel ? (
                        <div className="mt-3 text-sm font-semibold">
                          {sizesLabel}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>

                {/* Print areas */}
                <div>
                  {printAreasCount > 0 && (
                    <>
                      <div className="mt-9 lg:mt-0 text-sm text-neutral-600">
                        Print areas •{" "}
                        <span className="font-semibold">{printAreasCount}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-6">
                        {printAreas.map((p) => (
                          <div
                            key={p.id}
                            className="flex flex-col items-center"
                          >
                            <div className="h-10 w-10 grid place-items-center text-neutral-800">
                              {p.id === "front" && <FrontPrintIcon />}
                              {p.id === "back" && <BackPrintIcon />}
                              {p.id !== "front" && p.id !== "back" && (
                                <div className="h-10 w-10 rounded-xl bg-neutral-100 border border-black/10 grid place-items-center">
                                  {/* fallback icon box for future areas */}
                                  <span className="text-xs font-semibold">
                                    {String(p.id).slice(0, 2).toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div
                              className="mt-2 text-sm font-semibold"
                              style={{ fontFamily: "cursive" }}
                            >
                              {p.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="my-6 border-t border-black/10" />

              {/* Bottom row */}
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="flex gap-1">
                  {keyFeatures.map((f) => (
                    <span
                      key={f.id} // ✅ key must be string/number
                      className="h-8 inline-flex items-center bg-white border border-black/10 px-3 text-sm font-semibold text-neutral-800"
                    >
                      {f.title}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-3">
                  {startHref ? (
                    <a
                      href={startHref}
                      className="h-10 px-5 bg-emerald-800 text-white hover:bg-emerald-900 hover:rounded-xl transition-all font-semibold inline-flex items-center justify-center"
                    >
                      Start designing
                    </a>
                  ) : onStart ? (
                    <button
                      type="button"
                      onClick={onStart}
                      className="h-10 px-5 bg-emerald-800 text-white hover:bg-emerald-900 hover:rounded-xl transition-all font-semibold"
                    >
                      Start designing
                    </button>
                  ) : null}
                </div>
              </div>

              <section className="mt-16 border-t border-black/10">
                <div className="mx-auto max-w-[90rem] px-5 py-14">
                  <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
                    {/* ABOUT */}
                    <div className="text-3xl md:text-4xl font-semibold tracking-tight">
                      About
                    </div>

                    <div className="max-w-3xl text-[15px] leading-7 text-neutral-700">
                      {about}
                    </div>
                  </div>

                  <div className="mt-16 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
                    {/* KEY FEATURES TITLE */}
                    <div className="text-3xl md:text-4xl font-semibold tracking-tight">
                      Key features
                    </div>

                    {/* FEATURES GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12">
                      {features.map((f) => {
                        const Icon = ICONS[f.icon] ?? Shirt;

                        return (
                          <div key={f.id} className="flex flex-col">
                            {/* icon */}
                            <div className="h-10 w-10 grid place-items-center text-neutral-900">
                              <Icon className="h-7 w-7" strokeWidth={1.5} />
                            </div>

                            {/* title */}
                            <div className="mt-4 font-semibold text-neutral-900">
                              {f.title}
                            </div>

                            {/* desc */}
                            <p className="mt-3 text-sm leading-6 text-neutral-600 max-w-[26rem]">
                              {f.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>
              <section className=" border-t border-black/10">
                <div className="mx-auto max-w-[90rem] px-5 py-14">
                  {/* CARE INSTRUCTIONS */}
                  <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
                    <div className="text-3xl md:text-4xl font-semibold tracking-tight">
                      Care instructions
                    </div>

                    <div>
                      <div className="flex items-center gap-6 text-neutral-900">
                        <CareIcon kind="wash" />
                        <CareIcon kind="bleach" />
                        <CareIcon kind="dry" />
                        <CareIcon kind="iron" />
                        <CareIcon kind="dryclean" />
                      </div>

                      <p className="mt-4 text-[15px] leading-7 text-neutral-700 max-w-3xl">
                        {CARE_TEXT}
                      </p>
                    </div>
                  </div>

                  {/* SIZE GUIDE */}

                      {/* table */}
                      <div className="mt-6 overflow-x-auto">
                        {/* SIZE GUIDE */}
                        {sizeGuide &&
                          sizeGuide.columns.length > 0 &&
                          sizeGuide.rows.length > 0 && (
                            <div className="mt-16 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
                              <div className="text-3xl md:text-4xl font-semibold tracking-tight">
                                Size guide
                              </div>

                              <div>
                                <div className="text-sm text-neutral-600">
                                  {sizeGuide?.note ??
                                    "All measurements in the table refer to product dimensions."}
                                </div>

                                {/* tabs (optional) */}
                                <div className="mt-5 flex items-end gap-6 text-sm">
                                  {(sizeGuide?.tabs ?? ["Imperial"]).map(
                                    (t) => (
                                      <button
                                        key={t}
                                        type="button"
                                        className="font-semibold text-neutral-900 border-b-2 border-neutral-900 pb-2"
                                      >
                                        {t}
                                      </button>
                                    )
                                  )}
                                </div>

                                {/* table */}
                                <div className="mt-6 overflow-x-auto">
                                  <table className="min-w-[860px] w-full border border-black/10">
                                    <thead>
                                      <tr className="bg-white">
                                        <th className="text-left text-sm font-semibold text-neutral-700 px-5 py-4 border-b border-black/10 w-[280px]" />
                                        {sizeGuide?.columns.map((c) => (
                                          <th
                                            key={c}
                                            className="text-center text-sm font-semibold text-neutral-700 px-4 py-4 border-b border-black/10"
                                          >
                                            {c}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {sizeGuide?.rows.map((row, idx) => (
                                        <tr
                                          key={row.label}
                                          className={
                                            idx % 2 === 0
                                              ? "bg-[#f7f7f3]"
                                              : "bg-white"
                                          }
                                        >
                                          <td className="text-sm font-semibold text-neutral-700 px-5 py-4 border-t border-black/10">
                                            {row.label}
                                          </td>

                                          {row.values.map((v, i) => (
                                            <td
                                              key={`${row.label}-${i}`}
                                              className="text-center text-sm text-neutral-800 px-4 py-4 border-t border-black/10"
                                            >
                                              {fmt(v)}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>
                    
                  
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
