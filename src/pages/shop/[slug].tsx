import { FiFilter, FiEdit2 } from "react-icons/fi";
import Image from "next/image";

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
import { Textarea } from "@/components/ui/textarea"; // if you have one
import { ProductCarousel } from "@/components/ProductsCaroussel";
import { useState } from "react";
import { PartsBanner } from "@/components/PartsBanner";
import StickyAddToCartBar from "@/components/StickyBar";


type Review = {
  id: number;
  title: string;
  body: string;
  name: string;
  email: string;
};

const INITIAL_REVIEWS: Review[] = [
  {
    id: 1,
    title: "Best sweatpants I own",
    body: "Super soft, slightly oversized, exactly what I wanted.",
    name: "Sarah M.",
    email: "hidden@example.com",
  },
];

function ProductDetails() {
  const images = [
    "/assets/image1.png",
    "/assets/image2.png",
    "/assets/image3.png",
    "/assets/image4.png",
    "/assets/image5.png",
    "/assets/image6.png",
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "LOW SHOW V BRALETTE",
      price: "350",
      image: "/assets/image1.png",
      href: "/shop/low-show-v-bralette",
    },
    {
      id: 2,
      name: "HIGH SCULPT BRA RIB",
      price: "400",
      image: "/assets/image3.png",
      href: "/shop/high-sculpt-bra-rib",
    },
    {
      id: 3,
      name: "LOW HIDE THONG",
      price: "150",
      image: "/assets/image4.png",
      href: "/shop/low-hide-thong",
    },
    {
      id: 4,
      name: "SOFT RIB BRALETTE",
      price: "300",
      image: "/assets/image6.png",
      href: "/shop/soft-rib-bralette",
    },
    {
      id: 5,
      name: "LOW SHOW V BRALETTE – ROSE",
      price: "350",
      image: "/assets/image5.png",
      href: "/shop/low-show-v-rose",
    },
  ];


  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [activeTab, setActiveTab] = useState<"reviews" | "questions">(
    "reviews"
  );


  // 👉 later, replace these with values from your product API
  const ratingCounts: Record<number, number> = { 5: 26, 4: 0, 3: 0, 2: 0, 1: 0 };
  const totalReviews = Object.values(ratingCounts).reduce(
    (sum, v) => sum + v,
    0
  );
  const averageRating = 5.0;
  const recommendPercent = 100;

  const starRows = [5, 4, 3, 2, 1];

  const handleSubmitReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const title = String(formData.get("title") || "").trim();
    const body = String(formData.get("body") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();

    if (!title || !body || !name) {
      // you can show a toast instead
      return;
    }

    const newReview: Review = {
      id: reviews.length + 1,
      title,
      body,
      name,
      email,
    };

    setReviews((prev) => [newReview, ...prev]);
    e.currentTarget.reset();
  };


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
                Mid-rise slightly oversized fit. Sport meets sophistication.
                Your perfectly polished everyday pant crafted from luxury-grade
                Supima cotton terry. A vintage-inspired straight leg that moves
                seamlessly from morning workout to meetings to dinner plans. The
                rare blend of athletic heritage and modern refinement,
                enzyme-washed for the kind of softness that makes these an MVP
                in your daily wardrobe. Model is 5&apos;7&quot; and a size
                24&quot; and is wearing an XS.
              </p>
            </div>

            {/* DETAILS */}
            <div className="md:w-1/2 max-w-xl">
              <h3 className="mb-4 text-[16px] font-semibold tracking-[0.2em] text-black uppercase">
                DETAILS
              </h3>
              <ul className="list-disc space-y-1 pl-5 text-base leading-relaxed">
                <li>Premium 27 oz Supima cotton terry</li>
                <li>Mid-rise with athletic-inspired straight leg</li>
                <li>Clean waistband for studio-to-street style</li>
                <li>Deep side pockets for essentials</li>
                <li>Vintage sportswear silhouette, refined</li>
                <li>MOVA embroidered signature</li>
                <li>Enzyme-washed for lived-in comfort</li>
                <li>100% Supima cotton</li>
                <li>Care: machine wash cold, tumble dry low</li>
                <li>(Oversized fit; if in between sizes, please size down)</li>
                <li>Model is 5&apos;7&quot; wearing a size S</li>
              </ul>
            </div>

            {/* SIZE CHART BUTTON (desktop example) */}
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
                <img
                  src="/assets/sizes.webp"
                  alt="Sizes chart"
                  className="w-full"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* ⭐ RATING SUMMARY SECTION */}
      <section className="w-full border-t border-neutral-200 py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          {/* Top line: average rating + stars + review count */}
          <div className="flex items-center justify-center gap-2 text-sm md:text-base mb-6">
            <span className="font-semibold text-lg">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-lg">
              {"★★★★★".slice(0, Math.round(averageRating))}
            </span>
            <span className="text-xs md:text-sm text-black/70">
              Based on {totalReviews} reviews
            </span>
          </div>

          {/* Distribution rows */}
          <div className="space-y-2 text-xs md:text-sm">
            {starRows.map((star) => {
              const count = ratingCounts[star] || 0;
              const pct = totalReviews
                ? (count / totalReviews) * 100
                : 0;

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

          {/* Recommend line */}
          <div className="mt-6 text-center text-sm md:text-base font-semibold">
            {recommendPercent}%{" "}
            <span className="font-normal">
              would recommend these products
            </span>
          </div>
        </div>
      </section>

      <section className="w-full border-t border-neutral-200 py-10 md:py-14">
        <div className="px-16">
          {/* Tabs */}
          <div className="border-b border-black flex items-center gap-6 text-lg tracking-[0.12em]">
            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`pb-2 ${activeTab === "reviews"
                ? "border-b-2 border-black"
                : "text-black/60"
                }`}
            >
              Reviews ({totalReviews})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("questions")}
              className={`pb-2 ${activeTab === "questions"
                ? "border-b-2 border-black"
                : "text-black/60"
                }`}
            >
              Questions
            </button>
          </div>

          {/* Filters + Write Review row */}
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
                    {/* Use Textarea from shadcn, or a normal textarea */}
                    <Textarea
                      id="body"
                      name="body"
                      rows={4}
                      required
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <DialogFooter className="mt-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button type="submit" className="border">Submit review</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Reviews / Questions content */}
          <div className="mt-8 space-y-6">
            {activeTab === "reviews" ? (
              reviews.length === 0 ? (
                <p className="text-sm text-black/70">
                  There are no reviews yet. Be the first to write one.
                </p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-neutral-200 pb-4"
                  >
                    <h4 className="text-sm font-semibold">
                      {review.title}
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed">
                      {review.body}
                    </p>
                    <p className="mt-2 text-xs text-black/60">
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

      <section className="w-full border-t border-neutral-200 py-10 md:py-14 bg-white">
        <div className="">
          <h2 className="mb-6 pl-10 text-2xl md:text-3xl font-druk tracking-[0.18em] uppercase">
            FEATURED PRODUCTS
          </h2>

          {/* horizontal strip of products */}
          <div className="flex overflow-x-auto border border-neutral-200 border-l-0 border-b-0">
            {featuredProducts.map((p) => (
              <a
                key={p.id}
                href={p.href}
                className="flex flex-col flex-[0_0_60%] sm:flex-[0_0_40%] md:flex-[0_0_25%] lg:flex-[0_0_20%]
                   border-l border-neutral-200 bg-white"
              >
                {/* IMAGE CONTAINER */}
                <div className="relative w-full aspect-[3/4] bg-[#f5f5f5]">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, 60vw"
                    className="object-cover"
                  />
                </div>

                {/* TEXT UNDER IMAGE */}
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


      <StickyAddToCartBar
        name="LOW SHOW V BRALETTE"
        price={475}
        averageRating={5}
        reviewCount={49}
      />
    </div>
  );
}

export default ProductDetails;
