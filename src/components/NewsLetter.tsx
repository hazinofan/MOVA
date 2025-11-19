"use client";

import React from "react";

export default function NewsletterSection() {
  return (
    <section className="w-full bg-[#f5f5f5] py-16 md:py-24">
      <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <div className="flex flex-col items-start text-left md:pl-20">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-druk uppercase">
            JOIN OUR <br /> NEWSLETTER
          </h2>

          <p className="mt-4 text-sm md:text-base text-neutral-700 max-w-sm">
            Don’t miss our latest updates, <br /> special promotions and more.
          </p>

          {/* Email input */}
          <div className="mt-8 w-full max-w-sm relative">
            <input
              type="email"
              placeholder="Email address"
              className="w-full border-b border-black bg-transparent py-3 pl-0 pr-8 text-sm outline-none placeholder:text-neutral-400"
            />
            
            {/* Arrow Icon */}
            <button className="absolute right-0 top-3 text-lg font-bold hover:opacity-60 transition">
              →
            </button>
          </div>
        </div>

        {/* RIGHT IMAGES */}
        <div className="flex flex-col gap-4 justify-center md:justify-end">
          <img
            src="/people/landing.webp"
            alt="newsletter image 1"
            className="w-full md:w-[65%] object-cover rounded-md"
          />
          <span> @movabrand </span>
        </div>

        <p className="text-xs mt-2 md:mt-0 md:absolute md:right-20 md:bottom-16 font-semibold">
          @movabrand
        </p>
      </div>
    </section>
  );
}
