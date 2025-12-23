"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutSuccessPage() {
    const params = useSearchParams();
    const router = useRouter();

    const sessionId =
        params.get("session_id") ??
        (typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("session_id")
            : null);

    async function downloadInvoice(orderId: string) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/invoice.pdf`;
        const res = await fetch(url);

        if (!res.ok) {
            const text = await res.text();
            console.error("Invoice download failed:", res.status, text);
            alert(`Invoice download failed (${res.status})`);
            return;
        }

        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = `invoice-${orderId.slice(0, 8).toUpperCase()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(blobUrl);
    }

    const [loading, setLoading] = useState(true);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                if (!sessionId) throw new Error("Missing session id");

                const res = await fetch(
                    `${API_URL}/orders/stripe/verify?session_id=${encodeURIComponent(sessionId)}`
                );
                const data = await res.json();

                if (!res.ok || !data.paid) throw new Error("Payment not confirmed");

                setOrderId(data.orderId ?? null);
                setEmail(data.email ?? null);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [sessionId]);

    const invoiceUrl = useMemo(() => {
        if (!orderId) return null;
        return `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/invoice.pdf`;
    }, [orderId]);

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Confirming your payment…</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-red-600">{error}</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-white px-6 mt-44">
            <div className="w-full max-w-xl rounded-3xl border border-slate-200 p-10 text-center shadow-sm">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                    <svg className="h-7 w-7 text-green-600" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M5 13l4 4L19 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                <h1 className="text-2xl font-semibold text-slate-900">Payment successful</h1>
                <p className="mt-2 text-slate-500">
                    Thank you for your purchase. Your order has been confirmed. <br /> You will receive an email
                    with all the informations shortly.
                </p>

                {/* Order info */}
                <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    {orderId && (
                        <p>
                            <span className="font-medium text-slate-700">Order:</span>{" "}
                            #{orderId.slice(0, 8).toUpperCase()}
                        </p>
                    )}
                    {email && (
                        <p className="mt-1">
                            Receipt sent to <span className="font-medium">{email}</span>
                        </p>
                    )}
                </div>

                {/* ✅ QR Invoice */}
                {invoiceUrl && (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                        <p className="text-lg font-semibold text-slate-900">Invoice QR</p>
                        <p className="mt-1 text-base text-slate-500">
                            Scan to download your invoice on your phone.
                        </p>

                        <div className="mt-4 flex items-center justify-center">
                            <div className="rounded-2xl border border-slate-200 p-3 bg-white">
                                <QRCodeCanvas value={invoiceUrl} size={160} />
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(invoiceUrl)}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-lg text-slate-700 hover:bg-slate-50"
                            >
                                Copy invoice link
                            </button>

                            <a
                                href={invoiceUrl}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-lg text-white hover:bg-slate-800"
                                download
                            >
                                Open link
                            </a>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-8 space-y-3">
                    <button
                        onClick={() => {
                            if (!orderId) return;
                            downloadInvoice(orderId);
                        }}
                        className="w-full cursor-pointer rounded-xl bg-slate-900 py-3 text-white text-md font-medium hover:bg-slate-800"
                    >
                        Download invoice (PDF)
                    </button>

                    <button
                        onClick={() => router.push("/shop")}
                        className="w-full rounded-xl cursor-pointer border border-slate-300 py-3 text-md text-slate-700 hover:bg-slate-50"
                    >
                        Continue shopping
                    </button>
                </div>
            </div>
        </main>
    );
}
