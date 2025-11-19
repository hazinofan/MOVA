import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-6">
      
      <h1 className="font-druk text-8xl tracking-tight">PAGE NOT FOUND</h1>

      <p className="mt-5 text-base font-haas text-white/70 max-w-md">
        The page you're trying to access is unavailable or does not exist.
      </p>

      <Link
        href="/shop"
        className="mt-8 font-druk text-sm underline tracking-wider hover:opacity-70"
      >
        CONTINUE SHOPPING
      </Link>
    </div>
  );
}
