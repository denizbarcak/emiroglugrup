"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleKatalogClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      const katalogSection = document.getElementById("kataloglar");
      if (katalogSection) {
        katalogSection.scrollIntoView({ behavior: "smooth" });
      }
      setIsMenuOpen(false);
    }
  };

  const handleIletisimClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const footerSection = document.getElementById("iletisim");
    if (footerSection) {
      footerSection.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 bg-white z-50"
      style={{
        backgroundColor: "white",
        borderBottom: "1px solid rgba(0, 0, 0, 0.15)",
      }}
    >
      <nav className="container mx-auto px-4 py-7 md:py-4">
        <div className="relative flex items-center justify-between md:justify-center">
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors absolute left-0"
          >
            Emiroglu Grup
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden absolute right-0 text-black"
          >
            <div className="relative w-6 h-6">
              <div className="absolute top-1/2 left-0 right-0 -mt-0.5">
                {/* Üst çizgi */}
                <div
                  className={`absolute h-[1px] w-6 bg-current transform transition-transform duration-300 ${
                    isMenuOpen ? "rotate-45" : "-translate-y-[7px]"
                  }`}
                />
                {/* Orta çizgi */}
                <div
                  className={`absolute h-[1px] w-6 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                {/* Alt çizgi */}
                <div
                  className={`absolute h-[1px] w-6 bg-current transform transition-transform duration-300 ${
                    isMenuOpen ? "-rotate-45" : "translate-y-[7px]"
                  }`}
                />
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-12">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Ana Sayfa
            </Link>
            <a
              href={pathname === "/" ? "#kataloglar" : "/#kataloglar"}
              onClick={handleKatalogClick}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              Kataloglar
            </a>
            <a
              href="#iletisim"
              onClick={handleIletisimClick}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              İletişim
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 mb-0 bg-white">
            <div className="flex flex-col items-center space-y-3 pb-0 pt-2">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <a
                href={pathname === "/" ? "#kataloglar" : "/#kataloglar"}
                onClick={handleKatalogClick}
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                Kataloglar
              </a>
              <a
                href="#iletisim"
                onClick={handleIletisimClick}
                className="text-gray-600 hover:text-gray-900 cursor-pointer -mb-2"
              >
                İletişim
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
