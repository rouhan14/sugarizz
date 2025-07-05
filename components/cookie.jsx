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

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section
            className={`relative flex items-center justify-center w-full max-w-6xl mx-auto px-4 py-6 md:py-8 
  transition-all duration-300 rounded-2xl overflow-visible
  bg-white/10 backdrop-blur-md border border-white/20
  shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] hover:shadow-[0_12px_48px_0_rgba(0,0,0,0.35)]
  hover:scale-[1.015]`}
            style={{
                background: hovered && isDesktop
                    ? `linear-gradient(to bottom right, ${bgColor}50, ${bgColor}90)`
                    : undefined,
            }}
            onMouseEnter={() => isDesktop && setHovered(true)}
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
                        <h6 className={`text-2xl md:text-2xl font-bold ${hovered && isDesktop ? "text-black" : "text-white"}`}>
                            {price}
                        </h6>
                        <div className={`${hovered && isDesktop ? "text-black" : "text-white"}`}>PKR</div>
                    </div>

                    <div className="mt-5 flex gap-4 justify-center md:justify-start">
                        <div className="relative min-w-[120px]">
                            <div className="transition-all duration-300 ease-in-out">
                                {quantity === 0 ? (
                                    <Button
                                        onClick={() => increase(title)}
                                        className="w-full bg-green-500/70 hover:bg-green-500/40 border border-white/20 backdrop-blur-md shadow-[inset_0_0_4px_rgba(255,255,255,0.2),_0_4px_10px_rgba(0,128,0,0.35)] hover:shadow-[inset_0_0_6px_rgba(255,255,255,0.25),_0_6px_14px_rgba(0,128,0,0.45)] text-white font-semibold py-2 rounded-xl transition-all duration-300 cursor-pointer"
                                    >
                                        Order Now
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-[inset_0_0_4px_rgba(255,255,255,0.1),_0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-300">
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

                        {quantity > 0 && (
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
