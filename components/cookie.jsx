"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import useCookieStore from "@/store/cookieStore";
import { FaMinus, FaPlus } from "react-icons/fa6";


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
            className={`relative flex items-center justify-center w-full max-w-6xl mx-auto px-4 py-3 md:py-1 transition-colors duration-300 rounded-2xl overflow-visible ${
                hovered && isDesktop ? "shadow-2xl" : ""
            }`}
            style={{ backgroundColor: hovered && isDesktop ? bgColor : "" }}
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
                        className={`object-contain ${flip ? "rotate-[-25deg]" : "rotate-[25deg]"}`}
                        priority
                    />
                </div>

                {/* Text */}
                <div className="text-center md:text-left max-w-md">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                        {title}
                    </h1>
                    <p className="mt-3 md:mt-4 text-sm md:text-base text-white/80">
                        {description}
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                        <h6 className="text-2xl md:text-2xl font-bold text-white">
                            {price}
                        </h6>
                        <div className="text-white">PKR</div>
                    </div>
                    <div className="mt-5 flex gap-4 justify-center md:justify-start">
                        {/* <Button variant="outline">Learn More</Button> */}
                        {quantity === 0 ? (
                            <Button onClick={() => increase(title)}>Order Now</Button>
                        ) : (
                            <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-md">
                                <Button variant="outline" onClick={() => decrease(title)}><FaMinus /></Button>
                                <span>{quantity}</span>
                                <Button onClick={() => increase(title)}><FaPlus /></Button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
}
