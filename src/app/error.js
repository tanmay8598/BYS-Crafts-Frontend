"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log to your error tracking service (Sentry, LogRocket, etc.)
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[hsl(var(--warm-cream))] px-4">
      <div className="max-w-md w-full bg-[hsl(var(--card))] rounded-3xl shadow-[0_10px_30px_hsl(var(--earth-brown)/0.12)] border border-[hsl(var(--border))] p-8 text-center">

        {/* Icon bubble */}
        <div className="w-16 h-16 bg-[hsl(var(--warm-cream))] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>

        {/* Heading — Playfair */}
        <h2 className="font-playfair text-2xl md:text-3xl font-semibold text-[hsl(var(--earth-brown))] mb-2">
          Something went wrong
        </h2>

        {/* Body — DM Sans (inherited from body) */}
        <p className="text-[hsl(var(--muted-foreground))] mb-6 text-sm md:text-base leading-relaxed">
          We hit an unexpected error. Please try again.
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--terracotta))] text-[hsl(var(--primary-foreground))] rounded-xl font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            Try again
          </button>

          <Link
            href="/"
            className="px-5 py-2.5 border border-[hsl(var(--border))] text-[hsl(var(--earth-brown))] rounded-xl font-semibold hover:bg-[hsl(var(--warm-cream))] transition-all duration-300"
          >
            Go home
          </Link>
        </div>

        {/* Dev-only error details */}
        {process.env.NODE_ENV === "development" && (
          <pre className="mt-6 text-left text-xs bg-[hsl(var(--warm-cream))] p-3 rounded-xl overflow-auto text-[hsl(var(--destructive))] whitespace-pre-wrap break-words">
            {error?.message}
          </pre>
        )}
      </div>
    </div>
  );
}