"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IoPersonOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import useCookieStore from "@/store/cookieStore"; // Update this path

const navItems = [
    { href: "/", label: "HOME" },
    { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const quantities = useCookieStore((state) => state.quantities);

    const totalCookies = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);

    return (
        <nav className="w-full shadow-sm px-4 py-2 bg-[#242833] text-white sticky top-0 z-50000">
            <div className="flex justify-between items-center w-[80%] mx-auto">

                {/* Mobile Cart Button - Far Left */}
                <div className="md:hidden mr-2">
                    <Link
                        href="/cart"
                        className={`relative flex items-center justify-center border border-white rounded-md p-2 transition duration-200 ${pathname === "/cart"
                                ? "bg-white text-black"
                                : "text-white hover:bg-white hover:text-black"
                            }`}
                    >
                        <FiShoppingCart size={22} />
                        {totalCookies > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                                {totalCookies}
                            </span>
                        )}
                    </Link>
                </div>


                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center space-x-6 flex-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium px-6 py-2 border rounded-md transition w-30 text-center
                                    ${isActive
                                        ? "bg-white text-black border-white"
                                        : "text-white border-white hover:bg-white hover:text-black"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Logo - Centered */}
                <div className="flex justify-center items-center flex-1 ml-2 sm:ml-0">
                    <Link href="/" className="text-xl font-bold">
                        <Image
                            src="/logo3.png"
                            alt="Logo"
                            width={130}
                            height={300}
                            className="w-28 sm:w-32 object-contain"
                            priority
                        />
                    </Link>
                </div>

                {/* Profile & Cart Icons - Desktop Only */}
                <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
                    <Link
                        href="/cart"
                        className={`text-sm font-medium p-2 border rounded-md transition relative ${pathname === "/cart"
                                ? "bg-white text-black border-white"
                                : "text-white border-white hover:bg-white hover:text-black"
                            }`}
                    >
                        <FiShoppingCart size={25} />
                        {totalCookies > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {totalCookies}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-6 bg-[#242833] text-white z-99999 w-full max-w-xs">
                            <div className="flex flex-col gap-4 mt-10">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`text-sm font-medium px-3 py-2 rounded-md transition ${isActive
                                                    ? "bg-white text-black"
                                                    : "hover:bg-gray-700"
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
