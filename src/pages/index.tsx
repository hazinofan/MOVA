import { AdBanner } from "@/components/AdBanner";
import BestSellers from "@/components/BestSellers";
import { Categories } from "@/components/Categories";
import { WhyMovaSection } from "@/components/faq";
import HeroSection from "@/components/heroSection";
import Navbar from "@/components/layouts/navbar";
import NewsletterSection from "@/components/NewsLetter";
import { PartsBanner } from "@/components/PartsBanner";
import { MixAndMatchSection } from "@/components/QuickAdd";
import AsSeenOnCarousel from "@/components/SeenOnCaroussel";
import { Separator } from "@/components/Separator";

export default function Home() {
  const demo = [
    {
      id: 1,
      title: "LOW HIDE BRIEF",
      priceDh: 286,
      image: "/assets/image1.png",
      swatchNote: "Sand + 5 Other",
    },
    {
      id: 2,
      title: "HIGH SCULPT THONG",
      priceDh: 286,
      image: "/assets/image2.png",
      swatchNote: "Arctic Blue + 5 Other",
    },
    {
      id: 3,
      title: "LOW HIDE THONG",
      priceDh: 286,
      image: "/assets/image3.png",
      swatchNote: "Dusty Nude + 4 Other",
    },
    {
      id: 3,
      title: "LOW HIDE THONG",
      priceDh: 286,
      image: "/assets/image4.png",
      swatchNote: "Dusty Nude + 4 Other",
    },
    {
      id: 3,
      title: "LOW HIDE THONG",
      priceDh: 286,
      image: "/assets/image5.png",
      swatchNote: "Dusty Nude + 4 Other",
    },
    {
      id: 3,
      title: "LOW HIDE THONG",
      priceDh: 286,
      image: "/assets/image6.png",
      swatchNote: "Dusty Nude + 4 Other",
    },
  ];

  return (
    <div className="min-h-[190vh] bg-white transition-colors duration-500"> 
      <HeroSection />
      <BestSellers
        products={demo}
        onQuickAdd={(p, size) => {
          console.log("Quick add:", p.title, size);
        }}
      />
      <AdBanner
        variant="full"
        bgImage="/people/streatwear.webp"
        heroTitle="PREMIUM STREETWEAR"
        heroSubtitle="Comfort. Style. Confidence. Crafted for everyday movement."
        ctaLabel="Shop MOVA"
        sectionLines={["ESSENTIALS", "MADE", "FOR YOUR", "ACTIVE LIFE"]}
        sectionBody="Buttery soft, tailored to perfection, sculpting without the squeeze and made to move."
      />
      <Categories />
      <Separator />
      <AdBanner
        variant="section"
        heroTitle="ACTIVE LOUNGEWEAR"
        heroSubtitle="Ultra-soft pieces built for couch, city and everything between."
        ctaLabel="Explore Active Lounge"
        sectionLines={["LOUNGE MEETS","STREET ENERGY"]}
        sectionBody="Cloud-soft fabrics, clean lines, and fits designed for all-day wear."
      />
      <MixAndMatchSection />
      <AsSeenOnCarousel />
      <PartsBanner />
      <WhyMovaSection />
      <NewsletterSection />
    </div>
  );
}
