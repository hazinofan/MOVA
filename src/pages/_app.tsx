import { SiteFooter } from "@/components/Footer";
import Navbar from "@/components/layouts/navbar"; 
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PageLoader from "@/components/pageLoader";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // read static props from page
  const hideNavbar = (Component as any).hideNavbar;
  const hideFooter = (Component as any).hideFooter;

  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      {/* Global loader */}
      {loading && <PageLoader />}

      {/* NAVBAR */}
      {!hideNavbar && <Navbar />}

      {/* MAIN */}
      <main className="flex-1">
        <Component {...pageProps} />
      </main>

      {/* FOOTER */}
      {!hideFooter && <SiteFooter />}
    </div>
  );
}
