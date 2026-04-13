import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KitchenCart - Everything for Your Kitchen",
  description: "Premium kitchen tools, cookware, gadgets and accessories. Shop baking tools, cutlery, electronics, storage solutions and more at great prices.",
  keywords: ["kitchen", "cookware", "bakeware", "kitchen tools", "kitchen gadgets", "cutlery", "kitchen electronics"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: '#FFFBF5', color: '#1A1A1A' }}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
