"use client";

import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Printer, Sparkle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/core/services/products.service";

type Feature = {
    title: string;
    desc: string;
    icon: React.ReactNode;
};

type Cat = {
    key: "best" | "hoodies" | "tshirts" | 'cups';
    labelTop: string;
    title: string;
    subtitle: string;
    href: string;
    accent: "peach" | "blue" | "black";
    imageSrc: string;
};

const miniProducts = [
    {
        id: "mova-tee-01",
        title: "MOVA Core Tee",
        subtitle: "Front print, heavyweight cotton",
        priceMAD: 249,
        href: "/shop/mova-core-tee",
        badge: "NEW",
        imageSrc: "/mockups/tshirt.webp",
        colors: ["White", "Black", "Stone"],
        sizes: ["S", "M", "L", "XL"],
    },
    {
        id: "mova-hoodie-01",
        title: "MOVA Studio Hoodie",
        subtitle: "Premium fleece, clean back hit",
        priceMAD: 399,
        href: "/shop/mova-studio-hoodie",
        badge: "BEST",
        imageSrc: "/mockups/hoodies.webp",
        colors: ["Black", "Ash", "Cream"],
        sizes: ["S", "M", "L", "XL"],
    },
    {
        id: "mova-cup-01",
        title: "MOVA Round Cup",
        subtitle: "Glossy finish, crisp print",
        priceMAD: 129,
        href: "/shop/mova-cup",
        badge: "DROP",
        imageSrc: "/mockups/cups.webp",
        colors: ["White"],
        sizes: ["One size"],
    },
    {
        id: "mova-tee-02",
        title: "MOVA Type Tee",
        subtitle: "Minimal typography, sharp ink",
        priceMAD: 269,
        href: "/shop/mova-type-tee",
        badge: "LIMITED",
        imageSrc: "/mockups/tshirt.webp",
        colors: ["White", "Black"],
        sizes: ["S", "M", "L", "XL"],
    },
];


