const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("NEXT_PUBLIC_API_URL is not set");
}

async function handle(res: Response) {
  if (res.ok) return res.json();

  let message = "Request failed";
  try {
    const data = await res.json();
    message =
      data?.message?.toString?.() ||
      (Array.isArray(data?.message) ? data.message.join(", ") : message);
  } catch {}
  throw new Error(message);
}

export type CheckoutItemInput = {
  productId: number;
  qty: number;
  size?: string;
  color?: string;
};

export type CreateStripeCheckoutInput = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  postalCode?: string;
  country?: string; // default MA
  items: CheckoutItemInput[];
};

export type StripeCheckoutResponse = {
  url: string;
  orderId: string;
  sessionId: string;
};

export async function createStripeCheckoutSession(
  input: CreateStripeCheckoutInput
): Promise<StripeCheckoutResponse> {
  const res = await fetch(`${API_URL}/orders/checkout/stripe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      paymentMethod: "STRIPE",
      ...input,
    }),
  });

  return handle(res);
}
