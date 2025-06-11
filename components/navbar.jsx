"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { IoPersonOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import Image from "next/image";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="w-full shadow-sm px-4 py-2 bg-[#242833] text-white sticky top-0 z-50">

            <div className=" flex items-center justify-between w-[80%] mx-auto">

            

                {/* Creating separate links for each */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="/" className="text-sm font-medium hover:text-primary">
                        HOME
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-primary">
                        COOKIES
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm font-medium hover:text-primary"
                    >
                        CONTACT
                    </Link>
                </div>

                {/* Logo here */}
                <div>
                    <Link href="/" className="text-xl font-bold">
                        <Image src="/logo3.png" alt="Logo" width={130} height={300} />
                    </Link>

                </div>


                {/* create buttons for profile and checkout */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/cart" className="text-sm font-medium hover:text-primary">
                        <IoPersonOutline size={25} />
                    </Link>
                    <Link href="/cart" className="text-sm font-medium hover:text-primary">
                        <FiShoppingCart size={25} />
                    </Link>
                </div>


                {/* Mobile */}
                <div className="md:hidden BG-[#242833] text-white">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="p-6 bg-[#242833] text-white">
                            <div className="flex flex-col gap-4 mt-10">
                                <Link href="/" className="text-sm font-medium hover:text-primary">
                                    Home
                                </Link>
                                <Link href="/about" className="text-sm font-medium hover:text-primary">
                                    About
                                </Link>
                                <Link href="/contact" className="text-sm font-medium hover:text-primary">
                                    Contact
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

            </div>
        </nav>
    );
}
