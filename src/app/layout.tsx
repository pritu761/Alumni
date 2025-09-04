import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { PWAInstallBanner, OfflineIndicator, PWAUpdateNotification } from "@/components/PWAComponents";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alumni Network",
  description: "Connect with fellow alumni, attend events, and support your alma mater",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["alumni", "network", "events", "donations", "mentorship", "university"],
  authors: [
    { name: "Alumni Network Team" },
  ],
  creator: "Alumni Network Team",
  publisher: "Alumni Network",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Alumni Network",
    title: {
      default: "Alumni Network",
      template: "%s | Alumni Network",
    },
    description: "Connect with fellow alumni, attend events, and support your alma mater",
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "Alumni Network Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alumni Network",
    description: "Connect with fellow alumni, attend events, and support your alma mater",
    creator: "@alumninetwork",
    images: ["/icons/icon-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png" },
      { url: "/icons/icon-512x512.png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png" },
      { url: "/icons/icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icons/icon-512x512.png",
        color: "#3b82f6",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Alumni Network",
    startupImage: [
      {
        url: "/icons/icon-512x512.png",
        media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Alumni Network" />
        <meta name="application-name" content="Alumni Network" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <OfflineIndicator />
          <PWAInstallBanner />
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <Toaster />
          <PWAUpdateNotification />
        </AuthProvider>
      </body>
    </html>
  );
}
