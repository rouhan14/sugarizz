import { Geist, Geist_Mono } from "next/font/google";
import { IoWarning } from "react-icons/io5";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import Script from "next/script";

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
      <head>
        {/* Meta Pixel Script */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '738614225291126'); 
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
          />
        </noscript>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#242833] via-[#2d3142] to-[#1a1d29]`}
      >
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-black text-center py-2 text-md font-bold flex items-center justify-center gap-2">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="yellow"
          >
            <path
              d="M1 21h22L12 2 1 21z"
              stroke="yellow"
              strokeWidth="1"
            />
            <text
              x="12"
              y="17"
              textAnchor="middle"
              fontSize="14"
              fill="black"
              fontWeight="bold"
            >
              !
            </text>
          </svg>
          <span>Minimum order: Rs. 1000</span>
        </div>

        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
