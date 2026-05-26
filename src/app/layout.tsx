import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import AuthSessionProvider from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Set a proper mobile viewport so pages don't render at desktop width
// on phones, and disable horizontal user-scaling glitches.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#faf8f5",
};

export const metadata: Metadata = {
  title: "Indulge Salon & Spa | Richmond, VA — Nails, Hair, Waxing, Detox",
  description:
    "Indulge Salon & Spa in Richmond, VA. Founded by Eboni Mayo in 2005. Natural & artificial nails, waxing, hair cuts, gentlemen and kids services, and detox body wraps. Book online.",
  keywords: [
    "Indulge Salon and Spa",
    "Richmond VA nail salon",
    "Eboni Mayo",
    "nail technician Richmond",
    "waxing Richmond VA",
    "detox body wrap",
    "Midlothian Turnpike salon",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthSessionProvider>
          <ConditionalChrome>{children}</ConditionalChrome>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
