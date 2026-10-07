


import AllProductsClient from "./AllProductsClient";

export const metadata = {
  title: "All Products – BYS Crafts | Handmade Decor, Textiles & Artisan Gifts",
  description:
    "Browse the complete BYS Crafts collection — handmade home decor, artisan textiles, terracotta, wooden crafts, metal art, and unique handcrafted gifts. Ethically sourced, delivered across India.",
  alternates: { canonical: "/all-products" },
  openGraph: {
    title: "All Products – BYS Crafts",
    description:
      "Handmade home decor, artisan textiles, terracotta, wooden crafts, metal art, and unique handcrafted gifts.",
    url: "/all-products",
    type: "website",
    siteName: "BYS Crafts",
  },
  twitter: {
    card: "summary_large_image",
    title: "All Products – BYS Crafts",
    description:
      "Handmade home decor, artisan textiles, terracotta, wooden crafts, metal art, and unique handcrafted gifts.",
  },
};

export default function Page() {
  return <AllProductsClient />;
}