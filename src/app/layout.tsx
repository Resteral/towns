import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiOrderConciergeWidget from "@/components/AiOrderConciergeWidget";

export const viewport: Viewport = {
  themeColor: "#070709",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Oasis | Local Storefronts, NFC Network & Food Delivery Driver App",
  description: "Accelerate your 5-star Google Reviews, browse local restaurant menus, and manage real-time courier food delivery dispatch.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Oasis Driver",
  },
  applicationName: "Oasis Courier",
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
        <AiOrderConciergeWidget />
        <Footer />
      </body>
    </html>
  );
}
