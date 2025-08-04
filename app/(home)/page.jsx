import React from "react";
import CookieHero from "@/components/cookie";
import MoveToCartPopup from "@/components/moveToCartPopUp";
import data from "@/data";

const Home = () => {
  return (
    <div className="relative">
      {/* 🛒 Fixed popup not nested inside scrollable/flex container */}
      <MoveToCartPopup />

      {/* Main scrollable layout */}
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        style={{
          background: "linear-gradient(to right bottom, rgba(15,23,42,0.6), rgba(30,41,59,0.6))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="flex flex-col items-center justify-center w-full px-4 py-12 space-y-10">
          {data.map((cookie, index) => (
            <CookieHero
              key={index}
              title={cookie.title}
              description={cookie.description}
              price={cookie.price}
              image={cookie.image}
              bgColor={cookie.bgColor}
              flip={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
