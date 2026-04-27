import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "SecureBlog — Stored XSS Demo",
  description:
    "A digital curator's guide to web security. Exploring the intersection of rigorous analysis and elegant technical solutions.",
  keywords: ["XSS", "web security", "blog", "stored XSS", "demo"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="font-[Inter,system-ui,sans-serif] bg-surface text-on-surface antialiased">
        <Navbar />
        <main className="pt-[72px] min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
