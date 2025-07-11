import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sugarizz",
  description: "Order the freshest, most delicious cookies online with Sugarizz.",
  icons: {
    icon: "logo3.png",
  },
  openGraph: {
    title: "Sugarizz",
    description: "Delight in our mouth-watering cookies delivered straight to your door.",
    url: "https://sugarizz.com",
    siteName: "Sugarizz",
    images: [
      {
        url: "/logo3.png",
        width: 1200,
        height: 630,
        alt: "Sugarizz Cookie Box",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#242833] via-[#2d3142] to-[#1a1d29]`}
      >
        {/* 🔔 Sold Out Banner */}
        <div className="bg-yellow-100 text-yellow-900 text-center py-3 px-4 text-sm font-medium border-b border-yellow-300 shadow-md z-50">
          🚨 Sorry! We're currently <strong>sold out</strong>. We'll be baking again soon 🍪 - stay tuned!
        </div>

        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
