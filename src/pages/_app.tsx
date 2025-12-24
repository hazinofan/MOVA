import { SiteFooter } from "@/components/Footer";
import Navbar from "@/components/layouts/navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  // read the static property from the page
  const hideNavbar = (Component as any).hideNavbar;

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafa]">
      {/* NAVBAR */}
      {!hideNavbar && <Navbar />}

      {/* MAIN */}
      <main className="flex-1">
        <Component {...pageProps} />
      </main>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
}
