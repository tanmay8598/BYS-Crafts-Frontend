


import Link from "next/link";
import ProductPage from "./product";

const API_BASE = process.env.NEXT_PUBLIC_SERVER;

async function fetchProduct(id) {
  const url = `${API_BASE}/product/get-by-id?productId=${id}`;
  const res = await fetch(url, { method: "GET", cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

async function fetchRelatedProducts(categoryId) {
  const url = `${API_BASE}/product/get?category=${categoryId}`;
  const res = await fetch(url, { method: "GET", cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function generateMetadata({ params }) {
  const { id, "product-name": productName } = params;
  try {
    const product = await fetchProduct(id);
    const rawImg = product?.image?.[0];
    const imageUrl = rawImg?.startsWith("http") ? rawImg : `${process.env.NEXT_PUBLIC_CLIENT}${rawImg}`;
    const pageUrl = `${process.env.NEXT_PUBLIC_CLIENT}/product/${productName}/${id}`;
    return {
      title: `${product.metaTitle} | BYS Crafts`,
      description: product.metaDescription,
      openGraph: {
        title: `${product.metaTitle} | BYS Crafts`,
        description: product.metaDescription,
        url: pageUrl,
        siteName: "BYS Crafts",
        type: "website",
        images: [{ url: imageUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: product.metaTitle,
        description: product.metaDescription,
        images: [imageUrl],
      },
    };
  } catch {
    return { title: "Product not found", description: "Product not found", robots: "noindex" };
  }
}

export default async function Product({ params }) {
  const { id, "product-name": productName } = params;
  try {
    const product = await fetchProduct(id);
    const related = await fetchRelatedProducts(product.category?._id || product.category);

    const discountedPrice = product.discount
      ? product.sell_price - (product.discount * product.sell_price) / 100
      : product.sell_price;

    const cleanDescription = product.metaDescription?.substring(0, 160) || product.name;
    const rawImg = product?.image?.[0];
    const imageUrl = rawImg?.startsWith("http") ? rawImg : `${process.env.NEXT_PUBLIC_CLIENT}${rawImg}`;

    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      name: product.name,
      image: imageUrl,
      description: cleanDescription,
      brand: { "@type": "Brand", name: "BYS Crafts" },
      offers: {
        "@type": "Offer",
        price: discountedPrice.toString(),
        priceCurrency: "INR",
        availability: product.countInStock?.qty > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: `${process.env.NEXT_PUBLIC_CLIENT}/product/${productName}/${id}`,
        seller: { "@type": "Organization", name: "BYS Crafts" },
      },
      sku: product._id,
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
        <ProductPage product={product} related={related}  />
      </>
    );
  } catch (error) {
    console.error("Product page error:", error);
    return (
      <div className="py-8 px-4 min-h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-7xl font-extrabold">404</h1>
        <p className="text-3xl font-bold">Product Not Found</p>
        <Link href="/"><button className="bg-primary text-white px-6 py-3 rounded-lg mt-4">Back to Home</button></Link>
      </div>
    );
  }
}