export default function CreativePage() {
    const features: Feature[] = [
        {
            title: "Earn from selling tees",
            desc: "Launch drops, collect orders.",
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 1.8c-3.8 0-7 3.2-7 7v1.1c0 4.6 3.4 6.2 7 12.2 3.6-6 7-7.6 7-12.2V8.8c0-3.8-3.2-7-7-7Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M9.2 10.2c.3-1.1 1.3-1.8 2.7-1.8 1.6 0 2.6.7 2.6 1.9 0 1.2-1 1.7-2.4 2-1.2.2-2.2.6-2.2 1.8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M12 16.9h0"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                    />
                </svg>
            ),
        },
        {
            title: "Fast shipping",
            desc: "Morocco first, EU next.",
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 2a10 10 0 1 0 10 10"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M12 2c3.3 2.7 5.5 6.8 5.5 10s-2.2 7.3-5.5 10"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M12 2c-3.3 2.7-5.5 6.8-5.5 10s2.2 7.3 5.5 10"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                    <path
                        d="M2.5 12h19"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                    />
                </svg>
            ),
        },
        {
            title: "Wide selection",
            desc: "Hoodies, tees, more.",
            icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M8 4 6 6 3 7v4l3-1v11h12V10l3 1V7l-3-1-2-2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8 4c1.5 2 3 3 4 3s2.5-1 4-3"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
    ];

    const cats: Cat[] = [
        {
            key: "best",
            labelTop: "[BEST SELLER]",
            title: "Best Seller",
            subtitle: "Top picks this week",
            href: "",
            accent: "peach",
            imageSrc: "/mockups/hoodies.webp",
        },
        {
            key: "cups",
            labelTop: "[CATEGORY 01]",
            title: "Cups",
            subtitle: "Clean, round, clear",
            href: "",
            accent: "blue",
            imageSrc: "/mockups/cups.webp",
        },
        {
            key: "tshirts",
            labelTop: "[CATEGORY 02]",
            title: "T-Shirts",
            subtitle: "Everyday staples",
            href: "",
            accent: "black",
            imageSrc: "/mockups/tshirt.webp",
        },
    ];

    const [printedProducts, setPrintedProducts] = useState<MiniProduct[]>([]);
    const [printedLoading, setPrintedLoading] = useState(false);

    // adjust to your backend host
    const API_ASSETS = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    useEffect(() => {
        let cancelled = false;

        async function loadPrinted() {
            try {
                setPrintedLoading(true);

                // ✅ fetch printed only (server-side filter)
                const data = await fetchProducts(1, 4, false, { isPrinted: true });

                const mapped: MiniProduct[] = (data?.items ?? []).map((p: any) => {
                    const mainImg = p?.images?.[0]?.url;

                    const src = mainImg
                        ? mainImg.startsWith("http")
                            ? mainImg
                            : `${API_ASSETS}${mainImg.startsWith("/") ? "" : "/"}${mainImg}`
                        : "/assets/image1.png";

                    const colors = Array.isArray(p?.tags)
                        ? p.tags.filter((t: string) =>
                            ["black", "white", "beige", "cream", "stone", "grey", "gray"].includes(
                                String(t).toLowerCase()
                            )
                        )
                        : [];

                    const sizes = Array.isArray(p?.variants)
                        ? p.variants
                            .map((v: any) => String(v.size || "").toUpperCase())
                            .filter(Boolean)
                        : [];

                    return {
                        id: String(p.id),
                        title: p.name ?? "Unnamed",
                        subtitle: p?.metaTitle ?? "Printed by MOVA",
                        priceMAD: Number(p.salePrice ?? p.price ?? 0),
                        href: `/shop/${p.slug}`,
                        badge: p.isNewArrival ? "NEW" : p.isFeatured ? "BEST" : undefined,
                        imageSrc: src,
                        colors,
                        sizes,
                    };
                });

                if (!cancelled) setPrintedProducts(mapped);
            } finally {
                if (!cancelled) setPrintedLoading(false);
            }
        }

        loadPrinted();
        return () => {
            cancelled = true;
        };
    }, [API_ASSETS]);


    return (
        <main className="min-h-screen bg-white text-black">
            {/* HERO ONLY */}
            <section className="relative overflow-hidden">
                {/* subtle grid + glow */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.06),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(0,0,0,0.05),transparent_55%)]" />
                    <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
                </div>

                <div className="mx-auto max-w-[100rem] px-6 py-14 md:py-20">
                    {/* top mini header row */}
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <Link href="/" className="group inline-flex items-center gap-3">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-black text-white">
                                M
                            </span>
                            <div className="leading-none">
                                <div className="text-base font-semibold">MOVA Custom</div>
                                <div className="text-base text-black/60">
                                    Studio-grade tools. Street-ready results.
                                </div>
                            </div>
                        </Link>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-5 py-3 text-base font-semibold hover:bg-black/[0.03]"
                            >
                                Shop
                            </Link>

                            <Link href="/studio" className="w-full sm:w-auto">
                                <Button className="flex flex-row text-base bg-red-100 bg-gradient-to-b from-white via-[#f4f4f4] to-[#eaeaea] border border-gray-300 py-5 !px-16 rounded-tl-full rounded-br-full cursor-pointer hover:rounded-full ">
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Start customizing
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* main hero */}
                    <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
                        {/* left */}
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 backdrop-blur">
                                <span className="h-2 w-2 rounded-full bg-black/60" />
                                <span className="text-base font-semibold text-black/70">
                                    On-demand custom clothing
                                </span>
                            </div>

                            <h1 className="mt-6 font-druk text-5xl leading-[1.02] tracking-tight md:text-6xl">
                                Build your MOVA piece.
                                <span className="block text-black/60">Clean. Bold. Yours.</span>
                            </h1>

                            <p className="mt-5 text-lg leading-relaxed text-black/70">
                                Pick a base, drop your design, preview instantly. We produce on
                                demand and quality check before shipping.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link href="/studio" className="group inline-block w-full sm:w-auto">
                                    <button
                                        type="button"
                                        className=" relative w-full sm:w-auto overflow-hidden rounded-tl-full rounded-br-full px-16 py-3 cursor-pointer bg-gradient-to-br from-[#0f0f0f] via-[#1b1b1b] to-[#2d2d2d] text-base font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-all duration-300 ease-out hover:rounded-full hover:brightness-110 active:scale-[0.98]     "
                                    >
                                        {/* inner highlight */}
                                        <span
                                            className=" pointer-events-none absolute inset-0 rounded-tl-full rounded-br-full bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                                        />

                                        {/* content */}
                                        <span className="relative z-10 flex items-center gap-3">
                                            Open the studio
                                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                                →
                                            </span>
                                        </span>
                                    </button>
                                </Link>


                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="w-full cursor-pointer rounded-full border border-black/15 bg-white px-6 py-3 text-base font-semibold hover:bg-black/[0.03] sm:w-auto">
                                            Print area guide
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent
                                        className=" w-[92vw] sm:w-[88vw] lg:w-[820px] max-w-[92vw] sm:max-w-3xl overflow-hidden rounded-3xl border border-black/10 bg-white p-0 shadow-[0_30px_80px_rgba(0,0,0,0.18)] " >
                                        {/* subtle top gradient + grid */}
                                        <div className="relative border-b border-black/10 px-6 py-6 sm:px-7">
                                            <div className="pointer-events-none absolute inset-0">
                                                <div className="absolute inset-0 bg-gradient-to-br from-black/[0.05] via-transparent to-black/[0.03]" />
                                                <div className="absolute inset-0 opacity-[0.25] [background-image:linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />
                                            </div>

                                            <DialogHeader className="relative">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/10 bg-white shadow-sm">
                                                            {/* icon */}
                                                            <Printer className="h-6 w-6 text-black/70" />
                                                        </div>

                                                        <div className="leading-none">
                                                            <DialogTitle className="font-druk text-2xl tracking-tight sm:text-3xl">
                                                                Print area guide
                                                            </DialogTitle>
                                                            <p className="mt-2 text-base text-black/60">
                                                                Keep it inside the frame, keep it crisp.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-base font-semibold text-black/70 sm:inline-flex">
                                                        MOVA Studio
                                                    </span>
                                                </div>
                                            </DialogHeader>
                                        </div>

                                        {/* body */}
                                        <div className="px-6 py-6 sm:px-7">
                                            {/* quick summary */}
                                            <div className="rounded-3xl border border-black/10 bg-black/[0.03] p-5">
                                                <p className="text-base leading-relaxed text-black/80">
                                                    Keep your design inside the printable frame to avoid any cropping during
                                                    production. Leave some breathing room so edges stay clean.
                                                </p>
                                            </div>

                                            {/* do / dont */}
                                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                                <div className="rounded-3xl border border-black/10 bg-white p-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                                                            ✓
                                                        </span>
                                                        <p className="text-base font-semibold">Do</p>
                                                    </div>
                                                    <ul className="mt-3 space-y-2 text-base text-black/70">
                                                        <li className="flex gap-2">
                                                            <span className="mt-[6px] h-2 w-2 rounded-full bg-black/40" />
                                                            Keep important details away from edges
                                                        </li>
                                                        <li className="flex gap-2">
                                                            <span className="mt-[6px] h-2 w-2 rounded-full bg-black/40" />
                                                            Use high-res PNG (transparent) or SVG
                                                        </li>
                                                        <li className="flex gap-2">
                                                            <span className="mt-[6px] h-2 w-2 rounded-full bg-black/40" />
                                                            Prefer high contrast on dark garments
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="rounded-3xl border border-black/10 bg-white p-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white text-black">
                                                            ✕
                                                        </span>
                                                        <p className="text-base font-semibold">Avoid</p>
                                                    </div>
                                                    <ul className="mt-3 space-y-2 text-base text-black/70">
                                                        <li className="flex gap-2">
                                                            <span className="mt-[6px] h-2 w-2 rounded-full bg-black/15" />
                                                            Low-res screenshots or tiny images
                                                        </li>
                                                        <li className="flex gap-2">
                                                            <span className="mt-[6px] h-2 w-2 rounded-full bg-black/15" />
                                                            Text too close to the print boundary
                                                        </li>
                                                        <li className="flex gap-2">
                                                            <span className="mt-[6px] h-2 w-2 rounded-full bg-black/15" />
                                                            Washed-out colors on similar fabric tones
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* resolution callout */}
                                            <div className="mt-6 rounded-3xl border border-black/10 bg-gradient-to-br from-black/[0.06] via-black/[0.03] to-transparent p-6">
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <p className="text-base font-semibold">Recommended resolution</p>
                                                        <p className="mt-1 text-base text-black/70">
                                                            Aim for at least <span className="font-semibold">2000px</span> width
                                                            for large prints (clean edges, no pixelation).
                                                        </p>
                                                    </div>

                                                    <div className="w-fit rounded-2xl border border-black/10 bg-white px-4 py-3 text-center">
                                                        <div className="text-base font-semibold">2000px+</div>
                                                        <div className="text-base text-black/60">width</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* footer tip */}
                                            <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-black/10 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
                                                <div>
                                                    <p className="text-base font-semibold">Pro tip</p>
                                                    <p className="mt-1 text-base text-black/60">
                                                        Add a little margin. Your design will feel more premium.
                                                    </p>
                                                </div>

                                                <span className="inline-flex w-fit rounded-full border border-black/10 bg-black px-5 py-2 text-base font-semibold text-white">
                                                    Safe-zone mindset
                                                </span>
                                            </div>
                                        </div>
                                    </DialogContent>

                                </Dialog>
                            </div>

                            {/* stats */}
                            <div className="mt-10 grid gap-4 sm:grid-cols-3">
                                <StatPill label="Steps" value="3" />
                                <StatPill label="Preview" value="Live" />
                                <StatPill label="Made" value="On-demand" />
                            </div>
                        </div>

                        {/* right */}
                        <div className="relative">
                            {/* soft glow + grid */}
                            <div className="pointer-events-none absolute -inset-10">
                                <div className="absolute inset-0 rounded-[40px] " />
                                <div className="absolute inset-0 opacity-[0.25] [background-image:linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:56px_56px]" />
                            </div>

                            {/* main shell */}
                            <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-white/70 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur">
                                {/* top bar */}
                                <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white">
                                            <span className="h-2 w-2 rounded-full bg-black" />
                                        </span>

                                        <div className="leading-none">
                                            <div className="text-base">MOVA Studio</div>
                                            <div className="text-base text-black/55">Live preview</div>
                                        </div>
                                    </div>

                                    <div className="hidden items-center gap-2 md:flex">
                                        <Chip>Front</Chip>
                                        <Chip>Back</Chip>
                                        <Chip>Left</Chip>
                                        <Chip>Right</Chip>
                                    </div>
                                </div>

                                {/* body */}
                                <div className="grid gap-6 p-6 md:grid-cols-[170px_1fr]">
                                    {/* tool list */}
                                    <div className="space-y-3">
                                        <ToolCard title="Base" desc="Product, color, size" />
                                        <ToolCard title="Upload" desc="PNG / SVG artwork" />
                                        <ToolCard title="Type" desc="Fonts, spacing, curve" />
                                        <ToolCard title="Position" desc="Drag, rotate, scale" />

                                        {/* tiny trust badge */}
                                        <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
                                            <div className="text-base font-semibold">Production-ready</div>
                                            <div className="mt-1 text-base text-black/60">
                                                Quality checked before shipping.
                                            </div>
                                        </div>
                                    </div>

                                    {/* preview stage */}
                                    <div className="relative overflow-hidden rounded-[26px] border border-black/10 bg-gradient-to-b from-white to-black/[0.03] p-6">
                                        {/* stage header */}
                                        <div className="flex items-center justify-between">
                                            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2">
                                                <span className="text-base font-semibold">Preview</span>
                                                <span className="text-base text-black/50">3D</span>
                                            </div>

                                            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-base font-semibold text-black/70">
                                                Auto-fit
                                            </div>
                                        </div>

                                        {/* mockup stage */}
                                        <div className="relative mt-6 flex items-center justify-center">
                                            {/* subtle spotlight */}
                                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                                <div className="h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.08),transparent_60%)]" />
                                            </div>

                                            {/* mock image */}
                                            <div className="relative h-[360px] w-[320px] drop-shadow-[0_30px_45px_rgba(0,0,0,0.18)]">
                                                <Image
                                                    src="/assets/movabrand-custom.webp"
                                                    alt="T-shirt mock"
                                                    fill
                                                    className="object-contain"
                                                    priority
                                                />
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        {/* <div className="mt-6 grid gap-3">
                                            <Link
                                                href="/studio"
                                                className="group inline-flex w-full items-center justify-center rounded-full bg-black px-7 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-black/90"
                                            >
                                                Create now
                                                <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
                                            </Link>
                                        </div> */}
                                    </div>
                                </div>
                            </div>

                            {/* corner accent */}
                            <div className="pointer-events-none absolute -bottom-7 -right-7 h-24 w-24 rounded-full bg-black/[0.06]" />
                        </div>

                    </div>
                </div>
            </section>
            <section className="border-t border-black/10 bg-white">
                <div className="mx-auto max-w-[100rem] px-6 py-12">
                    {/* 3 ICONS ROW */}
                    <div className="grid gap-6 md:grid-cols-3">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="flex items-center gap-4 rounded-3xl border border-black/10 bg-white p-6"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] text-black">
                                    {f.icon}
                                </div>
                                <div>
                                    <div className="text-base font-semibold">{f.title}</div>
                                    <div className="text-base text-black/60">{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TITLE */}
                    <div className="mt-14">
                        <div className="text-base font-semibold text-black/50">
                            Explore Latest Updates
                        </div>
                        <h2 className="mt-3 font-druk text-5xl tracking-tight md:text-6xl">
                            Featured drops, curated by MOVA.
                        </h2>
                    </div>

                    <div className="mt-10 grid gap-6 lg:grid-cols-3">
                        {cats.map((c, idx) => (
                            <CategoryTile key={c.key} cat={c} index={idx + 1} />
                        ))}
                    </div>

                    <MiniShop products={printedProducts} loading={printedLoading} />
                </div>
            </section>
        </main>
    );
}

