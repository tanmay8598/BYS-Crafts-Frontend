import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[hsl(var(--warm-cream))] px-4">
      <div className="max-w-md w-full bg-[hsl(var(--card))] rounded-3xl shadow-[0_8px_32px_hsl(var(--earth-brown)/0.15)] border border-[hsl(var(--border))] p-8 text-center">

        <div className="font-playfair text-6xl md:text-7xl font-bold text-[hsl(var(--terracotta))] mb-2 leading-none">
          404
        </div>

        <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-[hsl(var(--earth-brown))] mb-3">
          Page not found
        </h2>

        <p className="text-[hsl(var(--muted-foreground))] mb-6 text-sm md:text-base leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block px-6 py-3 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--terracotta))] text-[hsl(var(--primary-foreground))] rounded-xl font-semibold transition-all duration-300 hover:scale-105"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}