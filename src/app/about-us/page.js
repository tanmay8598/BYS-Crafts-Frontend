
import { ARTISANS, FEATURES } from "@/constants";
import React from "react";

export const metadata = {
  title: "About BYS Crafts – Build Yourself | Handmade Marketplace",
  description:
    "BYS Crafts (Build Yourself) connects modern creators with timeless craftsmanship. Discover handmade products, artisan stories, and sustainable living.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About BYS Crafts – Build Yourself",
    description:
      "Where creativity meets craftsmanship. Discover handmade stories, curated for modern living.",
    type: "website",
    url: "/about",
    siteName: "BYS Crafts",
    images: [
      {
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
        width: 1200,
        height: 630,
        alt: "BYS Crafts – handmade artisan marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About BYS Crafts – Build Yourself",
    description:
      "Where creativity meets craftsmanship. Discover handmade stories, curated for modern living.",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    ],
  },
};


const Page = () => {
  return (
    <div className="w-full overflow-x-hidden bg-[#FAF6ED] text-[#1B3A5C]">

      <div className="relative w-full h-[70vh] flex items-center justify-center text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c")',
          }}
        />
        <div className="absolute inset-0 bg-[#0F1E2F]/60" />

        <div className="relative z-10 max-w-3xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Build Yourself with BYS Crafts
          </h1>
          <p className="text-[#E8C547] text-lg md:text-xl">
            Where creativity meets craftsmanship. Discover handmade stories,
            curated for modern living.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          What is BYS Crafts?
        </h2>
        <p className="text-[#7A8A9C] text-lg leading-relaxed">
          BYS Crafts (Build Yourself) is more than a marketplace — it's a
          movement. We connect modern creators with timeless craftsmanship,
          bringing you products that are not just made, but meaningful.
        </p>
      </div>

      <div className="bg-[#F5EFE0] py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">

          <div>
            <h3 className="text-xl font-semibold mb-2 text-[#1B3A5C]">
              🎨 Creativity First
            </h3>
            <p className="text-[#7A8A9C]">
              Every product is designed to inspire creativity and self-expression.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-[#1B3A5C]">
              🛠️ Build Yourself
            </h3>
            <p className="text-[#7A8A9C]">
              We believe in empowering you to create, learn, and grow through craft.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-[#1B3A5C]">
              🌱 Sustainable Living
            </h3>
            <p className="text-[#7A8A9C]">
              Handmade products that respect tradition and the environment.
            </p>
          </div>

        </div>
      </div>

      <div className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose BYS?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="text-3xl mb-4 text-[#E8C547]">
                <span className="material-symbols-outlined">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-[#7A8A9C] text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#F5EFE0] py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Meet the Makers
        </h2>

        <div className="flex overflow-x-auto gap-6 px-6 scrollbar-hide">
          {ARTISANS.map((artisan) => (
            <div
              key={artisan.id}
              className="min-w-[260px] bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <img
                src={artisan.image}
                alt={artisan.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{artisan.name}</h3>
                <p className="text-sm text-[#7A8A9C] mb-2">
                  {artisan.role}
                </p>
                <p className="text-sm italic text-[#1B3A5C]">
                  "{artisan.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default Page;