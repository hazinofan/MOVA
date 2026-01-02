import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import StudioShell from "@/components/StudioShell";
import { ProductConfig, ProductType } from "@/lib/products";
import { getProduct } from "@/lib/product.runtime";

function Splash({ phase }: { phase: "splash-in" | "splash-out" }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className={`studioSplash ${phase === "splash-in" ? "in" : "out"}`}>
      <img
        className={`studioSplashLogo ${
          phase === "splash-out" ? "logoOut" : "logoIn"
        }`}
        src="/assets/studio-logo.webp"
        alt="Logo"
      />
    </div>,
    document.body
  );
}

export default function StudioProductPage() {
  const router = useRouter();
  const [product, setProduct] = useState<ProductConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const productId = router.query.productId as ProductType | undefined;

  const [phase, setPhase] = useState<"splash-in" | "splash-out" | "studio">(
    "splash-in"
  );

  useEffect(() => {
    let alive = true;
    if (!productId) return;

    setLoading(true);

    getProduct(productId)
      .then((p) => {
        if (!alive) return;
        setProduct(p);
      })
      .catch(console.error)
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [productId]);

  useEffect(() => {
    if (!productId) return;

    setPhase("splash-in");

    const t1 = window.setTimeout(() => setPhase("splash-out"), 3000);
    const t2 = window.setTimeout(() => setPhase("studio"), 3400); // 400ms fade out

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [productId]);

  if (!productId) return null;
  if (loading || !product) return null;

  return (
    <>
      {/* Splash rendered outside layout via portal */}
      {phase !== "studio" && (
        <Splash phase={phase === "splash-in" ? "splash-in" : "splash-out"} />
      )}

      {/* Studio */}
      <div className={`studioWrap ${phase === "studio" ? "studioIn" : ""}`}>
        <StudioShell product={product} />
      </div>

      {/* GLOBAL styles so keyframes are not scoped/blocked */}
      <style jsx global>{`
        /* Splash overlay: true viewport center, unaffected by parent transforms */
        .studioSplash {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          z-index: 2147483647; /* super top */
          pointer-events: none;

          opacity: 0;
          transform: translateY(10px) scale(0.98);
        }

        .studioSplashLogo {
          width: 140px;
          height: 140px;
          object-fit: contain;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
        }

        .studioSplash.in {
          animation: studioSplashIn 600ms ease-out forwards;
        }
        .studioSplash.out {
          animation: studioSplashOut 400ms ease-in forwards;
        }

        @keyframes studioSplashIn {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes studioSplashOut {
          to {
            opacity: 0;
            transform: translateY(-8px) scale(0.985);
          }
        }

        .studioWrap {
          min-height: 100vh;
          opacity: 0;
          transform: translateY(8px);
        }

        .studioWrap.studioIn {
          animation: studioIn 500ms ease-out forwards;
        }

        @keyframes studioIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .studioSplashLogo {
          width: 1000px;
          height: 1000px;
          object-fit: contain;
          display: block;
          user-select: none;
          -webkit-user-drag: none;

          opacity: 0;
          transform: scale(0.96);
        }

        .studioSplashLogo.logoIn {
          animation: logoFadeIn 600ms ease-out forwards;
        }

        .studioSplashLogo.logoOut {
          animation: logoFadeOut 220ms cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        /* LOGO ANIMATIONS */
        @keyframes logoFadeIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes logoFadeOut {
          to {
            opacity: 0;
            transform: scale(0.97);
          }
        }
      `}</style>
    </>
  );
}

StudioProductPage.hideNavbar = true;
StudioProductPage.hideFooter = true;
