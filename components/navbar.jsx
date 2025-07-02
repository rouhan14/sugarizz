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
    
    // Calculate total number of cookies
    const totalCookies = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);

    return (
        <nav className="w-full shadow-sm px-4 py-2 bg-[#242833] text-white sticky top-0 z-50000">
            <div className="flex justify-between items-center w-[80%] mx-auto">
                
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
                <div className="flex justify-center items-center flex-1">
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

                {/* Profile & Cart Icons */}
                <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
                    <Link
                        href="/cart"
                        className={`text-sm font-medium p-2 border rounded-md transition relative ${
                            pathname === "/cart"
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

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-6 bg-[#242833] text-white">
                            <div className="flex flex-col gap-4 mt-10">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`text-sm font-medium px-3 py-2 rounded-md transition ${
                                                isActive
                                                    ? "bg-white text-black"
                                                    : "hover:bg-gray-700"
                                            }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                                
                                {/* Cart link for mobile */}
                                <Link
                                    href="/cart"
                                    className={`text-sm font-medium px-3 py-2 rounded-md transition flex items-center justify-between ${
                                        pathname === "/cart"
                                            ? "bg-white text-black"
                                            : "hover:bg-gray-700"
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span>CART</span>
                                    {totalCookies > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {totalCookies}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}