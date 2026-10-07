import BestSellersClient from "./BestSellersClient";

export const metadata = {
  title: "Most Ordered Products – BYS Crafts | Bestsellers",
  description:
    "Discover the most ordered products at BYS Crafts — best-selling handmade decor, artisan textiles, terracotta, wooden crafts, and metal art loved by thousands of homes across India.",
  alternates: { canonical: "/most-ordered" },
  openGraph: {
    title: "Most Ordered Products – BYS Crafts",
    description:
      "Best-selling handmade decor, artisan textiles, terracotta, wooden crafts, and metal art loved by thousands of homes.",
    url: "/most-ordered",
    type: "website",
    siteName: "BYS Crafts",
  },
  twitter: {
    card: "summary_large_image",
    title: "Most Ordered Products – BYS Crafts",
    description:
      "Best-selling handmade decor, artisan textiles, terracotta, wooden crafts, and metal art loved by thousands of homes.",
  },
};

export default function Page() {
  return <BestSellersClient />;
}