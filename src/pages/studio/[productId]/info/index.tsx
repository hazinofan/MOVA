"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProduct, type ProductType, type ProductColor } from "@/lib/products";
import FulfillmentOptionCard from "@/components/printingOptions";

type Thumb = { src: string; alt?: string };

function moneyMAD(n: number) {
    return new Intl.NumberFormat("fr-MA", {
        style: "currency",
        currency: "MAD",
    }).format(n);
}

export default function ProductInfoPage() {
    const router = useRouter();
    const pid = (router.query.productId as string | undefined) ?? null;

    // ✅ Always call hooks (no early return before hooks)
    const product = useMemo(() => {
        if (!pid) return null;
        return getProduct(pid as ProductType) ?? null;
    }, [pid]);

    const defaultColor: ProductColor = "white";

    const title = (product as any)?.title ?? product?.label ?? "Product";
    const brand = (product as any)?.brand ?? "MOVA";
    const model = (product as any)?.model ?? "";
    const description =
        (product as any)?.description ??
        "High-quality product ready for customization.";

    const priceFrom: number | null = (product as any)?.priceFrom ?? null;

    const thumbs: Thumb[] = useMemo(() => {
        if (!product) return [];

        const gallery: Thumb[] = Array.isArray((product as any).gallery)
            ? (product as any).gallery
            : [];

        const fromGallery = gallery
            .filter((t) => !!t?.src)
            .map((t) => ({ src: t.src, alt: t.alt ?? "Preview" }));

        const fromViews: Thumb[] =
            product.views?.map((v: any) => ({
                src:
                    typeof v.mockup === "function" ? v.mockup(defaultColor) : v.mockup,
                alt: v.label ?? "View",
            })) ?? [];

        const base: Thumb[] = [
            ...(product.thumbnail
                ? [{ src: product.thumbnail, alt: `${title} thumbnail` }]
                : []),
            ...(fromGallery.length ? fromGallery : fromViews),
        ];

        // de-dupe
        const seen = new Set<string>();
        return base
            .filter((t) => t.src && !seen.has(t.src) && (seen.add(t.src), true))
            .slice(0, 10);
    }, [product, title]);

    // ✅ Always define state hook (even while loading)
    const [active, setActive] = useState<Thumb | null>(null);

    // ✅ When thumbs change, ensure active is valid
    useEffect(() => {
        if (!thumbs.length) {
            setActive(null);
            return;
        }

        // If current active is missing, reset to first thumb
        const stillExists = active?.src
            ? thumbs.some((t) => t.src === active.src)
            : false;

        if (!stillExists) setActive(thumbs[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [thumbs]);

    const bullets: string[] =
        (product as any)?.bullets ??
        [
            "High-quality print-ready mockups",
            "Front and back customization (if supported)",
            "PNG/SVG uploads supported",
            "Accurate placement preview",
        ];

    const isLoading = !router.isReady || !pid;
    const notFound = router.isReady && pid && !product;

    const fulfillment = useMemo(() => {
        if (!product) return null;

        // You can define these in products.ts per product if you want
        const shipFrom = (product as any)?.shipFrom ?? { country: "United States", flagEmoji: "🇺🇸" };

        const colorsCount =
            (product as any)?.colorsCount ??
            (((product as any)?.colors?.length ?? 0) ||
                10);

        // Optional: show first 18 colors as dots (hex)
        const colorDots: string[] =
            (product as any)?.colorDots ??
            (Array.isArray((product as any)?.colors) ? (product as any).colors : []);

        const sizesLabel =
            (product as any)?.sizesLabel ??
            (Array.isArray((product as any)?.sizes)
                ? `${(product as any).sizes[0]} – ${(product as any).sizes[(product as any).sizes.length - 1]}`
                : "S – 4XL");

        const sizesCount =
            (product as any)?.sizesCount ??
            (Array.isArray((product as any)?.sizes) ? (product as any).sizes.length : 7);

        const printAreas =
            (product as any)?.printAreas ??
            ((product as any)?.areas?.filter((a: any) => a.id === "front" || a.id === "back")?.map((a: any) => ({
                id: a.id,
                label: a.id === "front" ? "Front side" : "Back side",
            })) ?? [
                    { id: "front", label: "Front side" },
                    { id: "back", label: "Back side" },
                ]);

        const printAreasCount = printAreas.length;

        const details = product.details ?? undefined;

        const features: string[] =
            (product as any)?.features ??
            ["Branded inserts", "Gift messages", "DTG"];

        // You can customize these per product too
        const metrics = product.metrics ?? undefined;

        return {
            brand: "MOVA",
            productName: "Choice",
            headline: "Trusted network of quality providers",
            description:
                (product as any)?.fulfillmentDescription ??
                "We automatically select a top-rated provider to get the best price/quality combo for your order.",
            metrics,
            colorsCount,
            colors: colorDots.length ? colorDots : undefined,
            sizesCount,
            details,
            sizesLabel,
            printAreasCount,
            printAreas,
            features,
            location: shipFrom,
        };
    }, [product]);


    return (
        <div className="min-h-[calc(100vh-64px)] bg-neutral-50 text-neutral-900 mt-44 mx-auto max-w-[90rem]">
            <div className="mx-auto max-w-[120rem] px-5 py-8">
                {/* Top line */}
                <div className="text-sm text-neutral-500">
                    <Link href="/studio" className="hover:underline">
                        Studio
                    </Link>{" "}
                    <span className="mx-2">/</span>
                    <span className="text-neutral-700">
                        {isLoading ? "Loading…" : notFound ? "Unknown product" : title}
                    </span>
                </div>

                {/* Loading / Not found blocks */}
                {isLoading && (
                    <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 ">
                        <div className="text-lg font-semibold">Loading…</div>
                        <div className="mt-2 text-sm text-neutral-600">
                            Preparing product info
                        </div>
                    </div>
                )}

                {notFound && (
                    <div className="mt-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
                        <div className="text-xl font-semibold">Product not found</div>
                        <div className="mt-2 text-neutral-600">
                            Unknown product id:{" "}
                            <span className="font-mono text-neutral-800">{pid}</span>
                        </div>

                        <div className="mt-5 flex items-center gap-2">
                            <Link
                                href="/studio"
                                className="inline-flex h-11 items-center justify-center rounded-xl bg-black px-4 text-white font-semibold hover:bg-black/90 transition"
                            >
                                Back to products
                            </Link>
                            <button
                                onClick={() => router.back()}
                                className="inline-flex h-11 items-center justify-center rounded-xl border border-black/10 bg-white px-4 font-semibold hover:bg-neutral-50 transition"
                            >
                                Go back
                            </button>
                        </div>
                    </div>
                )}

                {/* Main content */}
                {!isLoading && !notFound && product && (
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-[740px_1fr] gap-8">
                        {/* LEFT: gallery */}
                        <section className="overflow-hidden">
                            <div className="p-5">
                                {/* Main carousel */}
                                <div className="relative w-full">
                                    <div className="relative w-full aspect-[4/3] rounded-2xl bg-neutral-100 overflow-hidden border border-black/10">
                                        {thumbs.length ? (
                                            <>
                                                {/* Slides strip */}
                                                <div
                                                    className="absolute inset-0 flex transition-transform duration-300 ease-out"
                                                    style={{
                                                        transform: `translateX(-${Math.max(
                                                            0,
                                                            thumbs.findIndex((t) => t.src === active?.src)
                                                        ) * 100
                                                            }%)`,
                                                    }}
                                                >
                                                    {thumbs.map((t, idx) => (
                                                        <div key={`${t.src}-${idx}`} className="relative h-full w-full shrink-0">
                                                            <Image
                                                                src={t.src}
                                                                alt={t.alt ?? "Product preview"}
                                                                fill
                                                                className="object-contain p-6"
                                                                priority={idx === 0}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Prev/Next */}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const i = thumbs.findIndex((t) => t.src === active?.src);
                                                        const next = Math.max(0, i - 1);
                                                        setActive(thumbs[next]);
                                                    }}
                                                    disabled={thumbs.findIndex((t) => t.src === active?.src) <= 0}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-black/10 bg-white/90 backdrop-blur hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed grid place-items-center"
                                                    aria-label="Previous"
                                                >
                                                    ‹
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const i = thumbs.findIndex((t) => t.src === active?.src);
                                                        const next = Math.min(thumbs.length - 1, i + 1);
                                                        setActive(thumbs[next]);
                                                    }}
                                                    disabled={
                                                        thumbs.findIndex((t) => t.src === active?.src) >= thumbs.length - 1
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full border border-black/10 bg-white/90 backdrop-blur hover:bg-white transition disabled:opacity-40 disabled:cursor-not-allowed grid place-items-center"
                                                    aria-label="Next"
                                                >
                                                    ›
                                                </button>

                                                {/* Dots */}
                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                                    {thumbs.map((t, i) => {
                                                        const isActive = t.src === active?.src;
                                                        return (
                                                            <button
                                                                key={`dot-${t.src}-${i}`}
                                                                type="button"
                                                                onClick={() => setActive(t)}
                                                                className={[
                                                                    "h-2.5 w-2.5 rounded-full transition",
                                                                    isActive ? "bg-black" : "bg-black/20 hover:bg-black/35",
                                                                ].join(" ")}
                                                                aria-label={`Go to slide ${i + 1}`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="h-full w-full grid place-items-center text-neutral-500 text-sm">
                                                No preview available
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Thumbs (keep as is) */}
                                {thumbs.length > 1 && (
                                    <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-1">
                                        {thumbs.map((t, i) => {
                                            const isActive = t.src === active?.src;
                                            return (
                                                <button
                                                    key={`${t.src}-${i}`}
                                                    onClick={() => setActive(t)}
                                                    className={[
                                                        "shrink-0 rounded-xl border p-1 transition",
                                                        isActive
                                                            ? "border-black bg-black/5"
                                                            : "border-black/10 bg-white hover:border-black/30",
                                                    ].join(" ")}
                                                    title={t.alt ?? "Preview"}
                                                >
                                                    <div className="relative h-20 w-20 rounded-lg bg-neutral-100 overflow-hidden">
                                                        <Image
                                                            src={t.src}
                                                            alt={t.alt ?? "Thumb"}
                                                            fill
                                                            className="object-contain p-2"
                                                        />
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </section>


                        {/* RIGHT: info */}
                        <aside className="space-y-5">
                            <div className="p-6">
                                <div className="text-neutral-500 text-sm">
                                    {brand}
                                    {model ? ` • ${model}` : ""}
                                </div>

                                <h1 className="mt-2 text-3xl md:text-4xl font-druk tracking-tight">
                                    {title}
                                </h1>

                                <p className="mt-3 text-neutral-600 leading-relaxed">
                                    {description}
                                </p>

                                <ul className="mt-5 space-y-2">
                                    {bullets.map((b, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm">
                                            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-black/70" />
                                            <span className="text-neutral-700">{b}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-6 border border-black/10 bg-emerald-50 p-5">
                                    <div className="text-3xl flex flex-row gap-1 text-neutral-700 items-end"> MOVA <span className="text-base mr-1" style={{ fontFamily: 'cursive' }}> Studio</span> <p className="text-xl">Preview</p></div>

                                    <div className="mt-2">
                                        {priceFrom != null ? (
                                            <div className="text-neutral-800">
                                                From{" "}
                                                <span className="text-2xl font-semibold">
                                                    {moneyMAD(priceFrom)}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="text-neutral-800">
                                                Upload your design and preview instantly.
                                            </div>
                                        )}

                                        <div className="mt-1 text-sm text-neutral-600">
                                            Realistic placement, fast editor.
                                        </div>
                                    </div>

                                    <Link
                                        href={`/studio/${pid}`}
                                        className="mt-5 h-9 w-full bg-green-800/90 text-white font-semibold flex items-center justify-center hover:bg-green-900/90 transition"
                                    >
                                        Start designing
                                    </Link>

                                    <div className="mt-3 text-base text-neutral-600">
                                        Tip: Use PNG with transparent background for the cleanest print.
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
            {!isLoading && !notFound && product && fulfillment && fulfillment.details && (
                <div className="mt-10">
                    <FulfillmentOptionCard
                        details={fulfillment.details}
                        brand={fulfillment.brand}
                        productName={fulfillment.productName}
                        headline={fulfillment.headline}
                        description={fulfillment.description}
                        metrics={fulfillment.metrics}
                        colorsCount={fulfillment.colorsCount}
                        colors={fulfillment.colors}
                        sizesCount={fulfillment.sizesCount}
                        sizesLabel={fulfillment.sizesLabel}
                        printAreas={fulfillment.printAreas}
                        features={fulfillment.features}
                        startHref={`/studio/${pid}`}
                        detailsHref={`/studio/${pid}?tab=details`}
                    />
                </div>
            )}

        </div>
    );
}
