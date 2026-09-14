import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "OasisTap | Smart NFC Google Review Network",
  description: "Accelerate your 5-star Google Reviews with physical-to-digital smart NFC cards, countertop stands, and intelligent review filtering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#070709] text-slate-100 selection:bg-amber-400 selection:text-black flex flex-col justify-between">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
