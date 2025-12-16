"use client";

import { FiFilter, FiEdit2 } from "react-icons/fi";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { ProductCarousel } from "@/components/ProductsCaroussel";
import { PartsBanner } from "@/components/PartsBanner";
import StickyAddToCartBar from "@/components/StickyBar";

import { fetchProductBySlug, fetchProducts } from "@/core/services/products.service"; // ✅ adjust path
import { useCartStore } from "@/core/stores/cart.store";
import { createProductReview, fetchProductReviews, fetchProductReviewStats } from "@/core/services/reviews.service";

type Review = {
  id: number;
  title: string;
  body: string;
  name: string;
  email: string;
  rating: number;
};

type ReviewStats = {
  totalReviews: number;
  averageRating: number;
  ratingCounts: Record<number, number>;
  recommendPercent: number;
};

const DEFAULT_STATS: ReviewStats = {
  totalReviews: 0,
  averageRating: 0,
  ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  recommendPercent: 0,
};

function firstImageFromProduct(p: any): string | undefined {
  return (
    p?.image ||
    p?.mainImage ||
    p?.thumbnail ||
    (Array.isArray(p?.images) ? p.images?.[0]?.url : undefined) ||
    (Array.isArray(p?.photos) ? p.photos?.[0] : undefined)
  );
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

function toAbsoluteUrl(url?: string) {
  if (!url) return undefined;
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`; 
}

function allImagesFromProduct(p: any): string[] {
  const fromImages = Array.isArray(p?.images)
    ? p.images.map((x: any) => toAbsoluteUrl(x?.url)).filter(Boolean)
    : [];

  const fromPhotos = Array.isArray(p?.photos)
    ? p.photos.map((x: any) => toAbsoluteUrl(x)).filter(Boolean)
    : [];

  const first = toAbsoluteUrl(firstImageFromProduct(p));
  const merged = [first, ...fromImages, ...fromPhotos].filter(Boolean);

  return Array.from(new Set(merged as string[]));
}


export default function ProductDetails() {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : undefined;

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Optional: featured strip from API (instead of mock)
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [activeTab, setActiveTab] = useState<"reviews" | "questions">("reviews");

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.open);

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const p = await fetchProductBySlug(slug as string);
        if (!cancelled) setProduct(p);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Optional featured products from API
  useEffect(() => {
    let cancelled = false;

    async function loadFeatured() {
      try {
        const data = await fetchProducts(1, 10, false);
        if (cancelled) return;

        const mapped = (data.items || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: toAbsoluteUrl(firstImageFromProduct(p)) || "/assets/image1.png",
          href: `/shop/${p.slug ?? p.id}`,
        }));

        setFeaturedProducts(mapped);
      } catch {
        // keep empty silently
      }
    }

    loadFeatured();
    return () => {
      cancelled = true;
    };
  }, []);

  const images = useMemo(() => {
    const imgs = allImagesFromProduct(product);
    return imgs.length ? imgs : ["/assets/image1.png"];
  }, [product]);


  const [stats, setStats] = useState<ReviewStats>(DEFAULT_STATS);
  useEffect(() => {
    if (!product?.id) return;

    let cancelled = false;

    (async () => {
      try {
        const s = await fetchProductReviewStats(product.id);
        if (!cancelled) setStats(s);
      } catch {
        // keep defaults silently
        if (!cancelled) setStats(DEFAULT_STATS);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [product?.id]);
  const starRows = [5, 4, 3, 2, 1];

  useEffect(() => {
    if (!product?.id) return;

    let cancelled = false;

    (async () => {
      try {
        setReviewsLoading(true);
        const list = await fetchProductReviews(product.id);
        if (!cancelled) setReviews(list as Review[]);
      } catch {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setReviewsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [product?.id]);


  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product?.id) return;

    const formData = new FormData(e.currentTarget);

    const title = String(formData.get("title") || "").trim();
    const body = String(formData.get("body") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();

    if (!title || !body || !name) return;

    try {
      // ✅ send to DB (you must include rating + recommend to match your backend DTO)
      const created = await createProductReview(product.id, {
        title,
        body,
        name,
        email: email || undefined,
        rating: 5,        // TODO: replace with real user input
        recommend: true,  // TODO: replace with real user input
      });

      // ✅ update UI instantly
      setReviews((prev) => [created as any, ...prev]);

      // ✅ refresh stats so summary updates
      const s = await fetchProductReviewStats(product.id);
      setStats(s);

      e.currentTarget.reset();
    } catch (err: any) {
      console.log(err);
      // you can toast(err.message)
    }
  };

  const ratingCounts = stats.ratingCounts;
  const totalReviews = stats.totalReviews;
  const averageRating = stats.averageRating;
  const recommendPercent = stats.recommendPercent;


  if (loading) {
    return (
      <div className="py-24 text-center font-druk tracking-[0.16em]">
        LOADING PRODUCT...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-24 text-center">
        <p className="text-red-600">{error || "Product not found"}</p>
        <button className="underline mt-4" onClick={() => router.push("/shop")}>
          Back to shop
        </button>
      </div>
    );
  }

  return (
    <div>
      <ProductCarousel images={images} />

      {/* DESCRIPTION + DETAILS + SIZE CHART */}
      <section className="w-full border-t border-neutral-200 py-10 md:py-16">
        <div className="mx-8 lg:px-0">
          <div className="relative flex flex-col gap-10 md:flex-row md:gap-16">
            {/* DESCRIPTION */}
            <div className="md:w-1/2 max-w-xl">
              <h3 className="mb-4 text-[16px] font-semibold tracking-[0.2em] text-black uppercase">
                DESCRIPTION
              </h3>
              <p className="text-base leading-relaxed">
                {product.longDescription ??
                  "No description available yet."}
              </p>
            </div>

            {/* DETAILS */}
            <div className="md:w-1/2 max-w-xl">
              <h3 className="mb-4 text-[16px] font-semibold tracking-[0.2em] text-black uppercase">
                DETAILS
              </h3>

              {/* If API provides details array -> render it, else fallback */}
              {Array.isArray(product.details) && product.details.length ? (
                <ul className="list-disc space-y-1 pl-5 text-base leading-relaxed">
                  {product.details.map((d: string, idx: number) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              ) : (
                <ul className="list-disc space-y-1 pl-5 text-base leading-relaxed">
                  <li>Premium fabric</li>
                  <li>Care: machine wash cold</li>
                </ul>
              )}
            </div>

            {/* SIZE CHART BUTTON */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className="absolute right-0 top-0 hidden rounded-none bg-black px-6 py-2 text-[11px] font-semibold tracking-[0.2em] text-white md:inline-block"
                >
                  SIZE CHART
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[1024px] bg-white">
                <DialogHeader>
                  <DialogTitle className="font-druk tracking-[0.15em] text-xs">
                    SIZE CHART
                  </DialogTitle>
                </DialogHeader>
                <img src="/assets/sizes.webp" alt="Sizes chart" className="w-full" />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* ⭐ RATING SUMMARY SECTION (still mock) */}
      <section className="w-full border-t border-neutral-200 py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-center gap-2 text-sm md:text-base mb-6">
            <span className="font-semibold text-lg">{averageRating.toFixed(1)}</span>

            <span className="text-lg">
              {"★★★★★".slice(0, Math.round(averageRating))}
            </span>

            <span className="text-xs md:text-sm text-black/70">
              Based on {totalReviews} reviews
            </span>
          </div>

          <div className="space-y-2 text-xs md:text-sm">
            {starRows.map((star) => {
              const count = ratingCounts?.[star] || 0;
              const pct = totalReviews ? (count / totalReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-8 text-right">
                    {star} <span className="text-[10px]">★</span>
                  </span>

                  <div className="flex-1 h-2 bg-gray-100">
                    <div
                      className="h-full bg-[#949bbd]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <span className="w-6 text-right text-xs">{count}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center text-sm md:text-base font-semibold">
            {recommendPercent}%{" "}
            <span className="font-normal">would recommend these products</span>
          </div>
        </div>
      </section>


      {/* Reviews / questions unchanged */}
      <section className="w-full border-t border-neutral-200 py-10 md:py-14">
        <div className="px-16">
          <div className="border-b border-black flex items-center gap-6 text-lg tracking-[0.12em]">
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`pb-2 ${activeTab === "reviews" ? "border-b-2 border-black" : "text-black/60"
                }`}
            >
              Reviews ({totalReviews})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("questions")}
              className={`pb-2 ${activeTab === "questions" ? "border-b-2 border-black" : "text-black/60"
                }`}
            >
              Questions
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button className="flex items-center gap-2 bg-black text-white px-4 py-2 text-lg font-durk tracking-[0.12em]">
              <FiFilter className="h-4 w-4" />
              Filters
            </button>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-black text-white px-4 py-2 text-lg tracking-[0.12em]">
                  <FiEdit2 className="h-4 w-4" />
                  Write a Review
                </button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px] bg-white">
                <DialogHeader>
                  <DialogTitle className="font-druk tracking-[0.15em] text-xs">
                    WRITE A REVIEW
                  </DialogTitle>
                  <DialogDescription>
                    Share your thoughts about this product.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Review title</Label>
                    <Input id="title" name="title" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body">Review</Label>
                    <Textarea id="body" name="body" rows={4} required className="resize-none" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="you@example.com" />
                    </div>
                  </div>

                  <DialogFooter className="mt-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button type="submit" className="border">
                        Submit review
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-8 space-y-6">
            {activeTab === "reviews" ? (
              reviewsLoading ? (
                <p className="text-lg text-black/70">Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="text-lg text-black/70">
                  There are no reviews yet. Be the first to write one.
                </p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-neutral-200 pb-4"
                  >
                    {/* ⭐ STAR RATING */}
                    <div className="flex items-center gap-1 text-xl text-yellow-500 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>
                          {i < review.rating ? "★" : "☆"}
                        </span>
                      ))}
                    </div>

                    {/* TITLE */}
                    <h4 className="text-lg font-semibold">
                      {review.title}
                    </h4>

                    {/* BODY */}
                    <p className="mt-2 text-lg leading-relaxed">
                      {review.body}
                    </p>

                    {/* AUTHOR */}
                    <p className="mt-2 text-sm text-black/60">
                      — {review.name}
                    </p>
                  </div>
                ))
              )
            ) : (
              <p className="text-sm text-black/70">
                There are no questions yet.
              </p>
            )}
          </div>

        </div>
      </section>

      {/* Featured products (now from API) */}
      <section className="w-full border-t border-neutral-200 py-10 md:py-14 bg-white">
        <div>
          <h2 className="mb-6 pl-10 text-2xl md:text-3xl font-druk tracking-[0.18em] uppercase">
            FEATURED PRODUCTS
          </h2>

          <div className="flex overflow-x-auto border border-neutral-200 border-l-0 border-b-0">
            {featuredProducts.map((p) => (
              <a
                key={p.id}
                href={p.href}
                className="flex flex-col flex-[0_0_60%] sm:flex-[0_0_40%] md:flex-[0_0_25%] lg:flex-[0_0_20%] border-l border-neutral-200 bg-white"
              >
                <div className="relative w-full aspect-[3/4] bg-[#f5f5f5]">
                  <img
                    src={p.image}
                    alt={p.name}
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 60vw"
                    className="object-cover"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="font-semibold text-[13px] tracking-wide">{p.name}</p>
                  <p className="text-[12px] text-black/80">{p.price} DH</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <PartsBanner />

      {/* Sticky Add to cart uses fetched product */}
      <StickyAddToCartBar averageRating={averageRating} reviewCount={totalReviews} />
    </div>
  );
}
