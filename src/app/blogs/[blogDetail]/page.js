import { notFound } from "next/navigation";
import BlogArticleServer from "./BlogArticleServer";
import RelatedStoriesServer from "./RelatedStoriesServer";

export async function generateMetadata({ params }) {
  const resolved = await params;
  const blogid = resolved.blogDetail;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/blog/blogbyid/${blogid}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      return {
        title: "Story – BYS Crafts Journal",
        description: "Read our latest story from BYS Crafts",
      };
    }

    const data = await res.json();

    return {
      title: data?.mtitle || data?.heading || "Story – BYS Crafts Journal",
      description:
        data?.mdesc || "Read our latest story from BYS Crafts Journal",
      alternates: { canonical: `/blogs/${blogid}` },
      openGraph: {
        title: data?.heading,
        description: data?.mdesc,
        type: "article",
        publishedTime: data?.createdAt,
        images: data?.image?.[0] ? [data.image[0]] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: data?.heading,
        description: data?.mdesc,
        images: data?.image?.[0] ? [data.image[0]] : [],
      },
    };
  } catch (error) {
    console.error("Error fetching blog for metadata:", error);
    return {
      title: "Story – BYS Crafts Journal",
      description: "Read our latest story from BYS Crafts Journal",
    };
  }
}

export default async function Page({ params }) {
  const resolved = await params;
  const blogid = resolved.blogDetail;

  const [blogRes, relatedRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_SERVER}/blog/blogbyid/${blogid}`, {
      next: { revalidate: 300 },
    }),
    fetch(`${process.env.NEXT_PUBLIC_SERVER}/blog?pageNumber=1`, {
      next: { revalidate: 300 },
    }),
  ]);

  if (!blogRes.ok) notFound();
  const blog = await blogRes.json();
  if (!blog?._id) notFound();

  let relatedBlogs = [];
  if (relatedRes.ok) {
    const relatedData = await relatedRes.json();
    relatedBlogs = (relatedData.blogs || [])
      .filter((b) => b._id !== blog._id)
      .slice(0, 3);
  }

  return (
    <>
      <BlogArticleServer blog={blog} />
      <RelatedStoriesServer blogs={relatedBlogs} />
    </>
  );
}