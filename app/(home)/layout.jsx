import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/navbar";
import { AlertCircle } from "lucide-react";

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
    icon: "logo3.png", // Place your favicon in the public folder
  },
  openGraph: {
    title: "Sugarizz",
    description: "Delight in our mouth-watering cookies delivered straight to your door.",
    url: "https://sugarizz.com", // Replace with your actual domain
    siteName: "Sugarizz",
    images: [
      {
        url: "/logo3.png", // Save an Open Graph image in the public folder
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
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 text-sm flex items-center justify-center w-full shadow-sm">
          <AlertCircle className="h-4 w-4 mr-2 text-yellow-600" />
          <span>
            <strong>Sold Out for Today! Sold Out for Today! 🎉
Thank you for the amazing response!
You can still DM us your order on Instagram @suga.rizz and we’ll get back to you.
Please note, we will be closed tomorrow due to 10th Muharram. 🍪</strong>
          </span>
        </div>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
