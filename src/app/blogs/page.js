import BlogsListServer from "./BlogsListServer";

export const metadata = {
  title: "Stories & Journal – BYS Crafts | Handmade, Artisans & Traditions",
  description:
    "Read stories about Indian craft traditions, artisans, and handmade techniques — from stone carving and terracotta to weaving, folk art, and metalwork.",
  keywords: [
    "BYS Crafts blog",
    "Indian handicrafts",
    "artisan stories",
    "handmade decor",
    "stone carving India",
    "terracotta craft",
    "folk art India",
    "handicraft traditions",
  ],
  alternates: { canonical: "/blogs" },
  openGraph: {
    title: "Stories & Journal – BYS Crafts",
    description:
      "Stories about Indian craft traditions, artisans, and handmade techniques.",
    url: "/blogs",
    siteName: "BYS Crafts",
    type: "website",
    images: [
      {
        url: "/icons/og-blogs.jpg",
        width: 1200,
        height: 630,
        alt: "BYS Crafts Journal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stories & Journal – BYS Crafts",
    description:
      "Stories about Indian craft traditions, artisans, and handmade techniques.",
    images: ["/icons/og-blogs.jpg"],
  },
  robots: { index: true, follow: true },
};

export default async function BlogsPage({ searchParams }) {
  // Next.js 15+: searchParams is a Promise
  const resolved = await searchParams;
  const currentPage = Number(resolved?.page) || 1;

  let blogs = [];
  let pageCount = 0;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/blog/get-all-blogs?pageNumber=${currentPage}`,
      { next: { revalidate: 300 } }
    );

    if (res.ok) {
      const data = await res.json();
      blogs = data.blogs || [];
      pageCount = data.pageCount || 0;
    }
  } catch (err) {
    console.error("Server fetch failed for blogs:", err);
  }

  return (
    <BlogsListServer
      blogs={blogs}
      pageCount={pageCount}
      currentPage={currentPage}
    />
  );
}