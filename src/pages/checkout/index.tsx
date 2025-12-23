"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useCartStore } from "@/core/stores/cart.store";
import { createStripeCheckoutSession } from "@/core/services/orders.service";

type PaymentMethod = "stripe" | "cod";

export default function CheckoutPage() {
    const router = useRouter();

    const cart = useCartStore();

    const items = cart.items ?? [];
    const hasHydrated = cart.hasHydrated;

    const removeCartItem = (key: string) => {
        cart.removeItem(key);
    };

    const incQty = (p: any) => {
        cart.setQty(p.key, (p.qty ?? 1) + 1);
    };

    const decQty = (p: any) => {
        const next = (p.qty ?? 1) - 1;

        if (next <= 0) {
            cart.removeItem(p.key);
        } else {
            cart.setQty(p.key, next);
        }
    };


    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("stripe");
    const [promoCode, setPromoCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState(""); 
    const isFormValid =
        fullName.trim() &&
        email.trim() &&
        phone.trim() &&
        addressLine1.trim() &&
        city.trim();

    const subtotal = useMemo(() => {
        return items.reduce((sum: number, it: any) => sum + Number(it.price) * Number(it.qty ?? 1), 0);
    }, [items]);

    const discount = 0;
    const total = Math.max(0, subtotal - discount);


    const countLabel = useMemo(() => {
        const count = items.reduce((s: number, it: any) => s + Number(it.qty ?? 1), 0);
        return `${count} ${count === 1 ? "product" : "products"}`;
    }, [items]);

    async function onContinue() {
        if (!items?.length) return;

        setIsSubmitting(true);
        try {
            if (paymentMethod === "stripe") {
                // ✅ map cart store items -> backend DTO
                const payload = {
                    fullName,
                    email,
                    phone,
                    addressLine1,
                    city,
                    postalCode,
                    country: "MA",
                    items: items.map((it: any) => ({
                        productId: it.productId,
                        qty: it.qty,
                        size: it.size,
                        color: it.color,
                    })),
                };

                const { url } = await createStripeCheckoutSession(payload);

                // redirect to Stripe Checkout
                window.location.href = url;
                return;
            }

            // COD later...
            // router.push("/payment/cod");
            alert("Cash on delivery is coming next.");
        } catch (e: any) {
            alert(e?.message ?? "Checkout failed");
        } finally {
            setIsSubmitting(false);
        }
    }

    // If your store hydrates from localStorage, avoid UI flicker
    if (hasHydrated === false) {
        return (
            <main className="min-h-screen bg-white">
                <div className="mx-auto max-w-6xl px-6 py-10">
                    <div className="h-8 w-40 rounded bg-slate-100" />
                    <div className="mt-6 grid gap-6 lg:grid-cols-[1.65fr_1fr]">
                        <div className="h-72 rounded-2xl bg-slate-100" />
                        <div className="h-72 rounded-2xl bg-slate-100" />
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen mt-52">
            {/* Top stepper */}
            <div className="border-b border-slate-100">
                <div className="relative mx-auto flex max-w-7xl items-center px-6 py-5">
                    {/* Centered stepper */}
                    <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 text-xl text-slate-400 md:flex">
                        <StepDot active label="Cart" />
                        <span>›</span>
                        <StepDot label="Checkout" />
                        <span>›</span>
                        <StepDot label="Payment" />
                    </div>
                </div>
            </div>


            <div className="mx-auto max-w-[90rem] px-6 py-10">
                <div className="grid gap-6 lg:grid-cols-[1.65fr_1fr]">
                    {/* Left: Cart */}
                    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-druk text-slate-900">Cart</h1>
                                <p className="mt-1 text-xs text-slate-400">({countLabel})</p>
                            </div>

                            <button onClick={() => cart.clear()} type="button">
                                × Clear cart
                            </button>
                        </div>

                        {/* Table header */}
                        <div className="mt-6 grid grid-cols-[1.4fr_.6fr_.6fr_.2fr] items-center gap-3 text-lg text-slate-400">
                            <div>Product</div>
                            <div className="text-center">Count</div>
                            <div className="text-right">Price</div>
                            <div />
                        </div>

                        <div className="mt-3 space-y-3">
                            {(items ?? []).map((p: any) => (
                                <div
                                    key={p.key}
                                    className="grid grid-cols-[1.4fr_.6fr_.6fr_.2fr] items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4"
                                >
                                    {/* Product */}
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                                            {/* If you don’t have next/image for now, replace with <img> */}
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-900">
                                                {p.name}
                                            </p>
                                            <p className="text-lg text-slate-400">
                                                {p.color ?? "—"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Count */}
                                    <div className="flex items-center justify-center gap-3">
                                        <QtyButton onClick={() => decQty(p)}>-</QtyButton>

                                        <span className="w-6 text-center text-sm text-slate-900">
                                            {p.qty}
                                        </span>

                                        <QtyButton onClick={() => incQty(p)}>+</QtyButton>

                                    </div>

                                    {/* Price */}
                                    <div className="text-right text-sm font-semibold text-slate-900">
                                        {Number(p.price).toFixed(2)} MAD
                                    </div>

                                    <button
                                        onClick={() => removeCartItem(p.key)}
                                        className="text-sm text-red-500 hover:text-red-600"
                                        type="button"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            {!items?.length && (
                                <div className="rounded-2xl border border-slate-100 p-10 text-center text-sm text-slate-500">
                                    Your cart is empty.
                                </div>
                            )}
                        </div>

                        {/* Bottom banner (same vibe as screenshot) */}
                        <div className="mt-6 overflow-hidden rounded-2xl bg-slate-950">
                            <div className="relative h-36 w-full">
                                {/* Background image */}
                                <Image
                                    src="/assets/checkout.webp"
                                    alt="Promo banner"
                                    fill
                                    className="object-cover"
                                />

                                {/* Dark gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />

                                {/* Optional subtle blur for extra readability */}
                                <div className="absolute inset-0 backdrop-blur-[1px]" />

                                {/* Content */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-lg font-semibold tracking-tight text-white drop-shadow-md">
                                            Check the newest products
                                        </p>

                                        <button
                                            type="button"
                                            className="mt-3 rounded-full border border-white/40 px-5 py-2 text-md font-medium cursor-pointer text-white backdrop-blur-sm transition hover:bg-white/10"
                                            onClick={() => router.push("/shop")}
                                        >
                                            Shop now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>

                    {/* Right: Summary */}
                    <aside className="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
                        <div className="mb-6 space-y-3">
                            <h2 className="text-sm font-semibold text-slate-900">
                                Shipping information
                            </h2>

                            <input
                                className="w-full rounded-xl border px-4 py-2 text-sm"
                                placeholder="Full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />

                            <input
                                className="w-full rounded-xl border px-4 py-2 text-sm"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <input
                                className="w-full rounded-xl border px-4 py-2 text-sm"
                                placeholder="Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />

                            <input
                                className="w-full rounded-xl border px-4 py-2 text-sm"
                                placeholder="Address"
                                value={addressLine1}
                                onChange={(e) => setAddressLine1(e.target.value)}
                            />

                            <input
                                className="w-full rounded-xl border px-4 py-2 text-sm"
                                placeholder="City"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />

                            <input
                                className="w-full rounded-xl border px-4 py-2 text-sm"
                                placeholder="Postal code (optional)"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </div>
                        <h2 className="text-sm font-semibold text-slate-900">Promo code</h2>
                        <div className="mt-3 flex items-center gap-2 rounded-full bg-white p-2 shadow-sm">
                            <input
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Type here..."
                                className="w-full bg-transparent px-3 text-sm outline-none placeholder:text-slate-400"
                            />
                            <button
                                type="button"
                                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
                            >
                                Apply
                            </button>
                        </div>

                        {/* ✅ Payment method options */}
                        <div className="mt-6">
                            <p className="text-sm font-semibold text-slate-900">
                                Payment method
                            </p>

                            <div className="mt-3 cursor-pointer space-y-3">
                                <PaymentCard
                                    selected={paymentMethod === "stripe"}
                                    title="Pay by card"
                                    subtitle="Secure payment powered by Stripe"
                                    badge="Recommended"
                                    onClick={() => setPaymentMethod("stripe")}
                                />
                                <PaymentCard
                                    selected={paymentMethod === "cod"}
                                    title="Pay on delivery"
                                    subtitle="Pay when you receive your order"
                                    onClick={() => setPaymentMethod("cod")}
                                />
                            </div>
                        </div>

                        <div className="mt-6 space-y-3 text-sm">
                            <Row label="Subtotal" value={`${subtotal.toFixed(2)} MAD`} />
                            <Row label="Discount" value={`- ${discount.toFixed(2)} MAD`} muted />
                            <div className="h-px bg-slate-200" />
                            <Row
                                label={<span className="font-semibold text-slate-900">Total</span>}
                                value={<span className="font-semibold text-slate-900">{total.toFixed(2)} MAD</span>}
                            />
                        </div>

                        <button
                            type="button"
                            disabled={!items.length || isSubmitting || !isFormValid}
                            onClick={onContinue}
                            className="mt-6 w-full cursor-pointer rounded-2xl bg-slate-900 py-3 text-lg font-medium text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {paymentMethod === "stripe"
                                ? isSubmitting
                                    ? "Redirecting…"
                                    : "Continue to payment"
                                : isSubmitting
                                    ? "Placing order…"
                                    : "Place order (Pay on delivery)"}
                        </button>

                        <p className="mt-3 text-center text-sm text-slate-400">
                            By continuing, you agree to our <button onClick={() => { router.push('/terms') }} className=" text-black underline hover:text-gray-700 transition-colors cursor-pointer"> terms and conditions </button> .
                        </p>
                    </aside>
                </div>
            </div>
        </main>
    );
}

/* ---------- Small UI helpers ---------- */

function StepDot({ label, active }: { label: string; active?: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <span
                className={[
                    "inline-block h-3 w-3 rounded-full border",
                    active ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white",
                ].join(" ")}
            />
            <span className={active ? "text-slate-700" : "text-slate-400"}>{label}</span>
        </div>
    );
}

function QtyButton({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-sm text-slate-700 hover:bg-slate-50"
        >
            {children}
        </button>
    );
}

function Row({
    label,
    value,
    muted,
}: {
    label: React.ReactNode;
    value: React.ReactNode;
    muted?: boolean;
}) {
    return (
        <div className="flex items-center justify-between">
            <span className={muted ? "text-slate-400" : "text-slate-500"}>{label}</span>
            <span className={muted ? "text-slate-400" : "text-slate-700"}>{value}</span>
        </div>
    );
}

function PaymentCard({
    selected,
    title,
    subtitle,
    badge,
    onClick,
}: {
    selected: boolean;
    title: string;
    subtitle: string;
    badge?: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "w-full rounded-2xl border p-4 text-left transition",
                selected
                    ? "border-slate-900 bg-white shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300",
            ].join(" ")}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{title}</span>
                        {badge ? (
                            <span className="rounded-full bg-slate-900/5 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                                {badge}
                            </span>
                        ) : null}
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                </div>

                <span
                    className={[
                        "mt-1 inline-block h-4 w-4 rounded-full border",
                        selected ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white",
                    ].join(" ")}
                    aria-hidden="true"
                />
            </div>
        </button>
    );
}
