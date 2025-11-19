import { SiteFooter } from "@/components/Footer";
import Navbar from "@/components/layouts/navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
 

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      {/* NAVBAR ALWAYS AT THE TOP */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <Component {...pageProps} />
      </main>

      {/* FOOTER ALWAYS AT THE BOTTOM */}
      <SiteFooter />
    </div>
  );
}
