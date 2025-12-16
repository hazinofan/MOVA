 

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) { 
  console.warn("NEXT_PUBLIC_API_URL is not set");
}

export type Review = {
  id: number;
  productId: number;
  title: string;
  body: string;
  name: string;
  email?: string | null;
  rating: number; // 1..5
  recommend: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateReviewInput = {
  title: string;
  body: string;
  name: string;
  email?: string;
  rating: number; // 1..5
  recommend: boolean;
};

export type ReviewStats = {
  totalReviews: number;
  averageRating: number; // e.g. 4.6
  ratingCounts: Record<number, number>; // {1:0,2:1,3:2,4:10,5:36}
  recommendPercent: number; // 0..100
};

async function handle(res: Response) {
  if (res.ok) return res.json();

  // try to read backend error message
  let message = "Request failed";
  try {
    const data = await res.json();
    message =
      data?.message?.toString?.() ||
      (Array.isArray(data?.message) ? data.message.join(", ") : message);
  } catch {
    // ignore
  }

  throw new Error(message);
}

/** GET reviews for one product */
export async function fetchProductReviews(productId: number): Promise<Review[]> {
  const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store", // avoid stale reviews
  });
  return handle(res);
}

/** GET stats for the rating summary section */
export async function fetchProductReviewStats(
  productId: number
): Promise<ReviewStats> {
  const res = await fetch(`${API_URL}/products/${productId}/reviews/stats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  return handle(res);
}

/** POST a review for one product */
export async function createProductReview(
  productId: number,
  input: CreateReviewInput
): Promise<Review> {
  const res = await fetch(`${API_URL}/products/${productId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle(res);
}
