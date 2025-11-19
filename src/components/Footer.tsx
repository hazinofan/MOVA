"use client";

import React from "react";

export const SiteFooter = () => {
  return (
    <footer className="w-full bg-black text-white pt-16 pb-6">
      {/* TOP AREA */}
      <div className="px-4 md:px-8 ">
        <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-16 h-[24vh]">
          {/* BIG LOGO */}
          <div className="flex-1">
            <span className="font-druk text-[72px] leading-none md:text-[120px] lg:text-[150px] tracking-tight uppercase block">
              MOVA
            </span>
          </div>

          {/* LINKS + NEWSLETTER */}
          <div className="w-full md:w-[340px] lg:w-[400px] flex flex-col items-start gap-8">
            {/* Top links */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] md:text-xs uppercase tracking-[0.15em] font-druk">
              <button className="hover:underline underline-offset-4">
                Shipping
              </button>
              <button className="hover:underline underline-offset-4 font-druk">
                Refund Policy
              </button>
              <button className="hover:underline underline-offset-4 font-druk">
                Returns
              </button>
              <button className="hover:underline underline-offset-4 font-druk">
                Wholesale Login
              </button>
              <button className="hover:underline underline-offset-4 font-druk">
                Accessibility
              </button>
            </div>

            {/* Newsletter */}
            <div className="w-full mt-2">
              <p className="text-xs md:text-sm font-semibold tracking-[0.16em] uppercase mb-3">
                Join Our Newsletter
              </p>

              <div className="relative w-full">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border-b border-white bg-transparent py-2 pr-8 text-xs md:text-sm placeholder:text-neutral-500 focus:outline-none"
                />
                <button
                  className="absolute right-0 top-1.5 md:top-2 text-sm md:text-base font-bold hover:opacity-70 transition"
                  aria-label="Submit email"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="mt-10 border-t border-neutral-800 pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] md:text-xs text-neutral-400">
          <div className="flex items-center gap-6">
            <span>© MOVA {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6">
            <button className="hover:text-white transition">
              Terms Of Service
            </button>
            <button className="hover:text-white transition">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
