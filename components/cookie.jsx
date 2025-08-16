"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import useCookieStore from "@/store/cookieStore";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa6";

export default function CookieHero({
    title,
    description,
    price,
    image,
    bgColor,
    flip,
}) {
    const [hovered, setHovered] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    const { quantities, increase, decrease } = useCookieStore();
    const quantity = quantities[title] || 0;
    
    // Check if this cookie is out of stock
    const isOutOfStock = title === "";

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // Clean up out-of-stock items from cart
        if (isOutOfStock && quantity > 0) {
            decrease(title, true); // forceRemove = true
        }

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Also clean up if quantity changes and item is out of stock
        if (isOutOfStock && quantity > 0) {
            decrease(title, true);
        }
    }, [quantity, isOutOfStock, title, decrease]);

    return (
        <section
            className={`relative flex items-center justify-center w-full max-w-6xl mx-auto px-4 py-6 md:py-8 
  transition-all duration-300 rounded-2xl overflow-visible
  bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)]
  shadow-sm hover:shadow-md hover:scale-[1.015] ${isOutOfStock ? 'opacity-70' : ''}`}
            style={{
  background: hovered && isDesktop && !isOutOfStock
    ? `linear-gradient(to bottom right, ${bgColor}40, ${bgColor}90)`
    : undefined,
}}
            onMouseEnter={() => isDesktop && !isOutOfStock && setHovered(true)}
            onMouseLeave={() => isDesktop && setHovered(false)}
        >

            <div
                className={`flex flex-col ${flip ? "md:flex-row-reverse" : "md:flex-row"
                    } items-center gap-8 md:gap-12 w-full relative z-10`}
            >
                {/* Image */}
                <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] z-20">
                    <Image
                        src={image}
                        alt={`Image of ${title}`}
                        fill
                        className={`object-contain ${flip ? "md:-rotate-12" : "md:rotate-12"}`}
                        priority
                    />
                </div>

                {/* Text */}

                <div className="text-center md:text-left max-w-md">

                    <h1 className={`text-3xl md:text-4xl font-extrabold ${hovered && isDesktop ? "text-black" : "text-white"}`}>
                        {title}
                    </h1>
                    <p className={`mt-3 md:mt-4 text-sm md:text-base ${hovered && isDesktop ? "text-black/80" : "text-white/80"}`}>
                        {description}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                        {isOutOfStock ? (
                            <div className="flex flex-col items-center md:items-start gap-1">
                                <div className="flex items-center gap-2">
                                    <h6 className={`text-2xl md:text-2xl font-bold ${hovered && isDesktop ? "text-black" : "text-white"}`}>
                                        {price}
                                    </h6>
                                    <div className={`${hovered && isDesktop ? "text-black" : "text-white"}`}>PKR</div>
                                </div>
                                <div className="text-red-400 font-semibold text-sm">
                                    Out of Stock
                                </div>
                            </div>
                        ) : (
                            <>
                                <h6 className={`text-2xl md:text-2xl font-bold ${hovered && isDesktop ? "text-black" : "text-white"}`}>
                                    {price}
                                </h6>
                                <div className={`${hovered && isDesktop ? "text-black" : "text-white"}`}>PKR</div>
                            </>
                        )}
                    </div>

                    <div className="mt-5 flex gap-4 justify-center md:justify-start">
                        <div className="relative min-w-[120px]">
                            <div className="transition-all duration-300 ease-in-out">
                                {isOutOfStock ? (
                                    <Button
                                        disabled
                                        className="w-full bg-gray-500 text-gray-300 cursor-not-allowed font-semibold py-2 rounded-xl shadow-sm opacity-50"
                                    >
                                        Out of Stock
                                    </Button>
                                ) : quantity === 0 ? (
                                    <Button
                                        onClick={() => increase(title)}
                                        className="w-full bg-green-500 text-white hover:bg-green-600 font-semibold py-2 rounded-xl shadow-sm transition-all duration-300"
                                    >
                                        Order Now
                                    </Button>

                                ) : (
                                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl shadow-sm transition-all duration-300">
                                        <button
                                            onClick={() => decrease(title)}
                                            className="text-white p-4 rounded-l-xl hover:bg-white/10 transition cursor-pointer"
                                            style={{ lineHeight: 0 }}
                                        >
                                            <FaMinus size={14} />
                                        </button>
                                        <span className="font-semibold w-4 text-center text-white">{quantity}</span>
                                        <button
                                            onClick={() => increase(title)}
                                            className="text-white p-4 rounded-r-xl hover:bg-white/10 transition cursor-pointer"
                                            style={{ lineHeight: 0 }}
                                        >
                                            <FaPlus size={14} />
                                        </button>
                                    </div>

                                )}
                            </div>
                        </div>

                        {quantity > 0 && !isOutOfStock && (
                            <button
                                onClick={() => decrease(title, true)}
                                className="text-gray-400 hover:text-red-500 transition-all duration-200 p-2 cursor-pointer"
                                title="Remove"
                            >
                                <FaTrash size={16} />
                            </button>
                        )}
                    </div>

                </div>
            </div>


        </section>
    );
}
