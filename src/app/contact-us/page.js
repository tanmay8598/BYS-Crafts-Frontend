import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Us – BYS Crafts | Handmade Support & Enquiries",
  description:
    "Get in touch with BYS Crafts. Reach our team for order help, bulk orders, product enquiries, or general questions. Email, WhatsApp, or send us a message — we reply within 24 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us – BYS Crafts",
    description:
      "Reach the BYS Crafts team for order help, bulk orders, or product enquiries. We respond within 24 hours.",
    url: "/contact",
    type: "website",
    siteName: "BYS Crafts",
  },
  twitter: {
    card: "summary",
    title: "Contact Us – BYS Crafts",
    description:
      "Reach the BYS Crafts team for order help, bulk orders, or product enquiries.",
  },
  robots: { index: true, follow: true },
};

export default function Page() {
  return <ContactClient />;
}