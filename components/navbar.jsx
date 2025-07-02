"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // ✅ NEW
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IoPersonOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import Image from "next/image";

const navItems = [
    { href: "/", label: "HOME" },
    { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname(); // ✅ Get current route

    return (
        <nav className="w-full shadow-sm px-4 py-2 bg-[#242833] text-white sticky top-0 z-50000">
            <div className="flex justify-between w-[80%] mx-auto">
                
                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center space-x-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm font-medium p-2 border rounded-md transition
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

                {/* Logo */}
                            <div className="flex justify-center items-center w-full px-17 pe-8 sm:pe-40">
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
                <div className="hidden md:flex items-center space-x-4">
    {[
        
        { href: "/cart", icon: <FiShoppingCart size={25} /> },
    ].map(({ href, icon }) => {
        const isActive = pathname === href;
        return (
            <Link
                key={href}
                href={href}
                className={`text-sm font-medium p-2 border rounded-md transition ${
                    isActive
                        ? "bg-white text-black border-white"
                        : "text-white border-white hover:bg-white hover:text-black"
                }`}
            >
                {icon}
            </Link>
        );
    })}
</div>


                {/* Mobile Menu */}
                <div className="md:hidden BG-[#242833] text-white">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
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
                                                    : "hover:text-primary"
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
