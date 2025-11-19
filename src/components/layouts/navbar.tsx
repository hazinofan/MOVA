"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX, FiShoppingBag } from "react-icons/fi";
import { usePathname } from "next/navigation";

type Ad = { text: string; href?: string };

const ADS: Ad[] = [
  { text: "• Shop $60 3-Pack Thongs & Briefs •", href: "/collections/packs" },
  { text: "Free shipping over $100", href: "/pages/shipping" },
  { text: "Refer a friend, get rewards", href: "/refer" },
];

const NAV = [
  { href: "/shop", label: "SHOP" },
  { href: "/about", label: "ABOUT" },
  { href: "/search", label: "SEARCH" },
  { href: "/blog", label: "MOVAFASHION" },
];

export default function Navbar({
  logoSrc = "/assets/whiteLogo.webp",
  cartCount = 3,
}: {
  logoSrc?: string;
  cartCount?: number;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const rawPathname = usePathname();
  const pathname = rawPathname ?? "";
  const isHome = pathname === "/" || pathname === "/404";
  const startLogo = isHome ? logoSrc : "/assets/logo.webp";

  const [scrollY, setScrollY] = useState(0);
  const lastY = useRef(0);
  const [scrollingUp, setScrollingUp] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setAdIndex((i) => (i + 1) % ADS.length), 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setScrollingUp(y < lastY.current);
      lastY.current = y;
      setScrollY(y);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const THRESHOLD =
    typeof window !== "undefined" ? window.innerHeight * 0.35 : 0;

  const atTop = scrollY <= 4;
  const pastThreshold = scrollY > THRESHOLD;

  const showHeader = !pastThreshold || scrollingUp;

  const bg = atTop ? "transparent" : "rgba(0,0,0,0.9)";

  const linkColor = isHome && atTop ? "text-white" : "text-black";
  const iconColor = isHome && atTop ? "text-white" : "text-black";

  const TOP_SCALE = 1.65;
  const SCROLLED_SCALE = 0.4;
  const SCROLLED_LIFT_MD = -12;
  const SCROLLED_LIFT_SM = -6;

  const TOP_H_SM = "h-20";
  const TOP_H_MD = "md:h-28";
  const SCROLL_H_SM = "h-12";
  const SCROLL_H_MD = "md:h-16";

  return (
    <>
      {/* AD BAR */}
      <div className="fixed top-0 inset-x-0 z-50 h-10 bg-black text-white text-xs md:text-[14px] tracking-wide font-druk">
        <div className="mx-auto max-w-7xl h-full px-3 flex items-center justify-center relative overflow-hidden">
          {ADS.map((ad, i) => (
            <Link
              key={i}
              href={ad.href || "#"}
              className={`absolute transition-opacity duration-500 ease-in-out ${
                i === adIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              {ad.text}
            </Link>
          ))}
        </div>
      </div>

      {/* NAVBAR OVER HERO */}
      <header
        className={[
          "fixed inset-x-0 z-40 transition-all duration-300",
          "top-10",
          showHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3",
        ].join(" ")}
        style={{ backgroundColor: bg }}
      >
        <div className="mx-auto  px-16">
          <div
            className={[
              "flex items-center justify-between",
              atTop
                ? `${TOP_H_SM} ${TOP_H_MD}`
                : `${SCROLL_H_SM} ${SCROLL_H_MD}`,
            ].join(" ")}
          >
            {/* LOGO (always white; smaller & higher when scrolled) */}
            <Link
              href="/"
              className="flex items-center"
              style={{
                transform: `translateY(${
                  atTop
                    ? 0
                    : typeof window !== "undefined" && window.innerWidth >= 768
                    ? SCROLLED_LIFT_MD
                    : SCROLLED_LIFT_SM
                }px) scale(${atTop ? TOP_SCALE : SCROLLED_SCALE})`,
                transformOrigin: "left center",
                transition: "transform 250ms ease",
              }}
            >
              {/* Base logo box size (change these to set native logo size) */}
              <span className="relative block w-[220px] h-[56px] md:w-[320px] md:h-[82px] mt-10">
                <Image
                  src={startLogo}
                  alt="Logo"
                  fill
                  priority
                  sizes="(min-width: 768px) 320px, 220px"
                  className="object-contain"
                />
              </span>
            </Link>

            {/* RIGHT: NAV + ACTIONS */}
            <div className="flex items-center gap-2">
              {NAV.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={` ${linkColor} transition-colors text-[14px] font-druk tracking-[0.12em] hover:opacity-80 ${
                      isActive ? "underline underline-offset-2" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Cart */}
              <Link
                href="/cart"
                className={`relative inline-flex ${iconColor} hover:opacity-90 transition-opacity`}
                aria-label="Cart"
              >
                <FiShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-[10px] leading-none font-semibold bg-white text-black rounded-full px-1.5 py-0.5">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(true)}
                className="md:hidden inline-flex items-center justify-center text-white p-2"
                aria-label="Open menu"
              >
                <FiMenu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        <div
          className={`fixed inset-0 z-50 md:hidden ${
            menuOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
        >
          <div
            className={`absolute inset-0 bg-black/60 transition-opacity ${
              menuOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setMenuOpen(false)}
          />
          <div
            className={`absolute left-0 top-0 h-full w-80 bg-black text-white transform transition-transform duration-300 ${
              menuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
              <span className="relative block w-[140px] h-[36px]">
                <Image
                  src={startLogo}
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="p-2"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4 space-y-2">
              {NAV.map((item) => ( 
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 text-sm tracking-[0.12em] text-white/80 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-white/10 mt-2">
                <Link
                  href="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-2 py-3 text-sm"
                >
                  <FiShoppingBag className="h-5 w-5" />
                  Cart {cartCount > 0 ? `(${cartCount})` : ""}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