function StatPill({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-black/10 bg-white/80 p-5 backdrop-blur">
            <div className="text-base font-semibold text-black/60">{label}</div>
            <div className="mt-1 font-druk text-3xl tracking-tight">{value}</div>
        </div>
    );
}

function Chip({ children }: { children: React.ReactNode }) {
    return (
        <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-base font-semibold text-black/70">
            {children}
        </span>
    );
}

function ToolCard({ title, desc }: { title: string; desc: string }) {
    return (
        <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-base font-semibold">{title}</div>
            <div className="mt-1 text-base text-black/60">{desc}</div>
        </div>
    );
}

function CategoryTile({ cat, index }: { cat: Cat; index: number }) {
    const accentClass =
        cat.accent === "peach"
            ? "bg-[#ffcab1] text-black"
            : cat.accent === "blue"
                ? "bg-[#a8c7ff] text-black"
                : "bg-black text-white";

    const topBarText =
        cat.accent === "black" ? "text-white/90" : "text-black/90";

    const tagText = cat.accent === "black" ? "text-white/70" : "text-black/60";

    return (
        <div className="group grid gap-4">
            {/* TOP TILE (title) */}
            <Link
                href={cat.href}
                className={`
          relative overflow-hidden rounded-3xl
          border border-black/10
          ${accentClass}
          p-7
          transition-transform duration-300
          hover:-translate-y-0.5
        `}
            >
                {/* cut corner */}
                <div
                    className={`
            pointer-events-none absolute bottom-0 left-0 h-16 w-20
            ${cat.accent === "black" ? "bg-white" : "bg-white"}
            [clip-path:polygon(0_0,100%_100%,0_100%)]
            opacity-90
          `}
                />

                <div className="flex items-start justify-between">
                    <div>
                        <div className="text-base font-semibold">{cat.title}</div>
                        <div className={`mt-2 text-base ${tagText}`}>{cat.subtitle}</div>
                    </div>

                    <div
                        className={`
              font-mono text-base font-semibold mb-20 tracking-widest
              ${cat.accent === "black" ? "text-white/80" : "text-black/70"}
            `}
                    >
                        [{String(index).padStart(2, "0")}]
                    </div>
                </div>
            </Link>

            {/* IMAGE TILE */}
            <Link
                href={cat.href}
                className="relative overflow-hidden rounded-3xl border border-black/10 bg-white"
            >
                {/* top label bar */}
                <div className="absolute left-0 top-0 z-10 w-full bg-black/90 px-5 py-3">
                    <div className="flex items-center justify-between">
                        <div className="font-mono text-base font-semibold text-white">
                            {cat.labelTop}
                        </div>
                        <div className="font-mono text-base font-semibold text-white/70">
                            [{String(index).padStart(2, "0")}]
                        </div>
                    </div>
                </div>

                {/* image */}
                <div className="relative h-[650px] w-full">
                    <Image
                        src={cat.imageSrc}
                        alt={cat.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                </div>

                {/* bottom cut accent */}
                <div className="pointer-events-none absolute bottom-0 left-0 h-16 w-20 bg-white [clip-path:polygon(0_0,100%_100%,0_100%)]" />
            </Link>
        </div>
    );
}


CreativePage.hideNavbar = true;

type MiniProduct = {
    id: string;
    title: string;
    subtitle: string;
    priceMAD: number;
    href: string;
    badge?: string;
    imageSrc: string;
    colors: string[];
    sizes: string[];
};

function moneyMAD(n: number) {
    return new Intl.NumberFormat("fr-MA", {
        style: "currency",
        currency: "MAD",
        maximumFractionDigits: 0,
    }).format(n);
}

function MiniShop({
    products,
    loading,
}: {
    products: MiniProduct[];
    loading?: boolean;
}) {
    return (
        <section className="mt-16 overflow-hidden rounded-[36px] border border-black/10 bg-white">
            {/* header */}
            <div className="relative border-b border-black/10 px-6 py-10 sm:px-8">
                <div className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:52px_52px]" />
                <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="text-base font-semibold text-black/55">
                            Mini shop
                        </div>
                        <h3 className="mt-3 font-druk text-4xl tracking-tight sm:text-5xl">
                            Printed by MOVA. Sold by MOVA.
                        </h3>
                        <p className="mt-3 max-w-2xl text-base text-black/65">
                            Real drops we printed in-house: clean ink, premium blanks, ready to ship.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white px-6 py-3 text-base font-semibold hover:bg-black/[0.03]"
                        >
                            View all
                        </Link>

                        <Link href="/studio" className="w-full sm:w-auto">
                            <Button className="w-full bg-black text-base text-white hover:bg-black/90 rounded-full px-7 py-6">
                                <Sparkles className="mr-2 h-5 w-5" />
                                Make yours
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* grid */}
            <div className="p-6 sm:p-8">
                {loading ? (
                    <div className="py-10 text-center font-druk tracking-[0.12em] text-black/60">
                        LOADING PRINTED DROPS...
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-10 text-center font-druk tracking-[0.12em] text-black/60">
                        NO PRINTED PRODUCTS YET
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {products.map((p) => (
                            <MiniProductCard key={p.id} p={p} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function MiniProductCard({ p }: { p: MiniProduct }) {
    return (
        <Link
            href={p.href}
            className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white transition hover:-translate-y-0.5"
        >
            {/* image */}
            <div className="relative h-[360px] w-full bg-black/[0.02]">
                <Image
                    src={p.imageSrc}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                {/* badge (smaller + calmer) */}
                {p.badge ? (
                    <div className="absolute left-4 top-4 rounded-full border border-black/10 bg-white/85 px-3 py-1 text-[12px] font-semibold text-black/70 backdrop-blur">
                        {p.badge}
                    </div>
                ) : null}
            </div>

            {/* info */}
            <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <div className="truncate text-base font-semibold">{p.title}</div>
                        <div className="mt-1 truncate text-base text-black/55">
                            {p.subtitle}
                        </div>
                    </div>

                    <div className="shrink-0 text-base font-semibold">
                        {moneyMAD(p.priceMAD)}
                    </div>
                </div>

                {/* tiny meta (one line, no pills) */}
                <div className="mt-4 text-[12px] font-mono tracking-widest text-black/45">
                    {p.colors?.length ? `${p.colors.length} COLORS` : null}
                    {p.colors?.length && p.sizes?.length ? "  •  " : null}
                    {p.sizes?.length ? `${p.sizes.length} SIZES` : null}
                </div>
            </div>
        </Link>
    );
}
