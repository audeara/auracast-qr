import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Auracast QR Generator",
  description: "Generate SIG-compliant Bluetooth Auracast QR codes for physical deployment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <NuqsAdapter>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NuqsAdapter>
      </body>
    </html>
  );
}
