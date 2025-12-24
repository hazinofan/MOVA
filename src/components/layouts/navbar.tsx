"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX, FiShoppingBag } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useCartStore } from "@/core/stores/cart.store";
import { useRouter } from "next/router";

type Ad = { text: string; href?: string };

const ADS: Ad[] = [
  { text: "• Shop $60 3-Pack Thongs & Briefs •", href: "/collections/packs" },
  { text: "Free shipping over $100", href: "/pages/shipping" },
  { text: "Refer a friend, get rewards", href: "/refer" },
];

const NAV = [
  { href: "/shop", label: "SHOP" },
  { href: "/about", label: "ABOUT" },
  { href: "/creative", label: "MADE BY YOU" },
  { href: "/search", label: "SEARCH" },
  { href: "/blog", label: "MOVAFASHION" },
];

export default function Navbar({
  logoSrc = "/assets/whiteLogo.webp",
}: {
  logoSrc?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [scrollingUp, setScrollingUp] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ---- Cart (Zustand) ----
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const isCartOpen = useCartStore((s) => s.isOpen);

  const items = useCartStore((s) => s.items);
  const cartCount = useCartStore((s) => s.count());
  const subtotal = useCartStore((s) => s.subtotal());

  const router = useRouter();
  const openCart = useCartStore((s) => s.open);
  const closeCart = useCartStore((s) => s.close);
  const removeItem = useCartStore((s) => s.removeItem);
  const setQty = useCartStore((s) => s.setQty);

  const safeCartCount = hasHydrated ? cartCount : 0;
  const safeSubtotal = hasHydrated ? subtotal : 0;
  const safeItems = hasHydrated ? items : [];

  const lastY = useRef(0);
  const headerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname() ?? "";

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

  useEffect(() => {
    if (!showSearch) return;

    const handleClickOutside = (event: MouseEvent) => {
      const headerEl = headerRef.current;
      if (!headerEl) return;
      if (!headerEl.contains(event.target as Node)) setShowSearch(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSearch]);

  // avoid window access in render for hydration safety
  const [threshold, setThreshold] = useState(0);
  useEffect(() => {
    setThreshold(window.innerHeight * 0.35);
  }, []);

  const atTop = scrollY <= 4;
  const pastThreshold = scrollY > threshold;
  const showHeader = !pastThreshold || scrollingUp;

  const isHome = pathname === "/" || pathname === "/404";

  // ------------ COLORS + LOGO ------------
  let linkColor = "text-black";
  let iconColor = "text-black";
  let startLogo = "/assets/logo.webp";

  if (isHome) {
    linkColor = "text-white";
    iconColor = "text-white";
    startLogo = logoSrc;
  } else {
    linkColor = atTop ? "text-black" : "text-white";
    iconColor = atTop ? "text-black" : "text-white";
    startLogo = atTop ? "/assets/logo.webp" : logoSrc;
  }

  if (showSearch) {
    if (isHome) {
      linkColor = "text-black";
      iconColor = "text-black";
      startLogo = "/assets/logo.webp";
    } else {
      linkColor = "text-white";
      iconColor = "text-white";
      startLogo = logoSrc;
    }
  }

  // ------------ BACKGROUND ------------
  let bg = atTop ? "transparent" : "rgba(0,0,0,0.9)";
  if (showSearch) bg = isHome ? "#ffffff" : "#000000";

  // ------------ SIZE + TRANSFORM ------------
  const TOP_SCALE = 1.65;
  const SCROLLED_SCALE = 0.4;
  const SCROLLED_LIFT = -6; // single value (no window branching)

  const TOP_H_SM = "h-20";
  const TOP_H_MD = "md:h-28";
  const SCROLL_H_SM = "h-12";
  const SCROLL_H_MD = "md:h-16";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // hook your search here later
  };

  return (
    <>
      {/* AD BAR */}
      <div className="fixed top-0 inset-x-0 z-50 h-10 bg-black text-white text-[11px] sm:text-xs md:text-[14px] tracking-wide font-druk">
        <div className="mx-auto h-full px-2 sm:px-3 flex items-center justify-center relative overflow-hidden">
          {ADS.map((ad, i) => (
            <Link
              key={i}
              href={ad.href || "#"}
              className={`absolute text-center px-4 transition-opacity duration-500 ease-in-out ${i === adIndex ? "opacity-100" : "opacity-0"
                }`}
            >
              {ad.text}
            </Link>
          ))}
        </div>
      </div>

      {/* NAVBAR */}
      <header
        ref={headerRef}
        className={[
          "fixed inset-x-0 z-40 transition-all duration-300",
          "top-10",
          showHeader ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3",
        ].join(" ")}
        style={{ backgroundColor: bg }}
      >
        <div className="mx-auto px-4 md:px-16">
          <div
            className={[
              "flex items-center justify-between",
              atTop ? `${TOP_H_SM} ${TOP_H_MD}` : `${SCROLL_H_SM} ${SCROLL_H_MD}`,
            ].join(" ")}
          >
            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center"
              style={{
                transform: `translateY(${atTop ? 0 : SCROLLED_LIFT}px) scale(${atTop ? TOP_SCALE : SCROLLED_SCALE
                  })`,
                transformOrigin: "left center",
                transition: "transform 250ms ease",
              }}
            >
              <span className="relative block w-[160px] h-[40px] sm:w-[190px] sm:h-[50px] md:w-[220px] md:h-[56px] lg:w-[320px] lg:h-[82px] mt-4 md:mt-10">
                <Image
                  src={startLogo}
                  alt="Logo"
                  fill
                  priority
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 220px, 160px"
                  className="object-contain"
                />
              </span>
            </Link>

            {/* RIGHT: NAV + ACTIONS */}
            <div className="flex items-center gap-2">
              {/* Desktop / tablet nav */}
              <nav className="hidden md:flex items-center gap-4 lg:gap-6">
                {NAV.map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href);

                  if (item.label === "SEARCH") {
                    return (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => setShowSearch((prev) => !prev)}
                        className={`${linkColor} transition-colors text-xs lg:text-[14px] font-druk tracking-[0.12em] hover:opacity-80 ${showSearch ? "underline underline-offset-2" : ""
                          }`}
                      >
                        {item.label}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`${linkColor} transition-colors text-xs lg:text-[14px] font-druk tracking-[0.12em] hover:opacity-80 ${isActive ? "underline underline-offset-2" : ""
                        }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {/* Cart (desktop / tablet) */}
                <button
                  type="button"
                  onClick={openCart}
                  className={`relative hidden md:inline-flex ${iconColor} hover:opacity-90 transition-opacity`}
                  aria-label="Cart"
                >
                  <FiShoppingBag className="h-5 w-5" />
                  {safeCartCount > 0 && (
                    <span className="absolute -top-2 -right-2 text-[10px] leading-none font-semibold bg-white text-black rounded-full px-1.5 py-0.5">
                      {safeCartCount}
                    </span>
                  )}
                </button>
              </nav>

              {/* Mobile actions */}
              <div className="flex items-center gap-2 md:hidden">
                <button
                  type="button"
                  onClick={openCart}
                  className={`relative inline-flex ${iconColor} hover:opacity-90 transition-opacity`}
                  aria-label="Cart"
                >
                  <FiShoppingBag className="h-5 w-5" />
                  {safeCartCount > 0 && (
                    <span className="absolute -top-2 -right-2 text-[10px] leading-none font-semibold bg-white text-black rounded-full px-1.5 py-0.5">
                      {safeCartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setMenuOpen(true)}
                  className={`inline-flex items-center justify-center ${iconColor} p-2`}
                  aria-label="Open menu"
                >
                  <FiMenu className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        {showSearch && (
          <div>
            <div className="mx-auto px-4 md:px-16 pb-3">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center border-b-2 border-l-2 rounded-xl border-gray-500 px-3 py-1 max-w-2xl mx-auto"
              >
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className={`flex-1 bg-transparent text-xl outline-none text-sm px-1 py-1 ${isHome
                      ? "text-black placeholder:text-neutral-500"
                      : "text-white placeholder:text-neutral-300"
                    }`}
                />
                <button
                  type="submit"
                  className={`text-xs font-druk tracking-[0.16em] px-3 py-1 rounded-full flex items-center justify-center transition-colors ${isHome
                      ? "bg-black text-white hover:bg-neutral-900"
                      : "bg-white text-black hover:bg-neutral-200"
                    }`}
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MOBILE NAV DRAWER */}
        <div
          className={`fixed inset-0 z-50 md:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
        >
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"
              }`}
            onClick={() => setMenuOpen(false)}
          />
          <div
            className={`absolute left-0 top-0 h-full w-[80%] max-w-xs bg-black text-white transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
              <span className="relative block w-[120px] h-[32px]">
                <Image
                  src="/assets/whiteLogo.webp"
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

            <div className="p-4 space-y-2 bg-black h-screen">
              {NAV.map((item) => {
                if (item.label === "SEARCH") {
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setShowSearch(true);
                      }}
                      className="block w-full text-left py-3 text-sm tracking-[0.14em] text-white/80 hover:text-white"
                    >
                      {item.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 text-sm tracking-[0.14em] text-white/80 hover:text-white"
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-white/10 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openCart();
                  }}
                  className="inline-flex items-center gap-2 py-3 text-sm"
                >
                  <FiShoppingBag className="h-5 w-5" />
                  Cart {safeCartCount > 0 ? `(${safeCartCount})` : ""}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CART DRAWER */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div className="absolute inset-0 bg-black/60" onClick={closeCart} />

        <div
          className={`absolute left-0 top-0 h-full w-[90%] max-w-md bg-white text-black shadow-2xl transform transition-transform duration-300 ${isCartOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between px-4 h-14 border-b border-neutral-200">
            <h2 className="text-sm font-druk tracking-[0.16em]">YOUR CART</h2>
            <button onClick={closeCart} aria-label="Close cart" className="p-2">
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {safeItems.length === 0 ? (
              <p className="text-sm text-neutral-600">Your cart is currently empty.</p>
            ) : (
              safeItems.map((it: any) => (
                <div key={it.key} className="flex gap-3 border-b border-neutral-200 pb-4">
                  <div className="relative w-16 h-20 bg-neutral-100 shrink-0">
                    {it.image ? (
                      <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{it.name}</p>
                        <p className="text-xs text-neutral-600">
                          {it.size ? `Size: ${it.size}` : ""}
                          {it.color ? ` • Color: ${it.color}` : ""}
                        </p>
                        <p className="text-xs text-neutral-800 mt-1">{it.price.toFixed(2)} DH</p>
                      </div>

                      <button
                        className="text-xs underline text-neutral-600 hover:text-black"
                        onClick={() => removeItem(it.key)}
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        className="w-8 h-8 border border-neutral-300"
                        onClick={() => setQty(it.key, it.qty - 1)}
                      >
                        -
                      </button>
                      <span className="min-w-8 text-center text-sm">{it.qty}</span>
                      <button
                        className="w-8 h-8 border border-neutral-300"
                        onClick={() => setQty(it.key, it.qty + 1)}
                      >
                        +
                      </button>

                      <div className="ml-auto text-sm font-semibold">
                        {(it.price * it.qty).toFixed(2)} DH
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-neutral-200 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-semibold">{safeSubtotal.toFixed(2)} DH</span>
            </div>

            <button
              className="w-full cursor-pointer text-xs font-druk tracking-[0.18em] uppercase bg-black text-white py-3 rounded-full hover:bg-neutral-800 transition-colors"
              onClick={() => { router.push('/checkout'); closeCart(); }}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
