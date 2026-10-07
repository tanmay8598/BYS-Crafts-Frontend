
import "./globals.css";
import { Providers } from "@/redux/provider";
import ClientOnly from "@/components/ClientOnly";
import { Toaster } from "react-hot-toast"; 
import Script from "next/script";
import { Newsreader, Noto_Sans , Playfair_Display } from "next/font/google";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

const noto = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Build Yourself – Authentic Handicrafts | Handmade Home Decor & Gifts",
  description:
    "Discover authentic handicrafts crafted by local artisans — premium handmade decor, wooden crafts, metal art, terracotta, textiles, and more. Shop unique, eco-friendly, and culturally rich products with nationwide delivery.",
  keywords: [
    "buy handicrafts online",
    "handmade home decor",
    "traditional crafts India",
    " artisans",
    "eco-friendly gifts",
    "wooden crafts",
    "metal art",
    "terracotta products",
    "textile crafts",
    "cultural decor",
    "artisan-made products",
    "unique handmade gifts",
    "sustainable crafts India",
    "folk art ",
    "decorative handicrafts",
    "crafts marketplace India",
    "handcrafted souvenirs",
    "rural artisans India",
    "authentic Indian crafts",
    "crafts delivery India",
    "handmade gift items online",
    "traditional home accessories",
    " handicrafts",
  ].join(", "),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`font-archivo ${newsreader.variable} ${noto.variable}  ${playfair.variable}`}>
        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-D2TNV16HGC"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-D2TNV16HGC');
          `}
        </Script>

        {/* <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap"
          rel="stylesheet"
        /> */}
        {/* <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;family=Noto+Sans:wght@400;700&amp;display=swap"
          rel="stylesheet"
        /> */}
        <Providers>
          <ClientOnly>{children}</ClientOnly>
          <Toaster position="bottom-right" reverseOrder={false} />
        </Providers>
      </body>
    </html>
  );
}
