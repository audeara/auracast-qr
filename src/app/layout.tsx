import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Audeara",
    default: "Auracast QR Code Generator | Audeara",
  },
  description:
    "Free Auracast QR code generator. Create SIG-compliant Bluetooth broadcast codes for venues and assistive listening. Customise colours and download as SVG or PNG.",
  keywords: [
    "auracast qr code",
    "auracast qr generator",
    "bluetooth auracast",
    "auracast broadcast audio",
    "bluetooth le audio",
  ],
  authors: [{ name: "Audeara", url: "https://audeara.com" }],
  creator: "Audeara",
  publisher: "Audeara",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    siteName: "Auracast QR Generator by Audeara",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Auracast QR Code Generator by Audeara" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@audeara",
    creator: "@audeara",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Auracast QR",
  },
};

// Inlined script prevents flash of wrong theme before React hydrates
const themeScript = `(function(){var t=localStorage.getItem('theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${notoSans.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
