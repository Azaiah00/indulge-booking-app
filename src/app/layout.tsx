import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import AuthSessionProvider from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
