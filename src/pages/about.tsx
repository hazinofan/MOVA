import { FeaturedProducts } from "@/components/featuredProds";
import { ProductCarousel } from "@/components/ProductsCaroussel";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {

    const products = [
        {
            id: 1,
            name: "T-SHIRTS",
            image: "/sections/quickAdd.png",
            link: "/shop/tshirts",
            title: "LOW HIDE BRIEF",
            subtitle: "Heather Grey + 5 Other",
            price: "285.00 Dh",

        },
        {
            id: 2,
            name: "T-SHIRTS",
            image: "/assets/image1.png",
            link: "/shop/tshirts",
            title: "LOW HIDE BRIEF",
            subtitle: "Heather Grey + 5 Other",
            price: "285.00 Dh",

        },
        {
            id: 3,
            name: "T-SHIRTS",
            image: "/assets/image2.png",
            link: "/shop/tshirts",
            title: "LOW HIDE BRIEF",
            subtitle: "Heather Grey + 5 Other",
            price: "285.00 Dh",

        },
        {
            id: 4,
            name: "T-SHIRTS",
            image: "/assets/image3.png",
            link: "/shop/tshirts",
            title: "LOW HIDE BRIEF",
            subtitle: "Heather Grey + 5 Other",
            price: "285.00 Dh",

        },
    ]

    const images = [
        "/assets/image1.png",
        "/assets/image2.png",
        "/assets/image3.png",
        "/assets/image4.png",
        "/assets/image5.png",
        "/assets/image6.png",
    ];
    return (
        <main className="bg-white">
            {/* TOP: MEET MOVA + 2 images */}
            <section className="mx-auto max-w-7xl px-4 lg:px-0 pt-56 pb-32">
                <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,1.3fr)_1fr]">
                    {/* Left image */}
                    <div className="relative w-full  aspect-[3/4]">
                        <Image
                            src="/assets/jackets.png"
                            alt="MOVA model left"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Center text */}
                    <div className="text-center lg:text-left">
                        <h1 className="font-druk tracking-[0.2em] text-2xl md:text-xl lg:text-3xl uppercase mb-6">
                            MEET MOVA
                        </h1>

                        <p className="text-xs md:text-sm leading-relaxed max-w-xl mx-auto lg:mx-0">
                            They told us sexy was a pose. A perfect angle. A static frame.
                            But we know better. Sexy is movement. It&apos;s climbing stairs,
                            sprinting for the late-night tram, dancing until the lights come
                            on. When you move freely, confidence rises. Energy amplifies.
                            <br />
                            MOVA was created for real bodies and real life. Not the kind that
                            squeezes or holds you back, but the kind that lets you breathe,
                            stretch and live on your own terms. Every fabric, every seam,
                            every detail is engineered for motion.
                            <br />
                            This is MOVA. For women ready to move. For lives ready for more.
                        </p>
                    </div>

                    {/* Right image */}
                    <div className="relative w-full max-w-sm mx-auto lg:mx-0 aspect-[3/4]">
                        <Image
                            src="/assets/sweatshirt.png"
                            alt="MOVA model right"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* BOTTOM: FABRIC MADE TO MOVE */}
            <section className="mx-auto max-w-6xl px-4 lg:px-0 pb-32">
                <div className="grid gap-10 md:grid-cols-2">
                    {/* Left text block */}
                    <div className="max-w-md">
                        <h2 className="font-druk tracking-[0.2em] text-2xl md:text-3xl uppercase leading-tight mb-6">
                            FABRIC
                            <br />
                            MADE TO
                            <br />
                            MOVE
                        </h2>

                        <p className="text-xs md:text-sm leading-relaxed">
                            Because we knit each garment individually, starting with the best
                            yarn fibers, every piece begins with quality. We choose premium
                            performance fabrics that balance softness, stretch and recovery,
                            so your MOVA essentials move with you from morning to midnight.
                            <br />
                            Our advanced fabrication delivers enhanced comfort, breathability
                            and long-lasting shape, giving you support you can rely on every
                            single day.
                        </p>
                    </div>
                    <div />
                </div>
            </section>
            <section>
                <div className="min-h-screen mt-10 grid grid-cols-1 md:grid-cols-2">
                    {/* T-shirts */}
                    <Link
                        href="/shop/tshirts" // change route if needed
                        className="group relative block overflow-hidden"
                    >
                        <img
                            src="/assets/tshirt.png"
                            alt="Tshirts Section"
                            className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* bottom title overlay */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-4">
                            <span className="inline-block translate-y-2 opacity-0 text-white font-druk tracking-[0.2em] uppercase text-sm md:text-base transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                T-SHIRTS
                            </span>
                        </div>
                    </Link>

                    {/* Sweatshirts */}
                    <Link
                        href="/shop/sweatshirts"
                        className="group relative block overflow-hidden"
                    >
                        <img
                            src="/assets/sweatshirt.png"
                            alt="Sweatshirts Section"
                            className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* bottom title overlay */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-4">
                            <span className="inline-block translate-y-2 opacity-0 text-white font-druk tracking-[0.2em] uppercase text-sm md:text-base transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                SWEATSHIRTS
                            </span>
                        </div>
                    </Link>
                </div>
            </section>

            <section className="relative overflow-hidden bg-white">
                <div className="min-h-[110vh] lg:min-h-[135vh] py-16 md:py-24 md:px-10">
                    {/* HEADING (mobile + tablet) */}
                    <div className="mb-6 lg:hidden">
                        <h2 className="font-druk tracking-[0.18em] text-xl md:text-2xl leading-tight text-center uppercase">
                            ACTIVE INTIMATES FOR
                            <br />
                            WOMEN THAT MOVE
                        </h2>
                    </div>

                    {/* --- FLOATING IMAGES (DESKTOP ONLY – UNCHANGED) --- */}
                    <div className="relative hidden lg:block h-[60vh]">
                        {/* Left image */}
                        <div className="absolute top-4 left-0">
                            <div className="relative w-[260px] h-[360px]">
                                <Image
                                    src="/sections/quickAdd.png"
                                    alt="Model 1"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Center image */}
                        <div className="absolute top-80 left-1/2 -translate-x-1/2">
                            <div className="relative w-[280px] h-[400px]">
                                <Image
                                    src="/assets/sweatshirt.png"
                                    alt="Model 2"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Right image */}
                        <div className="absolute top-160 right-0">
                            <div className="relative w-[260px] h-[360px]">
                                <Image
                                    src="/assets/image1.png"
                                    alt="Model 3"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- GRID (MOBILE + TABLET) --- */}
                    <div className="grid grid-cols-2 gap-1 lg:hidden p-2">
                        {products.map((i) => (
                            <div key={i.id} className="relative w-full aspect-[3/4]">
                                <Image
                                    src={i.image}
                                    alt={`Model ${i.name}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* DESKTOP HEADING (bottom-left, only on large screens) */}
                    <div className="mt-24 lg:mt-72 hidden lg:block">
                        <h2 className="font-druk tracking-[0.2em] text-2xl md:text-4xl lg:text-5xl uppercase leading-tight">
                            ACTIVE INTIMATES FOR
                            <br />
                            WOMEN THAT MOVE
                        </h2>
                    </div>
                </div>
            </section>

            <FeaturedProducts items={products}/>
        </main>
    );
}
