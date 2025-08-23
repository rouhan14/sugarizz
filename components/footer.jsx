import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 text-white py-8 pt-16 mt-auto">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/sg-horizontal.png"
                alt="Sugarizz Logo"
                width={120}
                height={40}
                className="object-contain"
                priority
              />
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Order the freshest, most delicious cookies online with Sugarizz. 
              Premium quality cookies delivered straight to your door.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="space-y-2">
              <Link 
                href="/" 
                className="block text-white/70 hover:text-white transition-colors duration-200 text-sm"
              >
                Home
              </Link>
              <Link 
                href="/contact" 
                className="block text-white/70 hover:text-white transition-colors duration-200 text-sm"
              >
                Contact Us
              </Link>
              <Link 
                href="/cart" 
                className="block text-white/70 hover:text-white transition-colors duration-200 text-sm"
              >
                Cart
              </Link>
            </div>
          </div>

          {/* Legal and Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Legal & Support</h3>
            <div className="space-y-2">
              <Link 
                href="/privacy-policy" 
                className="block text-white/70 hover:text-white transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms-of-service" 
                className="block text-white/70 hover:text-white transition-colors duration-200 text-sm"
              >
                Terms of Service
              </Link>
              <a 
                href="mailto:sugarizz1000@gmail.com" 
                className="block text-white/70 hover:text-white transition-colors duration-200 text-sm"
              >
                sugarizz1000@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-white/60 text-xs">
            © {new Date().getFullYear()} Sugarizz. All rights reserved. | Made with 🧡 for cookie lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
