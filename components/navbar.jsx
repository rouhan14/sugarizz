"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import useCookieStore from "@/store/cookieStore";

const navItems = [
  { href: "/", label: "HOME" },
  { href: "/contact", label: "CONTACT" },
];

export function Navbar() {
  const pathname = usePathname();
  const [activePath, setActivePath] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const quantities = useCookieStore((state) => state.quantities);
  const totalCookies = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  useEffect(() => {
    setIsMounted(true);
    setActivePath(pathname);
  }, [pathname]);

  return (
    <nav className="w-full px-4 py-2 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-md text-white sticky top-0 z-50 transition-all duration-300">
      <div className="flex justify-between items-center w-[80%] mx-auto">

        {/* Mobile Cart Button */}
        <div className="md:hidden mr-2">
          <Link
            href="/cart"
            className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-300
              border border-white/20 bg-white/10 backdrop-blur-md text-white
              shadow-[inset_0_0_4px_rgba(255,255,255,0.15),_0_2px_6px_rgba(0,0,0,0.3)]
              hover:shadow-[inset_0_0_6px_rgba(255,255,255,0.2),_0_4px_10px_rgba(0,0,0,0.4)]
              hover:bg-white/20 hover:scale-[1.05]
              ${activePath === "/cart" ? "ring-2 ring-white/40" : ""}`}
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
            const isActive = activePath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold px-6 py-2 rounded-xl transition-all duration-300 w-30 text-center 
                  border border-white/20 bg-white/10 backdrop-blur-md
                  shadow-[inset_0_0_4px_rgba(255,255,255,0.2),_0_2px_6px_rgba(0,0,0,0.3)]
                  hover:shadow-[inset_0_0_6px_rgba(255,255,255,0.25),_0_4px_10px_rgba(0,0,0,0.35)]
                  hover:scale-[1.03] hover:border-white/30 hover:bg-white/20
                  ${isActive ? "ring-1 ring-white/50 text-white" : "text-white"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Logo - Center */}
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

        {/* Desktop Cart */}
        <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
          <Link
            href="/cart"
            className={`relative p-2 rounded-xl transition-all duration-300
              border border-white/20 bg-white/10 backdrop-blur-md text-white
              shadow-[inset_0_0_4px_rgba(255,255,255,0.15),_0_2px_6px_rgba(0,0,0,0.3)]
              hover:shadow-[inset_0_0_6px_rgba(255,255,255,0.2),_0_4px_10px_rgba(0,0,0,0.4)]
              hover:bg-white/20 hover:scale-[1.05]
              ${activePath === "/cart" ? "ring-2 ring-white/40" : ""}`}
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
            <SheetContent
              side="right"
              className="p-6 bg-white/10 backdrop-blur-md border-l border-white/20 text-white w-full max-w-xs shadow-lg"
            >
              <div className="flex flex-col gap-4 mt-10">
                {navItems.map((item) => {
                  const isActive = activePath === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-sm font-medium px-4 py-2 rounded-md transition
                        ${isActive
                          ? "bg-white text-black"
                          : "hover:bg-white/20 hover:text-white"}`}
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
