import React from "react";

type AdBannerProps = {
  variant?: "full" | "section";

  bgImage?: string;

  heroTitle?: string;
  heroSubtitle?: string;
  ctaLabel?: string;

  sectionLines?: string[];
  sectionBody?: string;
};

export const AdBanner: React.FC<AdBannerProps> = ({
  variant = "full",

  bgImage = "/people/streatwear.webp",
  heroTitle = "PREMIUM STREETWEAR",
  heroSubtitle = "Comfort. Style. Confidence. Crafted for everyday movement.",
  ctaLabel = "Shop Now",

  sectionLines = ["ESSENTIALS", "MADE", "FOR YOUR", "ACTIVE LIFE"],
  sectionBody = "Buttery soft, tailored to perfection, sculpting without the squeeze and made to move.",
}) => {
  if (variant === "section") {
    return (
      <section className="w-full py-8">
        <div className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          {/* Left Title */}
          <h2 className="text-xl font-druk md:text-5xl lg:text-4xl font-extrabold leading-tight tracking-tight">
            {sectionLines.map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </h2>

          {/* Right Description */}
          <div className="flex flex-col">
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-3"
            >
              <path
                d="M0 6.05C1.84258 6.05 3.04375 6.45699 3.79338 7.20662C4.54301 7.95625 4.95 9.15742 4.95 11H6.05C6.05 9.15742 6.45699 7.95625 7.20662 7.20662C7.95625 6.45699 9.15742 6.05 11 6.05V4.95C9.15742 4.95 7.95625 4.54301 7.20662 3.79338C6.45699 3.04375 6.05 1.84258 6.05 0H4.95C4.95 1.84258 4.54301 3.04375 3.79338 3.79338C3.04375 4.54301 1.84258 4.95 0 4.95V6.05Z"
                fill="black"
              />
            </svg>
            <p className="text-lg md:text-3xl leading-relaxed">
              {sectionBody}
            </p>
          </div>
        </div>
      </section>
    );
  }

  /** FULL VARIANT **/
  return (
    <>
      <div className="relative mt-16 min-h-screen w-full flex items-center justify-center">
        {/* Background image */}
        <img
          src={bgImage}
          alt="Advertisement Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 w-full h-full flex flex-col justify-between items-center py-20 text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center mt-10 mb-16 font-druk">
            {heroTitle}
          </h1>

          <p className="text-lg md:text-2xl font-medium text-center max-w-xl px-4">
            {heroSubtitle}
          </p>

          <button className="mt-10 mb-10 px-8 py-3 bg-white text-black border-2 border-black cursor-pointer font-semibold rounded-full hover:bg-gray-200 transition">
            {ctaLabel}
          </button>
        </div>

        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* The section after the hero */}
      <section className="w-full py-8">
        <div className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <h2 className="text-xl font-druk md:text-5xl lg:text-4xl font-extrabold leading-tight tracking-tight">
            {sectionLines.map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </h2>

          <div className="flex flex-col">
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-3"
            >
              <path
                d="M0 6.05C1.84258 6.05 3.04375 6.45699 3.79338 7.20662C4.54301 7.95625 4.95 9.15742 4.95 11H6.05C6.05 9.15742 6.45699 7.95625 7.20662 7.20662C7.95625 6.45699 9.15742 6.05 11 6.05V4.95C9.15742 4.95 7.95625 4.54301 7.20662 3.79338C6.45699 3.04375 6.05 1.84258 6.05 0H4.95C4.95 1.84258 4.54301 3.04375 3.79338 3.79338C3.04375 4.54301 1.84258 4.95 0 4.95V6.05Z"
                fill="black"
              />
            </svg>
            <p className="text-lg md:text-3xl leading-relaxed">
              {sectionBody}
            </p>
          </div>
        </div>
      </section>
    </>
  );
};
